import React, { useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { getRefCode } from '../utils';
import { notifyNewLead } from '../utils/notifyWebhook';
import './FreeLeadModal.css';

const WORKSHOP_API = '/api/email/send-workshop';
const API_BASE = import.meta.env.VITE_API_BASE || (window.location.hostname === 'localhost' ? 'https://click-funnels.vercel.app' : '');

const FreeLeadModal = ({ isOpen, onClose, courseId, courseName }) => {
  const [formData, setFormData] = useState({ name: '', phone: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [zaloLink, setZaloLink] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const refCode = getRefCode();
      let finalAffiliateId = null;

      // 1. Dò xem có Ref Code hợp lệ không và cơ chế Affiliate Trọn Đời (Lifetime)
      let lifetimeMatched = false;
      
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

      if (!lifetimeMatched && refCode) {
        let storedCampaignId = localStorage.getItem('aff_campaign_id');
        if (storedCampaignId === 'undefined' || storedCampaignId === 'null') storedCampaignId = null;

        let storedLinkId = localStorage.getItem('aff_link_id');
        if (storedLinkId === 'undefined' || storedLinkId === 'null') storedLinkId = null;

        const { data: refData, error: refError } = await supabase.rpc('record_affiliate_lead', {
          p_ref_code: refCode,
          p_campaign_id: storedCampaignId,
          p_link_id: storedLinkId
        });
        
        if (!refError && refData?.success) {
          finalAffiliateId = refData.affiliate_id;
        } else {
          console.warn('RPC record_affiliate_lead failed, falling back to direct query...');
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

      // 2. Tạo ID trước
      const generateUUID = () => {
        if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
          let r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
      };
      
      const newLeadId = generateUUID();
      const linkId = localStorage.getItem('aff_link_id') || null;

      // 3. Chèn vào bảng leads (đánh dấu là registered cho phễu miễn phí)
      const { error: insertError } = await supabase
        .from('leads')
        .insert([{
          id: newLeadId,
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          course_id: courseId,
          affiliate_id: finalAffiliateId,
          link_id: linkId,
          source: refCode ? 'referral' : 'direct',
          stage: 'new',
          notes: `Đăng ký miễn phí từ: ${courseName}`
        }]);

      if (insertError) throw insertError;

      // 3.5 Gửi Webhook thông báo lead mới (fire-and-forget)
      notifyNewLead({
        leadId: newLeadId,
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        courseName,
        courseId,
        source: refCode ? 'referral' : 'direct'
      });

      // 4. Gọi API gửi Email Workshop + Lịch .ICS
      if (formData.email) {
        try {
          const response = await fetch(`${API_BASE}${WORKSHOP_API}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: formData.name,
              email: formData.email,
              phone: formData.phone,
            }),
          });
          const result = await response.json();
          if (result.zaloGroupLink) {
            setZaloLink(result.zaloGroupLink);
          }
        } catch (emailErr) {
          console.error('Gửi email workshop lỗi:', emailErr);
        }
      }
      
      // 5. Hiển thị màn hình thành công
      setShowSuccess(true);

    } catch (err) {
      console.error('Lỗi đăng ký Free Lead:', err);
      alert('Đã có lỗi xảy ra. Hãy thử lại!');
    } finally {
      setLoading(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="lead-modal-backdrop" onClick={onClose}>
        <div className="lead-modal-card free-modal-success" onClick={e => e.stopPropagation()}>
          <div className="success-icon">✅</div>
          <h2>Đăng Ký Thành Công!</h2>
          <p className="success-msg">
            {formData.email 
              ? <>Chúng tôi đã gửi <strong>lịch 3 buổi học</strong> vào email <strong>{formData.email}</strong>. Kiểm tra email để ghim vào Lịch nhé!</>
              : <>Bạn đã đăng ký thành công! Vào nhóm Zalo để nhận lịch học.</>
            }
          </p>
          <a 
            href={zaloLink || 'https://zalo.me/g/xxxxxx'} 
            target="_blank" 
            rel="noopener noreferrer"
            className="free-cta-button free-submit-btn free-zalo-btn"
          >
            💬 VÀO NHÓM ZALO NGAY
          </a>
          <p className="success-note">Link Zoom sẽ được gửi trong nhóm Zalo trước mỗi buổi học.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="lead-modal-backdrop" onClick={onClose}>
      <div className="lead-modal-card" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>&times;</button>
        
        <h2>🆓 Đăng Ký Workshop Miễn Phí</h2>
        <p>Điền thông tin để nhận lịch học + vào nhóm Zalo.</p>
        
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
            <label>Email (để nhận lịch học) *</label>
            <input 
              type="email" 
              required
              placeholder="Nhập email"
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
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
          <button type="submit" disabled={loading} className="free-cta-button free-submit-btn">
            {loading ? 'Đang Xử Lý...' : '🔥 ĐĂNG KÝ MIỄN PHÍ'}
          </button>
          <p className="form-note">🔒 Không spam. Chỉ gửi lịch học + link Zoom.</p>
        </form>
      </div>
    </div>
  );
};

export default FreeLeadModal;
