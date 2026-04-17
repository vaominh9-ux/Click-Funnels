import React, { useEffect, useState } from 'react';
import './style.css';
import { useFunnelTracking } from '../utils';
import LeadModal from '../components/LeadModal';
import { FUNNEL_COURSES } from '../config';
import { 
  PlayCircle, Star, CheckCircle2, Shield, Zap, 
  TrendingUp, Users, Target, Lock, ArrowRight, Video 
} from 'lucide-react';

const COURSE_INFO = FUNNEL_COURSES['khoa-hoc-1'];

const Course1 = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);

    // Intersection Observer for Reveal Animations
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.15
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target); // Reveal only once
        }
      });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    revealElements.forEach(el => observer.observe(el));

    return () => {
      revealElements.forEach(el => observer.unobserve(el));
    };
  }, []);

  // Hook theo dõi ref
  useFunnelTracking();

  return (
    <div className="c1-container">
      {/* BACKGROUND PARTICLES */}
      <div className="c1-particles">
        <div className="particle p1"></div>
        <div className="particle p2"></div>
        <div className="particle p3"></div>
      </div>

      {/* HEADER */}
      <header className="c1-header">
        <div className="c1-logo">
          <Target className="c1-logo-icon" size={28} />
          DUHAVA <span>ACADEMY</span>
        </div>
        <button className="c1-header-btn" onClick={() => setIsModalOpen(true)}>
          Đăng Ký Khóa Học
        </button>
      </header>

      {/* HERO SECTION */}
      <section className="c1-hero">
        <div className="c1-badge">
          <Star size={14} /> KHÓA HỌC THỰC CHIẾN MỚI NHẤT 2026
        </div>
        <h1>Bậc Thầy Affiliate Marketing Tự Động Hóa</h1>
        <p className="c1-hero-subtitle">
          Khám phá hệ thống phễu bán hàng (Sale Funnels) bí mật giúp tạo ra thu nhập thụ động bền vững ngay cả khi bạn đang ngủ. Không cần kinh nghiệm IT cơ bản!
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

        {/* Hero Mockup or Video Placeholder */}
        <div className="c1-hero-mockup">
          <div className="c1-mockup-inner">
            <div className="c1-mockup-play">
              <PlayCircle size={32} />
            </div>
            <h3>Xem Video Giới Thiệu Khóa Học</h3>
            <p>Thời lượng: 12 phút</p>
          </div>
        </div>
      </section>

      {/* TRUST AS SEEN ON */}
      <section className="c1-trust reveal-on-scroll">
        <p>Đã giúp +2,000 học viên đạt thu nhập $1,000/tháng</p>
        <div className="c1-trust-logos">
          <span>FORBES</span>
          <span>ENTREPRENEUR</span>
          <span>TECHCRUNCH</span>
          <span>VNEXPRESS</span>
        </div>
      </section>

      {/* BENEFITS SECTION */}
      <section className="c1-section reveal-on-scroll">
        <div className="c1-section-header">
          <h2>Tại Sao Khóa Học Này Khác Biệt?</h2>
          <p>Không lý thuyết sáo rỗng. Chúng tôi cung cấp cho bạn hệ thống đã được chứng minh hiệu quả.</p>
        </div>
        <div className="c1-grid">
          <div className="c1-card reveal-card" style={{transitionDelay: '0.1s'}}>
            <div className="c1-icon-wrap"><Zap size={24} /></div>
            <h3>Khởi Động Nhanh Chóng</h3>
            <p>Bạn sẽ có hệ thống phễu đầu tiên hoạt động hoàn chỉnh chỉ sau 3 ngày thực hành theo các video hướng dẫn từng bước click by click.</p>
          </div>
          <div className="c1-card reveal-card" style={{transitionDelay: '0.2s'}}>
            <div className="c1-icon-wrap"><TrendingUp size={24} /></div>
            <h3>Tỷ Lệ Chuyển Đổi Cao</h3>
            <p>Chúng tôi chia sẻ template Funnel đang mang lại tỷ lệ chuyển đổi tĩnh lên đến 20%, giúp bạn tối ưu hóa ngân sách quảng cáo.</p>
          </div>
          <div className="c1-card reveal-card" style={{transitionDelay: '0.3s'}}>
            <div className="c1-icon-wrap"><Users size={24} /></div>
            <h3>Hỗ Trợ Cộng Đồng 24/7</h3>
            <p>Tham gia vào Private Group VIP. Đội ngũ chuyên gia và các mentor luôn sẵn sàng review phễu của bạn trước khi chạy chiến dịch.</p>
          </div>
        </div>
      </section>

      {/* CURRICULUM SECTION */}
      <section id="modules" className="c1-section reveal-on-scroll" style={{ background: 'rgba(0,0,0,0.2)' }}>
        <div className="c1-section-header">
          <h2>Nội Dung Khóa Học</h2>
          <p>Lộ trình thực chiến từ Zero đến Hero trong 4 tuần</p>
        </div>
        
        <div className="c1-grid" style={{ gridTemplateColumns: '1fr', maxWidth: '800px', margin: '0 auto' }}>
          
          <div className="c1-module reveal-card" style={{transitionDelay: '0.1s'}}>
            <div className="c1-module-header">
              <span className="c1-module-num">01</span>
              <h3>Nền Tảng Affiliate & Tư Duy Hệ Thống</h3>
            </div>
            <ul className="c1-module-list">
              <li><Video size={16} /> Lựa chọn ngách sản phẩm tiềm năng & sinh lời tốt nhất 2026</li>
              <li><Video size={16} /> Nguyên lý phễu bán hàng (Sales Funnel) và giá trị vòng đời khách hàng</li>
              <li><Video size={16} /> Mindset của một Affiliate Master thực thụ</li>
            </ul>
          </div>

          <div className="c1-module reveal-card" style={{transitionDelay: '0.2s'}}>
            <div className="c1-module-header">
              <span className="c1-module-num">02</span>
              <h3>Xây Dựng Cỗ Máy Kiếm Tiền</h3>
            </div>
            <ul className="c1-module-list">
              <li><Video size={16} /> Thiết kế Landing Page tỷ lệ chuyển đổi cao cực nhanh</li>
              <li><Video size={16} /> Viết Copywriting: Gắn móc họng khách hàng trong 3 giây đầu tiên</li>
              <li><Video size={16} /> Kết nối hệ thống Tracking và đo lường sự kiện chuyển đổi</li>
            </ul>
          </div>

          <div className="c1-module reveal-card" style={{transitionDelay: '0.3s'}}>
            <div className="c1-module-header">
              <span className="c1-module-num">03</span>
              <h3>Bom Tấn Kéo Traffic Đa Kênh</h3>
            </div>
            <ul className="c1-module-list">
              <li><Video size={16} /> Chạy quảng cáo Tiktok Ads & Facebook Ads đỉnh cao</li>
              <li><Video size={16} /> Xây dựng Free Traffic bằng Short-Form Video (TikTok/Reels/Shorts)</li>
              <li><Video size={16} /> Tối ưu hóa chi phí quảng cáo (CPA), scale ngân sách x10 không gãy</li>
            </ul>
          </div>

        </div>
      </section>

      {/* PRICING & FINAL CTA */}
      <section className="c1-section reveal-on-scroll">
        <div className="c1-pricing animated-border">
          <div className="c1-pricing-popular">Bán Chạy Nhất</div>
          <h2>Bậc Thầy Affiliate Tự Động</h2>
          <div className="c1-pricing-price">
            <div className="c1-price-strike">{(COURSE_INFO.price * 2).toLocaleString('vi-VN')} đ</div>
            <div className="c1-price-current">{COURSE_INFO.price.toLocaleString('vi-VN')} đ</div>
          </div>
          
          <ul className="c1-docs">
            <li><CheckCircle2 size={18} /> Truy cập trọn đời tất cả 46+ video HD</li>
            <li><CheckCircle2 size={18} /> Tặng 10 Template Funnels Convert Cao</li>
            <li><CheckCircle2 size={18} /> Tặng bộ prompt AI viết Copywriting</li>
            <li><CheckCircle2 size={18} /> Tham gia Group kín hỗ trợ 24/7</li>
            <li><CheckCircle2 size={18} /> Cập nhật khóa học miễn phí vĩnh viễn</li>
          </ul>

          <button className="c1-btn c1-btn-primary" style={{ width: '100%', fontSize: '18px' }} onClick={() => setIsModalOpen(true)}>
            Đăng Ký Vào Học Ngay <Lock size={18} />
          </button>
          
          <p style={{ marginTop: '20px', color: '#9CA3AF', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <Shield size={14} /> Bảo mật thanh toán an toàn. Hoàn tiền 100% trong 7 ngày.
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="c1-footer">
        <div className="c1-logo" style={{ fontSize: '18px', filter: 'grayscale(1)', opacity: 0.5 }}>
          <Target size={20} />
          DUHAVA ACADEMY
        </div>
        <p>&copy; 2026 DUHAVA Academy. Tất cả các quyền được bảo lưu.</p>
        <div style={{ fontSize: '12px', opacity: 0.5 }}>
          Bằng việc đăng ký, bạn đồng ý với Điều khoản dịch vụ và Chính sách bảo mật của chúng tôi.
        </div>
      </footer>

      {/* MODAL */}
      <LeadModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        courseId={COURSE_INFO.id} 
        courseName={COURSE_INFO.name} 
      />
    </div>
  );
};

export default Course1;
