import React, { useState } from 'react';
import { Copy, ExternalLink, Filter, Search } from 'lucide-react';
import { useToast } from '../../components/common/Toast';
import './Campaigns.css';

const AffiliateCampaigns = () => {
  const [copiedId, setCopiedId] = useState(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [selectedUpgrade, setSelectedUpgrade] = useState(null);

  const campaigns = [
    {
      id: 'CMP-STARTER',
      name: 'STARTER Training',
      description: 'The foundation to begin your journey. 6,000,000 VND.',
      commission: '50% Lifetime',
      image: 'https://placehold.co/400x200/2563eb/ffffff?text=STARTER+6Tr',
      link: 'https://go.yoursite.com/starter?aff_id=AFF10293',
      locked: false
    },
    {
      id: 'CMP-MASTER',
      name: 'MASTER Training',
      description: 'Advanced methodologies and tools. 12,000,000 VND.',
      commission: '50% Lifetime',
      image: 'https://placehold.co/400x200/0f172a/ffffff?text=MASTER+12Tr',
      link: 'https://go.yoursite.com/master?aff_id=AFF10293',
      locked: false
    },
    {
      id: 'CMP-AICOACH',
      name: 'AI COACH Certification',
      description: 'The comprehensive 30Tr curriculum to become a certified coach.',
      commission: '30% Lifetime',
      image: 'https://placehold.co/400x200/64748B/ffffff?text=AI+COACH+30Tr',
      link: null,
      locked: true,
      price: '30,000,000 VND',
      lockedMsg: 'Upgrade to Unlock AI COACH'
    },
    {
      id: 'CMP-AIPARTNER',
      name: 'AI PARTNER Program',
      description: 'Highest 100Tr tier for elite partners (3 Month access).',
      commission: '20% Lifetime',
      image: 'https://placehold.co/400x200/475569/ffffff?text=AI+PARTNER+100Tr',
      link: null,
      locked: true,
      price: '100,000,000 VND',
      lockedMsg: 'Upgrade to Unlock AI PARTNER'
    }
  ];

  const addToast = useToast();

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

  return (
    <div className="dashboard-wrapper relative">
      <div className="flex-between mb-4">
        <div>
          <h2>Active Campaigns</h2>
          <p className="text-muted mt-2">Get your tracking links and promotional assets here.</p>
        </div>
        <div className="search-bar">
          <Search size={18} className="text-muted" />
          <input type="text" placeholder="Search campaigns..." className="cf-input" style={{ width: '250px' }} />
        </div>
      </div>

      {/* Pay-to-play Alert Banner */}
      <div className="cf-card mb-6" style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', borderLeft: '4px solid #F59E0B' }}>
        <p style={{ color: '#D97706', fontSize: '14px', lineHeight: '1.5' }}>
          <strong>Pay-to-Play Notice:</strong> Bạn hiện đang ở hạng <strong>MASTER</strong>. Để quảng bá và nhận hoa hồng vĩnh viễn từ các dự án Cao Cấp hơn, bạn cần sở hữu/trải nghiệm trực tiếp dự án đó.
        </p>
      </div>

      <div className="campaigns-grid">
        {campaigns.map((camp) => (
          <div key={camp.id} className={`cf-card campaign-card ${camp.locked ? 'locked' : ''}`} style={camp.locked ? {opacity: 0.6} : {}}>
            <div className="campaign-image" style={{ backgroundImage: `url(${camp.image})` }}>
              {camp.locked && (
                 <div style={{background: 'rgba(0,0,0,0.6)', width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center'}}>
                    <span style={{color:'white', fontWeight:'bold', display:'flex', alignItems:'center', gap:'8px'}}><Filter size={18}/> LOCKED</span>
                 </div>
              )}
            </div>
            <div className="campaign-body">
              <div className="flex-between mb-2">
                <h3 className="campaign-name">{camp.name}</h3>
                <span className={camp.locked ? "badge badge-pending" : "badge badge-cleared"}>{camp.commission}</span>
              </div>
              <p className="campaign-desc text-muted">{camp.description}</p>
              
              {!camp.locked ? (
                <>
                  <div className="campaign-link-box mt-4">
                    <div className="link-text">{camp.link}</div>
                    <button 
                      className={`copy-btn ${copiedId === camp.id ? 'copied' : ''}`}
                      onClick={() => handleCopy(camp.id, camp.link)}
                    >
                      {copiedId === camp.id ? 'Copied!' : <Copy size={16} />}
                    </button>
                  </div>
                  <div className="campaign-footer flex-between mt-4">
                    <button className="cf-btn-text text-sm">Download Assets (Swipes)</button>
                    <button className="cf-btn-icon"><ExternalLink size={16}/></button>
                  </div>
                </>
              ) : (
                <div className="mt-4 flex-center flex-column" style={{gap: '8px'}}>
                  <button 
                    className="cf-btn-primary w-100" 
                    onClick={() => handleUpgradeClick(camp)}
                    style={{justifyContent: 'center', backgroundColor: '#fb923c', color: 'white', fontWeight: 600}}
                  >
                    {camp.lockedMsg}
                  </button>
                  <span style={{fontSize: '11px', color: '#6B7280'}}>Thanh toán: {camp.price}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {showUpgradeModal && selectedUpgrade && (
        <div className="modal-overlay" onClick={() => setShowUpgradeModal(false)} style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center'
        }}>
          <div className="cf-card" onClick={e => e.stopPropagation()} style={{ width: '500px', maxWidth: '90%', padding: '32px' }}>
            <h2 className="mb-2">Nâng cấp Đặc Quyền: {selectedUpgrade.name}</h2>
            <p className="text-muted mb-6">Mở khóa quyền phân phối chức năng và hưởng {selectedUpgrade.commission}</p>
            
            <div className="mb-6 p-4" style={{ backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
              <div className="flex-between mb-2">
                <span className="text-muted">Gói hiện tại</span>
                <span className="font-bold">MASTER (12Tr)</span>
              </div>
              <div className="flex-between mb-2" style={{color: '#9CA3AF'}}>
                <span>-&gt; Quyền lợi cũ</span>
                <span>Bán MAX Master</span>
              </div>
              <hr style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '16px 0' }} />
              <div className="flex-between mb-2">
                <span className="text-muted">Gói nâng cấp</span>
                <span className="font-bold" style={{color: '#34D399'}}>{selectedUpgrade.name}</span>
              </div>
              <div className="flex-between mb-2" style={{color: '#9CA3AF'}}>
                <span>-&gt; Quyền lợi mới</span>
                <span>Mở bán {selectedUpgrade.name}</span>
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
              <button className="cf-btn-primary w-100" style={{justifyContent: 'center', backgroundColor: '#34D399'}}>
                Xác nhận {selectedUpgrade.price}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AffiliateCampaigns;
