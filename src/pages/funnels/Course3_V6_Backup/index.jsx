import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Check, X, ShieldAlert, AlertTriangle, UserCheck, ChevronDown, Hand } from 'lucide-react';
import './c3-premium.css';

// --- SVG DRAWING COMPONENT ---
const DrawUnderline = ({ color = "#EF4444" }) => (
  <svg style={{ position: 'absolute', bottom: '-10px', left: 0, width: '100%', height: '20px', zIndex: -1 }} preserveAspectRatio="none" viewBox="0 0 100 20">
    <motion.path 
      d="M5 15 Q 50 0 95 15" fill="transparent" stroke={color} strokeWidth="8" strokeLinecap="round"
      initial={{ pathLength: 0, opacity: 0 }} whileInView={{ pathLength: 1, opacity: 1 }} viewport={{ once: true }}
      transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }} 
    />
  </svg>
);

const DrawCircle = ({ color = "#EF4444" }) => (
  <svg style={{ position: 'absolute', top: '-10%', left: '-5%', width: '110%', height: '130%', zIndex: -1, pointerEvents: 'none' }} preserveAspectRatio="none" viewBox="0 0 100 100">
    <motion.ellipse 
      cx="50" cy="50" rx="45" ry="40" fill="transparent" stroke={color} strokeWidth="4" strokeLinecap="round"
      initial={{ pathLength: 0, opacity: 0 }} whileInView={{ pathLength: 1, opacity: 1 }} viewport={{ once: true }}
      transition={{ duration: 1, ease: "easeInOut", delay: 0.5 }} 
    />
  </svg>
);

