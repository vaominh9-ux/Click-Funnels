import React, { useEffect, useState } from 'react';
import './c2-style.css';
import { useFunnelTracking } from '../utils';
import LeadModal from '../components/LeadModal';
import { FUNNEL_COURSES } from '../config';
import {
  CheckCircle2, XCircle, ArrowRight, ArrowDown,
  ShieldCheck, MonitorPlay, Calendar, Zap, Star,
  Briefcase, BarChart, Settings, Crown,
  Workflow, Cpu, Target, TrendingUp, Filter, Layers, FileText, Video, PlayCircle
} from 'lucide-react';

const COURSE_INFO = FUNNEL_COURSES['khoa-hoc-2'];

const Course2 = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Danh sách tên file logo đối tác (30 files)
  const partnerLogos = [
    "163997112890.jpeg", "53639333772_5e7495716b.jpg", "600175214_1385844209994023_3396440531865516689_n.jpg", 
    "Icon-Dai-Ichi.webp", "Logo-DH-Nguyen-Tat-Thanh.webp", "Logo-FPT-Color2.webp", "Logo-Prudential-En-H-1.webp", 
    "Logo-bieu-tuong-va-Huynh-Anh.png", "Mitsubishi-logo.png", "PTEXIM.jpg", "bannerlogo.png", "htv_logo_vn1.jpg", 
    "images (1).jpg", "images.jpg", "images.png", "logo (1).png", "logo mau-01.png", "logo-01-20220527042827.png", 
    "logo-BIDV-dongphucvina.vn_.webp", "logo-caay-thij.png", "logo-fsi2-compressed.webp", "logo-hoang-duc-fb.png", 
    "logo-vinhomes-2.png", "logo-xanh-la-cap-nhan-1.12.25-01.png", "logo.jpg", "logo.png", "logochaogaudo.png", 
    "phan-tich-cac-yeu-to-thiet-ke-trong-logo-vnpt-0.png", "smartland-1-1642936357.png", "untitled-1-2234.png"
  ];

  // Danh sách 32 ảnh thực chiến (Training) phân làm 2 dòng
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
        <section className="c2-hero-section text-center">
          <div className="c2-premium-badge mx-auto mb-6">
            <span className="c2-shimmer-bg">MASTER CLASS 2.0</span>
          </div>

          <h1 className="c2-main-headline text-center">
            Lộ Trình Xây Dựng <span className="c2-metallic-text">AI Agency</span><br className="desktop-only" />{' '}
            Làm Chủ Automation & Ads B2B
          </h1>

          <p className="c2-sub-headline text-center mb-10">
            Cú nhảy vọt từ Freelancer đơn lẻ lên mốc <strong>50 - 100&nbsp;triệu/tháng</strong>. Bí mật xây dựng hệ thống Agency phòng ban độ phân giải cao phục vụ Doanh nghiệp — tự động hóa 100%.
          </p>

          <div className="c2-hero-image-wrapper mb-12" style={{borderRadius:'16px',overflow:'hidden',maxWidth:'900px',margin:'0 auto 2.5rem',boxShadow:'0 30px 60px rgba(0,0,0,0.6), 0 0 40px rgba(234,179,8,0.1)'}}>
            <img src="/images/course2/c2-hero.png" alt="B2B AI Agency Dashboard" style={{width:'100%',display:'block',aspectRatio:'16/9',objectFit:'cover',objectPosition:'center'}} />
          </div>

          <button
            className="c2-btn-elite pulse-gold mx-auto w-full-mobile"
            onClick={() => setIsModalOpen(true)}
          >
            <Crown size={24} className="mr-2 text-yellow-100" />
            ĐĂNG KÝ MASTER LỘ TRÌNH NGAY
          </button>
        </section>

        {/* ─── PHẦN 1.5: LOGO ĐỐI TÁC (SOCIAL PROOF B2B) ─── */}
        <section className="c2-partners-glass-section mt-12">
          <h3 className="c2-partners-glass-title text-center">BẢO CHỨNG NĂNG LỰC CUNG CẤP GIẢI PHÁP A.I DOANH NGHIỆP</h3>
          <div className="c2-partners-marquee-container">
            <div className="c2-partners-marquee-track">
              {partnerLogos.map((filename, i) => (
                <div className="c2-partner-logo-card" key={`org-${i}`}>
                  <img src={`/images/partners/${filename}`} loading="lazy" alt={`Partner ${i}`} />
                </div>
              ))}
              {partnerLogos.map((filename, i) => (
                <div className="c2-partner-logo-card" key={`dup-${i}`}>
                  <img src={`/images/partners/${filename}`} loading="lazy" alt={`Partner Dup ${i}`} />
                </div>
              ))}
            </div>
          </div>
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
          <h2 className="c2-section-title mb-10">BẠN SẼ XÂY DỰNG 3 TRỤ CỘT CỦA MỘT<br /><span className="c2-metallic-text">AI AGENCY ĐẬM CHẤT ELITE</span></h2>

          <div className="c2-pillars-image-wrapper mb-12" style={{borderRadius:'16px',overflow:'hidden',maxWidth:'900px',margin:'0 auto 3rem',boxShadow:'0 20px 50px rgba(0,0,0,0.5)'}}>
            <img src="/images/course2/c2-pillars.png" alt="3 Trụ Cột AI Agency Elite" style={{width:'100%',display:'block',aspectRatio:'21/9',objectFit:'cover',objectPosition:'center'}} />
          </div>

          <div className="c2-pillars-grid mt-6">
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
        <section className="c2-timeline-section mt-32 relative">
          <h2 className="c2-section-title text-center mb-20">LỘ TRÌNH 4 TUẦN CHIẾN LƯỢC</h2>
          
          <div className="c2-stepper-container">
            {/* The vertical line running through the center */}
            <div className="c2-stepper-line"></div>

            {/* WEEK 1 */}
            <div className="c2-step-row">
              <div className="c2-step-number-container">
                <div className="c2-step-circle">1</div>
              </div>
              <div className="c2-step-card c2-glass-panel">
                <div className="step-watermark text-emerald-100">01</div>
                
                <div className="c2-step-layout">
                  <div className="c2-step-image">
                    <img src="/images/course2/c2-automation.png" alt="Automation System" loading="lazy" />
                  </div>
                  <div className="step-content-relative" style={{flex: 1}}>
                    <h3 className="step-title text-emerald-800">AUTOMATION & SYSTEM</h3>
                    <div className="step-badges">
                      <span className="neo-badge bg-emerald-50 text-emerald-700 border-emerald-200"><Workflow size={14}/> Master n8n Data</span>
                      <span className="neo-badge bg-emerald-50 text-emerald-700 border-emerald-200"><Cpu size={14}/> AI Agents Tự Suy Luận</span>
                      <span className="neo-badge bg-emerald-50 text-emerald-700 border-emerald-200"><Zap size={14}/> Build Pipeline Tự Chốt Deal</span>
                    </div>
                    <div className="step-output border-l-4 border-emerald-500 bg-white">
                      <strong>OUTPUT:</strong> Phễu Automation 10+ luồng sẵn sàng Deploy.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* WEEK 2 */}
            <div className="c2-step-row c2-row-reverse">
              <div className="c2-step-number-container">
                <div className="c2-step-circle">2</div>
              </div>
              <div className="c2-step-card c2-glass-panel">
                <div className="step-watermark text-blue-100">02</div>
                
                <div className="c2-step-layout">
                  <div className="c2-step-image">
                    <img src="/images/course2/c2-ads.png" alt="Ads B2B" loading="lazy" />
                  </div>
                  <div className="step-content-relative" style={{flex: 1}}>
                    <h3 className="step-title text-blue-800">ADS & TRAFFIC B2B</h3>
                    <div className="step-badges">
                      <span className="neo-badge bg-blue-50 text-blue-700 border-blue-200"><Target size={14}/> FB Ads Doanh Nghiệp</span>
                      <span className="neo-badge bg-blue-50 text-blue-700 border-blue-200"><TrendingUp size={14}/> TikTok Ads 200K Follow</span>
                      <span className="neo-badge bg-blue-50 text-blue-700 border-blue-200"><Filter size={14}/> Content Lead Gen B2B</span>
                    </div>
                    <div className="step-output border-l-4 border-blue-500 bg-white">
                      <strong>OUTPUT:</strong> 3 luồng Ads chạy máy hút khách hàng B2B.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* WEEK 3 */}
            <div className="c2-step-row">
              <div className="c2-step-number-container">
                <div className="c2-step-circle">3</div>
              </div>
              <div className="c2-step-card c2-glass-panel">
                <div className="step-watermark text-indigo-100">03</div>
                
                <div className="c2-step-layout">
                  <div className="c2-step-image">
                    <img src="/images/course2/c2-agency.png" alt="Agency Operations" loading="lazy" />
                  </div>
                  <div className="step-content-relative" style={{flex: 1}}>
                    <h3 className="step-title text-indigo-800">AGENCY OPERATION</h3>
                    <div className="step-badges">
                      <span className="neo-badge bg-indigo-50 text-indigo-700 border-indigo-200"><Layers size={14}/> Đóng Gói Dịch Vụ Khách</span>
                      <span className="neo-badge bg-indigo-50 text-indigo-700 border-indigo-200"><Briefcase size={14}/> Onboard & Fulfillment</span>
                      <span className="neo-badge bg-indigo-50 text-indigo-700 border-indigo-200"><FileText size={14}/> Hợp Đồng & Proposal</span>
                    </div>
                    <div className="step-output border-l-4 border-indigo-500 bg-white">
                      <strong>OUTPUT:</strong> Hồ sơ chuẩn Agency mang đi deal dự án $2,000+.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* WEEK 4 */}
            <div className="c2-step-row c2-row-reverse">
              <div className="c2-step-number-container">
                <div className="c2-step-circle-gold">4</div>
              </div>
              <div className="c2-step-card c2-glass-panel border-premium hover-glow-gold relative overflow-hidden">
                <div className="c2-shimmer-bg absolute top-0 -left-full w-full h-full opacity-10"></div>
                <div className="step-watermark text-amber-100 mix-blend-overlay opacity-30">04</div>
                
                <div className="c2-step-layout">
                  <div className="c2-step-image">
                    <img src="/images/course2/c2-media.png" alt="Scale Mass Media" loading="lazy" />
                  </div>
                  <div className="step-content-relative" style={{flex: 1}}>
                    <h3 className="step-title text-amber-600 drop-shadow-sm">SCALE & MASS MEDIA</h3>
                    <div className="step-badges">
                      <span className="neo-badge bg-amber-50 text-amber-800 border-amber-300 shadow-sm"><Video size={14}/> Trăm Mẫu Visual / Ngày</span>
                      <span className="neo-badge bg-amber-50 text-amber-800 border-amber-300 shadow-sm"><Star size={14}/> A/B Testing Bằng AI</span>
                      <span className="neo-badge bg-amber-50 text-amber-800 border-amber-300 shadow-sm"><PlayCircle size={14}/> Video Render Chuẩn Studio</span>
                    </div>
                    <div className="step-output-gold bg-gradient-to-r from-amber-50 to-white border-l-4 border-amber-500 text-amber-900 shadow-inner">
                      <strong>ĐẦU RA BÙNG NỔ:</strong> Khả năng phục vụ &gt;10 Doanh Nghiệp cùng lúc.
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ─── PHẦN 5: "SOCIAL PROOF" ─── */}
        <section className="c2-expert-section mt-32">
          <div className="c2-expert-luxury c2-glass-panel border-premium">
            <div className="expert-image-wrapper">
              <img src="/1bc4f6aa-9251-4973-a1eb-ea7ca1c9187f.jpg" alt="Mr. Hưng NPV" className="luxury-img" style={{objectFit: 'cover', objectPosition: 'center 10%'}} onError={(e) => { e.target.src = "https://ui-avatars.com/api/?name=Hung+NPV&size=500&background=F8FAFC&color=1E293B&font-size=0.33&bold=true"; }} />
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

        {/* ─── PHẦN 5.5: BỨC TƯỜNG ĐÀO TẠO DOANH NGHIỆP ─── */}
        <section className="c2-training-glass-wall mt-24">
          <h2 className="c2-section-title text-center mb-6">HIỆN DIỆN TẠI CÁC SÂN KHẤU CÔNG NGHỆ QUỐC BẢO</h2>
          <p className="text-center text-slate-400 mb-10 max-w-3xl mx-auto px-4 text-base md:text-lg">
            Hành trình đồng hành bảo chứng năng lực thực thi trực tiếp tại các Tập đoàn hàng đầu. Mã nguồn bạn sắp nhận được chính là công nghệ cốt lõi đứng sau chuỗi thành công này.
          </p>

          <div className="c2-training-marquee-container">
            <div className="c2-training-marquee-track scroll-left">
              {trainingRow1.map((filename, i) => (
                <div className="c2-training-photo-card" key={`t1-org-${i}`}>
                  <img src={`/images/training/${filename}`} loading="lazy" alt={`Training ${i}`} />
                </div>
              ))}
              {trainingRow1.map((filename, i) => (
                <div className="c2-training-photo-card" key={`t1-dup-${i}`}>
                  <img src={`/images/training/${filename}`} loading="lazy" alt={`Training Dup ${i}`} />
                </div>
              ))}
            </div>
          </div>

          <div className="c2-training-marquee-container mt-6">
            <div className="c2-training-marquee-track scroll-right">
              {trainingRow2.map((filename, i) => (
                <div className="c2-training-photo-card" key={`t2-org-${i}`}>
                  <img src={`/images/training/${filename}`} loading="lazy" alt={`Training 2 ${i}`} />
                </div>
              ))}
              {trainingRow2.map((filename, i) => (
                <div className="c2-training-photo-card" key={`t2-dup-${i}`}>
                  <img src={`/images/training/${filename}`} loading="lazy" alt={`Training Dup 2 ${i}`} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── PHẦN 6: "THE GRAND SLAM OFFER VIP PASS" ─── */}
        <section className="c2-offer-section mt-32">
          <h2 className="c2-section-title text-center mb-12">THẺ HỘI VIÊN MASTER — <br className="mobile-break" /><span className="c2-metallic-text">VIP PASS</span></h2>

          <div className="vip-pass-board">
            <div className="vip-animated-border"></div>
            <div className="vip-pass-inner c2-glass-panel">
              <div className="vip-header mb-8">
                <h3>BLACK CARD MEMBER</h3>
                <p>Khởi Tạo Tài Sản Trí Tuệ Vĩnh Viễn</p>
              </div>

              <div className="vip-bundle-image-wrapper mb-10" style={{borderRadius:'12px',overflow:'hidden',boxShadow:'0 20px 50px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(255,215,0,0.1)'}}>
                <img src="/images/course2/c2-vip-bundle.png" alt="VIP Pass Digital Bundle" style={{width:'100%',display:'block',aspectRatio:'16/9',objectFit:'cover',objectPosition:'center'}} />
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
                  <span className="text-red-500 line-through font-medium text-xl mr-0 mb-2 md:mb-0 md:mr-4 md:text-2xl whitespace-nowrap">&gt; 47.490.000₫</span>
                  <span className="text-white font-black text-3xl md:text-4xl whitespace-nowrap">MIỄN PHÍ</span>
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
              Hệ thống sẽ cử <strong>Chuyên gia 1-Kèm-1</strong> đồng hành nếu bạn vướng mắc sau 4 tuần Bootcamp. Nhưng nếu sau 30 ngày vẫn thực chiến thất bại? Chúng tôi xin lỗi & <strong>Transfer hoàn tiền học phí 100%</strong> ngay lập tức.
            </p>
          </div>

          <div className="c2-final-cta-area mt-20 mb-24 z-20 position-relative">
            <div className="c2-urgency-luxury mx-auto mb-8 box-shadow-glow items-start md:items-center text-left md:text-center">
              <span className="live-dot shrink-0 mt-1 md:mt-0"></span>
              <span><strong>GIỚI HẠN ALPHA V.I.P:</strong> Board sẽ khóa Slot ngay khi đủ sức chứa. Value sẽ TĂNG ở Ver kế!</span>
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
            <p className="text-base md:text-xl leading-relaxed text-slate-800">
              <em>"Mảnh ghép tối thượng: Những Founder xuất sắc của Master Board sẽ được đặc cách trải nghiệm <strong>AI COACH D.M V.I.P (19.997.000₫)</strong> — Gói huấn luyện bí mật giúp bạn đóng gói bản thân thành Nhà Đào Tạo có hệ sinh thái vệ tinh!"</em>
            </p>
          </div>
          <div className="c2-footer-bottom-l">
            <div className="footer-logo c2-metallic-text font-black text-2xl tracking-widest mb-4">MASTER X</div>
            <p className="font-semibold text-slate-600 tracking-wide block">© {new Date().getFullYear()} DUHAVA JSC / THE AUTOMATION BOARD.</p>
            <p className="mt-3 text-slate-400 text-sm tracking-wider">Cơ Sở Dữ Liệu Khép Kín Trực Thuộc HUNGNPV CORPORATION.<br /><span className="mt-2 text-slate-500 font-medium inline-block flex items-center justify-center gap-2">🔒 END-TO-END ENCRYPTED | VISA / NAPAS Cổng VIP</span></p>
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
