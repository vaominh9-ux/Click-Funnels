import React, { useEffect, useState } from 'react';
import '../Course1/style.css'; 
import { useFunnelTracking } from '../utils';
import LeadModal from '../components/LeadModal';
import { FUNNEL_COURSES } from '../config';

const COURSE_INFO = FUNNEL_COURSES['khoa-hoc-4'];

const Course4 = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useFunnelTracking();

  return (
    <div className="funnel-container">
      <header className="funnel-header">
        <div className="funnel-logo">DUHAVA <span>ACADEMY</span></div>
      </header>

      <section className="funnel-hero">
        <div className="hero-content">
          <span className="badge">Khóa học Mới Nhất 2026</span>
          <h1>Tiêu Đề Khóa Học 4 Nằm Ở Đây</h1>
          <p className="hero-subtitle">Mô tả ngắn gọn về giá trị của khóa 4.</p>
          <button className="cta-button primary-cta" onClick={() => setIsModalOpen(true)}>Đăng Ký Khóa Học Ngay</button>
        </div>
        <div className="hero-image-placeholder">
          <div className="placeholder-text">Hero Image/Video</div>
        </div>
      </section>

      <section className="funnel-features">
        <h2>Bạn sẽ nhận được gì?</h2>
        <div className="features-grid">
          <div className="feature-card"><h3>Nội dung 1</h3><p>Mô tả 1.</p></div>
          <div className="feature-card"><h3>Nội dung 2</h3><p>Mô tả 2.</p></div>
          <div className="feature-card"><h3>Nội dung 3</h3><p>Mô tả 3.</p></div>
        </div>
      </section>

      <section className="funnel-cta-section">
        <h2>Bắt đầu hành trình cùng chúng tôi!</h2>
        <p>Đăng ký ngay hôm nay.</p>
        <button className="cta-button secondary-cta" onClick={() => setIsModalOpen(true)}>Giữ Chỗ Ngay Hôm Nay</button>
      </section>
      
      <footer className="funnel-footer">
        <p>&copy; 2026 DUHAVA Academy.</p>
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

export default Course4;
