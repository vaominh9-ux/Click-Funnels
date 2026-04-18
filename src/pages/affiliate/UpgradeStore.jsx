import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useToast } from '../../components/common/Toast';
import { Send, Download, Users, Briefcase } from 'lucide-react';
import './UpgradeStore.css';

const OFFERS = [
  {
    id: 'starter',
    name: 'GÓI CRM STARTER B2B',
    commission: 'Lên tới 50%',
    max_earnings: '3,000,000 đ / Sale',
    target: 'Chủ shop nhỏ, kinh doanh cá nhân',
    features: [
      'Giải pháp chuyển đổi số bán hàng cơ bản',
      'Setup hệ thống affiliate riêng',
      'Đào tạo quản lý phễu'
    ],
    highlight: false
  },
  {
    id: 'master',
    name: 'GÓI ERP MASTER B2B',
    commission: 'Lên tới 50%',
    max_earnings: '6,000,000 đ / Sale',
    target: 'Doanh nghiệp vừa, team Sales 5-10 người',
    features: [
      'Số hóa toàn diện dữ liệu khách hàng',
      'Tự động hóa luồng chăm sóc Zalo/Email',
      'Báo cáo dòng tiền realtime'
    ],
    highlight: false
  },
  {
    id: 'ai-coach',
    name: 'HỆ THỐNG AI TỰ ĐỘNG HÓA',
    commission: 'Lên tới 30%',
    max_earnings: '19,000,000 đ / Sale',
    target: 'C-level, Giám đốc cần tối ưu quy trình',
    features: [
      'Tích hợp Chatbot AI chăm sóc đa kênh',
      'Phân tích hành vi khách hàng tự động',
      'Đồng bộ ERP và Accounting'
    ],
    highlight: true,
    badge: 'CHỐT NHIỀU NHẤT'
  },
  {
    id: 'ai-partner',
    name: 'ĐỐI TÁC CỔ ĐÔNG CHIẾN LƯỢC',
    commission: 'Lên tới 20%',
    max_earnings: '28,000,000 đ / Sale',
    target: 'Tập đoàn, chuỗi bán lẻ quy mô lớn',
    features: [
      'Triển khai phòng Marketing/IT in-house',
      'Tư vấn chiến lược thu hồi vốn',
      'Hỗ trợ kỹ thuật On-site 24/7'
    ],
    highlight: false
  }
];

