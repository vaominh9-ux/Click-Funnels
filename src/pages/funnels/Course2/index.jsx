import React, { useEffect, useState } from 'react';
import './c2-style.css'; // Phong cách mới: Whiteboard Brutalism (Light Mode Hormozi)
import { useFunnelTracking } from '../utils';
import LeadModal from '../components/LeadModal';
import { FUNNEL_COURSES } from '../config';
import { 
  PlayCircle, CheckSquare, ArrowRight, ShieldCheck, PhoneCall, TrendingUp, Users
} from 'lucide-react';

const COURSE_INFO = FUNNEL_COURSES['khoa-hoc-2'];

const Course2 = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useFunnelTracking();

  return (
    <div className="c2-hz-wrapper">
      <div className="c2-hz-inner">
        {/* HERO SECTION */}
        <section className="c2-hero">
          <div className="c2-hero-eyebrow">
            <TrendingUp size={18} strokeWidth={3} />
            MÔ HÌNH CHỐT SALE NÂNG CAO DÀNH CHO B2B & B2C
          </div>
          
          <h1 className="c2-hz-title">
            BIẾN NHỮNG LỜI TỪ CHỐI "ĐỂ SUY NGHĨ ĐÃ" THÀNH <span className="c2-highlight-yellow">TIỀN MẶT LẬP TỨC</span> BẰNG BỘ KỊCH BẢN TÂM LÝ HỌC ĐẢO NGƯỢC
          </h1>
          
          <p className="c2-hero-sub">
            Ngừng viện cớ "Khách chê đắt". Đây là cách đội telesale của chúng tôi chốt hạ những đơn hàng <span className="c2-highlight-blue">High-Ticket</span> chỉ trong 15 phút điện thoại.
          </p>

          <div className="c2-vsl-container" onClick={() => setIsModalOpen(true)}>
            <div className="c2-vsl-box">
              <PlayCircle className="c2-vsl-play" size={64} strokeWidth={2} />
              <div className="c2-vsl-text">BẤM VÀO ĐÂY ĐỂ XEM BÍ MẬT 8 PHÚT</div>
            </div>
          </div>

          <div className="c2-cta-wrap">
            <button className="c2-hz-btn" onClick={() => setIsModalOpen(true)}>
              TÔI MUỐN SỞ HỮU BỘ KỊCH BẢN NÀY <ArrowRight size={28} strokeWidth={3} />
            </button>
            <p className="c2-urgency">⚡ Cảnh báo: Sắp hết suất truy cập vào Kho Audio thực chiến.</p>
          </div>
        </section>

        {/* 3 CORE MODULES */}
        <section className="c2-section">
          <h2 className="c2-hz-title" style={{ textAlign: 'center', fontSize: '36px', marginBottom: '16px' }}>LỘ TRÌNH 3 BƯỚC THAO TÚNG TÂM LÝ</h2>
          <p style={{ textAlign: 'center', fontSize: '18px', color: '#475569', fontWeight: 600 }}>Không dạy lý thuyết suông. 100% Cầm tay chỉ việc.</p>
          
          <div className="c2-grid-3">
            <div className="c2-module-card">
              <div className="c2-module-num">1</div>
              <h3 className="c2-module-title">PHÁ BĂNG <br/><span style={{color: '#2563EB'}}>30 GIÂY ĐẦU</span></h3>
              <ul className="c2-module-list">
                <li><CheckSquare className="c2-module-icon" size={20} /> Vượt rào cản phòng thủ ngay lập tức</li>
                <li><CheckSquare className="c2-module-icon" size={20} /> Công thức NLP đổi giọng nói thu hút</li>
                <li><CheckSquare className="c2-module-icon" size={20} /> Khiến khách mớm lời trước</li>
              </ul>
            </div>

            <div className="c2-module-card">
              <div className="c2-module-num">2</div>
              <h3 className="c2-module-title">XỬ LÝ TỪ CHỐI <br/><span style={{color: '#EF4444'}}>ĐỈNH CAO</span></h3>
              <ul className="c2-module-list">
                <li><CheckSquare className="c2-module-icon" size={20} /> Hủy diệt câu "Giá hơi cao em ạ"</li>
                <li><CheckSquare className="c2-module-icon" size={20} /> Khóa mõm câu "Để anh bàn lại với vợ/sếp"</li>
                <li><CheckSquare className="c2-module-icon" size={20} /> Kỹ thuật Push/Pull (Đẩy - Kéo)</li>
              </ul>
            </div>

            <div className="c2-module-card">
              <div className="c2-module-num">3</div>
              <h3 className="c2-module-title">CHỐT HẠ <br/><span style={{color: '#16A34A'}}>KHÔNG THƯƠNG TIẾC</span></h3>
              <ul className="c2-module-list">
                <li><CheckSquare className="c2-module-icon" size={20} /> Đòn chốt im lặng (Silence Close)</li>
                <li><CheckSquare className="c2-module-icon" size={20} /> Lên đơn Upsell tự nhiên không ngượng</li>
                <li><CheckSquare className="c2-module-icon" size={20} /> Bắt khách tự đưa thẻ tín dụng</li>
              </ul>
            </div>
          </div>
        </section>
      </div>

      {/* THE OFFER STACK (RECEIPT) */}
      <section className="c2-offer-section">
        <div className="c2-hz-inner">
          <div className="c2-receipt">
            <h2 className="c2-hz-title">TỔNG HỢP GIÁ TRỊ NHẬN ĐƯỢC</h2>
            
            <div className="c2-stack-row">
              <span>Hệ thống Kịch Bản Chốt Sale Đỉnh Cao</span>
              <span className="c2-stack-val">8.500.000 đ</span>
            </div>
            <div className="c2-stack-row c2-stack-bonus">
              <span>(Bonus 1) Kho 100+ File Ghi Âm Chốt Đơn Thực Tế</span>
              <span className="c2-stack-val">5.000.000 đ</span>
            </div>
            <div className="c2-stack-row c2-stack-bonus">
              <span>(Bonus 2) Sổ Tay Giật Tít Kịch Bản B2B / B2C</span>
              <span className="c2-stack-val">3.000.000 đ</span>
            </div>
            
            <div className="c2-stack-total">
              TỔNG GIÁ TRỊ: <span className="c2-stack-strike">16.500.000 đ</span>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div className="c2-stack-today">
                CHỈ {COURSE_INFO.price.toLocaleString('vi-VN')} đ
              </div>
            </div>

            <div className="c2-cta-wrap" style={{ marginTop: '40px', marginBottom: 0 }}>
              <button className="c2-hz-btn" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setIsModalOpen(true)}>
                ĐĂNG KÝ VÀ LẤY QUÀ NGAY <ArrowRight size={24} strokeWidth={3} />
              </button>
            </div>
          </div>

          <div className="c2-guarantee">
            <ShieldCheck size={64} color="#B45309" style={{ margin: '0 auto' }} />
            <div className="c2-guarantee-title">BẢO HÀNH CHỐT ĐƠN 30 NGÀY</div>
            <p style={{ fontSize: '18px', fontWeight: 600, color: '#334155' }}>
              Áp dụng lộ trình này cho 30 cuộc gọi tới. Nếu tỷ lệ chuyển đổi của bạn không tăng lên, chúng tôi sẽ hoàn trả 100% học phí không cần một lời phàn nàn. 
              <strong> You have literally zero risk.</strong>
            </p>
          </div>
        </div>
      </section>

      <footer style={{ padding: '40px 0', textAlign: 'center', background: '#FAFAFA', fontWeight: 600, color: '#94A3B8' }}>
        <p>&copy; 2026 DUHAVA Academy. Dành cho chiến binh, không dành cho kẻ bỏ cuộc.</p>
      </footer>

      <LeadModal 
        isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} 
        courseId={COURSE_INFO.id} courseName={COURSE_INFO.name} 
      />
    </div>
  );
};

export default Course2;
