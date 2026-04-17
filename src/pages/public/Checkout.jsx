import React, { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { FUNNEL_COURSES, BANK_CONFIG } from '../funnels/config';
import { supabase } from '../../lib/supabase';
import { useToast } from '../../components/common/Toast';
import { CheckCircle, Clock, AlertCircle, Loader2, Copy, ShieldCheck } from 'lucide-react';
import './Checkout.css';

// Sinh mã thanh toán duy nhất: CF + 6 ký tự ngẫu nhiên
const generatePaymentCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Bỏ I,O,0,1 tránh nhầm
  let code = 'CF';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

const Checkout = () => {
  const { courseId } = useParams();
  const [searchParams] = useSearchParams();
  const leadId = searchParams.get('lead_id');
  const navigate = useNavigate();
  const addToast = useToast();
  
  const [loading, setLoading] = useState(false);
  const [leadInfo, setLeadInfo] = useState(null);
  const [paymentCode, setPaymentCode] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('idle'); // idle | waiting | success | error
  const [conversionId, setConversionId] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const timerRef = useRef(null);

  const course = FUNNEL_COURSES[courseId];
  const [bankConfig, setBankConfig] = useState(BANK_CONFIG);

  // Load lead info from sessionStorage
  useEffect(() => {
    if (!leadId) return;
    try {
      const cachedLead = sessionStorage.getItem('tempLeadInfo');
      if (cachedLead) {
        const parsed = JSON.parse(cachedLead);
        if (parsed.id === leadId) {
          setLeadInfo(parsed);
        }
      }
    } catch(err) {
      console.warn('Could not read lead from sessionStorage:', err);
    }
  }, [leadId]);

  // Sinh mã thanh toán 1 lần khi component mount
  useEffect(() => {
    setPaymentCode(generatePaymentCode());
    // Load bank config từ DB (nếu admin đã cấu hình)
    const loadBankConfig = async () => {
      try {
        const { data } = await supabase
          .from('system_settings')
          .select('value')
          .eq('key', 'bank_config')
          .single();
        if (data?.value) setBankConfig(data.value);
      } catch(err) {
        // Fallback dùng BANK_CONFIG từ config.js
      }
    };
    loadBankConfig();
  }, []);

  // Polling: kiểm tra trạng thái thanh toán mỗi 3 giây
  useEffect(() => {
    if (!conversionId) return;

    const pollInterval = setInterval(async () => {
      try {
        const { data, error } = await supabase
          .rpc('check_payment_status', { p_payment_code: conversionId });
        
        if (!error && data === 'approved') {
          setPaymentStatus('success');
          clearInterval(pollInterval);
          if (timerRef.current) clearInterval(timerRef.current);
          addToast('🎉 Thanh toán thành công! Đơn hàng đã được xác nhận.', 'success');
        }
      } catch (err) {
        console.warn('Payment check error:', err);
      }
    }, 3000); // Poll mỗi 3 giây

    return () => clearInterval(pollInterval);
  }, [conversionId]);

  // Timer đếm thời gian chờ
  useEffect(() => {
    if (paymentStatus === 'waiting') {
      timerRef.current = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paymentStatus]);

  if (!course) {
    return <div className="checkout-error">Không tìm thấy khóa học này!</div>;
  }

  const amount = course.price;
  // Nội dung CK: chứa mã thanh toán để SePay nhận diện
  const transferMessage = paymentCode;
  const qrImage = `https://img.vietqr.io/image/${bankConfig.bankId}-${bankConfig.accountNo}-print.png?amount=${amount}&addInfo=${transferMessage}&accountName=${encodeURIComponent(bankConfig.accountName)}`;

  const handleCreateOrder = async () => {
    if (!leadInfo) {
      addToast('Lỗi: Không tìm thấy thông tin đăng ký.', 'error');
      return;
    }
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('conversions')
        .insert([{
          affiliate_id: leadInfo.affiliate_id,
          sale_amount: amount,
          commission_amount: 0,
          status: 'pending',
          customer_name: leadInfo.name,
          product_name: course.name,
          payment_code: paymentCode,
          customer_info: {
            lead_id: leadInfo.id,
            phone: leadInfo.phone,
            notes: `Mua ${course.name}`
          }
        }]);

      if (error) throw error;
      
      setConversionId(paymentCode); // Dùng paymentCode làm key cho realtime
      setPaymentStatus('waiting');
      setElapsedTime(0);
      addToast('Đơn hàng đã được tạo. Quét mã QR để thanh toán!', 'success');
      
    } catch (error) {
      console.error(error);
      addToast('Đã xảy ra lỗi khi tạo đơn hàng.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(paymentCode);
    addToast('Đã sao chép mã thanh toán!', 'success');
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // ---- UI: Thanh toán thành công ----
  if (paymentStatus === 'success') {
    return (
      <div className="checkout-container">
        <div className="payment-success-card">
          <div className="success-icon-wrapper">
            <CheckCircle size={64} color="#059669" />
          </div>
          <h2>Thanh Toán Thành Công! 🎉</h2>
          <p className="success-subtitle">Đơn hàng của bạn đã được xác nhận tự động.</p>
          
          <div className="success-details">
            <div className="success-row">
              <span>Khóa học:</span>
              <strong>{course.name}</strong>
            </div>
            <div className="success-row">
              <span>Số tiền:</span>
              <strong style={{color: '#059669'}}>{amount.toLocaleString('vi-VN')} đ</strong>
            </div>
            <div className="success-row">
              <span>Mã đơn:</span>
              <strong>{paymentCode}</strong>
            </div>
          </div>
          
          <p style={{color: '#6B7280', fontSize: '14px', marginTop: '16px'}}>
            Bạn sẽ nhận được email xác nhận và link truy cập khóa học trong ít phút.
          </p>
          
          <button className="checkout-btn" onClick={() => navigate('/')} style={{marginTop: '24px'}}>
            Về Trang Chủ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <div className="checkout-wrapper">
        <div className="checkout-left">
          <h2>Tóm tắt đơn hàng</h2>
          
          <img src={course.checkoutImage} alt="Course" className="course-image" />
          
          <div className="order-details">
            <h3 className="course-name">{course.name}</h3>
            
            <div className="price-row">
              <span>Học phí gốc:</span>
              <span className="strike">{(course.price * 1.5).toLocaleString('vi-VN')} đ</span>
            </div>
            <div className="price-row total-row">
              <span>Thành tiền:</span>
              <span className="total-price">{amount.toLocaleString('vi-VN')} đ</span>
            </div>
          </div>
          
          <div className="security-badges">
            <ShieldCheck size={16} /> Thanh toán an toàn 100% | Cam kết hoàn tiền 7 ngày
          </div>
        </div>

        <div className="checkout-right">
          <h2>Thanh toán qua mã QR</h2>
          <p className="qr-guide">Mở App ngân hàng bất kỳ để quét mã VietQR bên dưới</p>

          <div className="qr-container">
            <img src={qrImage} alt="VietQR" className="qr-code-img" />
          </div>

          <div className="bank-details">
            <div className="bank-info-row">
              <span>Ngân hàng:</span>
              <strong>{bankConfig.bankName || 'BIDV'}</strong>
            </div>
            <div className="bank-info-row">
              <span>Chủ tài khoản:</span>
              <strong>{bankConfig.accountName}</strong>
            </div>
            <div className="bank-info-row">
              <span>Số tài khoản:</span>
              <strong>{bankConfig.accountNo}</strong>
            </div>
            <div className="bank-info-row">
              <span>Số tiền:</span>
              <strong className="text-blue">{amount.toLocaleString('vi-VN')} đ</strong>
            </div>
            <div className="bank-info-row" style={{background: 'rgba(245,158,11,0.1)', padding: '8px 12px', borderRadius: '8px', border: '1px dashed #F59E0B'}}>
              <span>Nội dung CK:</span>
              <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                <strong className="text-orange" style={{fontSize: '18px', letterSpacing: '2px'}}>{paymentCode}</strong>
                <button onClick={handleCopyCode} style={{background: 'none', border: 'none', cursor: 'pointer', color: '#F59E0B', padding: '2px'}}>
                  <Copy size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Trạng thái chờ thanh toán */}
          {paymentStatus === 'waiting' && (
            <div className="payment-waiting-box">
              <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px'}}>
                <Loader2 size={20} className="spin" style={{color: '#3B82F6'}} />
                <span style={{fontWeight: 600, color: '#1E40AF'}}>Đang chờ xác nhận thanh toán...</span>
              </div>
              <div style={{fontSize: '13px', color: '#6B7280'}}>
                Thời gian chờ: <strong>{formatTime(elapsedTime)}</strong> — Hệ thống sẽ tự động xác nhận khi nhận được tiền.
              </div>
              {elapsedTime > 300 && (
                <div style={{marginTop: '8px', fontSize: '13px', color: '#DC2626', display: 'flex', alignItems: 'center', gap: '6px'}}>
                  <AlertCircle size={14} />
                  Quá 5 phút chưa nhận được. Vui lòng kiểm tra lại nội dung chuyển khoản hoặc liên hệ hỗ trợ.
                </div>
              )}
            </div>
          )}

          {paymentStatus === 'idle' && (
            <button 
              className="checkout-btn" 
              onClick={handleCreateOrder}
              disabled={loading || !leadInfo}
            >
              {loading ? 'Đang Tạo Đơn...' : 'Xác Nhận & Chuyển Khoản'}
            </button>
          )}

          {paymentStatus === 'waiting' && (
            <div style={{textAlign: 'center', marginTop: '12px', fontSize: '13px', color: '#9CA3AF'}}>
              <Clock size={14} style={{verticalAlign: 'middle', marginRight: '4px'}} />
              Trang này sẽ tự động cập nhật khi nhận được thanh toán
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;
