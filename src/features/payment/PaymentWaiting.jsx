import React from 'react';
import { Loader2, AlertCircle, Clock } from 'lucide-react';

const PaymentWaiting = ({ elapsedTime }) => {
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <>
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
      <div style={{textAlign: 'center', marginTop: '12px', fontSize: '13px', color: '#9CA3AF'}}>
        <Clock size={14} style={{verticalAlign: 'middle', marginRight: '4px'}} />
        Trang này sẽ tự động cập nhật khi nhận được thanh toán
      </div>
    </>
  );
};

export default PaymentWaiting;
