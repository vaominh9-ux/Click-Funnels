import React from 'react';
import { CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PaymentSuccess = ({ course, amount, paymentCode }) => {
  const navigate = useNavigate();

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
            <span>Sản phẩm:</span>
            <strong>{course?.name || 'N/A'}</strong>
          </div>
          <div className="success-row">
            <span>Số tiền:</span>
            <strong style={{color: '#059669'}}>{(amount || 0).toLocaleString('vi-VN')} đ</strong>
          </div>
          <div className="success-row">
            <span>Mã đơn:</span>
            <strong>{paymentCode}</strong>
          </div>
        </div>
        
        <p style={{color: '#6B7280', fontSize: '14px', marginTop: '16px'}}>
          Bạn sẽ nhận được email xác nhận và link truy cập trong ít phút.
        </p>
        
        <button className="checkout-btn" onClick={() => navigate('/')} style={{marginTop: '24px'}}>
          Về Trang Chủ
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;
