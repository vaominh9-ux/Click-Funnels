import React, { useState, useEffect } from 'react';
import FreeLeadModal from './FreeLeadModal';
import { useFunnelTracking } from '../utils';
import { Calendar, MonitorPlay, UserCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import './style.css';

const COURSE_INFO = {
  id: 'free-3day',
  name: '3 Ngày Thực Chiến AI - Miễn Phí',
};

const Free3DayLanding = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Lưu ref/campaign/link từ URL vào localStorage để tracking Lead
  useFunnelTracking();

  // Cuộn mượt
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="hormozi-light-page">
      {/* HEADER / STICKY BANNER */}
      <div className="hq-banner">
        <p><strong>🆓 WORKSHOP MIỄN PHÍ</strong> | Không cần biết code. Học trực tiếp qua Zoom.</p>
      </div>

      <div className="hormozi-container">
        
        {/* HERO SECTION */}
        <section className="hero-section text-center">
          <div className="badge-pill mb-6 mx-auto">
            <span>SỰ KIỆN LIVE TRỰC TIẾP</span>
          </div>

          <h1 className="main-headline">
            <span className="text-highlight">3 Buổi Tối Thực Hành AI</span><br />
            Tự Tay Build Ứng Dụng - Không Cần Biết Code
          </h1>

          <p className="sub-headline mb-8">
            Đăng ký miễn phí. Tham gia nhóm Zalo. Hoàn toàn MIỄN PHÍ.<br />
            Sử dụng <strong>AI</strong> để tự động hóa công việc và bắt đầu kiếm tiền.
          </p>

          <div className="hero-details mb-10">
            <div className="detail-item">
              <Calendar className="icon-red" size={24} />
              <span><strong>3 Buổi Tối</strong><br/>19h30 - 21h00</span>
            </div>
            <div className="detail-item">
              <MonitorPlay className="icon-red" size={24} />
              <span><strong>LIVE qua Zoom</strong><br/>Tham gia trực tuyến</span>
            </div>
            <div className="detail-item">
              <UserCheck className="icon-red" size={24} />
              <span><strong>Hưng NPV</strong><br/>Hướng dẫn trực tiếp</span>
            </div>
          </div>

          <button 
            className="hormozi-btn btn-large pulse-animation mx-auto"
            onClick={() => setIsModalOpen(true)}
          >
            🔥 ĐĂNG KÝ MIỄN PHÍ NGAY KHÔNG PHÍ ẨN
            <ArrowRight size={20} className="ml-2" />
          </button>
          <p className="security-note mt-4">
            🔒 <em>Thông tin bảo mật. Tham gia ngay lập tức.</em>
          </p>
        </section>

        {/* 3 BUỔI HỌC GÌ SECTION */}
        <section className="curriculum-section mt-16">
          <h2 className="section-title text-center mb-10">Bạn Sẽ Đạt Được Gì Trong 3 Ngày?</h2>
          
          <div className="curriculum-cards">
            
            <div className="c-card">
              <div className="c-day">BUỔI 1</div>
              <h3 className="c-title">Kích Hoạt AI & Chatbot</h3>
              <ul className="c-list">
                <li><CheckCircle2 size={18} className="text-green-600 mr-2 flex-shrink-0" /> Kích hoạt Google AI Pro</li>
                <li><CheckCircle2 size={18} className="text-green-600 mr-2 flex-shrink-0" /> Framework viết prompt chuẩn</li>
                <li><CheckCircle2 size={18} className="text-green-600 mr-2 flex-shrink-0" /> Tự tay build Chatbot đầu tiên</li>
              </ul>
            </div>

            <div className="c-card">
              <div className="c-day">BUỔI 2</div>
              <h3 className="c-title">Công Cụ Bán Hàng Tự Động</h3>
              <ul className="c-list">
                <li><CheckCircle2 size={18} className="text-green-600 mr-2 flex-shrink-0" /> Nâng cấp Chatbot AI đa năng</li>
                <li><CheckCircle2 size={18} className="text-green-600 mr-2 flex-shrink-0" /> Sinh Landing Page bằng AI</li>
                <li><CheckCircle2 size={18} className="text-green-600 mr-2 flex-shrink-0" /> Xây dựng chuỗi Email Automation</li>
              </ul>
            </div>

            <div className="c-card highlight-card">
              <div className="c-day bg-red">BUỔI 3</div>
              <h3 className="c-title">Biến Kỹ Năng Thành Tiền</h3>
              <ul className="c-list">
                <li><CheckCircle2 size={18} className="text-red-600 mr-2 flex-shrink-0" /> Case study thực tế Freelancer AI</li>
                <li><CheckCircle2 size={18} className="text-red-600 mr-2 flex-shrink-0" /> Cách kiếm 5-20 triệu/tháng</li>
                <li><CheckCircle2 size={18} className="text-red-600 mr-2 flex-shrink-0" /> Lộ trình bài bản để đi đường dài</li>
              </ul>
            </div>

          </div>
        </section>

        {/* BOTTOM CTA */}
        <section className="bottom-cta text-center mt-16">
          <div className="cta-box">
            <h2 className="mb-4">Bạn Sẵn Sàng Bắt Đầu Chưa?</h2>
            <p className="mb-8">Không có rào cản. Không tốn 1 đồng. Điền email của bạn xuống dưới form để nhận ngay lịch học và link Zoom qua Zalo.</p>
            <button 
              className="hormozi-btn btn-large w-full-mobile mx-auto"
              onClick={() => setIsModalOpen(true)}
            >
              GIỮ CHỖ MIỄN PHÍ CHO TÔI
            </button>
          </div>
        </section>

      </div>

      <footer className="h-footer">
        <p>© {new Date().getFullYear()} DUHAVA | 🔒 Bảo mật SSL</p>
      </footer>

      {/* LEAD MODAL */}
      <FreeLeadModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        courseId={COURSE_INFO.id} 
        courseName={COURSE_INFO.name}
      />
    </div>
  );
};

export default Free3DayLanding;
