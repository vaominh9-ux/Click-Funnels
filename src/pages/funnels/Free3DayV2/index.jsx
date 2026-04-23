import React, { useState, useEffect, useRef } from 'react';
import FreeLeadModal from '../Free3Day/FreeLeadModal';
import { useFunnelTracking } from '../utils';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import './style.css';

const COURSE_INFO = {
  id: 'free-3day',
  name: '3 Ngày Thực Chiến AI — Miễn Phí',
};

/* ─── Scroll Reveal ────────────────────────── */
const useScrollReveal = () => {
  const ref = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('f3v2-visible');
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
    );
    const el = ref.current;
    if (el) el.querySelectorAll('.f3v2-reveal').forEach((c) => observer.observe(c));
    return () => observer.disconnect();
  }, []);
  return ref;
};

const Free3DayV2 = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const revealRef = useScrollReveal();
  useFunnelTracking();
  const openModal = () => setIsModalOpen(true);

  return (
    <div className="f3v2-page" ref={revealRef}>

      {/* ═══ TOP ANNOUNCEMENT BAR ═══ */}
      <div className="f3v2-announce-bar">
        HƯNG NPV PRESENT: <a href="#" onClick={(e) => { e.preventDefault(); openModal(); }}>FREE 3 NGÀY THỰC CHIẾN AI!</a>
      </div>

      {/* ═══ LOGO HEADER ═══ */}
      <header className="f3v2-logo-header">
        <div className="f3v2-logo-header-inner">
          <img src="/images/logo-3day.png" alt="3 Day AI Logo" className="f3v2-main-logo" />
        </div>
      </header>

      {/* ═══════════════════════════════════════════
          WRAPPER: ATTENTION BAR + HERO SECTION (Mô phỏng FullContainer)
          ═══════════════════════════════════════════ */}
      <section className="f3v2-hero-wrapper">

        {/* ═══ ATTENTION BAR ═══ */}
        <div style={{ paddingTop: '20px' }}>
          <div className="f3v2-attention-bar">
            Attention: Chủ Doanh Nghiệp, Người Làm Tự Do, Hoặc Bất Cứ Ai Muốn Có Thêm Thu Nhập...
          </div>
        </div>

        {/* ═══ HERO SECTION ═══ */}
        <div className="f3v2-hero">
        {/* Dot decorations */}
        <div className="f3v2-dots" style={{ top: '20%', right: '5%' }} />
        <div className="f3v2-dots" style={{ bottom: '10%', left: '3%' }} />

        <div className="f3v2-container-wide">
          <div className="f3v2-hero-grid">

            {/* Left: Image */}
            <div className="f3v2-hero-visual">
              <div className="f3v2-hero-img-frame">
                <img
                  src="/images/hero-3day-challenge.jpg"
                  alt="Hưng NPV — 3 Day AI Challenge"
                  loading="eager"
                />
              </div>
            </div>

            {/* Right: Content */}
            <div className="f3v2-hero-content">
              <h1 className="f3v2-hero-headline-top">
                "Chỉ Cần <span className="f3v2-green-text">3 Buổi Tối</span>,"
              </h1>
              <h2 className="f3v2-hero-headline-sub">
                Tôi Sẽ Chỉ Bạn Phương Pháp "Từng Bước" Chính Xác Để Tạo Ra <br className="f3v2-mobile-br" /><span className="f3v2-hero-headline-bold"><u className="f3v2-underline">Thu Nhập MỚI</u> Bằng Cách Áp Dụng AI!</span>"
              </h2>

              <div className="f3v2-hero-join-box">
                Tham gia 3 Ngày Thực Chiến AI <strong>(MIỄN PHÍ)</strong>
              </div>

              <p className="f3v2-hero-bonus">
                *** BONUS: Nhận <strong>"2 Bộ Công Cụ AI"</strong> trị giá 500K <strong>(MIỄN PHÍ)</strong> khi bạn tham gia đầy đủ 3 buổi!
              </p>

              <button className="f3v2-cta-btn" onClick={openModal}>
                <span className="f3v2-cta-main-text">
                  📋 ĐĂNG KÝ "3 NGÀY THỰC CHIẾN AI" MIỄN PHÍ!
                </span>
                <span className="f3v2-cta-sub-text">
                  Click để nhập Email — Nhận vé miễn phí ngay
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
      </section>

      {/* ═══════════════════════════════════════════
          VALUE PROPOSITION BANNER
          ═══════════════════════════════════════════ */}
      <section className="f3v2-value-banner f3v2-reveal">
        <div className="f3v2-container">
          <div className="f3v2-value-icon">
            <svg viewBox="0 0 24 24" fill="currentColor" width="80" height="80" className="f3v2-icon-svg"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm4.24 16L12 15.45 7.77 18l1.12-4.81-3.73-3.23 4.92-.42L12 5l1.92 4.53 4.92.42-3.73 3.23L16.23 18z"/></svg>
          </div>
          <h2 className="f3v2-value-title-top">"Điều Gì Xảy Ra Nếu Bạn Có Thêm</h2>
          <h1 className="f3v2-value-title-highlight">
            <u className="f3v2-highlight-pad">1, 5, hay 20 Triệu</u>
          </h1>
          <h2 className="f3v2-value-title-bottom">Thu Nhập Mỗi Tháng Nhờ AI!?!"</h2>
          <h3 className="f3v2-value-desc">
            Tham gia khóa học này <strong>(HOÀN TOÀN MIỄN PHÍ)</strong> và học cách <strong>"Bật Công Tắc"</strong> tạo dòng thu nhập liên tục cho doanh nghiệp của bạn!
          </h3>
          <div className="f3v2-divider" />
          <h1 className="f3v2-challenge-main-title">3 Ngày Thực Chiến AI</h1>
          <div className="f3v2-divider" />
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          DAY BREAKDOWN — 5DLC Layout (Left Text, Right Image)
          ═══════════════════════════════════════════ */}
      <section className="f3v2-days-section">
        <div className="f3v2-container">

          {/* ── DAY 1 ── */}
          <div className="f3v2-day-row f3v2-reveal">
            <div className="f3v2-day-text">
              <h1 className="f3v2-day-heading">
                <strong>BUỔI 1 - </strong>
                Kích Hoạt AI & Build Chatbot
              </h1>
              <p className="f3v2-day-body">
                Chúng ta sẽ khởi động CHALLENGE này bằng cách hướng dẫn bạn <u>chiến lược cốt lõi</u> để sử dụng AI tạo ra công cụ tự động. Bạn sẽ thấy ngay <strong>phương pháp này hoạt động cho CHÍNH BẠN như thế nào!</strong> Đây là buổi duy nhất mang tính "lý thuyết", tất cả các buổi còn lại là workshop thực hành trực tiếp!
              </p>
            </div>
            <div className="f3v2-day-media">
              <div className="f3v2-placeholder-img">
                GRAPHIC BUỔI 1
              </div>
            </div>
          </div>

          <div className="f3v2-arrows-divider" />

          {/* ── DAY 2 ── */}
          <div className="f3v2-day-row f3v2-reveal">
            <div className="f3v2-day-text">
              <h1 className="f3v2-day-heading">
                <strong>BUỔI 2 - </strong>
                Landing Page & Email Automation
              </h1>
              <p className="f3v2-day-body">
                Sau khi đã biết cách dùng AI, bước tiếp theo là <u>build landing page và hệ thống email tự động</u>. Chúng tôi sẽ chỉ bạn quy trình đơn giản để tạo một "trang thu Lead" như nam châm hút khách tiềm năng đến với bạn!
                <br /><br />
                <strong>LƯU Ý:</strong> Trong buổi này bạn sẽ được sử dụng <u>phần mềm kiến tạo miễn phí</u> giúp build UI siêu nhanh!
              </p>
            </div>
            <div className="f3v2-day-media">
              <div className="f3v2-placeholder-img">
                GRAPHIC BUỔI 2
              </div>
            </div>
          </div>

          <div className="f3v2-arrows-divider" />

          {/* ── DAY 3 ── */}
          <div className="f3v2-day-row f3v2-reveal">
            <div className="f3v2-day-text">
              <h1 className="f3v2-day-heading">
                <strong>BUỔI 3 - </strong>
                Biến AI Thành Thu Nhập Thật
              </h1>
              <p className="f3v2-day-body">
                Khi mọi thứ đã sẵn sàng, bước cuối cùng là <u>launch hệ thống kiếm tiền</u> của bạn! Bạn sẽ có <strong>Guest Trainer đặc biệt</strong> hướng dẫn cách triển khai mà <strong>không cần bỏ tiền quảng cáo ban đầu</strong>! Mọi thứ sẽ hoàn toàn xoay quanh các chiến lược tự nhiên.
              </p>
            </div>
            <div className="f3v2-day-media">
              <div className="f3v2-placeholder-img">
                GRAPHIC BUỔI 3
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ═══ MID CTA ═══ */}
      <section className="f3v2-mid-cta">
        <button className="f3v2-cta-btn" onClick={openModal}>
          <span className="f3v2-cta-main-text">
            <i className="fa fa-ticket-alt"></i> ĐĂNG KÝ "3 NGÀY THỰC CHIẾN AI" MIỄN PHÍ!
          </span>
          <span className="f3v2-cta-sub-text">
            Click Để Nhập Email Nhận Vé Tham Gia Chuỗi Đào Tạo Này
          </span>
        </button>
      </section>

      {/* ═══════════════════════════════════════════
          GUEST TRAINERS (4 Columns)
          ═══════════════════════════════════════════ */}
      <section className="f3v2-trainers-section f3v2-reveal">
        <div className="f3v2-trainers-title-wrap">
          <h2 className="f3v2-trainers-top">DIỄN GIẢ ĐẶC BIỆT TRONG</h2>
          <h1 className="f3v2-trainers-main">CHƯƠNG TRÌNH NÀY</h1>
        </div>

        <div className="f3v2-container">
          <div className="f3v2-trainers-grid f3v2-single-trainer">
            {/* Trainer 1 Image */}
            <div className="f3v2-trainer-img-col">
              <div className="f3v2-trainer-img-box effectbox">
                {/* Placeholder For Headshot Image */}
              </div>
            </div>
            {/* Trainer 1 Text */}
            <div className="f3v2-trainer-text-col">
              <h2 className="f3v2-trainer-role">MAIN TRAINER</h2>
              <h1 className="f3v2-trainer-name">HƯNG NPV</h1>
              <p className="f3v2-trainer-bio">
                <strong>Hưng NPV</strong> là chuyên gia AI Automation. Đã đào tạo hơn 1,200 học viên ứng dụng AI vào kinh doanh, xây dựng hệ thống tự động hóa cho nhiều doanh nghiệp, và giúp Freelancers kiếm thu nhập nhờ AI.
              </p>
            </div>
          </div>
          
          <div className="f3v2-bottom-trainers-cta">
             <button className="f3v2-cta-btn" onClick={openModal}>
                <span className="f3v2-cta-main-text">
                  <i className="fa fa-ticket-alt"></i> ĐĂNG KÝ "3 NGÀY THỰC CHIẾN AI" MIỄN PHÍ!
                </span>
                <span className="f3v2-cta-sub-text">
                  Click Để Nhập Email Nhận Vé Tham Gia Chuỗi Đào Tạo Này
                </span>
              </button>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          BOTTOM HERO — Dark Navy Background
          ═══════════════════════════════════════════ */}
      <section className="f3v2-bottom-hero f3v2-reveal">
        <div className="f3v2-container">
          <div className="f3v2-bottom-hero-inner">
            <h1 className="f3v2-bottom-headline-top">"Chỉ Cần Cho Tôi 3 Buổi Tối...</h1>
            <h1 className="f3v2-bottom-headline-main">
              Và Tôi Sẽ Chỉ Bạn Cách "Từng Bước" Để Tạo Thu Nhập Mới, Nơi Khách Hàng Khao Khát Được Làm Việc Với Bạn!"
            </h1>
            <h3 className="f3v2-bottom-headline-sub">
              Nhập Email Bên Dưới Để Truy Cập Khóa <strong>Đào Tạo Miễn Phí</strong> Này. Khóa Học Sẽ Vén Màn Bí Mật Giúp Bạn Kiến Tạo <u>Dòng Tiền Liên Tục</u> Để Phát Triển Công Việc Kinh Doanh Online!
            </h3>
            
            <div className="f3v2-bottom-cta-wrap">
              <button className="f3v2-cta-btn" onClick={openModal}>
                <span className="f3v2-cta-main-text">
                  ĐĂNG KÝ TẠI ĐÂY NGAY!
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="f3v2-footer">
        <p>© {new Date().getFullYear()} DUHAVA | Bảo mật SSL</p>
      </footer>

      {/* ═══ LEAD MODAL ═══ */}
      <FreeLeadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        courseId={COURSE_INFO.id}
        courseName={COURSE_INFO.name}
      />
    </div>
  );
};

export default Free3DayV2;
