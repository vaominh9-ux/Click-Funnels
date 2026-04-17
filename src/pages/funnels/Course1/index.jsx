import React, { useEffect, useState } from 'react';
import './style.css';
import { useFunnelTracking } from '../utils';
import LeadModal from '../components/LeadModal';
import { FUNNEL_COURSES } from '../config';

const COURSE_INFO = FUNNEL_COURSES['khoa-hoc-1'];

const Course1 = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Scroll to top on load
    window.scrollTo(0, 0);
  }, []);

  // Hook theo dõi ref
  useFunnelTracking();

  return (
    <div className="funnel-container">
      {/* HEADER */}
      <header className="funnel-header">
        <div className="funnel-logo">DUHAVA <span>ACADEMY</span></div>
      </header>

      {/* HERO SECTION */}
      <section className="funnel-hero">
        <div className="hero-content">
          <span className="badge">Khóa học Mới Nhất 2026</span>
          <h1>Tiêu Đề Khóa Học 1 Nằm Ở Đây</h1>
          <p className="hero-subtitle">
            Một mô tả ngắn gọn về giá trị cốt lõi mà khóa học này mang lại. Điểm nhấn mạnh những kỹ năng thực chiến mà học viên sẽ đạt được sau khi tham gia.
          </p>
          <button className="cta-button primary-cta" onClick={() => setIsModalOpen(true)}>Đăng Ký Khóa Học Ngay</button>
        </div>
        <div className="hero-image-placeholder">
          {/* Thay thế bằng ảnh thật của khóa học */}
          <div className="placeholder-text">Hero Image/Video</div>
        </div>
      </section>

      {/* FEATURES / BENEFITS */}
      <section className="funnel-features">
        <h2>Bạn sẽ nhận được gì?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>Nội dung 1</h3>
            <p>Mô tả chi tiết về lợi ích số 1.</p>
          </div>
          <div className="feature-card">
            <h3>Nội dung 2</h3>
            <p>Mô tả chi tiết về lợi ích số 2.</p>
          </div>
          <div className="feature-card">
            <h3>Nội dung 3</h3>
            <p>Mô tả chi tiết về lợi ích số 3.</p>
          </div>
        </div>
      </section>

      {/* CTA / OPT-IN FOOTER */}
      <section className="funnel-cta-section">
        <h2>Bắt đầu hành trình cùng chúng tôi!</h2>
        <p>Đăng ký ngay hôm nay để nhận được ưu đãi giới hạn cực kỳ hấp dẫn.</p>
        <button className="cta-button secondary-cta" onClick={() => setIsModalOpen(true)}>Giữ Chỗ Ngay Hôm Nay</button>
      </section>

      {/* FOOTER */}
      <footer className="funnel-footer">
        <p>&copy; 2026 DUHAVA Academy. Tất cả các quyền được bảo lưu.</p>
      </footer>

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
