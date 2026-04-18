import React, { useEffect, useState } from 'react';
import './c4-style.css'; // Phong cách Bụi bặm: THE INDUSTRIAL HUSTLE
import { useFunnelTracking } from '../utils';
import LeadModal from '../components/LeadModal';
import { FUNNEL_COURSES } from '../config';
import { 
  Play, ArrowRight, AlertTriangle, FastForward
} from 'lucide-react';

const COURSE_INFO = FUNNEL_COURSES['khoa-hoc-4'];

const Course4 = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useFunnelTracking();

  return (
    <div className="c4-hustle-wrapper">
      <div className="c4-caution-tape"></div>

      <div className="c4-container">
        {/* HERO SECTION */}
        <section className="c4-hero">
          <div className="c4-alert-badge">
            <AlertTriangle size={18} strokeWidth={3} /> STARTUP 2026: TÁC CHIẾN NHANH
          </div>
          
          <h1 className="c4-hustle-title">
            KHỞI NGHIỆP <span className="c4-orange-text">0 ĐỒNG TỐC CHIẾN</span>
          </h1>
          
          <p className="c4-hero-sub">
            Bạn không có vốn? Quên việc nhập hàng lại đi. Sử dụng AI và ngách Dropshipping/Affiliate để tạo ra dòng tiền dương ngay trong tuần đầu tiên chỉ với 1 chiếc Laptop.
          </p>

          <div className="c4-action-box" onClick={() => setIsModalOpen(true)}>
            <div className="c4-vsl-area">
              <Play size={48} color="#F97316" fill="#F97316" />
              <div className="c4-vsl-alert-text">XEM BẢN KẾ HOẠCH TÁC CHIẾN (5 PHÚT)</div>
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <button className="c4-hustle-btn" onClick={() => setIsModalOpen(true)}>
              TÔI MUỐN KIẾM TIỀN NGAY HÔM NAY <FastForward size={24} strokeWidth={3} />
            </button>
            <p style={{ marginTop: '16px', color: '#71717A', fontWeight: 600 }}>Cảnh báo: Nếu bạn lười biếng, hãy đóng trang web này lại.</p>
          </div>
        </section>

        {/* MODULES (ROUGH LIST) */}
        <section className="c4-modules-sec">
          <h2 className="c4-hustle-title" style={{ textAlign: 'center', fontSize: '36px' }}>BA BƯỚC ĐẬP ĐI XÂY LẠI TỪ HAI BÀN TAY TRẮNG</h2>
          
          <div className="c4-grid-col">
            <div className="c4-rough-card">
              <div className="c4-rough-num">01</div>
              <div className="c4-rough-content">
                <h3>XÁC ĐỊNH MỎ VÀNG TRONG NGÁCH NHỎ</h3>
                <p>Tuyệt đối không bán hàng phổ thông. Sử dụng prompt AI đặc biệt để tìm ra các sản phẩm ngách có biên lợi nhuận cực cao trên TikTok Shop Mỹ và Shopee.</p>
              </div>
            </div>

            <div className="c4-rough-card">
              <div className="c4-rough-num">02</div>
              <div className="c4-rough-content">
                <h3>KẺ HÚT TRAFFIC MIỄN PHÍ</h3>
                <p>Nấu nướng các Video ngắn (Shorts/Reels) bằng công cụ AI tự động. Bơm hàng triệu lượt xem miễn phí (Zero-Cost Traffic) mà không tốn một đồng chạy Facebook Ads.</p>
              </div>
            </div>

            <div className="c4-rough-card">
              <div className="c4-rough-num">03</div>
              <div className="c4-rough-content">
                <h3>CƠ CHẾ IN TIỀN TỰ ĐỘNG (SOLOPRENEUR)</h3>
                <p>Cấu hình luồng Dropshipping và Affiliate tự kết nối đơn hàng. Bạn đi ngủ, hệ thống xử lý nhà cung cấp. Bạn thức dậy, rút số dư trong tài khoản.</p>
              </div>
            </div>
          </div>
        </section>

        {/* STICKY NOTES OFFER STACK */}
        <section className="c4-offer-sec">
          <div className="c4-notice-board">
            <div className="c4-board-header">
              <h2 className="c4-hustle-title">TẤM VÉ THU PHÍ CHỈ 1 LẦN</h2>
            </div>
            
            <div className="c4-sticky-wrap">
              <div className="c4-sticky-note">
                <span>Hệ Thống Tác Chiến 0 Đồng Từ A-Z</span>
                <span className="c4-sticky-val">4.500.000 đ</span>
              </div>
              <div className="c4-sticky-note">
                <span>Kho 500+ Prompt ChatGPT Khủng (Bonus)</span>
                <span className="c4-sticky-val">2.000.000 đ</span>
              </div>
              <div className="c4-sticky-note">
                <span>Cẩm Nang Lách Luật Nền Tảng (Bonus)</span>
                <span className="c4-sticky-val">1.500.000 đ</span>
              </div>
            </div>

            <div className="c4-total-cost">
              TỔNG TRỊ GIÁ TRÊN BÀN H C: <span style={{ textDecoration: 'line-through' }}>8.000.000 đ</span>
            </div>
            <div className="c4-final-price">
              LỆ PHÍ TÁC CHIẾN: {COURSE_INFO.price.toLocaleString('vi-VN')} đ
            </div>

            <div style={{ textAlign: 'center', marginTop: '40px' }}>
              <button className="c4-hustle-btn" onClick={() => setIsModalOpen(true)}>
                KÍCH HOẠT VÉ VÀO CỬA <FastForward size={24} />
              </button>
            </div>
          </div>
        </section>
      </div>

      <div className="c4-caution-tape"></div>

      <footer style={{ padding: '40px 0', textAlign: 'center', background: '#09090B', color: '#52525B' }}>
        <p>&copy; 2026 DUHAVA Academy. Hành động ngay hoặc mất phần.</p>
      </footer>

      <LeadModal 
        isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} 
        courseId={COURSE_INFO.id} courseName={COURSE_INFO.name} 
      />
    </div>
  );
};

export default Course4;
