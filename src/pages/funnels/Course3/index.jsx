import React, { useEffect, useState } from 'react';
import '../Course1/style.css'; // Kế thừa toàn bộ nét hiện đại của Course 1
import { useFunnelTracking } from '../utils';
import LeadModal from '../components/LeadModal';
import { FUNNEL_COURSES } from '../config';
import { 
  PlayCircle, Star, CheckCircle2, Shield, Zap, 
  TrendingUp, Users, Target, Lock, ArrowRight, Video 
} from 'lucide-react';

const COURSE_INFO = FUNNEL_COURSES['khoa-hoc-3'];

const Course3 = () => {
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
          <Star size={14} /> KHÓA CHO FOUNDER & CEO 2026
        </div>
        <h1>Xây Dựng Agency Tự Vận Hành Đạt Doanh Số 10 Tỷ</h1>
        <p className="c1-hero-subtitle">
          Bí mật tối ưu hóa CRM, quản trị nhân sự, và tự động hóa quy trình phân bổ Lead giúp doanh nghiệp của bạn nhân bản quy mô nhanh chóng mà không cần bạn có mặt.
        </p>
        <div className="c1-hero-cta">
          <button className="c1-btn c1-btn-primary" onClick={() => setIsModalOpen(true)}>
            Nhận Ưu Đãi & Đăng Ký Ngay <ArrowRight size={18} />
          </button>
        </div>

        <div className="c1-hero-mockup">
          <div className="c1-mockup-inner">
            <div className="c1-mockup-play"><PlayCircle size={32} /></div>
            <h3>Xem Video Giới Thiệu Khóa Học</h3>
            <p>Thời lượng: 20 phút</p>
          </div>
        </div>
      </section>

      <section className="c1-section reveal-on-scroll">
        <div className="c1-section-header">
          <h2>Đòi Lại Thời Gian Cho Bạn</h2>
          <p>Từ một người làm nghề (Freelancer) đến một chủ doanh nghiệp đích thực (Business Owner).</p>
        </div>
        <div className="c1-grid">
          <div className="c1-card reveal-card" style={{transitionDelay: '0.1s'}}>
            <div className="c1-icon-wrap"><Zap size={24} /></div>
            <h3>Tự Động Phân Bổ Leads</h3>
            <p>Quản trị lượng data khách hàng khổng lồ bằng hệ thống tự chia Lead đều cho hàng trăm nhân viên Sales.</p>
          </div>
          <div className="c1-card reveal-card" style={{transitionDelay: '0.2s'}}>
            <div className="c1-icon-wrap"><Users size={24} /></div>
            <h3>Nhân Bản Leader</h3>
            <p>Cách truyền động lực, thưởng KPI, và xây cơ chế lương thưởng khiến nhân sự cống hiến hết mình 200% sức lực.</p>
          </div>
          <div className="c1-card reveal-card" style={{transitionDelay: '0.3s'}}>
            <div className="c1-icon-wrap"><TrendingUp size={24} /></div>
            <h3>Mở Rộng Quy Mô (Scale Up)</h3>
            <p>Sử dụng đòn bẩy tài chính dòng tiền, pháp lý nội bộ, và Affiliate để Scale Up từ 5 người lên 500 người an toàn.</p>
          </div>
        </div>
      </section>

      <section id="modules" className="c1-section reveal-on-scroll" style={{ background: 'rgba(0,0,0,0.2)' }}>
        <div className="c1-section-header">
          <h2>Nội Dung Khóa Học</h2>
        </div>
        <div className="c1-grid" style={{ gridTemplateColumns: '1fr', maxWidth: '800px', margin: '0 auto' }}>
          <div className="c1-module reveal-card" style={{transitionDelay: '0.1s'}}>
            <div className="c1-module-header">
              <span className="c1-module-num">01</span>
              <h3>Chiến Lược Sản Phẩm & Phễu Giá Trị</h3>
            </div>
            <ul className="c1-module-list">
              <li><Video size={16} /> Đóng gói dịch vụ để bán giá cao (High-Ticket)</li>
              <li><Video size={16} /> Tư duy "Thang Giá Trị" (Value Ladder) cho khách hàng B2B</li>
            </ul>
          </div>
          <div className="c1-module reveal-card" style={{transitionDelay: '0.2s'}}>
            <div className="c1-module-header">
              <span className="c1-module-num">02</span>
              <h3>Setup Hệ Thống Công Nghệ ERP/CRM</h3>
            </div>
            <ul className="c1-module-list">
              <li><Video size={16} /> Triển khai cấu trúc Data Pipeline trên Cloud an toàn</li>
              <li><Video size={16} /> Cấu hình quyền truy cập (RLS), ngăn chặn nhân sự ăn cắp data</li>
            </ul>
          </div>
          <div className="c1-module reveal-card" style={{transitionDelay: '0.3s'}}>
            <div className="c1-module-header">
              <span className="c1-module-num">03</span>
              <h3>Vận Hành Tự Động (Automation)</h3>
            </div>
            <ul className="c1-module-list">
              <li><Video size={16} /> Setup chuỗi Email Marketing chăm sóc khách theo luồng vòng đời</li>
              <li><Video size={16} /> Kết hợp AI (ChatGPT/Claude) vào hoạt động Marketing doanh nghiệp</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="c1-section reveal-on-scroll">
        <div className="c1-pricing animated-border">
          <div className="c1-pricing-popular">Đỉnh Cao CEO</div>
          <h2>{COURSE_INFO.name}</h2>
          <div className="c1-pricing-price">
            <div className="c1-price-strike">{(COURSE_INFO.price * 2).toLocaleString('vi-VN')} đ</div>
            <div className="c1-price-current">{COURSE_INFO.price.toLocaleString('vi-VN')} đ</div>
          </div>
          <ul className="c1-docs">
            <li><CheckCircle2 size={18} /> Khoá cứng Video độc quyền cho CEO</li>
            <li><CheckCircle2 size={18} /> Các file mẫu (Excel/Notion): Cơ chế Lương, Hợp Đồng Nhân Sự</li>
            <li><CheckCircle2 size={18} /> 01 Buổi Audit doanh nghiệp trực tiếp 30 phút</li>
          </ul>
          <button className="c1-btn c1-btn-primary" style={{ width: '100%', fontSize: '18px' }} onClick={() => setIsModalOpen(true)}>
            Đăng Ký Vào Học Ngay <Lock size={18} />
          </button>
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

export default Course3;
