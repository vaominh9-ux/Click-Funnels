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

      // 1. Dò xem có Ref Code hợp lệ không và cơ chế Affiliate Trọn Đời (Lifetime)
      let lifetimeMatched = false;
      
      // Ưu tiên 1 (Lifetime): Tìm xem Email này đã từng map với CTV nào chưa?
      if (formData.email) {
        const { data: existingLead } = await supabase
          .from('leads')
          .select('affiliate_id')
          .eq('email', formData.email)
          .not('affiliate_id', 'is', null)
          .order('created_at', { ascending: true })
          .limit(1)
          .single();
          
        if (existingLead && existingLead.affiliate_id) {
          finalAffiliateId = existingLead.affiliate_id;
          lifetimeMatched = true;
          console.log('Lifetime Affiliate matched via Email:', finalAffiliateId);
        }
      }

      // Ưu tiên 2: Truy vết theo link hiện tại nếu chưa có lịch sử Lifetime
      if (!lifetimeMatched && refCode) {
        // Lấy chính xác chiến dịch hiện tại lưu từ lúc click link
        let storedCampaignId = localStorage.getItem('aff_campaign_id');
        if (storedCampaignId === 'undefined' || storedCampaignId === 'null') {
           storedCampaignId = null;
        }

        // Cố gắng gọi RPC (nếu đã chạy migration)
        const { data: refData, error: refError } = await supabase.rpc('record_affiliate_lead', {
          p_ref_code: refCode,
          p_campaign_id: storedCampaignId
        });
        
        if (!refError && refData?.success) {
          finalAffiliateId = refData.affiliate_id;
        } else {
          // Fallback: Nếu RPC bị lỗi (ví dụ chưa chạy SQL v6), tự query trực tiếp
          console.warn('RPC record_affiliate_lead failed or missing, falling back to direct query...');
          const { data: profile } = await supabase
            .from('profiles')
            .select('id')
            .eq('ref_code', refCode)
            .single();
            
          if (profile) {
            finalAffiliateId = profile.id;
          }
        }
      }

      // 2. Tạo ID trước trên Frontend để tránh lỗi RLS (Row Level Security) khi Select back
      const generateUUID = () => {
        if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
          let r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
      };
      
      const newLeadId = generateUUID();

      // Lấy link_id từ localStorage (được ClickTracker lưu lại)
      const linkId = localStorage.getItem('aff_link_id') || null;

      // 3. Chèn vào bảng leads để Admin dễ chốt
      const { error: insertError } = await supabase
        .from('leads')
        .insert([{
          id: newLeadId,
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          affiliate_id: finalAffiliateId,
          link_id: linkId,
          source: refCode ? 'referral' : 'direct',
          stage: 'new',
          notes: `Đăng ký từ khóa học: ${courseName}`
        }]);

      if (insertError) throw insertError;

      // Lưu lại cache thông tin Lead vào SessionStorage để sang trang Checkout xài (Vượt qua lỗi RLS Select)
      sessionStorage.setItem('tempLeadInfo', JSON.stringify({
        id: newLeadId,
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        affiliate_id: finalAffiliateId
      }));

      // 4. Chuyển sang Checkout với ID vừa tạo
      navigate(`/checkout/${courseId}?lead_id=${newLeadId}`);

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
