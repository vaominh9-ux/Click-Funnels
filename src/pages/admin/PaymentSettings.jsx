import React, { useState, useEffect } from 'react';
import { Save, Loader2, Building2, CreditCard, QrCode, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useToast } from '../../components/common/Toast';
import './PaymentSettings.css';

const BANK_LIST = [
  { name: 'BIDV', bin: '970418' },
  { name: 'Vietcombank', bin: '970436' },
  { name: 'MB Bank', bin: '970422' },
  { name: 'Techcombank', bin: '970407' },
  { name: 'VPBank', bin: '970432' },
  { name: 'ACB', bin: '970416' },
  { name: 'TPBank', bin: '970423' },
  { name: 'Sacombank', bin: '970403' },
  { name: 'Agribank', bin: '970405' },
  { name: 'VietinBank', bin: '970415' },
  { name: 'SHB', bin: '970443' },
  { name: 'HDBank', bin: '970437' },
];

const PaymentSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const addToast = useToast();

  // Bank config form
  const [bankName, setBankName] = useState('BIDV');
  const [bankId, setBankId] = useState('970418');
  const [accountNo, setAccountNo] = useState('');
  const [accountName, setAccountName] = useState('');
  
  // Test QR preview
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .select('*')
        .eq('key', 'bank_config')
        .single();

      if (data && data.value) {
        const config = data.value;
        setBankName(config.bankName || 'BIDV');
        setBankId(config.bankId || '970418');
        setAccountNo(config.accountNo || '');
        setAccountName(config.accountName || '');
      }
    } catch (err) {
      console.error('Load settings error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBankChange = (selectedBankName) => {
    setBankName(selectedBankName);
    const bank = BANK_LIST.find(b => b.name === selectedBankName);
    if (bank) setBankId(bank.bin);
  };

  const handleSave = async () => {
    if (!accountNo.trim() || !accountName.trim()) {
      addToast('Vui lòng điền đầy đủ thông tin tài khoản', 'error');
      return;
    }

    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('system_settings')
        .upsert({
          key: 'bank_config',
          value: { bankId, accountNo: accountNo.trim(), accountName: accountName.trim().toUpperCase(), bankName },
          updated_at: new Date().toISOString(),
          updated_by: user?.id
        }, { onConflict: 'key' });

      if (error) throw error;
      
      addToast('Đã lưu cấu hình thanh toán thành công!', 'success');
      setShowQR(true);
    } catch (err) {
      console.error('Save error:', err);
      addToast('Lỗi khi lưu cấu hình: ' + err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const qrPreviewUrl = `https://img.vietqr.io/image/${bankId}-${accountNo}-print.png?amount=10000&addInfo=TEST_QR&accountName=${encodeURIComponent(accountName)}`;

  if (loading) {
    return (
      <div className="payment-settings-container">
        <div className="ps-header">
          <h1>Cấu Hình Thanh Toán</h1>
        </div>
        <div style={{padding: '40px', textAlign: 'center', color: '#9CA3AF'}}>
          <Loader2 size={32} className="spin" />
          <p style={{marginTop: '12px'}}>Đang tải cấu hình...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-settings-container">
      <div className="ps-header">
        <div>
          <h1>Cấu Hình Thanh Toán</h1>
          <p className="ps-subtitle">Quản lý thông tin ngân hàng nhận tiền & mã QR cho trang Checkout.</p>
        </div>
      </div>

      <div className="ps-grid">
        {/* Cột trái: Form cấu hình */}
        <div className="ps-card">
          <div className="ps-card-header">
            <Building2 size={20} />
            <h3>Thông Tin Ngân Hàng</h3>
          </div>
          
          <div className="ps-form">
            <div className="ps-field">
              <label>Ngân Hàng</label>
              <select value={bankName} onChange={(e) => handleBankChange(e.target.value)}>
                {BANK_LIST.map(b => (
                  <option key={b.bin} value={b.name}>{b.name}</option>
                ))}
              </select>
              <span className="ps-hint">BIN Code: {bankId}</span>
            </div>

            <div className="ps-field">
              <label>Số Tài Khoản (VA)</label>
              <input 
                type="text" 
                value={accountNo} 
                onChange={(e) => setAccountNo(e.target.value)}
                placeholder="VD: 96247NTH195"
              />
              <span className="ps-hint">Là số tài khoản ảo (VA) lấy từ SePay</span>
            </div>

            <div className="ps-field">
              <label>Tên Chủ Tài Khoản</label>
              <input 
                type="text" 
                value={accountName} 
                onChange={(e) => setAccountName(e.target.value.toUpperCase())}
                placeholder="VD: NGUYEN TRONG HUU"
                style={{textTransform: 'uppercase'}}
              />
              <span className="ps-hint">Viết HOA, không dấu — khớp với tên TK ngân hàng</span>
            </div>

            <button className="ps-save-btn" onClick={handleSave} disabled={saving}>
              {saving ? (
                <><Loader2 size={16} className="spin" /> Đang lưu...</>
              ) : (
                <><Save size={16} /> Lưu Cấu Hình</>
              )}
            </button>
          </div>
        </div>

        {/* Cột phải: Preview QR */}
        <div className="ps-card">
          <div className="ps-card-header">
            <QrCode size={20} />
            <h3>Xem Trước QR Code</h3>
          </div>

          <div className="ps-qr-preview">
            {accountNo && accountName ? (
              <>
                <img 
                  src={qrPreviewUrl} 
                  alt="QR Preview" 
                  className="ps-qr-image"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
                <div className="ps-qr-info">
                  <div className="ps-qr-row">
                    <span>Ngân hàng:</span>
                    <strong>{bankName}</strong>
                  </div>
                  <div className="ps-qr-row">
                    <span>Chủ TK:</span>
                    <strong>{accountName}</strong>
                  </div>
                  <div className="ps-qr-row">
                    <span>Số TK:</span>
                    <strong>{accountNo}</strong>
                  </div>
                  <div className="ps-qr-row">
                    <span>Số tiền test:</span>
                    <strong style={{color: '#059669'}}>10.000 đ</strong>
                  </div>
                </div>
                <div className="ps-qr-note">
                  <CheckCircle size={14} style={{color: '#059669'}} />
                  <span>QR sẽ hiển thị như thế này trên trang Checkout</span>
                </div>
              </>
            ) : (
              <div className="ps-qr-empty">
                <AlertCircle size={32} style={{color: '#6B7280'}} />
                <p>Điền thông tin ngân hàng để xem trước QR Code</p>
              </div>
            )}
          </div>

          <div className="ps-card-header" style={{marginTop: '24px'}}>
            <CreditCard size={20} />
            <h3>Hướng Dẫn Thay Đổi</h3>
          </div>
          <div className="ps-guide">
            <ol>
              <li>Điền đúng <strong>số VA</strong> lấy từ SePay Dashboard</li>
              <li>Tên chủ TK phải <strong>khớp chính xác</strong> với tên trên ngân hàng</li>
              <li>Nếu đổi ngân hàng mới → vào SePay liên kết TK mới + cập nhật Webhook</li>
              <li>Bấm <strong>"Lưu Cấu Hình"</strong> → trang Checkout sẽ tự cập nhật</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSettings;
