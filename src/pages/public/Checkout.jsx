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
  const orderInitialized = useRef(false);

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

  // === TÍNH HOA HỒNG TỰ ĐỘNG ===
  const calculateCommission = async (saleAmount, courseKey) => {
    try {
      const { data: plans } = await supabase
        .from('commission_plans')
        .select('*')
        .order('created_at', { ascending: false });

      if (!plans || plans.length === 0) return 0;

      // Ưu tiên 1: Tìm plan "Ghi đè Sản phẩm" khớp với courseId
      const productPlan = plans.find(p =>
        p.type === 'product' &&
        Array.isArray(p.applied_to) &&
        p.applied_to.includes(courseKey)
      );

      // Ưu tiên 2: Plan mặc định
      const defaultPlan = plans.find(p => p.type === 'default');

      const matchedPlan = productPlan || defaultPlan;
      if (!matchedPlan) return 0;

      // Tính: ưu tiên rate_fixed > rate_percent
      if (matchedPlan.rate_fixed && Number(matchedPlan.rate_fixed) > 0) {
        return Number(matchedPlan.rate_fixed);
      }
      if (matchedPlan.rate_percent && Number(matchedPlan.rate_percent) > 0) {
        return Math.round(saleAmount * Number(matchedPlan.rate_percent) / 100);
      }

      return 0;
    } catch (err) {
      console.error('Commission calc error:', err);
      return 0;
    }
  };

  const handleCreateOrder = async () => {
    if (!leadInfo) {
      addToast('Lỗi: Không tìm thấy thông tin đăng ký.', 'error');
      return;
    }
    
    setLoading(true);
    try {
      // Tính hoa hồng dựa trên commission_plans
      const commissionAmount = await calculateCommission(amount, courseId);
      
      // Lấy link_id và campaign_id từ localStorage để ghi nhận toàn diện
      const linkId = localStorage.getItem('aff_link_id') || null;
      let campaignId = localStorage.getItem('aff_campaign_id') || null;
      if (campaignId === 'undefined' || campaignId === 'null') campaignId = null;

      const { error } = await supabase
        .from('conversions')
        .insert([{
          affiliate_id: leadInfo.affiliate_id,
          campaign_id: campaignId,
          link_id: linkId,
          sale_amount: amount,
          commission_amount: commissionAmount,
          status: 'pending',
          customer_name: leadInfo.name,
          product_name: course.name,
          payment_code: paymentCode,
          customer_info: {
            lead_id: leadInfo.id,
            phone: leadInfo.phone,
            email: leadInfo.email || null,
            notes: `Mua ${course.name}`
          }
        }]);

      if (error) throw error;
      
      setConversionId(paymentCode); // Dùng paymentCode làm key cho realtime
      setPaymentStatus('waiting');
      setElapsedTime(0);

      // === GỬI EMAIL XÁC NHẬN ĐĂNG KÝ (fire-and-forget) ===
      if (leadInfo.email) {
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        fetch(`${baseUrl}/api/email/send-registration`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: leadInfo.name,
            email: leadInfo.email,
            phone: leadInfo.phone,
            courseName: course.name,
            coursePrice: amount,
            paymentCode: paymentCode,
            bankConfig: bankConfig
          })
        }).then(r => r.json())
          .then(d => console.log('📧 Registration email:', d.success ? 'sent' : 'skipped'))
          .catch(err => console.warn('Email send failed (non-blocking):', err));
      }
      
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

  // Tự động kéo đơn hàng ngầm (Auto-order)
  useEffect(() => {
    if (leadInfo && paymentCode && paymentStatus === 'idle' && !orderInitialized.current) {
      orderInitialized.current = true;
      handleCreateOrder();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leadInfo, paymentCode, paymentStatus]);

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

          {/* Trạng thái khởi tạo */}
          {paymentStatus === 'idle' && (
            <div className="payment-waiting-box" style={{textAlign: 'center'}}>
              <Loader2 size={24} className="spin" style={{color: '#38BDF8', margin: '0 auto 10px'}} />
              <div style={{fontWeight: 600, color: '#F8FAFC'}}>Đang khởi tạo giao dịch an toàn...</div>
            </div>
          )}

          {/* Trạng thái chờ thanh toán */}
          {paymentStatus === 'waiting' && (
            <div className="payment-waiting-box">
              <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px'}}>
                <Loader2 size={20} className="spin" style={{color: '#38BDF8'}} />
                <span style={{fontWeight: 600, color: '#38BDF8'}}>Đang chờ xác nhận thanh toán tự động...</span>
              </div>
              <div style={{fontSize: '13px', color: '#94A3B8'}}>
                Thời gian chờ: <strong style={{color: '#F8FAFC'}}>{formatTime(elapsedTime)}</strong> — Hệ thống quét giao dịch mỗi 3s.
              </div>
              {elapsedTime > 300 && (
                <div style={{marginTop: '12px', fontSize: '13px', color: '#EF4444', display: 'flex', alignItems: 'flex-start', gap: '6px', background: 'rgba(239, 68, 68, 0.1)', padding: '8px', borderRadius: '4px'}}>
                  <AlertCircle size={16} />
                  Quá 5 phút chưa nhận được. Vui lòng đảm bảo nội dung chuyển khoản là <b>{paymentCode}</b>, hoặc F5 để thử lại.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;
