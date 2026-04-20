import React, { useEffect, useState } from 'react';
import './c2-style.css';
import { useFunnelTracking } from '../utils';
import LeadModal from '../components/LeadModal';
import { FUNNEL_COURSES } from '../config';
import { 
  CheckCircle2, XCircle, ArrowRight, ArrowDown, 
  ShieldCheck, MonitorPlay, Calendar, Zap, Star,
  Briefcase, BarChart, Settings, Crown
} from 'lucide-react';

const COURSE_INFO = FUNNEL_COURSES['khoa-hoc-2'];

const Course2 = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useFunnelTracking();

  return (
    <div className="c2-master-page">
      {/* ─── NỀN MESH GRADIENT HẠNG SANG ─── */}
      <div className="c2-mesh-background">
        <div className="mesh-blob blob-1"></div>
        <div className="mesh-blob blob-2"></div>
        <div className="mesh-blob blob-3"></div>
      </div>

      {/* ─── STICKY EYEBROW BANNER ─── */}
      <div className="c2-banner c2-glass-panel">
        <div className="hormozi-container">
          <p>🚀 <strong>CHO NHỮNG AI ĐÃ BIẾT KIẾM TIỀN TỪ AI</strong> — VÀ MUỐN SCALE LÊN CẤP ĐỘ DOANH NGHIỆP B2B</p>
        </div>
      </div>

      <div className="hormozi-container relative z-10">

        {/* ─── PHẦN 1: HERO (THE BIG PROMISE) ─── */}
        <section className="c2-hero-section">
          <div className="c2-premium-badge mx-auto mb-6">
            <span className="c2-shimmer-bg">MASTER CLASS 2.0</span>
          </div>
          
          <h1 className="c2-main-headline text-center">
            Lộ Trình Xây Dựng <span className="c2-metallic-text">AI Agency</span><br className="desktop-only" />
            Làm Chủ Automation, Ads & Hệ Thống Corporate
          </h1>
          
          <p className="c2-sub-headline text-center mb-10">
            Bạn đã biết kiếm tiền từ AI 5-15 triệu/tháng. Giờ hãy SCALE lên <strong>50-100&nbsp;triệu/tháng</strong> bằng cách xây dựng hệ thống Agency AI phục vụ doanh nghiệp — có quy trình, có đội ngũ AI, có khách ổn định.
          </p>

          <button 
            className="c2-btn-elite pulse-gold mx-auto w-full-mobile"
            onClick={() => setIsModalOpen(true)}
          >
            <Crown size={24} className="mr-2 text-yellow-100" />
            ĐĂNG KÝ MASTER LỘ TRÌNH NGAY — {COURSE_INFO.price.toLocaleString('vi-VN')}₫
          </button>
        </section>

        {/* ─── PHẦN 2: "THE PROBLEM" ─── */}
        <section className="c2-problem-section mt-20 text-center">
          <div className="c2-problem-box c2-glass-panel border-premium">
            <h2 className="mb-8 problem-title">BẠN ĐANG KIẾM TIỀN TỪ AI — NHƯNG...</h2>
            <ul className="c2-pain-list">
              <li>
                <div className="icon-wrap"><XCircle size={22} className="text-red-500" /></div>
                <span>Vẫn đang làm TỪNG JOB MỘT — thu nhập phụ thuộc vào <strong>SỐ GIỜ</strong> làm việc?</span>
              </li>
              <li>
                <div className="icon-wrap"><XCircle size={22} className="text-red-500" /></div>
                <span>Không biết cách <strong>chạy Ads</strong> để tìm khách hàng doanh nghiệp lớn (B2B)?</span>
              </li>
              <li>
                <div className="icon-wrap"><XCircle size={22} className="text-red-500" /></div>
                <span>Muốn xây <strong>Agency</strong> nhưng không biết cách tạo hệ thống automation để phục vụ nhiều khách cùng lúc?</span>
              </li>
              <li>
                <div className="icon-wrap"><XCircle size={22} className="text-red-500" /></div>
                <span>Thấy cơ hội AI Agency đang BÙNG NỔ nhưng sợ <strong>mình không đủ "chuyên gia"</strong> để bán cho doanh nghiệp?</span>
              </li>
            </ul>
            <div className="problem-arrow my-8">
              <ArrowDown size={36} className="text-gold opacity-60 mx-auto drop-shadow-md" />
            </div>
            <div className="c2-problem-conclusion highlight-elite">
              <strong>→ KHÓA MASTER sẽ biến bạn từ Freelancer lẻ tẻ thành CHỦ AGENCY vận hành bằng máy.</strong>
            </div>
          </div>
        </section>

        {/* ─── PHẦN 3: "THE SOLUTION" ─── */}
        <section className="c2-solution-section mt-24 text-center">
          <h2 className="c2-section-title">BẠN SẼ XÂY DỰNG 3 TRỤ CỘT CỦA MỘT<br/><span className="c2-metallic-text">AI AGENCY ĐẬM CHẤT ELITE</span></h2>
          
          <div className="c2-pillars-grid mt-14">
            <div className="c2-pillar-card neumorphic">
              <div className="pillar-icon-luxury"><Settings size={30} /></div>
              <h3>🤖 AI Automation</h3>
              <p className="pillar-role"><strong>Hệ thống n8n + AI Agents</strong> phục vụ khách hàng.</p>
              <div className="pillar-result">Pipeline tự vận hành 24/7, phục vụ 5-20 khách cùng lúc.</div>
            </div>
            <div className="c2-pillar-card neumorphic">
              <div className="pillar-icon-luxury"><BarChart size={30} /></div>
              <h3>📣 Ads & Traffic</h3>
              <p className="pillar-role"><strong>Facebook Ads + TikTok Ads</strong> chuyên B2B.</p>
              <div className="pillar-result">Máy hút khách doanh nghiệp chạy hoàn toàn tự động.</div>
            </div>
            <div className="c2-pillar-card neumorphic">
              <div className="pillar-icon-luxury"><Briefcase size={30} /></div>
              <h3>🏗️ Agency System</h3>
              <p className="pillar-role"><strong>Quy trình vận hành</strong>, định giá, chốt deal B2B.</p>
              <div className="pillar-result">Agency hoàn chỉnh: Từ tìm khách → deliver → thu tiền.</div>
            </div>
          </div>
        </section>

        {/* ─── PHẦN 4: LỘ TRÌNH 4 TUẦN (THE VEHICLE) ─── */}
        <section className="c2-timeline-section mt-32">
          <h2 className="c2-section-title text-center mb-14">LỘ TRÌNH 4 TUẦN CHIẾN LƯỢC</h2>
          <div className="c2-timeline-wrapper">
            
            <div className="c2-module-card c2-glass-panel">
              <div className="module-week elite-tag text-emerald-800 bg-emerald-100">
                <span>TUẦN 1: AUTOMATION</span>
              </div>
              <div className="module-content">
                <ul className="module-list">
                  <li><CheckCircle2 size={18} className="text-emerald-600 icon-check flex-shrink-0" /> Master n8n: Từ cơ bản đến thiết kế phức hợp.</li>
                  <li><CheckCircle2 size={18} className="text-emerald-600 icon-check flex-shrink-0" /> Xây hệ thống AI Agents tự suy luận (CSKH, chốt sale).</li>
                  <li><CheckCircle2 size={18} className="text-emerald-600 icon-check flex-shrink-0" /> Build pipeline: Ý tưởng → Sản xuất → Phân phối → Chốt sale.</li>
                </ul>
                <div className="module-output-elite"><strong>ĐẦU RA:</strong> Phễu Automation 10+ luồng tự động (Copy-paste deploy).</div>
              </div>
            </div>

            <div className="c2-module-card c2-glass-panel">
              <div className="module-week elite-tag text-blue-800 bg-blue-100">
                <span>TUẦN 2: ADS B2B</span>
              </div>
              <div className="module-content">
                <ul className="module-list">
                  <li><CheckCircle2 size={18} className="text-blue-600 icon-check flex-shrink-0" /> Facebook Ads cho B2B: Targeting doanh nghiệp, CEO, founders.</li>
                  <li><CheckCircle2 size={18} className="text-blue-600 icon-check flex-shrink-0" /> TikTok Ads: Case study 100K-200K followers/tháng.</li>
                  <li><CheckCircle2 size={18} className="text-blue-600 icon-check flex-shrink-0" /> Chiến lược content marketing thu thập Leads B2B.</li>
                </ul>
                <div className="module-output-elite"><strong>ĐẦU RA:</strong> 3 luồng phễu Ads chạy live + Content plan dài hạn.</div>
              </div>
            </div>

            <div className="c2-module-card c2-glass-panel">
              <div className="module-week elite-tag text-indigo-800 bg-indigo-100">
                <span>TUẦN 3: AGENCY</span>
              </div>
              <div className="module-content">
                <ul className="module-list">
                  <li><CheckCircle2 size={18} className="text-indigo-600 icon-check flex-shrink-0" /> Đóng gói dịch vụ AI Doanh nghiệp (Basic-Pro-Enterprise).</li>
                  <li><CheckCircle2 size={18} className="text-indigo-600 icon-check flex-shrink-0" /> Quy trình onboard khách hàng + Fulfillment Delivery.</li>
                  <li><CheckCircle2 size={18} className="text-indigo-600 icon-check flex-shrink-0" /> Template hợp đồng chuẩn, báo giá, proposal chuyên môn sâu.</li>
                </ul>
                <div className="module-output-elite"><strong>ĐẦU RA:</strong> Bộ hồ sơ Agency doanh nghiệp (Mang đi Deal 50-100tr+ ngay).</div>
              </div>
            </div>

            <div className="c2-module-card highlight-elite-timeline c2-glass-panel relative overflow-hidden">
              <div className="c2-shimmer-bg absolute top-0 -left-full w-full h-full opacity-10"></div>
              <div className="module-week elite-tag text-yellow-900 bg-yellow-200" style={{background: 'linear-gradient(135deg, #FDE68A 0%, #D97706 100%)', color: '#fff'}}>
                <span>TUẦN 4: SCALE & MEDIA</span>
              </div>
              <div className="module-content">
                <ul className="module-list">
                  <li><CheckCircle2 size={18} className="text-amber-600 icon-check flex-shrink-0" /> Tối ưu pipeline Media AI: Thiết kế đồ họa bão hòa tự động.</li>
                  <li><CheckCircle2 size={18} className="text-amber-600 icon-check flex-shrink-0" /> Generative A/B Test: Trăm mẫu Ads Visual mỗi buổi sáng.</li>
                  <li><CheckCircle2 size={18} className="text-amber-600 icon-check flex-shrink-0" /> Xuất Video Thương Mại phân giải Studio qua AI Renderer.</li>
                </ul>
                <div className="module-output-elite bg-amber-50 border-amber-200 text-amber-900 text-gold-shadow"><strong>ĐẦU RA BÙNG NỔ:</strong> Agency siêu tốc, khả năng phục vụ &gt;10+ Corporation.</div>
              </div>
            </div>

          </div>
        </section>

        {/* ─── PHẦN 5: "SOCIAL PROOF" ─── */}
        <section className="c2-expert-section mt-32">
          <div className="c2-expert-luxury c2-glass-panel border-premium">
            <div className="expert-image-wrapper">
              <img src="https://ui-avatars.com/api/?name=Hung+NPV&size=500&background=F8FAFC&color=1E293B&font-size=0.33&bold=true" alt="Mr. Hưng NPV" className="luxury-img" />
              <div className="luxury-badge c2-metallic-text-bg">MASTER / FOUNDER</div>
            </div>
            <div className="expert-info">
              <h2>Mr. Nguyễn Phước Vĩnh Hưng (Hưng NPV)</h2>
              <p className="expert-title">CEO — Duhava Technology JSC | Cựu Chuyên Gia B2B</p>
              <ul className="expert-stats">
                <li>
                  <div className="luxury-bullet"></div> 
                  <span className="flex-1">Huấn luyện AI in-house: <strong>BIDV, Vinhomes, Droppii, Mitsubishi...</strong></span>
                </li>
                <li>
                  <div className="luxury-bullet"></div> 
                  <span className="flex-1"><strong>500,000+ followers</strong> TikTok & Sinh thái Group 200,000+</span>
                </li>
                <li>
                  <div className="luxury-bullet"></div> 
                  <span className="flex-1"><strong>10+ năm kinh nghiệm</strong> cố vấn Doanh nghiệp Doanh thu chục Tỷ</span>
                </li>
              </ul>
              <div className="expert-quote-luxury">
                "Agency AI không phải là một khóa học, mà là một Đế Chế Công Nghệ thu nhỏ. Tôi sẽ giao nộp mã nguồn gốc của hệ thống cỗ máy mà chúng tôi cấu trúc."
              </div>
            </div>
          </div>
        </section>

        {/* ─── PHẦN 6: "THE GRAND SLAM OFFER VIP PASS" ─── */}
        <section className="c2-offer-section mt-32">
          <h2 className="c2-section-title text-center mb-12">THẺ HỘI VIÊN MASTER — <br className="mobile-break" /><span className="c2-metallic-text">VIP PASS</span></h2>
          
          <div className="vip-pass-board">
            <div className="vip-animated-border"></div>
            <div className="vip-pass-inner c2-glass-panel">
              <div className="vip-header">
                <h3>BLACK CARD MEMBER</h3>
                <p>Khởi Tạo Tài Sản Trí Tuệ Vĩnh Viễn</p>
              </div>

              <ul className="c2-value-list">
                <li>
                  <div className="offer-item"><div className="offer-icon"><CheckCircle2 size={24} /></div> <span>Trại Huấn Luyện 4 Tuần LIVE (32 Giờ Thực Chiến)</span></div>
                  <span className="value-pill">15.000.000₫</span>
                </li>
                <li>
                  <div className="offer-item"><div className="offer-icon"><Settings size={24} /></div> <span>Thư viện 20+ AI Automation Pipeline (Sẵn Deploy)</span></div>
                  <span className="value-pill">20.000.000₫</span>
                </li>
                <li>
                  <div className="offer-item"><div className="offer-icon"><BarChart size={24} /></div> <span>Bản Vẽ Chiến Dịch Ads B2B Doanh số Tỷ Đoạn</span></div>
                  <span className="value-pill">5.000.000₫</span>
                </li>
                <li>
                  <div className="offer-item"><div className="offer-icon"><Briefcase size={24} /></div> <span>Legal Kit: Hợp đồng Agency, Proposal Chốt Deal B2B</span></div>
                  <span className="value-pill">3.000.000₫</span>
                </li>
                <li>
                  <div className="offer-item"><div className="offer-icon"><Zap size={24} /></div> <span>Kho Đạn 4.000+ Prompt AI Chuyên Ngành Rộng</span></div>
                  <span className="value-pill">2.000.000₫</span>
                </li>
                <li>
                  <div className="offer-item"><div className="offer-icon"><MonitorPlay size={24} /></div> <span>Vault Lưu Trữ Master 4K (Dành Cho Cấp Elite)</span></div>
                  <span className="value-pill">1.000.000₫</span>
                </li>
                <li>
                  <div className="offer-item"><div className="offer-icon"><ShieldCheck size={24} /></div> <span>License Phần mềm Workflow Chuyên Nghiệp (1 Năm)</span></div>
                  <span className="value-pill">1.490.000₫</span>
                </li>
                
                <li className="c2-offer-bonus-luxury">
                  <div className="offer-item">
                    <div className="offer-icon bonus-icon"><Crown size={24} /></div> 
                    <div className="bonus-text-wrap">
                      <strong className="c2-metallic-text">QUYỀN LỢI ĐỈNH CAO:</strong>
                      <span className="bonus-desc">Khóa V.I.P Server AI Agency Mastermind</span>
                    </div>
                  </div>
                  <span className="value-pill bonus-pill">VÔ GIÁ</span>
                </li>
              </ul>

              <div className="c2-total-wealth-box">
                <div className="wealth-label">TỔNG TÀI SẢN KẾT TINH:</div>
                <div className="wealth-price">
                  <span className="strike text-slate-400 font-medium text-xl mr-4 md:text-2xl">&gt; 47.490.000₫</span>
                  <span className="text-white font-black text-3xl md:text-4xl">MIỄN PHÍ</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── PHẦN 7 + 8 + 9: PRICE REVEAL, RISK REVERSAL & CTA ─── */}
        <section className="c2-close-section mt-24 text-center">
          <div className="c2-price-reveal">
            <div className="c2-price-context-luxury mb-8">
              <p>Chi phí tự xây dựng đội IT, Data thử sai: <strong>Tối thiểu 50.000.000₫ & 6 tháng đẫm máu.</strong></p>
              <p className="mt-2">Chi phí để Consultant Setup hộ: <strong>70.000.000₫ cho 1 lần lên sóng.</strong></p>
            </div>
            
            <p className="text-xl font-bold tracking-widest uppercase mt-12 text-slate-700">Giá Vé Lên Tàu Hôm Nay:</p>
            
            <div className="c2-final-price-luxury my-8 relative inline-block">
              <h1 className="c2-metallic-text text-8xl md:text-[7rem] px-8 tracking-tighter drop-shadow-xl z-10 relative">{COURSE_INFO.price.toLocaleString('vi-VN')}₫</h1>
            </div>

            <p className="c2-price-subtext-luxury">
              (Thấp hơn một nửa tiền lương của 1 Thực tập sinh tháng đầu — Đổi lấy <strong>Cỗ Máy Doanh Thu Trăm Triệu</strong>)
            </p>
          </div>

          <div className="c2-risk-reversal-luxury mx-auto mt-16 c2-glass-panel">
            <div className="shield-icon-luxury"><ShieldCheck size={48} /></div>
            <h3>Khế Ước Thép: Build Agency Không Ra Kết Quả = Đền Tiền</h3>
            <p>
              Nếu trải qua Bootcamp 4 Tuần mà bạn không thể thiết lập 1 quy trình Agency AI tiêu chuẩn... 
              Hệ thống sẽ cử <strong>Chuyên gia 1-Kèm-1</strong> để đưa bạn đến đích. Nếu sau 30 ngày vẫn thất bại? Chúng tôi xin lỗi & <strong>Transfer hoàn tiền gốc 100%</strong> vào ngay tài khoản.
            </p>
          </div>

          <div className="c2-final-cta-area mt-20 mb-24 z-20 position-relative">
            <div className="c2-urgency-luxury mx-auto mb-8 box-shadow-glow">
              <span className="live-dot"></span>
              <strong>GIỚI HẠN ALPHA V.I.P:</strong> Board sẽ khóa Slot ngay khi đủ sức chứa. Value sẽ TĂNG ở Ver kế!
            </div>
            <button 
              className="c2-btn-elite btn-massive mx-auto w-full-mobile shadow-massive-gold pulse-gold"
              onClick={() => setIsModalOpen(true)}
            >
              <Crown size={28} className="mr-3 text-yellow-100" />
              SỞ HỮU MÃ NGUỒN AGENCY NGAY
            </button>
          </div>
        </section>

      </div>

      {/* ─── PHẦN 10 & FOOTER ─── */}
      <footer className="c2-footer-luxury">
        <div className="hormozi-container text-center">
          <div className="c2-footer-upsell-glass c2-glass-panel mb-12 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-50"></div>
            <Star size={34} className="mx-auto text-amber-500 mb-6 fill-amber-300 drop-shadow-md" />
            <p className="text-xl leading-relaxed text-slate-800">
              <em>"Mảnh ghép tối thượng: Những Founder xuất sắc của Master Board sẽ được đặc cách trải nghiệm <strong>AI COACH D.M V.I.P (19.997.000₫)</strong> — Gói huấn luyện bí mật giúp bạn đóng gói bản thân thành Nhà Đào Tạo có hệ sinh thái vệ tinh!"</em>
            </p>
          </div>
          <div className="c2-footer-bottom-l">
            <div className="footer-logo c2-metallic-text font-black text-2xl tracking-widest mb-4">MASTER X</div>
            <p className="font-semibold text-slate-600 tracking-wide block">© {new Date().getFullYear()} DUHAVA JSC / THE AUTOMATION BOARD.</p>
            <p className="mt-3 text-slate-400 text-sm tracking-wider">Cơ Sở Dữ Liệu Khép Kín Trực Thuộc HUNGNPV CORPORATION.<br/><span className="mt-2 text-slate-500 font-medium inline-block flex items-center justify-center gap-2">🔒 END-TO-END ENCRYPTED | VISA / NAPAS Cổng VIP</span></p>
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

export default Course2;
