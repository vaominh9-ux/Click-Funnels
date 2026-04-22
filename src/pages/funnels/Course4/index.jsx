import React, { useState, useEffect } from 'react';
import { Shield, CheckCircle, ChevronRight, Lock, Award, Star, Send, HelpCircle, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LeadModal from '../components/LeadModal';
import { useFunnelTracking } from '../utils';
import { FUNNEL_COURSES } from '../config';
import './Course4.css';

export default function Course4() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Lưu ref/campaign/link từ URL vào localStorage để tracking Lead
  useFunnelTracking();

  useEffect(() => {
    window.scrollTo(0, 0);

    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.10
    };

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('c4-revealed');
          }, 50);
          obs.unobserve(entry.target);
        }
      });
    }, observerOptions);

    setTimeout(() => {
      const revealElements = document.querySelectorAll('.c4-section-gap, .c4-box, .c4-matrix-box, .c4-price-box, .c4-expert-img-wrapper, .c4-faq-item');
      revealElements.forEach(el => {
        el.classList.add('c4-reveal');
        observer.observe(el);
      });
    }, 100);

    return () => observer.disconnect();
  }, []);

  const cargoBoxItems = [
    { num: 1, title: '21 Nội Dung Chuyển Hóa', desc: 'Cách tạo content hấp dẫn, biến lượt xem thành doanh số', val: '9.997.000₫' },
    { num: 2, title: 'Nội Dung Vô Hạn Với AI', desc: 'Tận dụng AI để sản xuất content, quảng cáo, email, sales page', val: '9.997.000₫' },
    { num: 3, title: 'Xử Lý Hình Ảnh/Video A-Z', desc: 'Cài đặt OBS, StreamYard, góc máy, ánh sáng, nội dung', val: '6.997.000₫' },
    { num: 4, title: 'Làm Chủ Nguồn Lưu Lượng', desc: 'Facebook, TikTok, YouTube + điều hướng đánh giá', val: '6.997.000₫' },
    { num: 5, title: 'Phễu Quảng Cáo Facebook', desc: 'Tối ưu chiến dịch, xây phễu bán hàng trên Facebook', val: '6.997.000₫' },
    { num: 6, title: 'Xây Kênh & Quảng Cáo TikTok', desc: 'Case study 100K-200K followers/tháng, tối ưu thuật toán', val: '6.997.000₫' },
    { num: 7, title: 'Xây Dựng Phễu Bán Hàng', desc: 'Nhận diện nhu cầu → thu hút → chuyển đổi → chốt sale', val: '9.997.000₫' },
    { num: 8, title: 'Hệ Thống 132 Chiến Lược AI', desc: 'Chiến lược sản phẩm, giá, phân phối, marketing, quản trị, tài chính', val: '9.997.000₫' },
    { num: 9, title: '13 Bước Thoát Khỏi Bẫy Chuột', desc: 'Lộ trình đạt tự do tài chính + sống cuộc đời bạn muốn', val: '9.997.000₫' },
  ];

  const trainingRow1 = [
    "492552662_1227646702697936_3497594438060120710_n.jpg", "493403185_1229353382527268_2461051840988853049_n.jpg", "494493850_1236937181768888_7955328787891523460_n.jpg", "495579659_1237849975010942_1410451617846822921_n.jpg",
    "500267562_1250021547127118_3381600826981230739_n.jpg", "502399565_1258234002972539_5011806199028027196_n.jpg", "502468195_1258234086305864_6319487566870465950_n.jpg", "502534919_1258234046305868_7051752070850070240_n.jpg",
    "502662259_1258233982972541_2629059003435512234_n.jpg", "504915411_1266604662135473_3021813081456368847_n.jpg", "505372414_1266604608802145_6758692710621360626_n.jpg", "505485684_1266604732135466_5772722660527981384_n.jpg",
    "505599578_1269138205215452_9204714722928188122_n.jpg", "506506387_1269139011882038_5375807849332097190_n.jpg", "515309622_1287195016743104_1653839118932784470_n.jpg", "518005966_1293145389481400_7369074205193044887_n.jpg"
  ];

  const trainingRow2 = [
    "518276714_1295058152623457_2067073073989813957_n.jpg", "547519156_1351201850342420_2777957991506969149_n.jpg", "547989294_1355000663295872_8275444384891716753_n.jpg", "548230908_1351191013676837_460401791316159492_n.jpg",
    "548275877_1351191007010171_4449515615118036794_n.jpg", "549633211_1351201853675753_6964300288763343404_n.jpg", "549882936_1355000726629199_859242227222710449_n.jpg", "550724295_1355000716629200_5577827516566997616_n.jpg",
    "602988161_1436598285136109_3221736557485605248_n.jpg", "629220699_1475745831221354_8981191475029877965_n.jpg", "630230764_1475730884556182_6424476613284771060_n.jpg", "632245696_1482015047261099_3523584593468023150_n.jpg",
    "633551354_1482015083927762_6912985535366424662_n.jpg", "633992123_1486083586854245_4711196357813368697_n.jpg", "655834596_1513817117414225_5987499885961074778_n.jpg", "656857461_1513817144080889_2564696424553016396_n.jpg"
  ];

  return (
    <div className="course4-page">
      <div className="c4-container">

        {/* 1. HERO SECTION */}
        <section className="c4-hero">
          <span className="c4-kicker">⚠️ Chỉ Dành Cho Người Thực Sự Nghiêm Túc</span>
          <h1 className="c4-heading">
            Khám Phá Cách Thức Chi Tiết Để <span className="c4-text-gold">"Thoát Khỏi Bẫy Chuột"</span> & Xây Dựng Nền Tảng Kinh Doanh Bền Vững
          </h1>
          <p className="c4-subtitle">
            Phương pháp thực nghiệm, hướng dẫn từng bước thông qua kèm cặp trực tiếp 1:1, dành riêng cho những ai thực sự khát khao làm chủ doanh nghiệp trên Internet.
          </p>
          <button onClick={() => setIsModalOpen(true)} className="c4-btn-gold c4-btn-pulse">
            <Lock size={18} /> ĐĂNG KÝ VÒNG PHỎNG VẤN KÍN
          </button>
        </section>

        {/* 2. AUTHORITY SECTION - Củng cố Tín Nhiệm Ngay */}
        <section className="c4-section-gap" style={{ display: 'flex', gap: '60px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div className="c4-expert-img-wrapper">
            <img src="/images/expert_portrait_hero_face.png" alt="Phước Vĩnh Hưng - API" className="c4-expert-img" />
          </div>
          <div style={{ flex: 1, minWidth: '300px' }}>
            <span className="c4-kicker" style={{ marginBottom: '10px' }}>Huấn Luyện Trực Tiếp Bởi</span>
            <h2 className="c4-heading" style={{ fontSize: '3rem', marginBottom: '10px' }}>Mr. Vĩnh Hưng <span className="c4-text-gold">(Hưng NPV)</span></h2>
            <p className="c4-p" style={{ color: '#E5E7EB', fontSize: '1.2rem', marginBottom: '30px' }}>Founder — Duhava Technology JSC</p>
            <ul className="c4-bento-list c4-expert-stats">
              <li><Award size={24} className="c4-icon-gold" /> <div><strong>10+ Năm Thực Chiến:</strong> Khởi nghiệp kinh doanh số từ 2016.</div></li>
              <li><Star size={24} className="c4-icon-gold" /> <div><strong>500,000+ Thường Xuyên Theo Dõi:</strong> Trên các nền tảng Social Media.</div></li>
              <li><CheckCircle size={24} className="c4-icon-gold" /> <div><strong>200,000+ Thành Viên:</strong> Lãnh đạo cộng đồng AI lớn nhất nhì VN.</div></li>
              <li><ChevronRight size={24} className="c4-icon-gold" /> <div><strong>Cố Vấn Cấp Cao:</strong> Đào tạo In-house cho các tập đoàn tiên phong.</div></li>
            </ul>
          </div>
        </section>

        {/* 2.5 SOCIAL PROOF (INFINITE MARQUEE) */}
        <section className="c4-logo-section">
          <h4 className="c4-logo-kicker">CÁC ĐƠN VỊ ĐÃ TIN TƯỞNG TRƯỚC ĐÂY</h4>
          <div className="marquee-container">
            <div className="marquee-track">
              {/* Array of local logos */}
              {[
                "163997112890.jpeg", "53639333772_5e7495716b.jpg", "600175214_1385844209994023_3396440531865516689_n.jpg",
                "Icon-Dai-Ichi.webp", "Logo-DH-Nguyen-Tat-Thanh.webp", "Logo-FPT-Color2.webp", "Logo-Prudential-En-H-1.webp",
                "Logo-bieu-tuong-va-Huynh-Anh.png", "Mitsubishi-logo.png", "PTEXIM.jpg", "bannerlogo.png", "htv_logo_vn1.jpg",
                "images (1).jpg", "images.jpg", "images.png", "logo (1).png", "logo mau-01.png", "logo-01-20220527042827.png",
                "logo-BIDV-dongphucvina.vn_.webp", "logo-caay-thij.png", "logo-fsi2-compressed.webp", "logo-hoang-duc-fb.png",
                "logo-vinhomes-2.png", "logo-xanh-la-cap-nhan-1.12.25-01.png", "logo.jpg", "logo.png", "logochaogaudo.png",
                "phan-tich-cac-yeu-to-thiet-ke-trong-logo-vnpt-0.png", "smartland-1-1642936357.png", "untitled-1-2234.png"
                // Duplicate once to guarantee a seamless infinite scroll loop
              ].concat([
                "163997112890.jpeg", "53639333772_5e7495716b.jpg", "600175214_1385844209994023_3396440531865516689_n.jpg",
                "Icon-Dai-Ichi.webp", "Logo-DH-Nguyen-Tat-Thanh.webp", "Logo-FPT-Color2.webp", "Logo-Prudential-En-H-1.webp",
                "Logo-bieu-tuong-va-Huynh-Anh.png", "Mitsubishi-logo.png", "PTEXIM.jpg", "bannerlogo.png", "htv_logo_vn1.jpg",
                "images (1).jpg", "images.jpg", "images.png", "logo (1).png"
              ]).map((fileName, idx) => (
                <div key={idx} className="logo-card">
                  <img src={`/images/partners/${fileName}`} alt="Partner Logo" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. PAIN POINTS / TRAP CHECKER - Khoét sâu Nỗi Đau */}
        <section className="c4-trap-section c4-section-gap">
          <div className="c4-glass-box" style={{ borderColor: 'rgba(239, 68, 68, 0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', justifyContent: 'center', marginBottom: '30px' }}>
              <AlertTriangle color="#EF4444" size={32} />
              <h2 className="c4-heading" style={{ fontSize: '2.5rem', margin: 0 }}>Cái "Bẫy Chuột" Giết Chết Doanh Nhân</h2>
            </div>

            <p className="c4-p" style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 40px' }}>
              Chương trình đặc biệt này CHỈ dành cho bạn nếu bạn đang bị mắc kẹt vào ít nhất một trong các tình huống tồi tệ sau:
            </p>

            <div className="c4-checklist">
              {[
                'Luôn khát khao làm chủ, nhưng lại vướng vào một vòng xoay "làm công cho chính doanh nghiệp của mình" không lối thoát?',
                'Kinh doanh dậm chân tại chỗ, chi phí quảng cáo tăng phi mã nhưng biên độ lợi nhuận ngày càng mỏng?',
                'Muốn dùng sức bật Internet để nhân bản doanh thu nhưng sợ công nghệ, lười quay video, và rối loạn trước AI?',
                'Làm việc 14 tiếng/ngày, mất ngủ triền miên và đánh mất hoàn toàn thời gian vô giá bên cạnh Vợ/Chồng/Con cái?'
              ].map((item, idx) => (
                <div key={idx} className="c4-check-item">
                  <div className="c4-check-icon"><CheckCircle size={20} /></div>
                  <div className="c4-check-text">{item}</div>
                </div>
              ))}
            </div>

            <p className="c4-p" style={{ marginTop: '40px', fontWeight: 600, color: 'var(--c4-gold-primary)', textAlign: 'center', fontSize: '1.2rem', fontStyle: 'italic' }}>
              "Chỉ khi nào nhận ra mình đang trong bẫy, bạn mới bắt đầu tìm cách thoát ra."
            </p>
          </div>
        </section>

        {/* 4. MÔ THỨC TÂM LÝ - TƯ DUY */}
        <section className="c4-section-gap">
          <div className="c4-bento-grid">
            <div className="c4-bento-card">
              <h3>Hệ Thống Tư Duy CŨ ❌</h3>
              <ul className="c4-bento-list">
                <li><span style={{ color: '#EF4444' }}>•</span> Cần học nhiều, có bằng cấp xuất chúng mới thu nhập cao.</li>
                <li><span style={{ color: '#EF4444' }}>•</span> Phải bán mạng làm việc 9-5 (hoặc 9-9) để kiếm dòng tiền đều.</li>
                <li><span style={{ color: '#EF4444' }}>•</span> Phải thuê văn phòng đẹp, tuyển chục người để chứng tỏ quy mô.</li>
              </ul>
            </div>
            <div className="c4-bento-card highlight">
              <h3><span className="c4-text-gold">Hệ Thống Tư Duy MỚI ✅</span></h3>
              <ul className="c4-bento-list">
                <li><span style={{ color: '#10B981' }}>•</span> Cần học ĐÚNG kiến thức cốt lõi & Kỹ năng Đòn bẩy 4.0.</li>
                <li><span style={{ color: '#10B981' }}>•</span> Tạo Cỗ máy Internet hoạt động 24/7 mang giải pháp đến vạn người.</li>
                <li><span style={{ color: '#10B981' }}>•</span> Kinh doanh tinh gọn (1-2 người) MỌI LÚC, MỌI NƠI xuyên quốc gia nhờ sức mạnh Trí Tuệ Nhân Tạo.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 5. LOGIC / ROADMAP (Nexus Center Timeline) */}
        <section className="c4-section-gap">
          <h2 className="c4-heading" style={{ fontSize: '3rem', textAlign: 'center', marginBottom: '16px' }}>Bản Đồ Kẻ Thoát Khổ</h2>
          <p className="c4-p" style={{ textAlign: 'center', marginBottom: '80px' }}>Lộ trình 30 Ngày "Bắt Tay Kèm Cặp" Lột Xác Doanh Nghiệp Của Bạn</p>

          <div className="c4-nexus-roadmap">
            <div className="c4-nexus-line">
              <div className="c4-nexus-glow"></div>
            </div>

            {/* PHASE 1 SEPARATOR */}
            <div className="c4-phase-divider" data-aos="fade-up">
              <span className="c4-phase-pill">PHASE 1</span>
              <h3>Giai Đoạn 1: Móng Dày</h3>
            </div>

            {/* Phase 1 Items */}
            {[
              { day: 'Ngày 1', title: 'Truy Hồi Tư Duy Của Các Đa Triệu Phú Internet' },
              { day: 'Ngày 2', title: 'Xác Lập Mục Tiêu & Cài Đặt Khung Hoạt Động' },
              { day: 'Ngày 3', title: 'Phá Bỏ Rào Cản Tâm Lý Giam Giữ Bạn' },
              { day: 'Ngày 4', title: 'Thiết Kế Mô Hình Kinh Doanh Tái Cấu Trúc 4.0' },
              { day: 'Ngày 5', title: 'Đào Sâu Vùng Thị Trường Siêu Mang Tiền' },
              { day: 'Ngày 6', title: 'Đóng Gói Nhân Hiệu Cấp Độ Nhất Quán' },
              { day: 'Ngày 7', title: 'Chiến Lược Sản Phẩm Dịch Vụ Vô Hình' }
            ].map((item, i) => (
              <div key={item.day} className={`c4-nexus-row ${i % 2 === 0 ? 'left-aligned' : 'right-aligned'}`}>
                <div className="c4-nexus-node"></div>
                <div className="c4-nexus-card" data-aos={i % 2 === 0 ? 'fade-right' : 'fade-left'}>
                  <div className="c4-nexus-badge">{item.day}</div>
                  <h4>{item.title}</h4>
                </div>
              </div>
            ))}

            {/* PHASE 2 SEPARATOR */}
            <div className="c4-phase-divider c4-phase-green" data-aos="fade-up" style={{ marginTop: '80px' }}>
              <span className="c4-phase-pill">PHASE 2</span>
              <h3>Giai Đoạn 2: Vũ Khí Cuối</h3>
            </div>

            {/* Phase 2 Items */}
            {[
              { day: 'Tuần 2', title: 'Nghệ Thuật Bơm Nội Dung Tự Động Bằng AI' },
              { day: 'Tuần 3', title: 'Hệ Thống Phễu Lưu Lượng Dẫn Dắt & Gom Cá' },
              { day: 'Tuần 4', title: 'Tối Ưu Điểm Chạm & Chuyển Đổi Không Lối Thoát' }
            ].map((item, i) => (
              <div key={item.day} className={`c4-nexus-row c4-nexus-green ${i % 2 !== 0 ? 'left-aligned' : 'right-aligned'}`}>
                <div className="c4-nexus-node"></div>
                <div className="c4-nexus-card" data-aos={i % 2 !== 0 ? 'fade-right' : 'fade-left'}>
                  <div className="c4-nexus-badge">{item.day}</div>
                  <h4>{item.title}</h4>
                </div>
              </div>
            ))}

            {/* BONUS VIP TICKET */}
            <div className="c4-nexus-row center-aligned" style={{ marginTop: '80px' }}>
              <div className="c4-nexus-node node-gold"></div>
              <div className="c4-vip-ticket" data-aos="zoom-in">
                <div className="vip-ticket-cutout left"></div>
                <div className="vip-ticket-cutout right"></div>
                <div className="vip-content">
                  <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '15px' }}>🎁</span>
                  <h4>Tặng Kèm: Giấy phép AI Tool ADITI + ALADI</h4>
                  <p>(Gói Cao Nhất - Dành Riêng 1 Năm)</p>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* 6. VALUE STACK - Đóng Cọc Giá Trị */}
        <section className="c4-cargo-box c4-section-gap">
          <div className="c4-glass-box">
            <h2 className="c4-heading" style={{ textAlign: 'center', fontSize: '3rem', marginBottom: '10px' }}>9 "Rương Kho Báu" Độc Quyền</h2>
            <p className="c4-p" style={{ textAlign: 'center', marginBottom: '40px' }}>Toàn bộ khối tài sản số khổng lồ này sẽ chuyển giao trực tiếp vào tay bạn.</p>

            {/* Value Stack Bundle Visual Mockup */}
            <div style={{ textAlign: 'center', marginBottom: '60px', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '100%', height: '100%', background: 'radial-gradient(circle, rgba(212, 175, 55, 0.15) 0%, transparent 60%)', filter: 'blur(40px)', zIndex: 0 }}></div>
              <img
                src="/images/c4_value_stack_bundle.png"
                alt="Value Stack Digital Bundle"
                style={{ width: '90%', maxWidth: '900px', borderRadius: '24px', boxShadow: '0 40px 80px rgba(0,0,0,0.8)', border: '1px solid rgba(212, 175, 55, 0.2)', position: 'relative', zIndex: 1 }}
                data-aos="zoom-in"
                data-aos-duration="1500"
              />
            </div>

            <div className="c4-cargo-grid">
              {cargoBoxItems.map(item => (
                <div key={item.num} className="c4-cargo-item">
                  <div className="c4-cargo-header">
                    <span className="c4-cargo-number">{item.num}</span>
                    <span className="c4-cargo-value">{item.val}</span>
                  </div>
                  <h4 className="c4-cargo-title">{item.title}</h4>
                  <p className="c4-cargo-desc">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6.5 TRAINING GALLERY (SOCIAL PROOF) */}
        <section className="c4-section-gap" style={{ maxWidth: '100vw', margin: '140px calc(-50vw + 50%) 0', position: 'relative', overflow: 'hidden' }}>
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h2 className="c4-heading" style={{ fontSize: '2.5rem', marginBottom: '16px' }}>Hàng Ngàn Con Người Đã Đồng Hành Cùng Hệ Tư Tưởng</h2>
            <p className="c4-p">Bạn không cô đơn, chúng tôi gọi đây là ĐẾ CHẾ KHÔNG VIÊN GẠCH.</p>
          </div>

          {/* Row 1 - Trượt đều sang trái */}
          <div className="c4-gallery-track-left">
            <div className="c4-gallery-belt">
              {[...trainingRow1, ...trainingRow1].map((imgUrl, i) => (
                <div key={`r1-${i}`} className="c4-gallery-photo">
                  <img src={`/images/training/${imgUrl}`} loading="lazy" alt="Đào tạo" />
                </div>
              ))}
            </div>
          </div>

          {/* Row 2 - Trượt đều sang phải */}
          <div className="c4-gallery-track-right" style={{ marginTop: '20px' }}>
            <div className="c4-gallery-belt c4-belt-reverse">
              {[...trainingRow2, ...trainingRow2].map((imgUrl, i) => (
                <div key={`r2-${i}`} className="c4-gallery-photo">
                  <img src={`/images/training/${imgUrl}`} loading="lazy" alt="Đào tạo thực chiến" />
                </div>
              ))}
            </div>
          </div>

          {/* Lớp phủ màng sương hai rìa cho có chiều sâu */}
          <div className="c4-gallery-fade-left"></div>
          <div className="c4-gallery-fade-right"></div>
        </section>

        {/* 7. FAQ ZERO-JS */}
        <section className="c4-section-gap c4-faq-section">
          <h2 className="c4-heading" style={{ fontSize: '3rem', textAlign: 'center', marginBottom: '40px' }}>Đừng Để Sự Chần Chừ Chi Phối Bạn</h2>
          <div className="c4-faq-container">
            <details className="premium-faq">
              <summary>Học 1-1 sẽ diễn ra qua hình thức nào? <span className="faq-chevron">▼</span></summary>
              <div className="faq-content">
                Toàn bộ quá trình kèm cặp trực tiếp sẽ diễn ra qua nền tảng Zoom định kỳ hàng tuần. Ngoài ra, bạn sẽ được truy cập vào ứng dụng học tập nội bộ 24/7 và nhận hỗ trợ UltraViewer/TeamViewer khi thao tác kỹ thuật phức tạp nếu cần.
              </div>
            </details>
            <details className="premium-faq">
              <summary>Tôi chưa rành về Công nghệ/Máy tính thì có học được không? <span className="faq-chevron">▼</span></summary>
              <div className="faq-content">
                Hoàn toàn được. Chương trình không đào tạo bạn thành một "Lập trình viên", mà đào tạo bạn sử dụng những công cụ Công nghệ (AI, Phễu) đơn giản nhất được làm sẵn để phục vụ cho góc nhìn của một NHÀ KINH DOANH. Kỹ năng kéo-thả là đủ.
              </div>
            </details>
            <details className="premium-faq">
              <summary>Vì sao chương trình này phải qua vòng Phỏng Vấn Kín? <span className="faq-chevron">▼</span></summary>
              <div className="faq-content">
                Sản phẩm cao cấp này tiêu tốn thời gian cá nhân của Hưng NPV để đồng hành trực tiếp cùng bạn. Chúng tôi cần phỏng vấn để lọc ra những người Tích cực, Tư duy tốt và thực sự sẵn sàng lột xác. Nếu bạn mang tư duy Đổ lỗi hoặc Trông chờ ăn xổi, hồ sơ của bạn sẽ bị loại sớm.
              </div>
            </details>
          </div>
        </section>

        {/* 7.8 SCARCITY BAR */}
        <div className="c4-scarcity-box c4-reveal">
          <div className="c4-scarcity-header">
            <span style={{ color: '#ff4d4d', fontWeight: 'bold' }}><AlertTriangle size={18} style={{ display: 'inline', marginBottom: '-4px' }} /> CẢNH BÁO: GIỚI HẠN SỐ LƯỢNG</span>
            <span>Kỳ Huấn Luyện Gần Nhất</span>
          </div>
          <div className="c4-progress-bg">
            <div className="c4-progress-fill" style={{ width: '80%' }}></div>
          </div>
          <div className="c4-scarcity-footer">
            <span>Đã duyệt: 12/15 hồ sơ</span>
            <span className="c4-pulse-text">Chỉ còn trống 3 SLOT</span>
          </div>
        </div>

        {/* 8. GRAND SLAM OFFER & 9. SHIELD */}
        <section className="c4-price-box c4-section-gap">
          <h2 className="c4-heading" style={{ fontSize: '2.5rem', marginBottom: '10px', color: 'var(--c4-gold-primary)' }}>The Grand Slam Offer</h2>
          <p className="c4-p" style={{ fontSize: '1.2rem', marginBottom: '40px', color: '#FFF' }}>
            Vé thông hành trọn gói: Lộ Trình 30 Ngày + 9 Bộ Mô Đun Độc Quyền + Cố Vấn Thực Chiến 1-1
          </p>

          <div className="c4-price-breakdown">
            <div className="c4-total-value">Định Giá Thực Tế: &gt; 100.000.000₫</div>
            <div className="c4-p" style={{ marginTop: '20px', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 600 }}>
              Hội Viên "Tầng 4" Chỉ Cần Đầu Tư
            </div>
            <div className="c4-actual-price">97.000.000₫</div>

            <button onClick={() => setIsModalOpen(true)} className="c4-btn-gold c4-btn-pulse" style={{ marginTop: '10px' }}>
              NỘP HỒ SƠ & TRÒ CHUYỆN CÙNG HƯNG NPV <Send size={20} />
            </button>
          </div>

          <div className="c4-shield-mini">
            <Shield size={32} color="#10B981" />
            <div>
              <strong>LÁ CHẮN NIỀM TIN:</strong> Hoàn trả 100% trong 7 ngày đầu nếu bạn thấy chương trình này không sinh ra giá trị thực sự. Bạn không mất bất kỳ một rủi ro nào.
            </div>
          </div>
        </section>

        <footer className="c4-footer">
          <p>© 2026 DUHAVA JSC / HUNG NPV. Bản quyền chất xám tuân thủ Hiệp định Sở Hữu Trí Tuệ.</p>
          <p style={{ color: '#6B7280', marginTop: '15px' }}><Lock size={12} style={{ display: 'inline', position: 'relative', top: '2px' }} /> Trang đích được cấu trúc dựa trên hành vi con người. Tuyệt mật cho đến khi phổ biến.</p>
        </footer>
      </div>

      {/* MOBILE STICKY CTA */}
      <div className="c4-mobile-sticky-cta">
        <button onClick={() => setIsModalOpen(true)} className="c4-btn-gold c4-btn-pulse" style={{ width: '100%', padding: '16px' }}>
          NỘP HỒ SƠ PHỎNG VẤN <Send size={18} style={{ display: 'inline', marginLeft: '5px', marginBottom: '-3px' }} />
        </button>
      </div>

      <LeadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        courseId="khoa-hoc-4"
        courseName="AI PARTNER"
      />
    </div>
  );
}
