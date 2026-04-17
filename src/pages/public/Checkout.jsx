import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { FUNNEL_COURSES, BANK_CONFIG } from '../funnels/config';
import { supabase } from '../../lib/supabase';
import { useToast } from '../../components/common/Toast';
import './Checkout.css';

const Checkout = () => {
  const { courseId } = useParams();
  const [searchParams] = useSearchParams();
  const leadId = searchParams.get('lead_id');
  const navigate = useNavigate();
  const addToast = useToast();
  
  const [loading, setLoading] = useState(false);
  const [leadInfo, setLeadInfo] = useState(null);

  const course = FUNNEL_COURSES[courseId];

  useEffect(() => {
    // Kéo thông tin Lead lên để biết Affiliate nào
    const fetchLead = async () => {
      if (!leadId) return;
      const { data } = await supabase.from('leads').select('*').eq('id', leadId).single();
      if (data) setLeadInfo(data);
    };
    fetchLead();
  }, [leadId]);

  if (!course) {
    return <div className="checkout-error">Không tìm thấy khóa học này!</div>;
  }

  // Khởi tạo link VietQR
  const amount = course.price;
  const message = `Thanh toan khoa hoc ${leadInfo?.phone || ''}`.replace(/\s+/g, '%20');
  const qrImage = `https://img.vietqr.io/image/${BANK_CONFIG.bankId}-${BANK_CONFIG.accountNo}-print.png?amount=${amount}&addInfo=${message}&accountName=${BANK_CONFIG.accountName}`;

  const handleConfirmPayment = async () => {
    if (!leadInfo) {
      addToast('Lỗi: Không tìm thấy thông tin đăng ký (Lead ID).', 'error');
      return;
    }
    
    setLoading(true);
    try {
      // Tính hoa hồng tạm thời (mặc định cho admin duyệt). Lưu ý: hoa hồng thực tế sẽ tính bởi Admin 
      // Nhưng ta cứ chèn log vào conversions. Cấu hình tỉ lệ hoa hồng thường nằm ở logic backend
      
      const { error } = await supabase
        .from('conversions')
        .insert([{
          affiliate_id: leadInfo.affiliate_id, // Gắn vào ctv
          lead_id: leadInfo.id,
          sale_amount: amount,
          status: 'pending', // Chờ Admin check bank
          notes: `Mua ${course.name}`
        }]);

      if (error) throw error;
      
      addToast('Gửi yêu cầu thành công! Vui lòng chờ admin xác nhận.', 'success');
      
      // Chuyển về trang lỗi hoặc trang cảm ơn
      setTimeout(() => navigate('/'), 2000);
      
    } catch (error) {
      console.error(error);
      addToast('Đã xảy ra lỗi khi tạo đơn hàng.', 'error');
    } finally {
      setLoading(false);
    }
  };

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
            Thanh toán an toàn 100% | Cam kết hoàn tiền 7 ngày
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
              <span>Chủ tài khoản:</span>
              <strong>{BANK_CONFIG.accountName}</strong>
            </div>
            <div className="bank-info-row">
              <span>Số tài khoản:</span>
              <strong>{BANK_CONFIG.accountNo}</strong>
            </div>
            <div className="bank-info-row">
              <span>Số tiền:</span>
              <strong className="text-blue">{amount.toLocaleString('vi-VN')} đ</strong>
            </div>
            <div className="bank-info-row">
              <span>Nội dung CK:</span>
              <strong className="text-orange">{message.replace(/%20/g, ' ')}</strong>
            </div>
          </div>

          <button 
            className="checkout-btn" 
            onClick={handleConfirmPayment}
            disabled={loading || !leadInfo}
          >
            {loading ? 'Đang Xử Lý...' : 'Tôi Đã Chuyển Khoản'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
