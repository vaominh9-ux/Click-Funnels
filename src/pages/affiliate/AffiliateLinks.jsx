import React, { useState, useEffect } from 'react';
import { Copy, Link as LinkIcon, BarChart2, CheckCircle2, ChevronDown, Filter, Loader2 } from 'lucide-react';
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

      // 3. Load user's tracked links
      if (profileData) {
        const { data: linksData } = await supabase
          .from('affiliate_links')
          .select('*, campaigns(name)')
          .eq('affiliate_id', profileData.id)
          .order('created_at', { ascending: false });
          
        if (linksData) {
          setLinks(linksData);
        }
      }
      
      setLoading(false);
    };

    fetchData();
  }, []);

  const generatedLink = loading || !profile ? null : (selectedCampaign 
    ? `${selectedCampaign.landing_page_url}?ref=${profile.ref_code}${utmSource ? `&utm_source=${encodeURIComponent(utmSource)}` : ''}`
    : 'Chưa chọn dự án...');

  const addToast = useToast();

  const handleCopy = async () => {
    if (!selectedCampaign || !profile) return;
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    addToast('Đã sao chép đường dẫn thành công', 'success');
    
    // Upsert link to DB (tạo mới nếu chưa có, bỏ qua nếu đã tồn tại)
    const { error } = await supabase
      .from('affiliate_links')
      .upsert({
        campaign_id: selectedCampaign.id,
        affiliate_id: profile.id,
        sub_id1: utmSource || '',
        generated_url: generatedLink,
        short_code: `URL-${Math.random().toString(36).substr(2, 6)}`
      }, { onConflict: 'affiliate_id,campaign_id,sub_id1', ignoreDuplicates: true });

    if (!error) {
      // Refresh links list
      const { data: linksData } = await supabase
        .from('affiliate_links')
        .select('*, campaigns(name)')
        .eq('affiliate_id', profile.id)
        .order('created_at', { ascending: false });
      if (linksData) setLinks(linksData);
    }
    
    setTimeout(() => setCopied(false), 2000);
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
          <div className="flex-align-center" style={{gap: '8px'}}>
            <BarChart2 size={20} color="#10B981" />
            <h3>Đo Lường Hiệu Quả Gần Đây</h3>
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
                <th className="text-right">SỐ CLICK</th>
                <th className="text-right">ĐĂNG KÝ (LEADS)</th>
                <th className="text-right">CHỐT SALE</th>
                <th className="text-right">TỈ LỆ CHUYỂN ĐỔI</th>
              </tr>
            </thead>
            <tbody>
              {links.map(link => (
                <tr key={link.id}>
                  <td>
                    <div className="stat-code bg-gray-100 text-gray-800 text-sm px-2 py-1 rounded inline-block font-mono mb-1">
                      {link.campaigns?.name}
                    </div>
                    <div className="text-muted text-xs">
                      UTM: {link.sub_id1 || '(Mặc định)'}
                    </div>
                  </td>
                  <td className="text-right font-semibold text-blue-600">{(link.clicks || 0).toLocaleString()}</td>
                  <td className="text-right font-semibold text-orange-500">{(link.leads || 0).toLocaleString()}</td>
                  <td className="text-right font-bold text-green-600">{(link.sales || 0)}</td>
                  <td className="text-right">
                    <span className="conversion-badge">
                      {link.clicks > 0 ? ((link.sales / link.clicks) * 100).toFixed(1) : 0}%
                    </span>
                  </td>
                </tr>
              ))}
              {links.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-muted">Chưa tạo đường link Affiliate nào.</td>
                </tr>
              )}
            </tbody>
            {links.length > 0 && (
            <tfoot>
              <tr>
                <td className="font-bold">TỔNG CỘNG</td>
                <td className="text-right font-bold text-lg">{links.reduce((sum, link) => sum + (link.clicks || 0), 0).toLocaleString()}</td>
                <td className="text-right font-bold text-lg">{links.reduce((sum, link) => sum + (link.leads || 0), 0).toLocaleString()}</td>
                <td className="text-right font-bold text-lg text-green-600">{links.reduce((sum, link) => sum + (link.sales || 0), 0)}</td>
                <td className="text-right font-bold text-lg text-blue-600">
                  {links.reduce((sum, link) => sum + (link.clicks || 0), 0) > 0 
                    ? ((links.reduce((sum, link) => sum + (link.sales || 0), 0) / links.reduce((sum, link) => sum + (link.clicks || 0), 0)) * 100).toFixed(1) 
                    : 0}%
                </td>
              </tr>
            </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}