// --- FAQ COMPONENT ---
const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="c3-faq-item" onClick={() => setIsOpen(!isOpen)}>
      <div className="c3-faq-qn">
        {question}
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }}><ChevronDown size={24} color="#000" strokeWidth={3} /></motion.div>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden' }}>
            <div className="c3-faq-ans">{answer}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const AICoachPage = () => {
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showExitIntent, setShowExitIntent] = useState(false);
  
  // V6: Countdown Logic
  const [timeLeft, setTimeLeft] = useState(15 * 60); 
  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(prev => prev > 0 ? prev - 1 : 0), 1000);
    return () => clearInterval(timer);
  }, []);
  const m = Math.floor(timeLeft / 60);
  const s = timeLeft % 60;
  const timeString = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;

  // V6: Continuous Social Proof Toasts
  const [toastData, setToastData] = useState(null);
  const fakeNames = ["Phạm Nhật V***", "Lê Hoàng T***", "Đoàn Trần B***", "Nguyễn Văn K***", "Trịnh S***"];
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setToastData({ name: fakeNames[index % fakeNames.length], time: Math.floor(Math.random() * 5) + 1 });
      index++;
      setTimeout(() => setToastData(null), 4000); // Show for 4s, hide for 2s
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // V6: Exit Intent Mouse Tracking
  useEffect(() => {
    const handleMouseOut = (e) => {
      // If mouse leaves top of the window
      if (e.clientY < 10) setShowExitIntent(true);
    };
    document.addEventListener('mouseout', handleMouseOut);
    return () => document.removeEventListener('mouseout', handleMouseOut);
  }, []);

  const revealUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };
  const scaleUp = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "backOut" } }
  };

  return (
    <div className="c3-premium-container">
      
      {/* --- V6: URGENT STICKY BAR --- */}
      <div className="c3-sticky-urgent">
        <AlertTriangle size={24} className="c3-blink" />
        <div>ƯU ĐÃI ĐÓNG LẠI TRONG VÒNG: <span style={{ fontSize: '1.5rem', background: '#000', padding: '0 10px', borderRadius: '4px', marginLeft: '10px' }}>{timeString}</span></div>
      </div>

      {/* --- TICKER MARQUEE --- */}
      <div className="c3-ticker-tape">
        <div className="c3-ticker-content" style={{ paddingLeft: '50%' }}>
          🔥 HÀNH ĐỘNG NGAY BÂY GIỜ &nbsp;&nbsp;&bull;&nbsp;&nbsp;
          GIỚI HẠN DÀNH CHO 5 NGƯỜI &nbsp;&nbsp;&bull;&nbsp;&nbsp;
          🔥 HÀNH ĐỘNG NGAY BÂY GIỜ &nbsp;&nbsp;&bull;&nbsp;&nbsp;
          GIỚI HẠN DÀNH CHO 5 NGƯỜI &nbsp;&nbsp;&bull;&nbsp;&nbsp;
          🔥 HÀNH ĐỘNG NGAY BÂY GIỜ &nbsp;&nbsp;&bull;&nbsp;&nbsp;
          GIỚI HẠN DÀNH CHO 5 NGƯỜI &nbsp;&nbsp;&bull;&nbsp;&nbsp;
          🔥 HÀNH ĐỘNG NGAY BÂY GIỜ &nbsp;&nbsp;&bull;&nbsp;&nbsp;
          GIỚI HẠN DÀNH CHO 5 NGƯỜI &nbsp;&nbsp;&bull;&nbsp;&nbsp;
        </div>
      </div>

      {/* --- SUPER HERO SECTION --- */}
      <section className="c3-content-wrapper" style={{ textAlign: 'center', paddingTop: '10px', paddingBottom: '20px' }}>
        <motion.div 
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          style={{ display: 'inline-block', backgroundColor: '#000', color: '#FDE047', padding: '10px 20px', fontWeight: 900, marginBottom: '20px', letterSpacing: '2px', textTransform: 'uppercase', border: '4px solid #FDE047', transform: 'rotate(-2deg)', boxShadow: '6px 6px 0 #EF4444' }}
        >
          MỞ CỬA DUY NHẤT LẦN NÀY TRONG NĂM
        </motion.div>
        
        <motion.h1 className="c3-title-font c3-hero-title" initial="hidden" animate="visible" variants={revealUp}>
          Sự Thật Đằng Sau Một <br/> 
          <span className="c3-highlight" style={{ position: 'relative', whiteSpace: 'nowrap' }}>
            <span>DOANH NHÂN THÔNG TIN</span>
            <DrawCircle color="#000" />
          </span> <br/>
          Có Thu Nhập <span style={{ position: 'relative', whiteSpace: 'nowrap' }}>$20,000/Tháng <DrawUnderline /></span>
        </motion.h1>
        
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} style={{ fontSize: '1.5rem', color: '#334155', maxWidth: '800px', margin: '0 auto 40px', fontWeight: 800 }}>
          Lý do vì sao sản phẩm thông tin đang là mỏ vàng, và chính xác cách bạn có thể sao chép "Cỗ Máy In Tiền" này trong 30 ngày tới.
        </motion.p>

        {/* --- V6: SCARCITY PROGRESS BAR --- */}
        <motion.div className="c3-urgency-wrapper" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 900, color: '#000', marginBottom: '10px', textTransform: 'uppercase' }}>
            <span>Đã Ghi Danh Hợp Tác</span>
            <span style={{ color: '#EF4444' }} className="c3-blink">4 / 5 VỊ TRÍ</span>
          </div>
          <div className="c3-progress-track">
            <div className="c3-progress-fill">
              <div className="c3-progress-stripes"></div>
            </div>
          </div>
          <div style={{ fontSize: '0.9rem', fontWeight: 800, marginTop: '10px', color: '#a1a1aa' }}>⚠️ CHỈ CÒN LẠI 1 SLOT DUY NHẤT. HỆ THỐNG SẼ ĐÓNG TỰ ĐỘNG.</div>
        </motion.div>

        {/* Video Placeholder */}
        <div style={{ position: 'relative', maxWidth: '800px', margin: '0 auto' }}>
          <div className="c3-blink" style={{ position: 'absolute', top: '-15px', left: '50%', transform: 'translateX(-50%)', background: '#FDE047', color: '#000', padding: '5px 15px', border: '3px solid #000', borderRadius: '4px', fontWeight: 900, zIndex: 20, boxShadow: '4px 4px 0 #EF4444' }}>
            CẢNH BÁO: BẬT LOA LÊN TRƯỚC KHI XEM
          </div>
          <motion.div className="c3-vsl-board" initial="hidden" animate="visible" variants={scaleUp} transition={{ delay: 0.2 }}>
            <div className="c3-play-btn">
              <Play size={50} fill="white" color="white" style={{ marginLeft: '8px' }} />
            </div>
          </motion.div>
        </div>

        {/* V6: Violent Shake CTA */}
        <motion.button className="c3-cta-wow c3-violent-shake" onClick={() => setShowApplyModal(true)} whileHover={{ scale: 1.05, animation: 'none' }} whileTap={{ scale: 0.95 }} style={{ marginTop: '40px', transformOrigin: 'center' }}>
          TÔI MUỐN SAO CHÉP HỆ THỐNG NÀY! <br/>
          <span style={{ fontSize: '1rem', fontWeight: 800, opacity: 0.9, textTransform: 'none' }}>(Bấm vào đây để ứng tuyển tham gia mâm VIP)</span>
        </motion.button>
      </section>

      {/* --- V6: AS SEEN ON AUTHORITY STRIP --- */}
      <section className="c3-seen-on">
        <div>FORBES</div>
        <div>BUSINESS INSIDER</div>
        <div>ENTREPRENEUR</div>
        <div>TEDx</div>
      </section>

      {/* --- THE TRUTH SECTION --- */}
      <section className="c3-content-wrapper">
        <motion.div className="c3-lead-box" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={revealUp}>
          <div className="c3-stamp">SỰ THẬT<br/>100%</div>
          <p>BÀI VIẾT NÀY SẼ TRẢ LỜI ĐÍCH ĐÁNG 3 CÂU HỎI:</p>
          <ul style={{ listStyleType: 'square', color: '#EF4444', fontSize: '1.4rem', fontWeight: 900, marginTop: '20px', lineHeight: 1.8 }}>
            <li><span style={{ color: '#000' }}>Còn cơ hội nào cho NGƯỜI MỚI không?</span></li>
            <li><span style={{ color: '#000' }}>Ai NÊN và KHÔNG NÊN làm cái này?</span></li>
            <li><span style={{ color: '#000' }}>Làm sao tung ra sản phẩm mà không "sấp mặt"?</span></li>
          </ul>
        </motion.div>

        <motion.h2 className="c3-title-font" style={{ textAlign: 'center' }} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={revealUp}>
          BÀI HỌC TỪ CON BỌ CÁNH CỨNG 🐛
        </motion.h2>
        
        <div className="c3-grid-2" style={{ margin: '40px 0' }}>
          <motion.div className="c3-hormozi-card" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={scaleUp}>
            <div className="c3-card-number">01</div>
            <h3 style={{ fontSize: '2rem', color: '#EF4444', fontWeight: 900, textTransform: 'uppercase', marginTop: 10 }}>🦬 Cậy Sức (Bọ Lớn)</h3>
            <div style={{ height: '4px', background: '#000', margin: '15px 0' }}></div>
            <p style={{ color: '#000', fontWeight: 700 }}>Ngây thơ cho đập tiền chạy ads hùng hục, bán rẻ phá giá, xây hệ thống rối nùi phức tạp. Sức kéo trâu nhưng thực chất luôn kiệt quệ mệt mỏi.</p>
          </motion.div>
          <motion.div className="c3-hormozi-card" style={{ background: '#FDE047' }} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={scaleUp} transition={{ delay: 0.2 }}>
            <div className="c3-card-number" style={{ textShadow: '4px 4px 0 #fff', borderColor: '#000' }}>02</div>
            <h3 style={{ fontSize: '2rem', color: '#000', fontWeight: 900, textTransform: 'uppercase', marginTop: 10 }}>🐜 Thông thái (Bọ Nhỏ)</h3>
            <div style={{ height: '4px', background: '#000', margin: '15px 0' }}></div>
            <p style={{ color: '#000', fontWeight: 800 }}>Chỉ việc lẻn gặm kết quả. Bán sản phẩm tri thức không tốn giá vốn hàng bán, một vốn bốn mươi lời. Đẳng cấp nằm ở sự tinh anh não bộ.</p>
          </motion.div>
        </div>
        
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={revealUp}
          style={{ textAlign: 'center', background: '#000', color: '#fff', border: '6px solid #EF4444', padding: '30px', borderRadius: '16px', fontWeight: 900, fontSize: '1.6rem', textTransform: 'uppercase', transform: 'rotate(-1deg)', boxShadow: '15px 15px 0 #FDE047', marginTop: '60px' }}
        >
          "CHIẾN LƯỢC LUÔN ĐÁNH BẠI LỢI THẾ. <br/> KHÔNG CÓ NHIỀU TIỀN, HÃY DÙNG SỰ LINH HOẠT."
        </motion.div>
      </section>

      {/* --- BUSINESS MATH --- */}
      <section className="c3-content-wrapper">
        <motion.h2 className="c3-title-font" style={{ textAlign: 'center' }} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={revealUp}>TỈNH THỨC VỚI TOÁN HỌC</motion.h2>
        <motion.div className="c3-table-holder" style={{ margin: '40px 0' }} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={revealUp}>
          <table>
            <thead><tr><th>Chiến lược</th><th>Số Khách</th><th>Giá Mỗi Đơn</th><th>Tổng Thu Nhập</th></tr></thead>
            <tbody>
              <tr><td>Mù quáng</td><td>100,000</td><td>$10</td><td>$1,000,000</td></tr>
              <tr><td>Khó khăn</td><td>10,000</td><td>$100</td><td>$1,000,000</td></tr>
              <tr><td>Khả thi</td><td>1,000</td><td>$1,000</td><td>$1,000,000</td></tr>
              <tr style={{ background: '#FDE047' }}>
                <td><strong style={{ fontSize: '1.5rem',textTransform: 'uppercase' }}>HIGH TICKET</strong></td>
                <td><strong>100 người</strong></td>
                <td style={{ color: '#EF4444', fontSize: '1.8rem' }}><strong>$10,000</strong></td>
                <td style={{ color: '#EF4444', fontSize: '1.8rem' }}><strong>$1,000,000</strong></td>
              </tr>
            </tbody>
          </table>
        </motion.div>
      </section>

      {/* --- 3 CORE STRATEGIES --- */}
      <section className="c3-content-wrapper">
        <h2 className="c3-title-font" style={{ textAlign: 'center' }}>HỆ THỐNG 3 CHIẾN LƯỢC SÁT THỦ 🔪</h2>
        <div className="c3-grid-3">
          <motion.div className="c3-hormozi-card" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={scaleUp}>
            <h3 style={{ fontSize: '2rem', color: '#000', fontWeight: 900, whiteSpace: 'nowrap' }}>[ FREE ]</h3>
            <h4 style={{ fontSize: '1.5rem', color: '#EF4444', fontWeight: 900, textTransform: 'uppercase' }}>Sản phẩm WOW</h4>
            <div style={{ height: '4px', background: '#000', margin: '15px 0' }}></div>
            <p style={{ color: '#000', fontWeight: 700 }}>Tặng đồ giá trị cao, miễn phí hoàn toàn. Phá nát hàng rào cản phòng vệ tâm lý.</p>
          </motion.div>
          <motion.div className="c3-hormozi-card" style={{ background: '#FDE047' }} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={scaleUp} transition={{ delay: 0.15 }}>
            <h3 style={{ fontSize: '2rem', color: '#000', fontWeight: 900, whiteSpace: 'nowrap' }}>[ CHEAP ]</h3>
            <h4 style={{ fontSize: '1.5rem', color: '#000', fontWeight: 900, textTransform: 'uppercase' }}>Kết quả tức thì</h4>
            <div style={{ height: '4px', background: '#000', margin: '15px 0' }}></div>
            <p style={{ color: '#000', fontWeight: 800 }}>Sản phẩm mồi $50. Không để kiếm tiền mà dùng để phá lớp băng Rút Tiền Vi Hành lần đầu.</p>
          </motion.div>
          <motion.div className="c3-hormozi-card" style={{ background: '#000' }} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={scaleUp} transition={{ delay: 0.3 }}>
            <h3 style={{ fontSize: '2rem', color: '#FDE047', fontWeight: 900, whiteSpace: 'nowrap' }}>[ CORE ]</h3>
            <h4 style={{ fontSize: '1.5rem', color: '#fff', fontWeight: 900, textTransform: 'uppercase' }}>Trọng Tâm</h4>
            <div style={{ height: '4px', background: '#fff', margin: '15px 0' }}></div>
            <p style={{ color: '#fff', fontWeight: 700 }}>Bán Offer hàng chục ngàn đô chỉ cho nhóm 100 người khát máu nhất. Lợi nhuận nằm toàn bộ ở đây.</p>
          </motion.div>
        </div>
      </section>

      {/* --- GRAND SLAM OFFER --- */}
      <section className="c3-content-wrapper" style={{ paddingBottom: '40px' }}>
        <motion.div className="c3-value-stack" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={revealUp}>
          <div className="c3-stamp" style={{ top: '20px', left: '-50px', background: 'none', backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='%23FDE047' d='M88.7,-98.6C108.5,-80.7,113.8,-40.3,114.3,0.5C114.7,41.2,110.3,82.4,90.5,100.3C70.6,118.1,35.3,112.5,0.2,112.3C-34.9,112.1,-69.8,117.2,-89.6,99.4C-109.5,81.5,-114.2,40.8,-113.8,0.4C-113.4,-40.1,-107.8,-80.2,-88,-98.1C-68.2,-116,-34.1,-111.7,2.9,-114.6C39.9,-117.5,79.8,-112.3,88.7,-98.6Z' transform='translate(100 100)'/%3E%3C/svg%3E\")", color: '#000', border: 'none', boxShadow: 'none' }}>
            DUY NHẤT<br/>HÔM NAY
          </div>

          <h2 className="c3-title-font" style={{ textAlign: 'center', color: '#000' }}>THE GRAND SLAM OFFER</h2>
          <p style={{ textAlign: 'center', color: '#1e293b', fontSize: '1.5rem', fontWeight: 900 }}>HỆ THỐNG DOANH NHÂN THÔNG TIN "CHÌA KHÓA TRAO TAY"</p>
          
          <div style={{ marginTop: '50px', background: '#fff', padding: '40px', border: '4px solid #000', borderRadius: '16px', boxShadow: '10px 10px 0 #EF4444' }}>
            {[
               { name: "Bản vẽ Hệ Thống Doanh Nhân Thông Tin 20K USD/tháng", price: '50,000,000₫' },
               { name: "Chuyển giao kịch bản Phễu 3 tầng Tự Động (Kéo thả)", price: '20,000,000₫' },
               { name: "Coach 1:1 đồng hành + Mentor sát cánh (30-90 ngày)", price: '30,000,000₫' },
               { name: "Biệt đội AI Agents CSKH và Clone nội dung tự động", price: '10,000,000₫' },
               { name: "Template Grand Slam Offer + Kịch bản Telesale High-Ticket", price: '5,000,000₫' },
               { name: "Membership HỘI KÍN: Doanh Nhân Thông Tin Trọn Đời", price: 'VÔ GIÁ' }
            ].map((i, k) => (
              <motion.div className="c3-vs-item" key={k} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: k * 0.1 }} viewport={{ once: true }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{ background: '#10B981', borderRadius: '50%', padding: '5px', border: '3px solid #000' }}>
                    <Check size={24} color="#fff" strokeWidth={4} />
                  </div>
                  <span className="c3-vs-text">{i.name}</span>
                </div>
                <div className="c3-vs-price">{i.price}</div>
              </motion.div>
            ))}
          </div>

          <div className="c3-total-box">
            <h3 style={{ margin: 0, textTransform: 'uppercase', fontWeight: 900, fontSize: '2rem' }}>TỔNG GIÁ TRỊ THỰC TẾ:</h3>
            <div className="c3-final-price c3-strike">115,000,000₫</div>
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <h3 style={{ marginTop: '30px', textTransform: 'uppercase', fontWeight: 900, fontSize: '1.5rem', background: '#000', color: '#fff', padding: '10px 20px', transform: 'rotate(2deg)' }}>MỨC ĐẦU TƯ CỦA BẠN HÔM NAY:</h3>
              <DrawCircle color="#FDE047" />
            </div>
            <div className="c3-final-price" style={{ color: '#EF4444', textShadow: '6px 6px 0 #000' }}>19,997,000₫</div>
          </div>

          <motion.button className="c3-cta-wow c3-violent-shake" onClick={() => setShowApplyModal(true)} style={{ marginTop: '60px' }} whileHover={{ scale: 1.05, animation: 'none' }} whileTap={{ scale: 0.95 }}>
            ĐIỀN ĐƠN ỨNG TUYỂN NGAY BÂY GIỜ!
          </motion.button>
        </motion.div>
      </section>

      {/* --- V6: FAQ SECTION --- */}
      <section className="c3-content-wrapper" style={{ paddingTop: '20px' }}>
        <h2 className="c3-title-font" style={{ textAlign: 'center', fontSize: '3rem', marginBottom: '40px' }}>HỎI ĐÁP PHŨ PHÀNG</h2>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <FAQItem question="TIỀN KHÔNG CÓ NHIỀU CÓ CHƠI ĐƯỢC KHÔNG?" answer="Không. Khuyên thật lòng là không. Bạn nên đi tìm các khóa học $20 ngoài kia, học cho vui. Hệ thống này cần máu mặt, sự tập trung và một lượng tiền nhàn rỗi tối thiểu để không bị chết ngộp cảm xúc khi chạy." />
          <FAQItem question="LỘ TRÌNH 30 NGÀY HOẠT ĐỘNG THẾ NÀO?" answer="10 ngày Đóng Gói Tư Duy. 10 Ngày Xây Phễu Và Setup Hệ thống Thanh Toán. 10 Ngày Đẩy Trái Bom Truyền Thông và Tuyển Dụng Khách Hàng. Nếu bạn làm ỳ ạch thì kéo ra 90 ngày. Thời gian nằm trong tay bạn." />
          <FAQItem question="NẾU THẤT BẠI THÌ MẤT GÌ?" answer="Mất tiền mua gói này, và mất đi một cơ hội lớn nhất trong giới Info-Business. Cơ hội thứ 2 không đến từ tôi, mà đến từ người khác với mức giá có lẽ cao gấp 3 lần mức hôm nay. Hãy lựa chọn." />
        </div>
      </section>

      {/* --- FOOTER UPSELL --- */}
      <footer style={{ background: '#000', padding: '60px 40px', textAlign: 'center', borderTop: '8px solid #FDE047' }}>
        <p style={{ fontWeight: 900, fontSize: '2rem', textTransform: 'uppercase', color: '#FDE047', margin: 0 }}>TẦNG TỐI THƯỢNG: AI PARTNER</p>
        <p style={{ color: '#fff', fontSize: '1.2rem', maxWidth: '800px', margin: '20px auto', fontWeight: 700 }}>
          "Những người xuất sắc nhất sẽ được mời hợp tác mâm chung AI PARTNER, nơi Founder và bạn cưa ngang rào cản tài chính."
        </p>
      </footer>

      {/* --- APPLY MODAL --- */}
      <AnimatePresence>
        {showApplyModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(255,255,255,0.95)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', backdropFilter: 'blur(5px)' }}>
            <motion.div initial={{ scale: 0.95, y: 50, rotate: -2 }} animate={{ scale: 1, y: 0, rotate: 0 }} exit={{ scale: 0.95, y: 50, rotate: 2 }} style={{ background: '#fff', border: '8px solid #000', borderRadius: '16px', padding: '50px', maxWidth: '600px', width: '100%', position: 'relative', boxShadow: '20px 20px 0 #EF4444' }}>
              <button onClick={() => setShowApplyModal(false)} style={{ position: 'absolute', top: '-20px', right: '-20px', background: '#000', color: '#fff', border: '4px solid #FDE047', borderRadius: '50%', width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10 }}>
                <X size={30} strokeWidth={4} />
              </button>
              <h2 className="c3-title-font" style={{ margin: '0 0 10px', color: '#000', fontSize: '3rem', textTransform: 'uppercase' }}>BƯỚC 1: XÁC MINH</h2>
              <p style={{ color: '#EF4444', fontWeight: 900, marginBottom: '30px', fontSize: '1.2rem' }}>Hệ thống này lập tức tự Block các thông tin rác.</p>
              
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontWeight: 900, color: '#000', marginBottom: '10px' }}>HỌ VÀ TÊN *</label>
                <input type="text" className="c3-form-input" placeholder="VD: Nguyễn Văn A..." required />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontWeight: 900, color: '#000', marginBottom: '10px' }}>SĐT LIÊN HỆ *</label>
                <input type="tel" className="c3-form-input" placeholder="09xxxx..." required />
              </div>
              <motion.button className="c3-cta-wow" style={{ fontSize: '1.5rem', padding: '25px', boxShadow: '8px 8px 0 #000' }} onClick={() => setShowApplyModal(false)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                [ GỬI HỒ SƠ ỨNG TUYỂN ]
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- V6: EXIT INTENT POPUP --- */}
      <AnimatePresence>
        {showExitIntent && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.98)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <motion.div initial={{ scale: 1.2 }} animate={{ scale: 1 }} style={{ background: '#FDE047', border: '8px solid #EF4444', borderRadius: '16px', padding: '50px', maxWidth: '800px', width: '100%', textAlign: 'center', boxShadow: '0 0 50px rgba(239,68,68,0.5)' }}>
              <AlertTriangle size={80} color="#EF4444" style={{ margin: '0 auto 20px' }} className="c3-blink" />
              <h1 className="c3-title-font" style={{ fontSize: '4rem', color: '#000', lineHeight: 1, marginBottom: '20px' }}>KHOAN ĐÃ!</h1>
              <h2 style={{ fontSize: '2rem', color: '#000', fontWeight: 900, textTransform: 'uppercase', marginBottom: '30px' }}>TRƯỚC KHI BẠN RỜI ĐI VÀ LỠ MẤT CƠ HỘI NÀY...</h2>
              <p style={{ fontSize: '1.5rem', color: '#000', fontWeight: 700, marginBottom: '40px' }}>
                Nếu bạn rời đi lúc này, thuật toán sẽ nhường ghế của bạn cho người xếp hàng phía sau và bạn có thể sẽ không bao giờ nhìn thấy trang web này với mức giá cực hời này nữa.
              </p>
              <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
                <button className="c3-cta-wow" style={{ background: '#EF4444', color: '#fff', border: '4px solid #000', boxShadow: '6px 6px 0 #000' }} onClick={() => setShowExitIntent(false)}>
                  QUAY LẠI ỨNG TUYỂN!
                </button>
              </div>
              <button onClick={() => setShowExitIntent(false)} style={{ display: 'inline-block', marginTop: '30px', background: 'none', border: 'none', color: '#666', fontWeight: 800, textDecoration: 'underline', cursor: 'pointer' }}>
                Không, tôi từ chối cơ hội đổi đời này. Đóng trang.
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- V6: SOCIAL PROOF TOAST (LOOPING) --- */}
      <AnimatePresence>
        {toastData && (
          <motion.div
            initial={{ opacity: 0, x: -100, y: 20 }} animate={{ opacity: 1, x: 0, y: 0 }} exit={{ opacity: 0, y: 50 }}
            className="c3-toast"
          >
            <div className="c3-toast-icon"><UserCheck size={20} strokeWidth={3} /></div>
            <div>
              <div style={{ fontWeight: 900, fontSize: '1.1rem', color: '#000' }}>{toastData.name}</div>
              <div style={{ fontWeight: 600, color: '#10B981', fontSize: '0.9rem' }}>Vừa đăng ký thành công $10K Offer</div>
              <div style={{ fontSize: '0.8rem', color: '#a1a1aa', fontWeight: 700 }}>{toastData.time} phút trước</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default AICoachPage;
