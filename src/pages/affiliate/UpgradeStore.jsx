import React, { useState } from 'react';
import { useToast } from '../../components/common/Toast';
import './UpgradeStore.css';

const TIERS = [
  {
    id: 'starter',
    name: 'STARTER',
    price: '6,000,000 đ',
    commission: '50%',
    features: [
      'Hoa hồng tối đa 3 Triệu / Sale',
      'Được bán mọi khóa học',
      'Hoa hồng trọn đời',
      'Quy tắc sinh tồn 90 ngày',
    ],
    highlight: false
  },
  {
    id: 'master',
    name: 'MASTER',
    price: '12,000,000 đ',
    commission: '50%',
    features: [
      'Hoa hồng tối đa 6 Triệu / Sale',
      'Tặng kèm nội dung khóa Starter',
      'Được bán mọi khóa học',
      'Hoa hồng trọn đời',
    ],
    highlight: false
  },
  {
    id: 'ai-coach',
    name: 'AI COACH',
    price: '30,000,000 đ',
    commission: '30%',
    features: [
      'Hoa hồng tối đa 9 Triệu / Sale',
      'Bao gồm Starter và Master',
      'Gấp 3 năng lực bán hàng (Lý tưởng)',
      'Tham gia đào tạo riêng biệt',
    ],
    highlight: true,
    badge: 'THỊNH HÀNH'
  },
  {
    id: 'ai-partner',
    name: 'AI PARTNER',
    price: '100,000,000 đ',
    commission: '20%',
    features: [
      'Hoa hồng 20 Triệu / Sale + % Nhánh',
      'Bao gồm toàn bộ Khóa trước',
      'Lợi nhuận dự án B2B 28%',
      'Cổ đông chiến lược trọn đời',
    ],
    highlight: false
  }
];

export default function UpgradeStore() {
  const currentTier = 'master'; // Mocking current user tier as Master
  const tierRank = { 'starter': 1, 'master': 2, 'ai-coach': 3, 'ai-partner': 4 };
  const currentRank = tierRank[currentTier];

  const [checkoutTier, setCheckoutTier] = useState(null);
  const addToast = useToast();

  const handleUpgrade = (tier) => {
    setCheckoutTier(tier);
  };

  const closeCheckout = () => {
    setCheckoutTier(null);
  };

  return (
    <div className="store-container">
      <div className="store-header">
        <h1>Thang Giá Trị & Nâng Cấp Bậc</h1>
        <p>
          Hiện tại bạn đang ở hạng mức <span>{currentTier}</span>. 
          Nâng cấp ngay để mở khóa toàn bộ tiềm năng hoa hồng và tránh thất thoát (Roll-up) cho upline.
        </p>
      </div>

      <div className="store-grid">
        {TIERS.map((tier) => {
          const rankMatch = tierRank[tier.id];
          const isCurrent = rankMatch === currentRank;
          const isLower = rankMatch < currentRank;
          
          return (
            <div key={tier.id} className={`store-card ${tier.highlight ? 'highlight' : ''} ${isLower ? 'opacity-50' : ''}`}>
              {tier.badge && <div className="store-badge">{tier.badge}</div>}
              <div className="store-card-header">
                <h3 className="store-tier-name">{tier.name}</h3>
                <div className="store-price">{tier.price}</div>
                <div className="store-commission">Hoa hồng giới thiệu: <span className="font-bold">{tier.commission}</span></div>
              </div>
              <div className="store-divider"></div>
              <ul className="store-features">
                {tier.features.map((feature, idx) => (
                  <li key={idx}>
                    <svg width="20" height="20" className="store-li-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ minWidth: "20px" }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <div className="store-card-footer">
                {isCurrent ? (
                  <button className="store-btn current" disabled>GÓI HIỆN TẠI</button>
                ) : isLower ? (
                  <button className="store-btn lower" disabled>ĐÃ BAO GỒM</button>
                ) : (
                  <button onClick={() => handleUpgrade(tier)} className={`store-btn upgrade ${tier.highlight ? 'pulse' : ''}`}>
                    NÂNG CẤP NGAY
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {checkoutTier && (
        <div className="store-modal-overlay">
          <div className="store-modal">
            <div className="modal-header">
              <h2>Xác nhận Nâng cấp: <span>{checkoutTier.name}</span></h2>
              <button onClick={closeCheckout} className="btn-close">
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            <div className="modal-body">
              <div className="warning-box">
                <div className="warning-flex">
                  <svg width="24" height="24" className="warning-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ minWidth: "24px" }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                  <div className="warning-text">
                    <h4>CẢNH BÁO LUẬT CHƠI: KHÔNG BÙ TRỪ</h4>
                    <p>Hệ thống áp dụng chính sách: Mua khóa cao tặng khóa thấp, tuy nhiên KHÔNG có chính sách trừ tiền bù vào nếu bạn đi lên từ cấp thấp. Bạn phải thanh toán đủ 100% giá của Mức {checkoutTier.name} là {checkoutTier.price}.</p>
                  </div>
                </div>
              </div>
              
              <div className="payment-grid">
                <div className="qr-section">
                  <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=ChuyenKhoanHeThongB2B" alt="QR Code" className="qr-img" />
                  <span className="qr-caption">Quét mã VietQR</span>
                </div>
                <div className="details-section">
                  <div className="detail-item">
                    <label>Ngân hàng</label>
                    <div className="detail-value box-white">
                      Techcombank (TCB)
                    </div>
                  </div>
                  <div className="detail-item">
                    <label>Tài khoản thụ hưởng & Số tiền</label>
                    <div className="detail-value box-blue">
                      1903.xxxx.xxxx.xx
                    </div>
                    <div className="detail-amount">
                       {checkoutTier.price}
                    </div>
                  </div>
                  <div className="detail-item">
                    <label>Nội dung chuyển khoản</label>
                    <div className="detail-value box-mono">
                      <span>UPGRADE {checkoutTier.name} AFF_ID69</span>
                      <button className="copy-btn" onClick={() => {
                        navigator.clipboard.writeText(`UPGRADE ${checkoutTier.name} AFF_ID69`);
                        addToast('Đã copy nội dung chuyển khoản', 'success');
                      }}>Copy</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={closeCheckout} className="btn-cancel">Hủy bỏ</button>
              <button className="btn-confirm" onClick={() => {
                addToast('Đã ghi nhận thanh toán. Vui lòng chờ admin duyệt.', 'success');
                closeCheckout();
              }}>
                <svg width="20" height="20" className="confirm-icon hidden" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Tôi đã chuyển khoản thành công
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
