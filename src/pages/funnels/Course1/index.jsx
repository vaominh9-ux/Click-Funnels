import React, { useEffect, useState } from 'react';
import './style.css';
import { useFunnelTracking } from '../utils';
import LeadModal from '../components/LeadModal';
import { FUNNEL_COURSES } from '../config';
import { 
  CheckCircle2, XCircle, ArrowRight, ArrowDown, 
  ShieldCheck, MonitorPlay, Calendar, Zap, Star
} from 'lucide-react';

const COURSE_INFO = FUNNEL_COURSES['khoa-hoc-1'];

const Course1 = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useFunnelTracking();

  return (
    <div className="hormozi-light-page starter-funnel">
      {/* ─── STICKY EYEBROW BANNER ─── */}
      <div className="hq-banner">
        <p>🔥 <strong>DÀNH RIÊNG CHO NHỮNG AI ĐÃ THAM GIA 3 NGÀY MIỄN PHÍ</strong> — Hoặc bất kỳ ai muốn kiếm tiền từ AI</p>
      </div>

      <div className="hormozi-container">

        {/* ─── PHẦN 1: HERO (THE BIG PROMISE) ─── */}
        <section className="hero-section text-center">
          <h1 className="main-headline">
            Bí Mật Kiếm Tiền Từ AI Với <span className="text-highlight">0 Đồng Vốn:</span><br />
            Lộ Trình 7 Ngày Biến Bạn Thành AI Freelancer Có Thu Nhập
          </h1>
          
          <p className="sub-headline mb-8">
            Bạn đã biết BUILD app AI (từ 3 ngày miễn phí). Giờ hãy biến kỹ năng đó thành <strong>TIỀN</strong>.<br/>
            7 buổi tối, mỗi buổi 2 tiếng. Kết thúc lộ trình, bạn có <strong>KỸ NĂNG + KHÁCH HÀNG ĐẦU TIÊN.</strong>
          </p>

          <div className="hero-details mb-10">
            <div className="detail-item">
              <Calendar className="icon-red" size={24} />
              <span><strong>7 Buổi LIVE</strong><br/>19:30 - 21:30</span>
            </div>
            <div className="detail-item">
              <MonitorPlay className="icon-red" size={24} />
              <span><strong>Mr. Hưng NPV</strong><br/>Huấn luyện trực tiếp</span>
            </div>
            <div className="detail-item">
              <Zap className="icon-red" size={24} />
              <span><strong>Tặng Template AI</strong><br/>+ 20 Prompt Chốt Deal</span>
            </div>
          </div>

          <button 
            className="hormozi-btn btn-large pulse-animation mx-auto"
            onClick={() => setIsModalOpen(true)}
          >
            🔥 ĐĂNG KÝ LỘ TRÌNH NGAY — {COURSE_INFO.price.toLocaleString('vi-VN')}₫
            <ArrowRight size={20} className="ml-2" />
          </button>
        </section>

        {/* ─── PHẦN 2: "THE PROBLEM" ─── */}
        <section className="problem-section mt-16">
          <div className="problem-box">
            <h2 className="mb-6 problem-title">BẠN ĐÃ BIẾT DÙNG AI. NHƯNG...</h2>
            <ul className="pain-list">
              <li>
                <div className="icon-wrap"><XCircle size={22} className="text-red-500" /></div>
                <span>Biết build app AI rồi, nhưng <strong>không biết kiếm tiền bằng cách nào?</strong></span>
              </li>
              <li>
                <div className="icon-wrap"><XCircle size={22} className="text-red-500" /></div>
                <span>Muốn bắt đầu kinh doanh online nhưng <strong>không có vốn, không biết bắt đầu từ đâu?</strong></span>
              </li>
              <li>
                <div className="icon-wrap"><XCircle size={22} className="text-red-500" /></div>
                <span>Thấy người khác nhận job freelance AI kiếm 5-20 triệu/tháng, còn mình thì <strong>không biết tìm khách ở đâu?</strong></span>
              </li>
              <li>
                <div className="icon-wrap"><XCircle size={22} className="text-red-500" /></div>
                <span>Sợ rằng biết AI nhưng <strong>không biến nó thành nghề</strong> thì cuối cùng cũng chỉ là "biết cho vui"?</span>
              </li>
            </ul>
            <div className="problem-arrow text-center my-6">
              <ArrowDown size={32} className="text-gray-400 mx-auto" />
            </div>
            <p className="problem-conclusion text-center">
              <strong>→ Lộ trình "Khởi Sự 0 Đồng" giải quyết CHÍNH XÁC vấn đề này.</strong>
            </p>
          </div>
        </section>

        {/* ─── PHẦN 3: "THE SOLUTION" ─── */}
        <section className="solution-section mt-16 text-center">
          <h2 className="section-title">Đây KHÔNG phải khóa học AI thêm vào bộ sưu tập.</h2>
          <p className="solution-subtitle mb-8">Đây là <strong>Lộ Trình Thực Thi 7 Ngày</strong> — nơi bạn sẽ:</p>
          
          <div className="solution-steps">
            <div className="s-step">
              <div className="s-number">1</div>
              <p>Trang bị đúng dịch vụ AI để bán (Chatbot, Content, Automation)</p>
            </div>
            <div className="s-step">
              <div className="s-number">2</div>
              <p>Tìm khách hàng ĐẦU TIÊN (Mô hình 0 đồng vốn không quảng cáo)</p>
            </div>
            <div className="s-step">
              <div className="s-number">3</div>
              <p>Hoàn thành dự án thực tế + Thu tiền về túi</p>
            </div>
          </div>
          <div className="highlight-pill mt-10 mx-auto">
            Kết thúc 7 ngày = Bạn có nghề AI Freelancer + thu nhập thật.
          </div>
        </section>

        {/* ─── PHẦN 4: LỘ TRÌNH 7 NGÀY (THE VEHICLE) ─── */}
        <section className="timeline-section mt-16">
          <h2 className="section-title text-center mb-10">LỘ TRÌNH 7 NGÀY THỰC CHIẾN</h2>
          <div className="timeline-container">
            {[
              { day: 1, title: 'Tư Duy Kiếm Tiền Từ AI', desc: 'Hiểu rõ 5 mô hình kinh doanh AI dễ nhất, chọn 1 mô hình cho mình.' },
              { day: 2, title: 'Build Sản Phẩm AI Đầu Tiên', desc: 'Hoàn thành 1 sản phẩm/dịch vụ AI sẵn sàng mang đi bán.' },
              { day: 3, title: 'Tìm Khách Hàng 0 Đồng', desc: '20+ kênh tìm khách MIỄN PHÍ + Template tin nhắn chào hàng đỉnh cao.' },
              { day: 4, title: 'Định Giá & Chốt Deal', desc: 'Kịch bản báo giá + chốt deal chống trượt cho freelancer AI mới.' },
              { day: 5, title: 'Nâng Cấp Sản Phẩm Bằng AI', desc: 'Tự động hóa sản xuất content/hình ảnh/video bằng AI Workflow.' },
              { day: 6, title: 'Xây Profile & Portfolio AI', desc: 'Portfolio chuyên nghiệp + Bio thu hút khách hàng liên tục.' },
              { day: 7, title: 'Tổng Kết & Kế Hoạch 30 Ngày', desc: 'Bản kế hoạch chi tiết kiếm 5-15 triệu/tháng đều đặn từ AI freelance.', isFinal: true }
            ].map(item => (
              <div className={`t-card ${item.isFinal ? 't-card-highlight' : ''}`} key={item.day}>
                <div className="t-day">NGÀY {item.day}</div>
                <div className="t-content">
                  <h3 className="t-title">{item.title}</h3>
                  <p className="t-desc">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── PHẦN 5: "SOCIAL PROOF" ─── */}
        <section className="expert-section mt-16">
          <div className="expert-box">
            <div className="expert-image">
              <img src="https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&q=80&w=400" alt="Mr. Hưng NPV" />
            </div>
            <div className="expert-info">
              <h2>Mr. Nguyễn Phước Vĩnh Hưng (Hưng NPV)</h2>
              <p className="expert-title">Founder & CEO — Duhava Technology JSC</p>
              <ul className="expert-stats">
                <li><CheckCircle2 size={18} className="text-blue-500 mr-2 flex-shrink-0" /> <strong>500,000+ followers</strong> TikTok</li>
                <li><CheckCircle2 size={18} className="text-blue-500 mr-2 flex-shrink-0" /> Admin Group AI <strong>200,000+ thành viên</strong></li>
                <li><CheckCircle2 size={18} className="text-blue-500 mr-2 flex-shrink-0" /> Huấn luyện: BIDV, Vinhomes, Droppii, Mitsubishi...</li>
                <li><CheckCircle2 size={18} className="text-blue-500 mr-2 flex-shrink-0" /> <strong>10+ năm</strong> thực chiến kinh doanh online</li>
              </ul>
              <div className="expert-quote">
                "Tôi bắt đầu kinh doanh online cũng từ 0 đồng. Lộ trình này là BẢN ĐỒ chính xác mà tôi ước có từ ngày đầu lập nghiệp."
              </div>
            </div>
          </div>
        </section>

        {/* ─── PHẦN 6: "THE GRAND SLAM OFFER" ─── */}
        <section className="offer-section mt-16 mb-16">
          <div className="offer-box">
            <h2 className="section-title text-center text-white mb-8">BẠN SẼ NHẬN ĐƯỢC GÌ HÔM NAY?</h2>
            
            <ul className="value-stack-list">
              <li>
                <span>🎓 7 buổi LIVE (14 giờ đào tạo trực tiếp)</span>
                <span className="value">8.500.000₫</span>
              </li>
              <li>
                <span>🤖 Template sản phẩm AI kiếm tiền (copy-paste)</span>
                <span className="value">3.000.000₫</span>
              </li>
              <li>
                <span>📚 20+ Kịch bản chào hàng + chốt deal Freelancer</span>
                <span className="value">2.000.000₫</span>
              </li>
              <li>
                <span>🎥 Bản ghi hình Full 4K — xem lại TRỌN ĐỜI</span>
                <span className="value">1.000.000₫</span>
              </li>
              <li>
                <span>🔓 Tài khoản AI Workflow Art PRO (1 năm)</span>
                <span className="value">1.490.000₫</span>
              </li>
              <li className="offer-bonus">
                <span>🎁 BONUS 1: 20+ AI Agents đã lập trình sẵn</span>
                <span className="value">5.000.000₫</span>
              </li>
              <li className="offer-bonus">
                <span>🎁 BONUS 2: Cộng đồng AI Freelancer VIP (trọn đời)</span>
                <span className="value text-red">VÔ GIÁ</span>
              </li>
            </ul>
            <div className="offer-total">
              <div className="total-label">TỔNG GIÁ TRỊ:</div>
              <div className="total-price strike">&gt; 20.990.000₫</div>
            </div>
          </div>
        </section>

        {/* ─── PHẦN 7 + 8 + 9: PRICE REVEAL, RISK REVERSAL & CTA ─── */}
        <section className="close-section mt-16 text-center">
          <div className="price-reveal">
            <p>Nếu tự mò mẫm → <strong>6-12 tháng</strong> + hàng chục triệu thử sai.</p>
            <p>Nếu thuê mentor 1:1 → <strong>10-20 triệu</strong> cho vài buổi.</p>
            <p className="mt-6 text-lg">Nhưng hôm nay, trọn gói "Khởi Sự 0 Đồng":</p>
            <h3 className="strike-price text-gray-500 font-bold line-through text-3xl mt-4">20.990.000₫</h3>
            <div className="final-price-container mt-2 mb-4">
              <span className="price-pointer">👉 CHỈ</span>
              <h1 className="final-price text-red-600 font-black m-0">{COURSE_INFO.price.toLocaleString('vi-VN')}₫</h1>
            </div>
            <p className="price-subtext text-gray-500 italic mb-8">(Rẻ hơn 1 bữa tiệc — nhưng bạn mang về 1 NGHỀ kiếm tiền cả đời)</p>
          </div>

          <div className="risk-reversal-box mx-auto mt-10">
            <ShieldCheck size={48} className="mx-auto text-green-600 mb-4" />
            <h3 className="text-xl font-bold mb-4">🛡️ CAM KẾT: KHÔNG KIẾM ĐƯỢC TIỀN = KHÔNG MẤT TIỀN</h3>
            <p className="text-gray-600 leading-relaxed">
              Nếu sau 7 ngày bạn chưa biết cách kiếm đồng tiền đầu tiên từ AI, hãy gửi tin nhắn — bạn sẽ được <strong>hỗ trợ 1:1</strong> cho đến khi có kết quả, hoặc <strong>hoàn tiền 100%</strong>.
            </p>
          </div>

          <div className="final-cta-area mt-10 mb-10">
            <p className="urgency-text text-red-600 text-sm font-bold tracking-wide">⚠️ LƯU Ý: CHỈ MỞ 30 SUẤT MỖI ĐỢT (HỌC LIVE KÈM CẶP TỪNG NGƯỜI)</p>
            <button 
              className="hormozi-btn btn-large pulse-animation mx-auto w-full-mobile mt-6"
              onClick={() => setIsModalOpen(true)}
            >
              🔥 ĐĂNG KÝ BẢO LƯU SUẤT TRƯỚC KHI ĐÓNG!
            </button>
          </div>
        </section>

      </div>

      {/* ─── PHẦN 10 & FOOTER ─── */}
      <footer className="starter-footer mt-16 pt-10 pb-10 bg-gray-50 border-t border-gray-200 text-center">
        <div className="hormozi-container">
          <div className="footer-upsell mb-8 bg-blue-50 p-6 rounded-xl border border-blue-100">
            <Star size={24} className="mx-auto text-yellow-500 mb-3 fill-current" />
            <p className="text-gray-700 text-sm">
              <em>"Sau khi hoàn thành lộ trình 7 ngày, những học viên muốn SCALE lên — xây dựng AI Agency riêng, chạy Ads, automation phục vụ doanh nghiệp — sẽ được mời tham gia Khóa MASTER (6.997.000₫) với ưu đãi đặc biệt."</em>
            </p>
          </div>
          <div className="footer-bottom">
            <p className="font-bold text-gray-800">© {new Date().getFullYear()} DUHAVA JSC. All rights reserved.</p>
            <p className="mt-2 text-gray-500 text-xs">🔒 Bảo mật SSL | Thanh toán an toàn qua cổng VNPay/Chuyển Khoản</p>
          </div>
        </div>
      </footer>

      {/* LEAD MODAL */}
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
