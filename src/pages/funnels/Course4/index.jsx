import React, { useEffect, useState } from 'react';
import '../Course1/style.css'; // Kế thừa toàn bộ nét hiện đại của Course 1
import { useFunnelTracking } from '../utils';
import LeadModal from '../components/LeadModal';
import { FUNNEL_COURSES } from '../config';
import { 
  PlayCircle, Star, CheckCircle2, Shield, Zap, 
  TrendingUp, Users, Target, Lock, ArrowRight, Video 
} from 'lucide-react';

const COURSE_INFO = FUNNEL_COURSES['khoa-hoc-4'];

const Course4 = () => {
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
          <Star size={14} /> KHÓA CHO NGƯỜI MỚI BẮT ĐẦU 2026
        </div>
        <h1>Khởi Nghiệp 0 Đồng Tinh Gọn</h1>
        <p className="c1-hero-subtitle">
          Tìm ra ý tưởng kinh doanh không rủi ro tài chính. Vận dụng AI và miễn phí nguồn traffic (Traffic Zero Cost) để tạo ra những đơn hàng đầu tiên dưới 7 ngày!
        </p>
        <div className="c1-hero-cta">
          <button className="c1-btn c1-btn-primary" onClick={() => setIsModalOpen(true)}>
            Nhận Ưu Đãi & Đăng Ký Ngay <ArrowRight size={18} />
          </button>
          <button className="c1-btn c1-btn-secondary" onClick={() => {
            document.getElementById('modules').scrollIntoView({ behavior: 'smooth' });
          }}>
            Xem Lộ Trình Học
          </button>
        </div>

        <div className="c1-hero-mockup">
          <div className="c1-mockup-inner">
            <div className="c1-mockup-play"><PlayCircle size={32} /></div>
            <h3>Xem Video Giới Thiệu Khóa Học</h3>
            <p>Thời lượng: 5 phút</p>
          </div>
        </div>
      </section>

      <section className="c1-section reveal-on-scroll">
        <div className="c1-section-header">
          <h2>Hãy vứt bỏ những rào cản cũ!</h2>
          <p>Bạn không cần vốn lớn, không cần mặt bằng, không cần nhập hàng. Bạn chỉ cần Wifi và Laptop.</p>
        </div>
        <div className="c1-grid">
          <div className="c1-card reveal-card" style={{transitionDelay: '0.1s'}}>
            <div className="c1-icon-wrap"><Zap size={24} /></div>
            <h3>Dropshipping & Affiliate</h3>
            <p>Kinh doanh mà không tồn kho. Bán sản phẩm của người khác với mức hoa hồng cao chót vót.</p>
          </div>
          <div className="c1-card reveal-card" style={{transitionDelay: '0.2s'}}>
            <div className="c1-icon-wrap"><TrendingUp size={24} /></div>
            <h3>AI Kinh Doanh (ChatGPT)</h3>
            <p>Để AI viết nội dung, thiết kế hình ảnh, lập kế hoạch marketing 100% thay vì thuê đội ngũ cồng kềnh.</p>
          </div>
          <div className="c1-card reveal-card" style={{transitionDelay: '0.3s'}}>
            <div className="c1-icon-wrap"><Users size={24} /></div>
            <h3>Khởi Nghiệp 1 Người (Solopreneur)</h3>
            <p>Trở thành công ty 1 người với hệ thống đòn bẩy công nghệ tinh gọn tối giản, tự do tài chính mọi nơi.</p>
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
              <h3>Xác Định Nghách Ngon, Ít Cạnh Tranh</h3>
            </div>
            <ul className="c1-module-list">
              <li><Video size={16} /> Sử dụng AI để research xu hướng thị trường nóng hổi</li>
              <li><Video size={16} /> Chọn sản phẩm "Vạn người mê" trên Shopee, TikTok Shop Mẽo</li>
            </ul>
          </div>
          <div className="c1-module reveal-card" style={{transitionDelay: '0.2s'}}>
            <div className="c1-module-header">
              <span className="c1-module-num">02</span>
              <h3>Tiếp Thị 0 Đồng</h3>
            </div>
            <ul className="c1-module-list">
              <li><Video size={16} /> Bơm Traffic miễn phí từ Tiktok Organic & SEO</li>
              <li><Video size={16} /> Seeding group Facebook mà không dính Spam</li>
            </ul>
          </div>
          <div className="c1-module reveal-card" style={{transitionDelay: '0.3s'}}>
            <div className="c1-module-header">
              <span className="c1-module-num">03</span>
              <h3>Scale Lợi Nhuận Gấp Đôi Mỗi Tuần</h3>
            </div>
            <ul className="c1-module-list">
              <li><Video size={16} /> Chiến lược Upsell ngay khi khách vừa mua xong</li>
              <li><Video size={16} /> Chăm sóc khách cũ với chi phí bằng 0VNĐ</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="c1-section reveal-on-scroll">
        <div className="c1-pricing animated-border">
          <div className="c1-pricing-popular">Đầu Tư Xứng Đáng Nhất</div>
          <h2>{COURSE_INFO.name}</h2>
          <div className="c1-pricing-price">
            <div className="c1-price-strike">{(COURSE_INFO.price * 2).toLocaleString('vi-VN')} đ</div>
            <div className="c1-price-current">{COURSE_INFO.price.toLocaleString('vi-VN')} đ</div>
          </div>
          <ul className="c1-docs">
            <li><CheckCircle2 size={18} /> Các Video thực chiến cầm tay chỉ việc</li>
            <li><CheckCircle2 size={18} /> Kho 200+ câu lệnh Prompt ChatGPT thần thánh cho bán hàng</li>
            <li><CheckCircle2 size={18} /> 1 Tháng tham gia Thử Thách Hành Động Cùng Cộng Đồng 0 Đồng</li>
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
        <p>&copy; 2026 DUHAVA Academy.</p>
      </footer>

      <LeadModal 
        isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} 
        courseId={COURSE_INFO.id} courseName={COURSE_INFO.name} 
      />
    </div>
  );
};

export default Course4;
