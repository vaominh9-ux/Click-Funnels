import React, { useState, useEffect } from 'react';
import { Search, Link as LinkIcon, Filter, Copy, CheckCircle2, ChevronDown, Loader2, BarChart2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useToast } from '../../components/common/Toast';
import Skeleton from '../../components/common/Skeleton';
import './AffiliateLinks.css';


export default function AffiliateLinks() {
  const [links, setLinks] = useState([]);
  const [profile, setProfile] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [utmSource, setUtmSource] = useState('');
  const [copiedRowId, setCopiedRowId] = useState(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      // 1. Get current user profile for refCode and ID
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        setLoading(false);
        return;
      }
      
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userData.user.id)
        .single();
        
      setProfile(profileData);

      // 2. Load active campaigns
      const { data: campaignData, error: campaignError } = await supabase
        .from('campaigns')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (!campaignError && campaignData) {
        setCampaigns(campaignData);
        if (campaignData.length > 0) {
          setSelectedCampaign(campaignData[0]);
        }
      }

      let subscription = null;

      // 3. Load user's tracked links
      const fetchLinks = async (userId) => {
        const { data: linksData } = await supabase
          .from('affiliate_links')
          .select('*, campaigns(name)')
          .eq('affiliate_id', userId)
          .order('created_at', { ascending: false });
          
        if (linksData) {
          setLinks(linksData);
        }
      };

      if (profileData) {
        await fetchLinks(profileData.id);

        // === REALTIME SUBSCRIPTION ===
        subscription = supabase
          .channel('realtime_affiliate_links')
          .on('postgres_changes', { 
            event: '*', 
            schema: 'public', 
            table: 'affiliate_links',
            filter: `affiliate_id=eq.${profileData.id}`
          }, (payload) => {
            console.log('Realtime update on links:', payload);
            fetchLinks(profileData.id); // Tự động load lại data mới
          })
          .subscribe();
      }
      
      setLoading(false);

      return () => {
        if (subscription) {
          supabase.removeChannel(subscription);
        }
      };
    };

    const cleanup = fetchData();
    return () => {
      cleanup.then(cleanFn => {
        if (typeof cleanFn === 'function') cleanFn();
      });
    };
  }, []);

  // Link tracking: dùng Tracking Domain (server-side redirect, gần như tức thì)
  const trackingDomain = import.meta.env.VITE_TRACKING_DOMAIN || (window.location.hostname === 'localhost' ? 'https://click-funnels.vercel.app' : window.location.origin);
  
  const generatedLink = loading || !profile ? null : (selectedCampaign 
    ? `${trackingDomain}/go/${profile.ref_code}?campaign=${selectedCampaign.id}${utmSource ? `&utm_source=${encodeURIComponent(utmSource)}` : ''}`
    : 'Chưa chọn dự án...');

  const addToast = useToast();

  const handleCopy = async () => {
    if (!generatedLink) return;
    try {
      await navigator.clipboard.writeText(generatedLink);
      addToast('success', 'Đã copy link thành công!');
      
      // Auto-save the link to DB if it's a new combination
      const { error } = await supabase
        .from('affiliate_links')
        .upsert({
          campaign_id: selectedCampaign.id,
          affiliate_id: profile.id,
          sub_id1: utmSource || '',
        }, { onConflict: 'affiliate_id, campaign_id, sub_id1' }); // Prevent inserting duplicate links

      if (!error) {
        // Refresh the list without overriding typing
        const { data } = await supabase
          .from('affiliate_links')
          .select('*, campaigns(name, status)')
          .eq('affiliate_id', profile.id)
          .order('created_at', { ascending: false });
        if (data) setLinks(data);
      }
    } catch (err) {
      addToast('error', 'Không thể copy link');
    }
  };

  const handleCopyRow = async (linkRow) => {
    if (!profile) return;
    const trackingDomain = window.location.hostname === 'localhost' 
      ? 'http://localhost:5173' 
      : 'https://click-funnels.vercel.app';
      
    const utmParam = linkRow.sub_id1 ? `&utm_source=${encodeURIComponent(linkRow.sub_id1)}` : '';
    const linkStr = `${trackingDomain}/go/${profile.ref_code}?campaign=${linkRow.campaign_id}${utmParam}`;
    
    try {
      await navigator.clipboard.writeText(linkStr);
      setCopiedRowId(linkRow.id);
      addToast('success', 'Đã copy link thành công!');
      setTimeout(() => setCopiedRowId(null), 2000);
    } catch (err) {
      addToast('error', 'Lỗi copy link');
    }
  };

  return (
    <div className="links-container">
      <div className="links-header">
        <h1>Quản Lý Link & UTM Tracking</h1>
        <p>Kiểm soát tỷ lệ chuyển đổi từ số lượt click cho đến khi ra đơn hàng ở từng bài post, từng chiến dịch.</p>
      </div>

      <div className="generator-card">
        <div className="generator-header">
          <LinkIcon size={20} color="#3B82F6" />
          <h3>Tạo Link Gắn Tag Truy Vết (UTM)</h3>
        </div>
        
        <div className="generator-body">
          <div className="form-group flex-1">
            <label>Chọn Dự Án Đang Chạy</label>
            <div className="select-wrapper">
              <select 
                value={selectedCampaign?.id || ''} 
                onChange={(e) => setSelectedCampaign(campaigns.find(c => c.id === e.target.value))}
                disabled={loading || campaigns.length === 0}
              >
                {loading ? (
                  <option value="">Đang tải các dự án...</option>
                ) : campaigns.length === 0 ? (
                  <option value="">Chưa có dự án nào (Admin cần cấu hình)</option>
                ) : (
                  campaigns.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))
                )}
              </select>
              <ChevronDown size={16} className="select-icon" />
            </div>
          </div>

          <div className="form-group flex-1">
            <label>Nhập Kênh / Nguồn truy cập (Tùy chọn)</label>
            <input 
              type="text" 
              placeholder="VD: facebook_ads, tiktok_bio, zalo_group..." 
              value={utmSource}
              onChange={(e) => setUtmSource(e.target.value)}
              disabled={!selectedCampaign}
            />
          </div>
        </div>

        <div className="link-result-box">
          <div className="link-url flex-align-center" style={{ width: '100%' }}>
            {loading ? <Skeleton width="100%" height="20px" /> : generatedLink}
          </div>
          <button 
            className={`links-copy-btn ${copied ? 'copied' : ''}`} 
            onClick={handleCopy}
            disabled={!selectedCampaign}
            style={{opacity: !selectedCampaign ? 0.5 : 1, cursor: !selectedCampaign ? 'not-allowed' : 'pointer'}}
          >
            {copied ? (
              <><CheckCircle2 size={16} /> Đã Copy</>
            ) : (
              <><Copy size={16} /> Copy Link</>
            )}
          </button>
        </div>
      </div>

      <div className="stats-section">
        <div className="stats-header flex-between">
          <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
            <BarChart2 size={20} color="#10B981" />
            <h3 style={{margin: 0}}>Đo Lường Hiệu Quả Gần Đây</h3>
          </div>
          <button className="filter-btn">
            <Filter size={16} /> Lọc kết quả
          </button>
        </div>

        <div className="stats-table-wrapper">
          <table className="stats-table">
            <thead>
              <tr>
                <th>LINK ĐƯỢC THEO DÕI (UTM TAG)</th>
                <th style={{textAlign: 'center'}}>SỐ CLICK</th>
                <th style={{textAlign: 'center'}}>ĐĂNG KÝ (LEADS)</th>
                <th style={{ width: '15%', textAlign: 'center' }}>CHỐT SALE</th>
                <th style={{ width: '15%', textAlign: 'center' }}>TỈ LỆ CHUYỂN ĐỔI</th>
                <th style={{ width: '10%', textAlign: 'center' }}>THAO TÁC</th>
              </tr>
            </thead>
            <tbody>
              {links.map((link) => (
                <tr key={link.id}>
                  <td>
                    <div style={{ fontWeight: 600, color: '#1E293B' }}>{link.campaigns ? link.campaigns.name : 'Chiến dịch đã xóa'}</div>
                    <div style={{ fontSize: '13px', color: '#94A3B8', marginTop: '4px' }}>
                      UTM: <span style={{ background: '#F1F5F9', padding: '2px 6px', borderRadius: '4px' }}>{link.sub_id1 ? link.sub_id1 : '(Mặc định)'}</span>
                    </div>
                  </td>
                  <td style={{ color: '#3B82F6', fontWeight: 600, textAlign: 'center' }}>{link.clicks || 0}</td>
                  <td style={{ color: '#F59E0B', fontWeight: 600, textAlign: 'center' }}>{link.leads || 0}</td>
                  <td style={{ color: '#10B981', fontWeight: 600, textAlign: 'center' }}>{link.sales || 0}</td>
                  <td style={{ textAlign: 'center' }}>
                    <span style={{ 
                      background: '#F0FDF4', color: '#16A34A', 
                      padding: '4px 10px', borderRadius: '20px', 
                      fontSize: '13px', fontWeight: 600 
                    }}>
                      {link.clicks > 0 ? ((link.leads / link.clicks) * 100).toFixed(1) : 0}%
                    </span>
                  </td>
                  <td style={{ display: 'flex', justifyContent: 'center' }}>
                    <button 
                      onClick={() => handleCopyRow(link)}
                      style={{
                        background: 'none', border: '1px solid #CBD5E1', padding: '6px 10px', 
                        borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', 
                        gap: '6px', color: '#475569', fontSize: '12px'
                      }}
                      title="Copy lại link này"
                    >
                      {copiedRowId === link.id ? <CheckCircle2 size={14} color="#10B981" /> : <Copy size={14} />}
                      {copiedRowId === link.id ? 'Copied' : 'Copy'}
                    </button>
                  </td>
                </tr>
              ))}
              {links.length === 0 && (
                <tr>
                  <td colSpan="6" style={{textAlign: 'center', padding: '24px', color: '#9CA3AF'}}>Chưa tạo đường link Affiliate nào.</td>
                </tr>
              )}
            </tbody>
            {links.length > 0 && (
            <tfoot>
              <tr>
                <td style={{fontWeight: 700}}>TỔNG CỘNG</td>
                <td style={{textAlign: 'center', fontWeight: 700, fontSize: '16px'}}>{links.reduce((sum, link) => sum + (link.clicks || 0), 0).toLocaleString()}</td>
                <td style={{textAlign: 'center', fontWeight: 700, fontSize: '16px'}}>{links.reduce((sum, link) => sum + (link.leads || 0), 0).toLocaleString()}</td>
                <td style={{textAlign: 'center', fontWeight: 700, fontSize: '16px', color: '#10B981'}}>{links.reduce((sum, link) => sum + (link.sales || 0), 0)}</td>
                <td style={{textAlign: 'center', fontWeight: 700, fontSize: '16px'}}>
                  {links.reduce((sum, link) => sum + (link.clicks || 0), 0) > 0 
                    ? ((links.reduce((sum, link) => sum + (link.sales || 0), 0) / links.reduce((sum, link) => sum + (link.clicks || 0), 0)) * 100).toFixed(1) 
                    : 0}%
                </td>
                <td></td>
              </tr>
            </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}
