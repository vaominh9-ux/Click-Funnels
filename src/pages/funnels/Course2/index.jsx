import React, { useEffect, useState } from 'react';
import '../Course1/style.css'; // Kế thừa toàn bộ nét hiện đại của Course 1
import { useFunnelTracking } from '../utils';
import LeadModal from '../components/LeadModal';
import { FUNNEL_COURSES } from '../config';
import { 
  PlayCircle, Star, CheckCircle2, Shield, Zap, 
  TrendingUp, Users, Target, Lock, ArrowRight, Video 
} from 'lucide-react';

const COURSE_INFO = FUNNEL_COURSES['khoa-hoc-2'];

const Course2 = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);

    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.15 };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target); 
        }
      });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    revealElements.forEach(el => observer.observe(el));

    return () => revealElements.forEach(el => observer.unobserve(el));
  }, []);

  useFunnelTracking();

  return (
    <div className="c1-container">
      <div className="c1-particles">
        <div className="particle p1"></div><div className="particle p2"></div><div className="particle p3"></div>
      </div>

      <header className="c1-header">
        <div className="c1-logo">
          <Target className="c1-logo-icon" size={28} />
          DUHAVA <span>ACADEMY</span>
        </div>
        <button className="c1-header-btn" onClick={() => setIsModalOpen(true)}>Đăng Ký Khóa Học</button>
      </header>

      <section className="c1-hero">
        <div className="c1-badge">
          <Star size={14} /> KHÓA HỌC COACHING ĐỘC QUYỀN
        </div>
        <h1>Bậc Thầy Chốt Sale Triệu Đô</h1>
        <p className="c1-hero-subtitle">
          Khám phá nghệ thuật tâm lý học trong bán hàng. Biến mọi lời từ chối thành những cú gật đầu đồng ý. Tăng x3 tỷ lệ chuyển đổi lập tức!
        </p>
        <div className="c1-hero-cta">
          <button className="c1-btn c1-btn-primary" onClick={() => setIsModalOpen(true)}>
            Nhận Ưu Đãi & Đăng Ký Ngay <ArrowRight size={18} />
          </button>
          <button className="c1-btn c1-btn-secondary" onClick={() => {
            document.getElementById('modules').scrollIntoView({ behavior: 'smooth' });
          }}>
            Xem Chi Tiết Khóa Học
          </button>
        </div>

        <div className="c1-hero-mockup">
          <div className="c1-mockup-inner">
            <div className="c1-mockup-play"><PlayCircle size={32} /></div>
            <h3>Xem Video Giới Thiệu Khóa Học</h3>
            <p>Thời lượng: 8 phút</p>
          </div>
        </div>
      </section>

      <section className="c1-trust reveal-on-scroll">
        <p>Được vinh danh và công nhận bởi các tạp chí hàng đầu Việt Nam</p>
        <div className="c1-trust-logos">
          <span>FORBES</span><span>ENTREPRENEUR</span><span>TECHCRUNCH</span><span>VNEXPRESS</span>
        </div>
      </section>

      <section className="c1-section reveal-on-scroll">
        <div className="c1-section-header">
          <h2>Tại Sao Khóa Học Này Khác Biệt?</h2>
          <p>Không dạy lý thuyết. Chúng tôi đưa cho bạn 100+ kịch bản chốt đơn thực chiến nhất.</p>
        </div>
        <div className="c1-grid">
          <div className="c1-card reveal-card" style={{transitionDelay: '0.1s'}}>
            <div className="c1-icon-wrap"><Zap size={24} /></div>
            <h3>Kịch Bản Miếng Mồi Ngon</h3>
            <p>Học cách thiết kế lời chào hàng khiến khách hàng cảm thấy họ ngốc nghếch nếu từ chối.</p>
          </div>
          <div className="c1-card reveal-card" style={{transitionDelay: '0.2s'}}>
            <div className="c1-icon-wrap"><TrendingUp size={24} /></div>
            <h3>Tâm Lý Học Đảo Ngược</h3>
            <p>Đẩy khách hàng ra để họ tự động kéo bạn lại. Tuyệt chiêu chốt đơn cao cấp nhất.</p>
          </div>
          <div className="c1-card reveal-card" style={{transitionDelay: '0.3s'}}>
            <div className="c1-icon-wrap"><Users size={24} /></div>
            <h3>Coaching Trực Tiếp 1-1</h3>
            <p>Cùng nghe lại cuộc gọi sale cũ và bắt tay chỉnh sửa trực tiếp cùng Mentor DUHAVA.</p>
          </div>
        </div>
      </section>

      <section id="modules" className="c1-section reveal-on-scroll" style={{ background: 'rgba(0,0,0,0.2)' }}>
        <div className="c1-section-header">
          <h2>Lộ Trình Trở Thành Bậc Thầy</h2>
          <p>3 Module huấn luyện cường độ cao</p>
        </div>
        <div className="c1-grid" style={{ gridTemplateColumns: '1fr', maxWidth: '800px', margin: '0 auto' }}>
          <div className="c1-module reveal-card" style={{transitionDelay: '0.1s'}}>
            <div className="c1-module-header">
              <span className="c1-module-num">01</span>
              <h3>Phá Băng Khách Hàng (Telesale)</h3>
            </div>
            <ul className="c1-module-list">
              <li><Video size={16} /> Vượt qua "Rào cản thư ký" thành công 90%</li>
              <li><Video size={16} /> 3 câu nói ma thuật tạo niềm tin trong 10 giây đầu</li>
              <li><Video size={16} /> Công thức NLP để đọc vị tính cách khách hàng qua giọng nói</li>
            </ul>
          </div>
          <div className="c1-module reveal-card" style={{transitionDelay: '0.2s'}}>
            <div className="c1-module-header">
              <span className="c1-module-num">02</span>
              <h3>Xử Lý Mọi Lời Từ Chối</h3>
            </div>
            <ul className="c1-module-list">
              <li><Video size={16} /> Khắc phục hiệu quả: "Sản phẩm này đắt quá"</li>
              <li><Video size={16} /> Chặn đứng câu: "Để anh/chị suy nghĩ thêm nhé"</li>
              <li><Video size={16} /> Bộ 50+ kịch bản xử lý từ chối hóc búa nhất</li>
            </ul>
          </div>
          <div className="c1-module reveal-card" style={{transitionDelay: '0.3s'}}>
            <div className="c1-module-header">
              <span className="c1-module-num">03</span>
              <h3>Chốt Giao Dịch Không Kháng Cự</h3>
            </div>
            <ul className="c1-module-list">
              <li><Video size={16} /> Nghệ thuật im lặng (Silence Close) chết người</li>
              <li><Video size={16} /> Đẩy cảm xúc khách hàng lên điểm mù lý trí</li>
              <li><Video size={16} /> Bán chéo (Cross-sell) & Bán thêm (Upsell) biên lợi nhuận cao</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="c1-section reveal-on-scroll">
        <div className="c1-pricing animated-border">
          <div className="c1-pricing-popular">🔥 Hot Nhất B2B</div>
          <h2>{COURSE_INFO.name}</h2>
          <div className="c1-pricing-price">
            <div className="c1-price-strike">{(COURSE_INFO.price * 2).toLocaleString('vi-VN')} đ</div>
            <div className="c1-price-current">{COURSE_INFO.price.toLocaleString('vi-VN')} đ</div>
          </div>
          
          <ul className="c1-docs">
            <li><CheckCircle2 size={18} /> Kho Audio 100 Cuộc Gọi Chốt Sale Ghi Âm Sẵn</li>
            <li><CheckCircle2 size={18} /> Tài liệu kịch bản bán hàng mọi ngách in màu</li>
            <li><CheckCircle2 size={18} /> Group Coaching riêng tư thứ 5 hàng tuần</li>
            <li><CheckCircle2 size={18} /> Update chiến lược chốt sale MỚI NHẤT MIỄN PHÍ</li>
          </ul>

          <button className="c1-btn c1-btn-primary" style={{ width: '100%', fontSize: '18px' }} onClick={() => setIsModalOpen(true)}>
            Đăng Ký Vào Học Ngay <Lock size={18} />
          </button>
          
          <p style={{ marginTop: '20px', color: '#9CA3AF', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <Shield size={14} /> Hoàn tiền 100% nếu áp dụng 30 cuộc gọi mà không chốt được sale!
          </p>
        </div>
      </section>

      <footer className="c1-footer">
        <div className="c1-logo" style={{ fontSize: '18px', filter: 'grayscale(1)', opacity: 0.5 }}>
          <Target size={20} /> DUHAVA ACADEMY
        </div>
        <p>&copy; 2026 DUHAVA Academy. Tất cả các quyền được bảo lưu.</p>
      </footer>

      <LeadModal 
        isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} 
        courseId={COURSE_INFO.id} courseName={COURSE_INFO.name} 
      />
    </div>
  );
};

export default Course2;
