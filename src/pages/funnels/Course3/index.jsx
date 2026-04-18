import React, { useEffect, useState } from 'react';
import './c3-style.css'; // Phong cách Đẳng Cấp: THE BLACK CARD (Elite Mastermind)
import { useFunnelTracking } from '../utils';
import LeadModal from '../components/LeadModal';
import { FUNNEL_COURSES } from '../config';
import { 
  Play, ArrowRight, ShieldAlert, Cpu, Network, Briefcase, Lock, Fingerprint
} from 'lucide-react';

const COURSE_INFO = FUNNEL_COURSES['khoa-hoc-3'];

const Course3 = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useFunnelTracking();

  return (
    <div className="c3-elite-wrapper">
      <div className="c3-elite-inner">
        {/* HERO SECTION */}
        <section className="c3-hero">
          <div className="c3-top-secret-badge">
            <Fingerprint size={16} /> DỰ ÁN MẬT DÀNH RIÊNG CHO FOUNDER & CEO 2026
          </div>
          
          <h1 className="c3-elite-title">
            BÍ MẬT XÂY DỰNG AGENCY TỰ VẬN HÀNH <br/> ĐẠT DOANH SỐ <span className="c3-gold-text">10 TỶ/NĂM</span> MÀ KHÔNG CẦN BẠN CÓ MẶT
          </h1>
          
          <p className="c3-hero-sub">
            Giải phóng bản thân khỏi mớ hỗn độn hàng ngày. Đây là hệ thống đóng gói toàn bộ quy trình CRM, Phân bổ Lead và Bảng lương tự động hóa để nhân bản doanh nghiệp của bạn lên quy mô 100 nhân sự.
          </p>

          <div className="c3-vsl-board" onClick={() => setIsModalOpen(true)}>
            <div className="c3-vsl-inner">
              <div className="c3-play-btn">
                <div><Play size={40} color="#BF953F" fill="#BF953F" /></div>
              </div>
              <div className="c3-vsl-text">MỞ KHÓA TÀI LIỆU (18 PHÚT)</div>
            </div>
          </div>

          <div className="c3-cta-wrap">
            <button className="c3-elite-btn" onClick={() => setIsModalOpen(true)}>
              TÔI ĐÃ SẴN SÀNG THOÁT KHỎI VẬN HÀNH <ArrowRight size={28} strokeWidth={3} />
            </button>
            <p className="c3-limited">Lưu ý: Chỉ tiếp nhận 20 CEO trong tháng này để đảm bảo chất lượng Coaching.</p>
          </div>
        </section>

        {/* THE BOARDROOM MODULES */}
        <section className="c3-boardroom">
          <h2 className="c3-elite-title" style={{ textAlign: 'center', fontSize: '32px', marginBottom: '8px' }}>CỖ MÁY IN TIỀN TỰ ĐỘNG</h2>
          <p style={{ textAlign: 'center', color: '#94A3B8', fontSize: '16px', marginBottom: '40px' }}>Ba mảnh ghép hoàn hảo để chuyển hóa từ "Người làm nghề" sang "Chủ doanh nghiệp".</p>
          
          <div className="c3-grid-3">
            <div className="c3-card">
              <Network className="c3-card-icon" size={40} strokeWidth={1.5} />
              <h3 className="c3-card-title">HỆ THỐNG DATA PIPELINE</h3>
              <p>Setup guồng máy tự động kéo Data từ đa kênh đổ thẳng vào CRM, và chia đều cho hàng trăm nhân viên Sales chỉ bằng trí tuệ nhân tạo (AI).</p>
            </div>

            <div className="c3-card">
              <Briefcase className="c3-card-icon" size={40} strokeWidth={1.5} />
              <h3 className="c3-card-title">NHÂN BẢN DOANH NGHIỆP</h3>
              <p>Cơ chế thiết lập Lương cúp cứng, thưởng dật cấp và Phả hệ Affiliate nội bộ khiến nhân sự cày cuốc 200% sức lực mà không cần giám sát.</p>
            </div>

            <div className="c3-card">
              <Cpu className="c3-card-icon" size={40} strokeWidth={1.5} />
              <h3 className="c3-card-title">MÀNG LỌC BẢO MẬT MATRIX</h3>
              <p>Áp dụng hệ thống Role-Level Security (RLS) để cô lập dữ liệu. Không một nhân sự cấp dưới nào có quyền tải trộm Data khách hàng của công ty.</p>
            </div>
          </div>
        </section>
      </div>

      {/* THE DOSSIER (OFFER STACK) */}
      <section className="c3-dossier-section">
        <div className="c3-elite-inner">
          <div className="c3-dossier-box">
            <div className="c3-dossier-header">
              <h2 className="c3-elite-title" style={{ fontSize: '28px', color: '#BF953F', margin: 0 }}>HỒ SƠ NHƯỢNG QUYỀN (DOSSIER)</h2>
            </div>
            
            <div className="c3-dossier-body">
              <div className="c3-dossier-row">
                <span>Khung Sườn ERP/CRM Bản Quyền 2026</span>
                <span className="c3-dossier-val">45.000.000 đ</span>
              </div>
              <div className="c3-dossier-row">
                <span>(File Tuyệt Mật) Hợp Đồng Khoán Việc KPI & Cổ Phần Chéo</span>
                <span className="c3-dossier-val">22.000.000 đ</span>
              </div>
              <div className="c3-dossier-row">
                <span>(Vault 3) Group Coaching Cấp Cao Cùng Founder Thứ 7 Hàng Tuần</span>
                <span className="c3-dossier-val">50.000.000 đ</span>
              </div>
              <div className="c3-dossier-row" style={{ borderBottom: 'none' }}>
                <span style={{ color: '#E11D48' }}>*QUYỀN LỢI ĐẶC BIỆT: 1 Vé Thăm Khám Trực Tiếp Trụ Sở DUHAVA</span>
                <span className="c3-dossier-val" style={{ color: '#E11D48' }}>Vô Giá</span>
              </div>
              
              <div className="c3-dossier-total">
                ĐỊNH GIÁ TÀI SẢN: <span className="c3-dossier-strike">117.000.000 đ</span>
              </div>

              <div className="c3-dossier-price c3-gold-text">
                CHỈ THEO YÊU CẦU
              </div>
              <p style={{ textAlign: 'center', color: '#94A3B8', fontSize: '14px', marginTop: '8px' }}>
                (Mức giá kích hoạt hiện tại: {COURSE_INFO.price.toLocaleString('vi-VN')} đ)
              </p>

              <div className="c3-cta-wrap" style={{ marginTop: '40px', marginBottom: 0 }}>
                <button className="c3-elite-btn" style={{ width: '100%' }} onClick={() => setIsModalOpen(true)}>
                  <Lock size={20} /> KIỂM TRA ĐIỀU KIỆN ỨNG TUYỂN
                </button>
              </div>
            </div>
          </div>

          {/* IRONCLAD GUARANTEE */}
          <div className="c3-ironclad">
            <div className="c3-seal">
               <ShieldAlert size={48} color="#E11D48" />
            </div>
            <div className="c3-ironclad-title">BẢN CAM KẾT HOÀN VỐN DOANH NGHIỆP</div>
            <p style={{ fontSize: '16px', color: '#CBD5E1', lineHeight: 1.8 }}>
              Hệ thống này được thiết kế không phải để nằm trên giấy. Nếu sau khi triển khai toàn bộ khung sườn CRM và Automation mà doanh số của công ty bạn không tăng chi phí nhân sự không giảm, 
              <strong> chúng tôi sẽ bay trực tiếp đến văn phòng của bạn để Setup lại. Và nếu vẫn không thành công, 100% chi phí chuyển giao sẽ được bồi hoàn. Không hỏi han lằng nhằng.</strong>
            </p>
          </div>
        </div>
      </section>

      <footer style={{ padding: '40px 0', textAlign: 'center', background: '#000', color: '#334155', borderTop: '1px solid #0F172A' }}>
        <p>&copy; 2026 DUHAVA Academy Elite. Classified Information.</p>
      </footer>

      <LeadModal 
        isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} 
        courseId={COURSE_INFO.id} courseName={COURSE_INFO.name} 
      />
    </div>
  );
};


export default Course3;