export default function UpgradeStore() {
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [loading, setLoading] = useState(false);
  const addToast = useToast();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    notes: ''
  });

  const handleOpenLead = (offer) => {
    setSelectedOffer(offer);
    setFormData({ name: '', phone: '', email: '', notes: '' });
  };

  const closeModal = () => {
    setSelectedOffer(null);
  };

  const handleSubmitLead = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      addToast('Vui lòng nhập Tên và Số điện thoại khách hàng', 'error');
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        addToast('Vui lòng đăng nhập lại.', 'error');
        setLoading(false);
        return;
      }

      const fullNotes = `Quan tâm gói dự án B2B: ${selectedOffer.name}\n\nGhi chú thêm từ đối tác:\n${formData.notes}`;

      const { error } = await supabase.from('leads').insert({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        notes: fullNotes,
        affiliate_id: user.id,
        source: 'referral',
        stage: 'new'
      });

      if (error) throw error;

      addToast('Tuyệt vời! Thông tin khách hàng đã được gửi đến bộ phận Sale để chốt chéo giúp bạn.', 'success');
      closeModal();
    } catch (err) {
      console.error('Submit lead error:', err);
      addToast('Có lỗi xảy ra, vui lòng gửi lại sau.', 'error');
    }
    setLoading(false);
  };

  return (
    <div className="store-container">
      <div className="store-header">
        <h1>Sản Phẩm & Phễu Chuyển Đổi Cao</h1>
        <p>
          Danh mục định giá <span>High-Ticket</span>. Bạn KHÔNG cần tự tư vấn.
          Tuyệt chiêu là hãy gửi thông tin Lead tiềm năng bạn có tại đây, chuyên gia của chúng tôi sẽ gọi điện/Zoom chốt trực tiếp thay bạn.
          Bạn sẽ nhận ngay hoa hồng khủng khi hợp đồng được ký!
        </p>
      </div>

      <div className="store-grid">
        {OFFERS.map((offer) => (
          <div key={offer.id} className={`store-card ${offer.highlight ? 'highlight' : ''}`}>
            {offer.badge && <div className="store-badge">{offer.badge}</div>}
            
            <div className="store-card-header">
              <h3 className="store-tier-name">{offer.name}</h3>
              <div className="store-commission-pot">
                <span>Hoa hồng tối đa có thể nhận</span>
                <div className="pot-value">{offer.max_earnings}</div>
              </div>
              <div className="store-commission">Mức chia sẻ doanh thu: <span className="font-bold">{offer.commission}</span></div>
            </div>
            
            <div className="store-divider"></div>
            
            <div className="store-target">
              <Users size={16} />
              <span><strong>Đối tác phù hợp:</strong> {offer.target}</span>
            </div>
            
            <ul className="store-features">
              {offer.features.map((feature, idx) => (
                <li key={idx}>
                  <svg width="20" height="20" className="store-li-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ minWidth: "20px" }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  {feature}
                </li>
              ))}
            </ul>
            
            <div className="store-card-footer mt-auto pt-4">
              <button onClick={() => handleOpenLead(offer)} className={`store-btn upgrade ${offer.highlight ? 'pulse' : ''} mb-3`} style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'}}>
                <Send size={18} />
                GỬI THÔNG TIN KHÁCH HÀNG
              </button>
              <button className="store-btn download" style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'}} onClick={() => addToast('Sale Kit tài liệu đang được upload. Sẽ có file PDF cho bạn sớm nhất.', 'info')}>
                <Download size={18} />
                Tải Sale Kit (PDF)
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedOffer && (
        <div className="store-modal-overlay">
          <div className="store-modal">
            <div className="modal-header">
              <h2>Gửi Form Thông Tin: <span>{selectedOffer.name}</span></h2>
              <button onClick={closeModal} className="btn-close">
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmitLead}>
              <div className="modal-body pb-0">
                <div className="warning-box" style={{backgroundColor: '#EFF6FF', borderColor: '#BFDBFE', color: '#1E40AF'}}>
                  <div className="warning-flex">
                    <Briefcase size={24} className="warning-icon" style={{color: '#2563EB'}} />
                    <div className="warning-text">
                      <h4 style={{color: '#1D4ED8'}}>BƯỚC CHỐT CHÉO TỰ ĐỘNG</h4>
                      <p style={{color: '#1E40AF'}}>Chuyên viên Sales của hệ thống sẽ gọi điện chăm sóc khách hàng này. Khi có cập nhật mới (Chốt lịch Zoom / Ký HĐ xong), bạn có thể theo dõi tiến độ ở trang CRM.</p>
                    </div>
                  </div>
                </div>

                <div className="form-group mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Tên liên hệ / Quý công ty <span className="text-red-500">*</span></label>
                  <input type="text" className="cf-input w-full" placeholder="Ví dụ: Anh Nguyễn Văn A - CTCP Vinatex" required
                         value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                
                <div className="form-group mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Số ĐT của khách (Zalo) <span className="text-red-500">*</span></label>
                  <input type="tel" className="cf-input w-full" placeholder="09xx..." required
                         value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                </div>
                
                <div className="form-group mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email (Nếu có)</label>
                  <input type="email" className="cf-input w-full" placeholder="email@example.com" 
                         value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>
                
                <div className="form-group mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Thông tin mồi / Ghi chú cho Sales của chúng tôi</label>
                  <textarea className="cf-input w-full" placeholder="- Quy mô công ty: 15 người&#10;- Vấn đề đang gặp: Quản lý khách lộn xộn&#10;- Mức độ quan tâm: Cao, cuối tuần khách rảnh nghe Zoom" rows="3"
                         value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})}></textarea>
                </div>

              </div>
              <div className="modal-footer">
                <button type="button" onClick={closeModal} className="btn-cancel">Hủy bỏ</button>
                <button type="submit" className="btn-confirm" disabled={loading}>
                  {loading ? 'Đang gửi...' : 'Gửi Khách Hàng Này'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
