import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';
import { getRefCode } from '../utils';
import './LeadModal.css';

const LeadModal = ({ isOpen, onClose, courseId, courseName }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', phone: '', email: '' });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const refCode = getRefCode();
      let finalAffiliateId = null;

      // 1. Gọi RPC để dò xem có Ref Code hợp lệ không
      if (refCode) {
        const { data: refData, error: refError } = await supabase.rpc('record_affiliate_lead', {
          p_ref_code: refCode
        });
        
        if (!refError && refData?.success) {
          finalAffiliateId = refData.affiliate_id;
        }
      }

      // 2. Chèn vào bảng leads để Admin dễ chốt
      const { data: newLead, error: insertError } = await supabase
        .from('leads')
        .insert([{
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          affiliate_id: finalAffiliateId,
          source: refCode ? 'referral' : 'direct',
          stage: 'new',
          notes: `Đăng ký từ khóa học: ${courseName}`
        }])
        .select()
        .single();

      if (insertError) throw insertError;

      // 3. Chuyển sang Checkout
      navigate(`/checkout/${courseId}?lead_id=${newLead.id}`);

    } catch (err) {
      console.error('Lỗi đăng ký Lead:', err);
      alert('Đã có lỗi xảy ra. Hãy thử lại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lead-modal-backdrop" onClick={onClose}>
      <div className="lead-modal-card" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>&times;</button>
        <h2>Đăng Ký {courseName}</h2>
        <p>Vui lòng để lại thông tin để chúng tôi liên hệ tư vấn chuyên sâu.</p>
        
        <form onSubmit={handleSubmit} className="lead-form">
          <div className="form-group">
            <label>Họ & Tên *</label>
            <input 
              type="text" 
              required 
              placeholder="Nhập họ tên của bạn"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>Số điện thoại *</label>
            <input 
              type="tel" 
              required 
              placeholder="Nhập số điện thoại"
              value={formData.phone}
              onChange={e => setFormData({...formData, phone: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>Email (Không bắt buộc)</label>
            <input 
              type="email" 
              placeholder="Nhập email"
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <button type="submit" disabled={loading} className="cta-button primary-cta submit-btn">
            {loading ? 'Đang Xử Lý...' : 'Chuyển Tới Bước Thanh Toán'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LeadModal;
