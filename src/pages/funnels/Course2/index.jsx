import React, { useEffect, useState } from 'react';
import './c2-style.css';
import { useFunnelTracking } from '../utils';
import LeadModal from '../components/LeadModal';
import { FUNNEL_COURSES } from '../config';
import { 
  CheckCircle2, XCircle, ArrowRight, ArrowDown, 
  ShieldCheck, MonitorPlay, Calendar, Zap, Star,
  Briefcase, BarChart, Settings
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
      {/* ─── STICKY EYEBROW BANNER ─── */}
      <div className="c2-banner">
        <div className="hormozi-container">
          <p>🚀 <strong>CHO NHỮNG AI ĐÃ BIẾT KIẾM TIỀN TỪ AI</strong> — VÀ MUỐN SCALE LÊN CẤP ĐỘ DOANH NGHIỆP B2B</p>
        </div>
      </div>

      <div className="hormozi-container">

        {/* ─── PHẦN 1: HERO (THE BIG PROMISE) ─── */}
        <section className="c2-hero-section">
          <div className="c2-hero-glow"></div>
          <h1 className="c2-main-headline text-center">
            Lộ Trình Xây Dựng <span className="c2-text-gold">AI Agency:</span><br />
            Làm Chủ Automation, Ads & Hệ Thống Phục Vụ Doanh Nghiệp
          </h1>
          
          <p className="c2-sub-headline text-center mb-10">
            Bạn đã biết kiếm tiền từ AI 5-15 triệu/tháng. Giờ hãy SCALE lên <strong>50-100 triệu/tháng</strong> bằng cách xây dựng hệ thống Agency AI phục vụ doanh nghiệp — có quy trình, có đội ngũ AI, có khách ổn định.
          </p>

          <button 
            className="c2-btn-gold pulse-gold mx-auto w-full-mobile"
            onClick={() => setIsModalOpen(true)}
          >
            <Zap size={24} className="mr-2" />
            ĐĂNG KÝ MASTER LỘ TRÌNH NGAY — {COURSE_INFO.price.toLocaleString('vi-VN')}₫
          </button>
        </section>

        {/* ─── PHẦN 2: "THE PROBLEM" ─── */}
        <section className="c2-problem-section mt-16 text-center">
          <div className="c2-problem-box">
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
              <ArrowDown size={36} className="text-navy opacity-50 mx-auto" />
            </div>
            <div className="c2-problem-conclusion highlight-card">
              <strong>→ KHÓA MASTER sẽ biến bạn từ Freelancer đơn lẻ thành CHỦ AGENCY có hệ thống.</strong>
            </div>
          </div>
        </section>

        {/* ─── PHẦN 3: "THE SOLUTION" ─── */}
        <section className="c2-solution-section mt-20 text-center">
          <h2 className="c2-section-title">BẠN SẼ XÂY DỰNG 3 TRỤ CỘT CỦA MỘT AI AGENCY</h2>
          
          <div className="c2-pillars-grid mt-10">
            <div className="c2-pillar-card">
              <div className="pillar-icon"><Settings size={36} /></div>
              <h3>🤖 AI Automation</h3>
              <p className="pillar-role"><strong>Hệ thống n8n + AI Agents</strong> phục vụ khách hàng.</p>
              <div className="pillar-result">Pipeline tự vận hành 24/7, phục vụ 5-20 khách cùng lúc.</div>
            </div>
            <div className="c2-pillar-card">
              <div className="pillar-icon"><BarChart size={36} /></div>
              <h3>📣 Ads & Traffic</h3>
              <p className="pillar-role"><strong>Facebook Ads + TikTok Ads</strong> chuyên B2B.</p>
              <div className="pillar-result">Máy hút khách doanh nghiệp chạy hoàn toàn tự động.</div>
            </div>
            <div className="c2-pillar-card">
              <div className="pillar-icon"><Briefcase size={36} /></div>
              <h3>🏗️ Agency System</h3>
              <p className="pillar-role"><strong>Quy trình vận hành</strong>, định giá, chốt deal B2B.</p>
              <div className="pillar-result">Agency hoàn chỉnh: Từ tìm khách → deliver → thu tiền.</div>
            </div>
          </div>
        </section>

        {/* ─── PHẦN 4: LỘ TRÌNH 4 TUẦN (THE VEHICLE) ─── */}
        <section className="c2-timeline-section mt-24">
          <h2 className="c2-section-title text-center mb-12">LỘ TRÌNH 4 TUẦN BUILD AGENCY</h2>
          <div className="c2-timeline-wrapper">
            
            <div className="c2-module-card">
              <div className="module-week"><span>TUẦN 1</span></div>
              <div className="module-content">
                <h3 className="module-title">Nền Tảng Automation Chuyên Sâu</h3>
                <ul className="module-list">
                  <li><CheckCircle2 size={18} className="text-navy icon-check flex-shrink-0" /> Master n8n: Từ cơ bản đến nâng cao.</li>
                  <li><CheckCircle2 size={18} className="text-navy icon-check flex-shrink-0" /> Xây hệ thống AI Agents tự suy luận (CSKH, chốt sale).</li>
                  <li><CheckCircle2 size={18} className="text-navy icon-check flex-shrink-0" /> Build pipeline: Ý tưởng → Sản xuất → Phân phối → Chốt sale.</li>
                </ul>
                <div className="module-output"><strong>ĐẦU RA:</strong> Bộ 10+ workflow automation sẵn sàng deploy cho khách.</div>
              </div>
            </div>

            <div className="c2-module-card">
              <div className="module-week"><span>TUẦN 2</span></div>
              <div className="module-content">
                <h3 className="module-title">Làm Chủ Ads & Traffic</h3>
                <ul className="module-list">
                  <li><CheckCircle2 size={18} className="text-navy icon-check flex-shrink-0" /> Facebook Ads cho B2B: Targeting doanh nghiệp, CEO, founders.</li>
                  <li><CheckCircle2 size={18} className="text-navy icon-check flex-shrink-0" /> TikTok Ads: Case study 100K-200K followers/tháng.</li>
                  <li><CheckCircle2 size={18} className="text-navy icon-check flex-shrink-0" /> Chiến lược content marketing thu hút khách B2B.</li>
                </ul>
                <div className="module-output"><strong>ĐẦU RA:</strong> 3 chiến dịch Ads đang chạy + Content calendar 30 ngày.</div>
              </div>
            </div>

            <div className="c2-module-card">
              <div className="module-week"><span>TUẦN 3</span></div>
              <div className="module-content">
                <h3 className="module-title">Xây Hệ Thống Agency</h3>
                <ul className="module-list">
                  <li><CheckCircle2 size={18} className="text-navy icon-check flex-shrink-0" /> Đóng gói dịch vụ AI cho doanh nghiệp (Basic-Pro-Enterprise).</li>
                  <li><CheckCircle2 size={18} className="text-navy icon-check flex-shrink-0" /> Quy trình onboard khách hàng + delivery workflow.</li>
                  <li><CheckCircle2 size={18} className="text-navy icon-check flex-shrink-0" /> Template hợp đồng, báo giá, proposal chuyên nghiệp.</li>
                </ul>
                <div className="module-output"><strong>ĐẦU RA:</strong> Bộ tài liệu Agency hoàn chỉnh sẵn sàng mang đi bán.</div>
              </div>
            </div>

            <div className="c2-module-card highlight-module">
              <div className="module-week"><span>TUẦN 4</span></div>
              <div className="module-content">
                <h3 className="module-title text-navy">Tối Ưu & Scale (Mở rộng)</h3>
                <ul className="module-list">
                  <li><CheckCircle2 size={18} className="text-navy icon-check flex-shrink-0" /> Tối ưu pipeline: Media AI 24/7 (Content, Hình ảnh, Video).</li>
                  <li><CheckCircle2 size={18} className="text-navy icon-check flex-shrink-0" /> Thiết kế thị giác bằng thuật toán — A/B test trăm mẫu ads/ngày.</li>
                  <li><CheckCircle2 size={18} className="text-navy icon-check flex-shrink-0" /> Sản xuất video thương mại chất lượng studio bằng AI.</li>
                </ul>
                <div className="module-output text-navy gold-glass"><strong>ĐẦU RA:</strong> Cỗ máy Agency tự vận hành, sẵn sàng scale lên 10+ khách.</div>
              </div>
            </div>

          </div>
        </section>

        {/* ─── PHẦN 5: "SOCIAL PROOF" ─── */}
        <section className="c2-expert-section mt-24">
          <div className="c2-expert-glass">
            <div className="expert-image">
              <img src="https://images.unsplash.com/photo-1556761175-5973dc0f32d7?auto=format&fit=crop&q=80&w=400" alt="Mr. Hưng NPV" />
              <div className="c2-badge">CHUYÊN GIA B2B</div>
            </div>
            <div className="expert-info">
              <h2>Mr. Nguyễn Phước Vĩnh Hưng (Hưng NPV)</h2>
              <p className="expert-title">Founder & CEO — Duhava Technology JSC</p>
              <ul className="expert-stats">
                <li><CheckCircle2 size={18} className="text-navy icon-check mr-3 flex-shrink-0" /> Huấn luyện in-house: <strong>BIDV, Vinhomes, Droppii, Mitsubishi...</strong></li>
                <li><CheckCircle2 size={18} className="text-navy icon-check mr-3 flex-shrink-0" /> <strong>500,000+ followers</strong> TikTok & Quản trị Group 200,000+</li>
                <li><CheckCircle2 size={18} className="text-navy icon-check mr-3 flex-shrink-0" /> <strong>10+ năm</strong> tư vấn doanh nghiệp & kinh doanh online</li>
              </ul>
              <div className="expert-quote">
                "Mô hình AI Agency chính là cỗ máy in tiền mà tôi đang vận hành. Trong chương trình này, tôi chuyển giao <strong>CHÍNH XÁC</strong> hệ thống đó cho bạn — 100% không giấu nghề."
              </div>
            </div>
          </div>
        </section>

        {/* ─── PHẦN 6: "THE GRAND SLAM OFFER" ─── */}
        <section className="c2-offer-section mt-24">
          <h2 className="c2-section-title text-center mb-10">BẠN SẼ NHẬN ĐƯỢC GÌ HÔM NAY?</h2>
          
          <div className="c2-offer-board">
            <ul className="c2-value-list">
              <li>
                <span>🎓 4 Tuần Đào Tạo LIVE Chuyên Sâu (32 Giờ)</span>
                <span className="value">15.000.000₫</span>
              </li>
              <li>
                <span>🤖 20+ AI Workflow Automation (Copy-paste deploy)</span>
                <span className="value">20.000.000₫</span>
              </li>
              <li>
                <span>📣 Template Chiến Dịch Ads B2B (Facebook + TikTok)</span>
                <span className="value">5.000.000₫</span>
              </li>
              <li>
                <span>📋 Bộ Tài Liệu Agency: Hợp đồng, Proposal, Báo giá</span>
                <span className="value">3.000.000₫</span>
              </li>
              <li>
                <span>📚 Thư Viện 4.000+ Prompt Chuyên Sâu B2B</span>
                <span className="value">2.000.000₫</span>
              </li>
              <li>
                <span>🎥 Bản Ghi Hình Khóa Học Phân Giải Cao 4K</span>
                <span className="value">1.000.000₫</span>
              </li>
              <li>
                <span>🔓 Tài Khoản Hệ Thống Workflow PRO (1 Năm)</span>
                <span className="value">1.490.000₫</span>
              </li>
              <li className="c2-offer-bonus">
                <span>🎁 SUPER BONUS: Cộng Đồng AI Agency Mastermind</span>
                <span className="value text-gold">VÔ GIÁ</span>
              </li>
            </ul>
            <div className="c2-offer-total">
              <div className="total-label">TỔNG GIÁ TRỊ TÀI SẢN:</div>
              <div className="total-price strike font-bold text-3xl">&gt; 47.490.000₫</div>
            </div>
          </div>
        </section>

        {/* ─── PHẦN 7 + 8 + 9: PRICE REVEAL, RISK REVERSAL & CTA ─── */}
        <section className="c2-close-section mt-20 text-center">
          <div className="c2-price-reveal">
            <div className="c2-price-context mb-8">
              <p>Nếu bạn tự build Agency từ đầu → <strong>6-12 tháng</strong> + <strong>20-50 triệu</strong> thử sai.</p>
              <p className="mt-2">Nếu thuê consultant setup Agency → Mất <strong>30-50 triệu</strong> cho vài buổi tư vấn.</p>
            </div>
            
            <p className="text-xl font-bold tracking-wide uppercase mt-8 text-navy">Hôm Nay, Toàn Bộ Hệ Thống MASTER:</p>
            
            <div className="c2-final-price-container">
              <span className="c2-price-pointer">👉 MỨC ĐẦU TƯ:</span>
              <h1 className="c2-final-price text-navy">{COURSE_INFO.price.toLocaleString('vi-VN')}₫</h1>
            </div>
            <p className="c2-price-subtext italic mt-4">
              (Rẻ hơn 1 tháng tiền thuê văn phòng — nhưng bạn mang về 1 AGENCY Thực Thụ)
            </p>
          </div>

          <div className="c2-risk-reversal mx-auto mt-14">
            <ShieldCheck size={56} className="mx-auto text-green-600 mb-6" />
            <h3 className="text-2xl font-bold mb-4 text-green-700">🛡️ CAM KẾT VÀNG: KHÔNG BUILD ĐƯỢC AGENCY = HOÀN TIỀN</h3>
            <p className="text-lg leading-relaxed px-4">
              Nếu sau 4 tuần học thực chiến mà bạn chưa setup xong 1 hệ thống Agency AI hoạt động trơn tru... 
              hãy liên hệ với trợ lý. Bạn sẽ được <strong>hỗ trợ 1:1</strong> cho tới khi ra kết quả, hoặc <strong>hoàn tiền 100%</strong> không lằng nhằng.
            </p>
          </div>

          <div className="c2-final-cta-area mt-16 mb-20">
            <div className="c2-urgency-bar mx-auto mb-6">
              ⚠️ <strong>CẢNH BÁO:</strong> Giới hạn suất học. Giá sẽ TĂNG ở đợt tuyển sinh tiếp theo!
            </div>
            <button 
              className="c2-btn-gold btn-massive pulse-gold mx-auto w-full-mobile mt-4"
              onClick={() => setIsModalOpen(true)}
            >
              <Zap size={24} className="mr-3" />
              THAM GIA AI AGENCY MASTER BÂY GIỜ
            </button>
          </div>
        </section>

      </div>

      {/* ─── PHẦN 10 & FOOTER ─── */}
      <footer className="c2-footer">
        <div className="hormozi-container text-center">
          <div className="c2-footer-upsell mb-10">
            <Star size={28} className="mx-auto text-gold mb-4 fill-current" />
            <p className="text-lg leading-relaxed">
              <em>"Những Agency Owner xuất sắc nhất sau khoá học sẽ được mời trực tiếp tham gia chương trình đặc quyền <strong>AI COACH / AI TRAINER (19.997.000₫)</strong> — nơi bạn được hướng dẫn cách NHÂN BẢN chính mình thành người đào tạo và kiếm tiền thụ động từ thị trường B2B."</em>
            </p>
          </div>
          <div className="c2-footer-bottom">
            <p className="font-bold">© {new Date().getFullYear()} DUHAVA JSC / MASTER SYSTEMS.</p>
            <p className="mt-2 text-sm">Tất cả bản quyền hệ thống thuộc về HUNGNPV AI.VIBE.CODE.<br/><span className="mt-1 inline-block text-navy">🔒 Bảo mật SSL | Hỗ trợ VNPay & Credit Card</span></p>
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
