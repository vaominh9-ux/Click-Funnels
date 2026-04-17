import React, { useState, useEffect } from 'react';
import { Save, User, CreditCard, Loader2, Camera } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useToast } from '../../components/common/Toast';
import Skeleton from '../../components/common/Skeleton';
import './Settings.css';

const AffiliateSettings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const addToast = useToast();

  // Profile form state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [tier, setTier] = useState('starter');
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Payout form state
  const [paymentMethod, setPaymentMethod] = useState('bank');
  const [bankAccount, setBankAccount] = useState('');
  const [bankName, setBankName] = useState('');

  // Billing history
  const [rankingHistory, setRankingHistory] = useState([]);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Lỗi khi lấy profile:', error);
        addToast('Không thể tải thông tin cá nhân', 'error');
      } else if (profile) {
        setFullName(profile.full_name || '');
        setEmail(profile.email || '');
        setPhone(profile.phone || '');
        setTier(profile.tier || 'starter');
        setAvatarUrl(profile.avatar_url || null);

        // Parse payment_info từ JSONB
        if (profile.payment_info) {
          const pInfo = typeof profile.payment_info === 'string' 
            ? JSON.parse(profile.payment_info) 
            : profile.payment_info;
          setPaymentMethod(pInfo.method || 'bank');
          setBankAccount(pInfo.account || '');
          setBankName(pInfo.bank_name || '');
        }

        // Tạo ranking history từ tier hiện tại
        const history = [];
        const tierOrder = ['starter', 'master', 'ai-coach', 'ai-partner'];
        const tierPrices = { 'starter': '6,000,000 VND', 'master': '12,000,000 VND', 'ai-coach': '30,000,000 VND', 'ai-partner': '100,000,000 VND' };
        const currentTierIndex = tierOrder.indexOf(profile.tier || 'starter');
        
        for (let i = 0; i <= currentTierIndex; i++) {
          history.push({
            rank: tierOrder[i].toUpperCase(),
            price: tierPrices[tierOrder[i]],
            status: 'Completed',
            note: i === 0 ? 'Đăng ký ban đầu' : 'Nâng cấp (No-prorating)',
            date: profile.created_at ? new Date(profile.created_at).toLocaleDateString('vi-VN') : 'N/A'
          });
        }
        setRankingHistory(history);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
    }
    setLoading(false);
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          phone: phone,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) {
        console.error('Lỗi khi cập nhật profile:', error);
        addToast('Cập nhật thất bại!', 'error');
      } else {
        addToast('Đã lưu thông tin cá nhân', 'success');
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      addToast('Đã xảy ra lỗi!', 'error');
    }
    setSaving(false);
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate
    if (file.size > 2 * 1024 * 1024) {
      addToast('Ảnh quá lớn! Tối đa 2MB.', 'error');
      return;
    }
    if (!file.type.startsWith('image/')) {
      addToast('Chỉ chấp nhận file ảnh (JPG, PNG, WEBP).', 'error');
      return;
    }

    setUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const fileExt = file.name.split('.').pop();
      const filePath = `avatars/${user.id}.${fileExt}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        addToast('Upload thất bại: ' + uploadError.message, 'error');
        return;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Update profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl, updated_at: new Date().toISOString() })
        .eq('id', user.id);

      if (updateError) {
        addToast('Lưu avatar thất bại!', 'error');
      } else {
        setAvatarUrl(publicUrl + '?t=' + Date.now()); // bust cache
        addToast('Đã cập nhật ảnh đại diện!', 'success');
      }
    } catch (err) {
      console.error(err);
      addToast('Đã xảy ra lỗi!', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleSavePayout = async () => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('profiles')
        .update({
          payment_info: {
            method: paymentMethod,
            account: bankAccount,
            bank_name: bankName
          },
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) {
        console.error('Lỗi khi cập nhật payout:', error);
        addToast('Cập nhật thất bại!', 'error');
      } else {
        addToast('Đã cập nhật phương thức thanh toán', 'success');
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      addToast('Đã xảy ra lỗi!', 'error');
    }
    setSaving(false);
  };

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

            {/* AVATAR UPLOAD */}
            <div className="avatar-upload-section">
              <div className="avatar-preview">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="avatar-img" />
                ) : (
                  <div className="avatar-placeholder">
                    {fullName ? fullName.charAt(0).toUpperCase() : '?'}
                  </div>
                )}
                <label className="avatar-upload-btn" htmlFor="avatar-input">
                  {uploading ? <Loader2 size={14} className="animate-spin" /> : <Camera size={14} />}
                </label>
                <input
                  id="avatar-input"
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleAvatarUpload}
                  disabled={uploading}
                />
              </div>
              <div className="avatar-info">
                <span className="font-bold">{fullName || 'Chưa đặt tên'}</span>
                <span className="text-muted text-sm">Nhấp vào biểu tượng máy ảnh để đổi ảnh (tối đa 2MB)</span>
              </div>
            </div>
            
            <div className="form-group mt-4">
              <label>Họ và Tên</label>
              {loading ? <Skeleton width="100%" height="40px" /> : (
                <input type="text" className="cf-input w-100" value={fullName} onChange={e => setFullName(e.target.value)} />
              )}
            </div>
            
            <div className="form-group mt-4">
              <label>Địa chỉ Email</label>
              {loading ? <Skeleton width="100%" height="40px" /> : (
                <input type="email" className="cf-input w-100" value={email} disabled />
              )}
              <span className="text-sm text-muted mt-1" style={{display:'block'}}>Email đăng nhập không thể bị thay đổi.</span>
            </div>

            <div className="form-group mt-4">
              <label>Số Điện Thoại</label>
              {loading ? <Skeleton width="100%" height="40px" /> : (
                <input type="text" className="cf-input w-100" value={phone} onChange={e => setPhone(e.target.value)} placeholder="VD: 0987 654 321" />
              )}
            </div>

            <div className="form-group mt-4">
              <label>Hạng Đại Lý</label>
              {loading ? <Skeleton width="100%" height="40px" /> : (
                <input type="text" className="cf-input w-100" value={tier.toUpperCase()} disabled style={{fontWeight: 700, color: '#3B82F6'}} />
              )}
            </div>

            <div className="flex-end mt-6">
              <button className="cf-btn-primary" onClick={handleSaveProfile} disabled={saving} style={{display:'flex',alignItems:'center',gap:'8px'}}>
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Lưu Thay Đổi
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
              {loading ? <Skeleton width="100%" height="40px" /> : (
                <select className="cf-input w-100" style={{ padding: '10px', backgroundColor: 'var(--cf-bg-surface)' }} value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
                  <option value="bank">Chuyển khoản Ngân hàng (Nội địa)</option>
                  <option value="paypal">PayPal (Quốc tế)</option>
                </select>
              )}
            </div>

            <div className="form-group mt-4">
              <label>Số Tài Khoản</label>
              {loading ? <Skeleton width="100%" height="40px" /> : (
                <input type="text" className="cf-input w-100" placeholder="VD: 1903..." value={bankAccount} onChange={e => setBankAccount(e.target.value)} />
              )}
            </div>
            
            <div className="form-group mt-4">
              <label>Tên Ngân Hàng / Viết tắt</label>
              {loading ? <Skeleton width="100%" height="40px" /> : (
                <input type="text" className="cf-input w-100" placeholder="VD: Techcombank, VCB..." value={bankName} onChange={e => setBankName(e.target.value)} />
              )}
            </div>

            <div className="cf-card mt-6" style={{ background: 'rgba(52, 211, 153, 0.1)', border: '1px solid rgba(52, 211, 153, 0.3)' }}>
              <strong style={{ color: '#34D399' }}>Lưu ý:</strong> Mọi khoản rút tiền phải trải qua chu kỳ 30 ngày đóng băng để đối trừ (Cooling period) tránh rủi ro hoàn tiền.
            </div>

            <div className="flex-end mt-6">
              <button className="cf-btn-primary" onClick={handleSavePayout} disabled={saving} style={{display:'flex',alignItems:'center',gap:'8px'}}>
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Lưu Thông Tin
              </button>
            </div>
          </div>
        )}

        {activeTab === 'billing' && (
          <div className="tab-pane" style={{ maxWidth: '800px' }}>
            <h3 className="mb-4">Lịch Sử Đầu Tư Phễu</h3>
            <p className="text-muted mb-6">Kiểm tra các gói bạn đã nâng cấp và lịch sử đơn hàng trên hệ thống.</p>
            
            <div className="timeline-container">
              {loading ? (
                Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="cf-card mb-4" style={{borderLeft: '4px solid #6B7280'}}>
                    <div className="flex-between">
                      <div><Skeleton width="200px" height="20px" /><div style={{marginTop: 8}}><Skeleton width="160px" height="14px" /></div></div>
                      <div style={{textAlign: 'right'}}><Skeleton width="120px" height="20px" /><div style={{marginTop: 8}}><Skeleton width="80px" height="24px" style={{borderRadius: 12}} /></div></div>
                    </div>
                  </div>
                ))
              ) : rankingHistory.map((item, index) => (
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

            <div className="p-4 mt-6" style={{ background: 'rgba(0,0,0,0.02)', borderRadius: '8px', border: '1px solid var(--cf-border)' }}>
              <div className="flex-between">
                <div>
                  <h4 className="font-bold mb-1">Bạn muốn thăng hạng cao hơn?</h4>
                  <p className="text-sm text-muted">Truy cập ngay bảng Dự Án (Campaigns) để mua thêm quyền phân phối cấp Đại Lượng.</p>
                </div>
                <button className="cf-btn-primary" onClick={() => window.location.href = '/affiliate/store'}>Đến trang Nâng Cấp</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AffiliateSettings;
