import React, { useState } from 'react';
import { Save, User, CreditCard } from 'lucide-react';
import { useToast } from '../../components/common/Toast';
import './Settings.css';

const AffiliateSettings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const addToast = useToast();

  const rankingHistory = [
    { date: '10 Feb 2026', rank: 'STARTER', price: '6,000,000 VND', status: 'Completed', note: 'Initial Registration' },
    { date: '15 Apr 2026', rank: 'MASTER', price: '12,000,000 VND', status: 'Completed', note: 'No-prorating Upgrade' },
  ];

  return (
    <div className="settings-wrapper">
      <div className="mb-6">
        <h2>Cài Đặt Hệ Thống</h2>
        <p className="text-muted mt-2">Quản lý hồ sơ cá nhân và phương thức rút tiền hoa hồng.</p>
      </div>

      <div className="settings-tabs">
        <button 
          className={`settings-tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          Hồ Sơ Cá Nhân
        </button>
        <button 
          className={`settings-tab-btn ${activeTab === 'payout' ? 'active' : ''}`}
          onClick={() => setActiveTab('payout')}
        >
          Phương Thức Thanh Toán
        </button>
        <button 
          className={`settings-tab-btn ${activeTab === 'billing' ? 'active' : ''}`}
          onClick={() => setActiveTab('billing')}
        >
          Lịch Sử Hạng & Thanh Toán
        </button>
      </div>

      <div className="settings-container">
        {activeTab === 'profile' && (
          <div className="cf-card settings-card" style={{ maxWidth: '600px' }}>
            <div className="settings-header flex-align-center mb-6" style={{ gap: '12px' }}>
              <User size={20} className="text-muted" />
              <h3 className="font-bold">Thông Tin Chi Tiết</h3>
            </div>
            
            <div className="form-group mt-4">
              <label>Họ và Tên</label>
              <input type="text" className="cf-input w-100" defaultValue="Nguyễn Trọng Hữu" />
            </div>
            
            <div className="form-group mt-4">
              <label>Địa chỉ Email</label>
              <input type="email" className="cf-input w-100" defaultValue="nhaccu1993@gmail.com" disabled />
              <span className="text-sm text-muted mt-1" style={{display:'block'}}>Email đăng nhập không thể bị thay đổi.</span>
            </div>

            <div className="form-group mt-4">
              <label>Số Điện Thoại</label>
              <input type="text" className="cf-input w-100" defaultValue="0987 654 321" />
            </div>

            <div className="flex-end mt-6">
              <button className="cf-btn-primary" onClick={() => addToast('Đã lưu thông tin cá nhân', 'success')}>
                <Save size={16} /> Lưu Thay Đổi
              </button>
            </div>
          </div>
        )}

        {activeTab === 'payout' && (
          <div className="cf-card settings-card" style={{ maxWidth: '600px' }}>
            <div className="settings-header flex-align-center mb-4" style={{ gap: '12px' }}>
              <CreditCard size={20} className="text-muted" />
              <h3 className="font-bold">Thiết Lập Rút Tiền</h3>
            </div>
            <p className="text-muted text-sm mt-2 mb-6">
              Vui lòng cung cấp chính xác STK ngân hàng. Chu kỳ chốt hoa hồng vào ngày 1 và 15 âm hàng tháng.
            </p>

            <div className="form-group">
              <label>Phương Thức Nhận</label>
              <select className="cf-input w-100" style={{ padding: '10px', backgroundColor: 'var(--cf-bg-surface)' }}>
                <option>Chuyển khoản Ngân hàng (Nội địa)</option>
                <option>PayPal (Quốc tế)</option>
              </select>
            </div>

            <div className="form-group mt-4">
              <label>Số Tài Khoản</label>
              <input type="text" className="cf-input w-100" placeholder="VD: 1903..." />
            </div>
            
            <div className="form-group mt-4">
              <label>Tên Ngân Hàng / Viết tắt</label>
              <input type="text" className="cf-input w-100" placeholder="VD: Techcombank, VCB..." />
            </div>

            <div className="cf-card mt-6" style={{ background: 'rgba(52, 211, 153, 0.1)', border: '1px solid rgba(52, 211, 153, 0.3)' }}>
              <strong style={{ color: '#34D399' }}>Lưu ý:</strong> Mọi khoản rút tiền phải trải qua chu kỳ 30 ngày đóng băng để đối trừ (Cooling period) tránh rủi ro hoàn tiền.
            </div>

            <div className="flex-end mt-6">
              <button className="cf-btn-primary" onClick={() => addToast('Đã cập nhật phương thức thanh toán', 'success')}>
                <Save size={16} /> Lưu Thông Tin
              </button>
            </div>
          </div>
        )}

        {activeTab === 'billing' && (
          <div className="tab-pane" style={{ maxWidth: '800px' }}>
            <h3 className="mb-4">Lịch Sử Đầu Tư Phễu</h3>
            <p className="text-muted mb-6">Kiểm tra các gói bạn đã nâng cấp và lịch sử đơn hàng trên hệ thống.</p>
            
            <div className="timeline-container">
              {rankingHistory.map((item, index) => (
                <div key={index} className="cf-card mb-4" style={{borderLeft: `4px solid ${index === rankingHistory.length - 1 ? '#34D399' : '#6B7280'}`}}>
                  <div className="flex-between">
                    <div>
                      <h4 className="font-bold mb-1">Nâng cấp thành {item.rank}</h4>
                      <div className="text-sm text-muted">{item.date} • {item.note}</div>
                    </div>
                    <div style={{textAlign: 'right'}}>
                      <div className="font-bold">{item.price}</div>
                      <div className="badge badge-paid mt-1">{item.status}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 mt-6" style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--cf-border)' }}>
              <div className="flex-between">
                <div>
                  <h4 className="font-bold mb-1">Bạn muốn thăng hạng cao hơn?</h4>
                  <p className="text-sm text-muted">Truy cập ngay bảng Dự Án (Campaigns) để mua thêm quyền phân phối cấp Đại Lượng.</p>
                </div>
                <button className="cf-btn-primary">Đến trang Dự Án</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AffiliateSettings;
