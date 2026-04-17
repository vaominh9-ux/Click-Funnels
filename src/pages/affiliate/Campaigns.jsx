import React, { useState, useEffect } from 'react';
import { Copy, ExternalLink, Filter, Search, Lock } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useToast } from '../../components/common/Toast';
import Skeleton from '../../components/common/Skeleton';
import { FUNNEL_COURSES } from '../funnels/config';
import './Campaigns.css';

const TIER_RANK = { 'starter': 1, 'master': 2, 'ai-coach': 3, 'ai-partner': 4 };

const AffiliateCampaigns = () => {
  const [copiedId, setCopiedId] = useState(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [selectedUpgrade, setSelectedUpgrade] = useState(null);
  const [loading, setLoading] = useState(true);
  const [campaigns, setCampaigns] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const addToast = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // 1. Lấy thông tin user hiện tại
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // 2. Lấy profile (để biết tier)
      const { data: profile } = await supabase
        .from('profiles')
        .select('tier, ref_code, full_name')
        .eq('id', user.id)
        .single();

      setUserProfile(profile);

      // 3. Lấy tất cả campaigns active
      const { data: campaignData, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('status', 'active')
        .order('tier_required', { ascending: true });

      if (error) {
        console.error('Lỗi khi lấy campaigns:', error);
        addToast('Không thể tải danh sách chiến dịch', 'error');
      } else {
        setCampaigns(campaignData || []);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
    }
    setLoading(false);
  };

  const userTierRank = userProfile ? (TIER_RANK[userProfile.tier] || 1) : 1;
  const userTierLabel = userProfile?.tier?.toUpperCase() || 'STARTER';

  const isLocked = (campaign) => {
    return (campaign.tier_required || 1) > userTierRank;
  };

  const getAffLink = (campaign) => {
    if (!userProfile?.ref_code) return '';
    const trackingDomain = import.meta.env.VITE_TRACKING_DOMAIN || window.location.origin;
    return `${trackingDomain}/go/${userProfile.ref_code}?campaign=${campaign.id}`;
  };

  const handleCopy = (id, link) => {
    navigator.clipboard.writeText(link);
    setCopiedId(id);
    addToast('Đã sao chép link chiến dịch', 'success');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleUpgradeClick = (campaign) => {
    setSelectedUpgrade(campaign);
    setShowUpgradeModal(true);
  };

  const filteredCampaigns = campaigns.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard-wrapper relative">
      <div className="flex-between mb-4">
        <div>
          <h2>Active Campaigns</h2>
          <p className="text-muted mt-2">Get your tracking links and promotional assets here.</p>
        </div>
        <div className="search-bar">
          <Search size={18} className="text-muted" />
          <input
            type="text"
            placeholder="Search campaigns..."
            className="cf-input"
            style={{ width: '250px' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Pay-to-play Alert Banner */}
      <div className="cf-card mb-6" style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', borderLeft: '4px solid #F59E0B' }}>
        <p style={{ color: '#D97706', fontSize: '14px', lineHeight: '1.5' }}>
          <strong>Pay-to-Play Notice:</strong> Bạn hiện đang ở hạng <strong>{userTierLabel}</strong>. Để quảng bá và nhận hoa hồng vĩnh viễn từ các dự án Cao Cấp hơn, bạn cần sở hữu/trải nghiệm trực tiếp dự án đó.
        </p>
      </div>

      <div className="campaigns-grid">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="cf-card campaign-card">
              <div className="campaign-image" style={{display:'flex',alignItems:'center',justifyContent:'center'}}>
                <Skeleton width="100%" height="100%" />
              </div>
              <div className="campaign-body">
                <div className="flex-between mb-2">
                  <Skeleton width="140px" height="20px" />
                  <Skeleton width="80px" height="24px" style={{borderRadius: 12}} />
                </div>
                <Skeleton width="100%" height="14px" style={{marginBottom: 6}} />
                <Skeleton width="70%" height="14px" style={{marginBottom: 16}} />
                <Skeleton width="100%" height="40px" style={{borderRadius: 6}} />
              </div>
            </div>
          ))
        ) : filteredCampaigns.length === 0 ? (
          <div className="cf-card" style={{gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: '#6B7280'}}>
            {searchTerm ? 'Không tìm thấy chiến dịch nào.' : 'Chưa có chiến dịch nào được tạo.'}
          </div>
        ) : filteredCampaigns.map((camp, index) => {
          const locked = isLocked(camp);
          const affLink = getAffLink(camp);

          // Tự động tìm ảnh khớp với cấu hình Khóa Học nếu Admin quên map ảnh
          const matchedCourseKey = Object.keys(FUNNEL_COURSES).find(k => camp.landing_page_url?.includes(k));
          const fallbackImages = [
            'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1556761175-5973dc0f32d7?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1533750349088-cd871a92f312?auto=format&fit=crop&w=800&q=80'
          ];
          const displayImage = camp.image_url || 
            (matchedCourseKey ? FUNNEL_COURSES[matchedCourseKey].checkoutImage : fallbackImages[index % fallbackImages.length]);

          return (
            <div key={camp.id} className={`cf-card campaign-card ${locked ? 'locked' : ''}`} style={locked ? {opacity: 0.75} : {}}>
              <div className="campaign-image" style={{
                backgroundImage: `url(${displayImage})`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative'
              }}>
                <div className="campaign-image-overlay"></div>
                {locked && (
                  <div style={{position: 'absolute', background: 'rgba(15, 23, 42, 0.8)', inset: 0, display:'flex', alignItems:'center', justifyContent:'center', backdropFilter: 'blur(4px)'}}>
                    <span style={{color:'white', fontWeight:'bold', display:'flex', alignItems:'center', gap:'8px', fontSize: '1.1rem'}}><Lock size={20}/> LOCKED</span>
                  </div>
                )}
                {!locked && (
                  <span className="campaign-hover-btn">Click để xem trang đích</span>
                )}
              </div>
              <div className="campaign-body">
                <div className="flex-between mb-2">
                  <h3 className="campaign-name">{camp.name}</h3>
                  <span className={locked ? "badge badge-pending" : "badge badge-cleared"}>
                    {camp.commission_text || '50%'}
                  </span>
                </div>
                <p className="campaign-desc text-muted">{camp.description || 'Chiến dịch quảng bá sản phẩm.'}</p>

                {!locked ? (
                  <>
                    <div className="campaign-link-box mt-4">
                      <div className="link-text">{affLink}</div>
                      <button
                        className={`copy-btn ${copiedId === camp.id ? 'copied' : ''}`}
                        onClick={() => handleCopy(camp.id, affLink)}
                      >
                        {copiedId === camp.id ? 'Copied!' : <Copy size={16} />}
                      </button>
                    </div>
                    <div className="campaign-footer flex-between mt-4">
                      <button 
                        className="cf-btn-text text-sm"
                        onClick={() => {
                          if (camp.asset_url) {
                            window.open(camp.asset_url, '_blank');
                          } else {
                            addToast('Chưa có tài liệu quảng bá cho chiến dịch này.', 'info');
                          }
                        }}
                      >Download Assets (Swipes)</button>
                      <a href={camp.landing_page_url} target="_blank" rel="noopener noreferrer" className="cf-btn-icon">
                        <ExternalLink size={16}/>
                      </a>
                    </div>
                  </>
                ) : (
                  <div className="mt-4 flex-center flex-column" style={{gap: '8px'}}>
                    <button 
                      className="cf-btn-primary w-100" 
                      onClick={() => handleUpgradeClick(camp)}
                      style={{justifyContent: 'center', backgroundColor: '#fb923c', color: 'white', fontWeight: 600}}
                    >
                      Nâng cấp để Mở Khóa
                    </button>
                    <span style={{fontSize: '11px', color: '#6B7280'}}>
                      Yêu cầu: Hạng {['', 'STARTER', 'MASTER', 'AI COACH', 'AI PARTNER'][camp.tier_required] || 'N/A'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {showUpgradeModal && selectedUpgrade && (
        <div className="modal-overlay" onClick={() => setShowUpgradeModal(false)} style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center'
        }}>
          <div className="cf-card" onClick={e => e.stopPropagation()} style={{ width: '500px', maxWidth: '90%', padding: '32px' }}>
            <h2 className="mb-2">Nâng cấp Đặc Quyền: {selectedUpgrade.name}</h2>
            <p className="text-muted mb-6">Mở khóa quyền phân phối chức năng và hưởng {selectedUpgrade.commission_text || '50%'}</p>
            
            <div className="mb-6 p-4" style={{ backgroundColor: 'rgba(0,0,0,0.02)', borderRadius: '8px', border: '1px solid var(--cf-border)' }}>
              <div className="flex-between mb-2">
                <span className="text-muted">Gói hiện tại</span>
                <span className="font-bold">{userTierLabel}</span>
              </div>
              <div className="flex-between mb-2" style={{color: '#9CA3AF'}}>
                <span>→ Quyền lợi cũ</span>
                <span>Bán MAX {userTierLabel}</span>
              </div>
              <hr style={{ borderColor: 'var(--cf-border)', margin: '16px 0' }} />
              <div className="flex-between mb-2">
                <span className="text-muted">Gói nâng cấp cần</span>
                <span className="font-bold" style={{color: '#34D399'}}>
                  {['', 'STARTER', 'MASTER', 'AI COACH', 'AI PARTNER'][selectedUpgrade.tier_required] || selectedUpgrade.name}
                </span>
              </div>
            </div>

            {/* No Prorating Warning */}
            <div className="p-4 mb-6" style={{ background: 'rgba(239, 68, 68, 0.1)', borderLeft: '4px solid #EF4444', borderRadius: '4px' }}>
              <p style={{ color: '#F87171', fontSize: '13px', lineHeight: 1.5 }}>
                <strong>Lưu ý quan trọng:</strong> Nâng cấp hạng trên hệ thống Đại lý độc quyền là chính sách Mua Trọn Gói. Chi phí nâng cấp sẽ KHÔNG áp dụng chính sách trừ lùi/gộp từ các gói bạn đã thanh toán trước đây.
              </p>
            </div>

            <div className="flex-between" style={{ gap: '16px' }}>
              <button className="cf-btn-text w-100" onClick={() => setShowUpgradeModal(false)} style={{justifyContent: 'center'}}>Hủy bỏ</button>
              <button
                className="cf-btn-primary w-100"
                style={{justifyContent: 'center', backgroundColor: '#34D399'}}
                onClick={() => {
                  addToast('Vui lòng liên hệ Admin để nâng cấp!', 'info');
                  setShowUpgradeModal(false);
                }}
              >
                Liên hệ nâng cấp
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AffiliateCampaigns;
