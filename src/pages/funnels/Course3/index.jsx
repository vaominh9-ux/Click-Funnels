import React, { useState } from 'react';
import LeadModal from '../components/LeadModal';
import { useFunnelTracking } from '../utils';
import './c3-premium.css';

const AICoachPage = () => {
  const [showModal, setShowModal] = useState(false);

  // Lưu ref/campaign/link từ URL vào localStorage để tracking Lead
  useFunnelTracking();

  const openModal = () => setShowModal(true);

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

  return (
    <div className="aicoach-wrapper">
      {/* ============================================================
          1. HERO — Hook & CTA
          ============================================================ */}
      <section className="aicoach-hero">
        <div className="aicoach-kicker">
          ⚠️ CẢNH BÁO: ĐỌC KỸ KẺO LỠ CƠ HỘI MỚI!
        </div>

        <h1>
          SỰ THẬT ĐẰNG SAU MỘT DOANH NHÂN THÔNG TIN CÓ THU NHẬP
          <span className="aicoach-headline-highlight"> 20,000 USD</span> HÀNG THÁNG...
        </h1>

        <h2 className="aicoach-subheadline">
          Lý do vì sao <span className="aicoach-gold">sản phẩm thông tin</span> đang lên ngôi? Những chiến lược nào hiệu quả nhất
          trong ngành công nghiệp sản phẩm thông tin và những điều bạn cần làm để khai thác <span className="aicoach-gold">mỏ vàng lộ thiên</span> này?
        </h2>

        <div className="aicoach-hero-grid">
          <div className="hero-content-left">
            <ul className="hero-punch-list">
              <li>
                <span className="icon">📈</span>
                <div>
                  <strong>Thị trường bùng nổ:</strong> Từ cuốn eBook vài đô la đến những khóa học chuyên sâu trị giá 50.000 USD.
                </div>
              </li>
              <li>
                <span className="icon">👑</span>
                <div>
                  <strong>Sự thật 8 con số:</strong> Tai Lopez, Sam Ovens, Grant Cardone đều đạt 8 con số mỗi năm nhờ bán "thông tin".
                </div>
              </li>
              <li>
                <span className="icon">🔥</span>
                <div>
                  <strong>Cơ hội hoàng kim:</strong> "Cơn sốt vàng" này chưa hề kết thúc — <span className="aicoach-highlight">nó chỉ mới bắt đầu.</span>
                </div>
              </li>
            </ul>

            <button className="aicoach-btn hide-on-mobile" onClick={openModal}>
              📋 TÔI MUỐN ỨNG TUYỂN VÀO AI COACH
            </button>
          </div>

          <div className="hero-content-right">
            <div className="hero-image-container">
              <div className="hero-image-wrapper">
                <img src="/images/course3/aicoach-hero-premium.png" alt="Billionaire Info Business AI Coach" />
                <div className="hero-image-overlay"></div>
              </div>
                
              <div className="hero-floating-stat">
                <span className="stat-label">Lợi nhuận mục tiêu</span>
                <span className="stat-value">$20,000<span>/tháng</span></span>
              </div>
            </div>

            <div className="micro-trust-badge">
              <div className="trust-avatars">
                <div className="avatar" style={{backgroundImage: 'url(https://i.pravatar.cc/100?img=11)'}}></div>
                <div className="avatar" style={{backgroundImage: 'url(https://i.pravatar.cc/100?img=32)'}}></div>
                <div className="avatar" style={{backgroundImage: 'url(https://i.pravatar.cc/100?img=68)'}}></div>
                <div className="avatar" style={{backgroundImage: 'url(https://i.pravatar.cc/100?img=44)'}}></div>
                <div className="avatar" style={{backgroundImage: 'url(https://i.pravatar.cc/100?img=53)'}}></div>
              </div>
              <span className="trust-text">Hàng trăm học viên đã áp dụng thành công</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          1.5. MARQUEE LOGO ĐỐI TÁC (Social Proof)
          Giải pháp Card Trắng: Xử lý dứt điểm các file có nền cồng kềnh lẫn không nền
          ============================================================ */}
      <section className="aicoach-partners-section">
        <h3 className="partners-title">NIỀM TIN ĐƯỢC CHỨNG THỰC BỞI HÀNG TRĂM DOANH NGHIỆP TRONG VÀ NGOÀI NƯỚC</h3>
        <div className="partners-marquee-container">
          <div className="partners-marquee-track">
            {partnerLogos.map((filename, i) => (
              <div className="partner-logo-card" key={`org-${i}`}>
                <img src={`/images/partners/${filename}`} loading="lazy" alt={`Partner ${i}`} />
              </div>
            ))}
            {/* Nhân bản để cuộn vòng lặp không giới hạn */}
            {partnerLogos.map((filename, i) => (
              <div className="partner-logo-card" key={`dup-${i}`}>
                <img src={`/images/partners/${filename}`} loading="lazy" alt={`Partner Dup ${i}`} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          2. STORY — Con Bọ Cánh Cứng (Engage)
          ============================================================ */}
      <section className="aicoach-section-alt">
        <div className="aicoach-section">
          <div className="aicoach-letter">
            <p style={{ fontWeight: 700, color: '#FFFFFF', fontSize: '1.3rem' }}>
              Bài viết này trả lời 3 câu hỏi:
            </p>
            <p><strong className="aicoach-gold">1.</strong> Còn CƠ HỘI nào cho những người muốn thâm nhập vào thế giới sản phẩm thông tin không?</p>
            <p><strong className="aicoach-gold">2.</strong> Ai nên (và ai KHÔNG nên) xem xét việc xây dựng sản phẩm thông tin?</p>
            <p><strong className="aicoach-gold">3.</strong> Cần gì để tung ra sản phẩm thông tin thành công? Làm sao giảm tối đa sai lầm?</p>

            <div className="aicoach-blockquote">
              Và cuối cùng — một chiến lược sát thủ đang rất hiệu quả trong thị trường này.<br />
              <strong>Nhưng trước đó, hãy nói về... những con bọ.</strong>
            </div>

            <h3>🐛 Tinh Hoàn Của Bọ Cánh Cứng Dạy Bạn Điều Gì Về Kinh Doanh Online?</h3>

            <div className="aicoach-image-container">
              <img src="/images/course3/beetle.png" alt="Con bọ cánh cứng" className="aicoach-img-styled img-canvas" style={{maxWidth: '450px'}} />
            </div>

            <p>Sinh vật mạnh nhất hành tinh không phải voi châu Phi — mà là <strong className="aicoach-white">con bọ cánh cứng nhỏ xíu</strong>, với sức mạnh bằng <span className="aicoach-gold">1,141 lần</span> trọng lượng cơ thể.</p>
            <p>Nhưng sức mạnh lại tạo ra một vấn đề độc đáo... Có 2 loại bọ đực:</p>

            <p>🦬 <strong className="aicoach-white">Bọ lớn có sừng:</strong> Dành phần lớn thời gian choảng nhau với các con đực khác và xây hầm bảo vệ con cái. Mạnh nhưng <span className="aicoach-red">kiệt sức</span>.</p>
            <p>🐜 <strong className="aicoach-white">Bọ nhỏ không sừng:</strong> Trong khi bọ lớn đang đánh nhau và xây hầm, bọ nhỏ lẻn vào, liên lạc với nhiều con cái, <span className="aicoach-green">hưởng chiến lợi phẩm</span>.</p>

            <div className="aicoach-blockquote">
              <strong>Bài Học Kinh Doanh:</strong> Chiến lược có thể đánh bại lợi thế.<br />
              Nếu bạn không phải ông lớn, không mạnh — hãy dùng sự linh hoạt và đa dạng hóa cơ hội để đạt mục tiêu.
            </div>

            <p><strong className="aicoach-white">Người Tí Hon có lợi thế linh hoạt.</strong> Khi mọi thứ không như mong đợi? Chúng ta dễ dàng chỉnh sửa, thậm chí đập đi xây lại. Điều <span className="aicoach-red">bất khả thi</span> với doanh nghiệp cồng kềnh.</p>
          </div>
        </div>
      </section>

      {/* ============================================================
          3. HỆ THỐNG MỚI LÀ SỨC MẠNH (Education)
          ============================================================ */}
      <section className="aicoach-section-dark">
        <div className="aicoach-section">
          <div className="aicoach-letter">
            <h2 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '16px' }}>
              HỆ THỐNG MỚI LÀ SỨC MẠNH
            </h2>
            <div className="aicoach-divider" />

            <p>Hầu hết mọi người đều xem thông tin tràn lan trên Internet là tốt. Tuy nhiên, có một vấn đề lớn:</p>
            <p style={{ fontSize: '1.4rem', fontWeight: 800, color: '#F59E0B', textAlign: 'center', margin: '30px 0' }}>
              Nó thiếu tính hệ thống.
            </p>
            <p>Nếu không có cấu trúc được sắp xếp phù hợp, chúng ta sẽ bơi trong một biển thông tin không bao giờ cạn — không có cách nào để sắp xếp thứ tự ưu tiên hoặc lọc thông tin.</p>
            <p>Vấn đề quá tải thông tin đã tạo ra một <strong className="aicoach-white">cơ hội độc đáo</strong> cho các doanh nhân hiểu biết — những người không ngại đào sâu, thử nghiệm, sắp xếp và giảng dạy lại chúng.</p>

            <div className="aicoach-blockquote" style={{ borderColor: '#F59E0B' }}>
              "Trong một thế giới phức tạp, nơi hầu như tất cả mọi người đều có thể truy cập vào cùng một nguồn thông tin, bạn có thể mang lại <strong>giá trị mới</strong> bằng cách kết nối các ý tưởng lại với nhau theo những <strong>cách mới lạ.</strong>"
            </div>

            <div className="aicoach-image-container" style={{ margin: '40px 0' }}>
              <img src="/images/course3/aicoach-system-premium.png" alt="Hệ thống hoá thông tin" className="aicoach-img-styled" />
            </div>

            <p>Bây giờ là thời điểm tốt nhất để tạo ra một sản phẩm thông tin chất lượng. Tuy nhiên có một chú ý cực kỳ quan trọng:</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 900, color: '#EF4444', textAlign: 'center', margin: '30px 0', letterSpacing: '1px' }}>
              "CHẤT LƯỢNG PHẢI LUÔN CAO HƠN GIÁ BÁN"
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================
          4. TỈNH THỨC VỚI CON SỐ (Logic)
          ============================================================ */}
      <section className="aicoach-section-alt">
        <div className="aicoach-section">
          <div className="aicoach-letter">
            <h2 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '16px' }}>
              TỈNH THỨC VỚI NHỮNG CON SỐ
            </h2>
            <div className="aicoach-divider" />

            <p>Bạn thỉnh thoảng vẫn thấy các phép toán như: "Để kiếm 1.000.000 đô la, tất cả những gì bạn cần là..."</p>

            <div className="aicoach-math-stack">
              <div className="math-stack-card tier-1">
                <div className="math-head">
                  <span className="math-number">100.000</span>
                  <span className="math-label">lần bán × $10</span>
                </div>
                <div className="math-body">
                  <p>Bạn sẽ <strong>sạt nghiệp</strong> vì chi phí quảng cáo (Ads) trước khi tìm được 100.000 khách hàng lạ mặt.</p>
                </div>
              </div>

              <div className="math-stack-card tier-2">
                <div className="math-head">
                  <span className="math-number">10.000</span>
                  <span className="math-label">lần bán × $100</span>
                </div>
                <div className="math-body">
                  <p>Yêu cầu một hệ thống Marketing khổng lồ để duy trì 10 ngàn lượt mua hàng đều đặn.</p>
                </div>
              </div>

              <div className="math-stack-card tier-3 math-trap">
                <div className="math-head">
                  <span className="math-number">1.000</span>
                  <span className="math-label">lần bán × $1.000</span>
                </div>
                <div className="math-body">
                  <div className="trap-label">⚠️ CÁI BẪY THỰC TẾ</div>
                  <p>Hầu hết mọi người thất bại ở đây. Cực kỳ khó để khiến 1 người lạ tin tưởng và trả $1.000 ngay lần đầu tiên chạm mặt bạn mà không qua "nuôi dưỡng".</p>
                </div>
              </div>

              <div className="math-stack-card tier-4">
                <div className="math-head">
                  <span className="math-number">100</span>
                  <span className="math-label">lần bán × $10.000</span>
                </div>
                <div className="math-body">
                  <p>Đòi hỏi bạn phải là một chuyên gia danh tiếng hạng A và có kỹ năng chốt sale High-ticket thượng thừa.</p>
                </div>
              </div>
            </div>

            <p>Mặc dù phép toán không sai, nhưng kiếm được hơn 1.000 khách hàng mua ngay một sản phẩm là <strong className="aicoach-white">siêu thử thách</strong>.</p>
            
            <div className="aicoach-image-container">
              <img src="/images/course3/funnel-math.png" alt="Mô hình phễu kinh doanh" className="aicoach-img-styled img-canvas" />
            </div>

            <p style={{textAlign: 'center', fontSize: '1.2rem', color: '#E5E7EB'}}>
              <strong>Mục Tiêu: 21.000 USD/Tháng.</strong> Dùng 1.000 USD để thu hút 1.000 người nhận quà miễn phí, và dần chuyển đổi họ qua các tầng phễu hệ thống.
            </p>

            <p>Chúng tôi tin rằng không có gì sai khi muốn kiếm một triệu đô — nhưng rất nhiều người nhìn vào con số đó mà <span className="aicoach-red">không hiểu thực tế đằng sau nó</span>.</p>

            <div className="aicoach-blockquote">
              <strong>Ước mơ là chất keo kết dính các chiến lược.</strong> Hãy để chúng lớn lên trong tâm trí và trái tim, nhưng đừng quên rằng một giấc mơ không có kế hoạch sẽ mãi mãi chỉ là một giấc mơ.
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          5. 3 CHIẾN LƯỢC SÁT THỦ (Framework)
          ============================================================ */}
      <section className="aicoach-section-dark">
        <div className="aicoach-section">
          <h2 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '16px' }}>
            3 CHIẾN LƯỢC SÁT THỦ
          </h2>
          <div className="aicoach-divider" />
          <p style={{ textAlign: 'center', color: '#9CA3AF', maxWidth: '650px', margin: '0 auto 50px', fontSize: '1.15rem' }}>
            Những chiến lược không chỉ hiệu quả mà còn bền vững — đã được chứng minh trong thực tế.
          </p>

          <div className="aicoach-image-container">
            <img src="/images/course3/funnel.png" alt="Phễu 3 chiến lược sát thủ" className="aicoach-img-styled img-canvas" style={{maxWidth: '350px'}} />
          </div>

          <div className="aicoach-strategy-card">
            <h4><span className="aicoach-gold">01.</span> Trải Nghiệm WOW — Tặng Miễn Phí Giá Trị Cao</h4>
            <p>Chọn đúng đối tượng có nhu cầu thật sự và tặng họ một sản phẩm Miễn Phí nhưng giá trị cực cao. Cảm xúc trải nghiệm WOW này sẽ là động cơ để họ tiếp tục mua sản phẩm trả phí phía sau.</p>
          </div>

          <div className="aicoach-strategy-card">
            <h4><span className="aicoach-gold">02.</span> Sản Phẩm Cheap — Giải Pháp Tức Thì Giá Rẻ</h4>
            <p>Con người thích "kết quả tức thì". Tạo sản phẩm Cheap (20-50 USD) để tạo thói quen mua hàng. Một khi họ đã trả tiền, họ trở thành khách hàng thực sự của bạn.</p>
          </div>

          <div className="aicoach-strategy-card">
            <h4><span className="aicoach-gold">03.</span> Core → High-End — Tăng Giá Trị, Tăng Giá</h4>
            <p>Khách hàng muốn kết quả rõ ràng hơn, to lớn hơn. Đây là lúc bạn chào sản phẩm Core (250 USD) và High-End (1,250 USD+). Một nhóm khách hàng luôn sẵn sàng trả giá cao cho điều đặc biệt.</p>
          </div>

          <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <button className="aicoach-btn" onClick={openModal}>
              🚀 TÔI MUỐN HỌC CHIẾN LƯỢC NÀY
            </button>
          </div>
        </div>
      </section>

      {/* ============================================================
          6. AI NÊN THAM GIA (Qualification)
          ============================================================ */}
      <section className="aicoach-qualifications">
        <div className="aicoach-qualifications-inner">
          <h2 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '16px' }}>
            Ai Nên Tham Gia?
          </h2>
          <div className="aicoach-divider" />
          <p style={{ textAlign: 'center', color: '#9CA3AF', fontSize: '1.15rem' }}>
            Không phải ai cũng phù hợp. Bạn có những phẩm chất này không?
          </p>

          <ul>
            <li>Không ngại đầu tư thời gian và năng lượng để <strong className="aicoach-white">học cách sáng tạo liên tục</strong>.</li>
            <li>Đủ khiêm tốn để thừa nhận <strong className="aicoach-white">cần giúp đỡ</strong> — và đủ quyết tâm để tìm ra nó.</li>
            <li>Sẵn sàng <strong className="aicoach-white">lắng nghe nhu cầu khán giả</strong> thay vì cố chấp sở thích cá nhân.</li>
            <li>Hiểu rằng nỗi sợ hãi là sản phẩm của sự thiếu hiểu biết — cần <strong className="aicoach-white">dùng kiến thức làm sáng tỏ</strong>.</li>
            <li>Thích <strong className="aicoach-white">phát triển bản thân</strong> và giúp người khác cùng phát triển.</li>
            <li><strong className="aicoach-white">Kiên nhẫn và quyết tâm</strong> tới cùng với mục tiêu.</li>
          </ul>

          <div className="aicoach-blockquote" style={{ textAlign: 'center', borderColor: '#F59E0B' }}>
            "Tin xấu: Nó không dễ dàng. Nhưng tin tốt: VÌ nó không dễ dàng — đó chính là bộ lọc cho những ai sớm từ bỏ. Nếu ai cũng làm được, <strong>ai cũng kiếm 20K USD/tháng rồi.</strong>"
          </div>
        </div>
      </section>

      {/* ============================================================
          7. SOCIAL PROOF (Trust)
          ============================================================ */}
      <section className="aicoach-section-dark">
        <div className="aicoach-section">
          <h2 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '16px' }}>
            MỘT HỆ THỐNG ĐÃ ĐƯỢC CHỨNG MINH
          </h2>
          <div className="aicoach-divider" />
          <p style={{ textAlign: 'center', color: '#9CA3AF', maxWidth: '650px', margin: '0 auto 20px', fontSize: '1.15rem' }}>
            Sau hơn 18 tháng vận hành, hệ thống này đã tạo ra:
          </p>

          <div className="aicoach-proof-grid">
            <div className="aicoach-proof-item">
              <span className="proof-number">10,000+</span>
              <span className="proof-label">Đơn hàng Cheap<br />(20-50 USD)</span>
            </div>
            <div className="aicoach-proof-item">
              <span className="proof-number">2,000+</span>
              <span className="proof-label">Đơn hàng Core<br />(500 USD)</span>
            </div>
            <div className="aicoach-proof-item">
              <span className="proof-number">800+</span>
              <span className="proof-label">Đơn hàng High-End<br />(3,000 USD)</span>
            </div>
          </div>

          <p style={{ textAlign: 'center', color: '#D1D5DB', maxWidth: '650px', margin: '0 auto' }}>
            Đây là một hệ thống khóa học chặt chẽ hướng dẫn tất cả kiến thức và kỹ năng dành cho bất cứ ai <strong className="aicoach-white">khát khao thành công trên Internet</strong>. Chúng tôi mời bạn học hỏi và hợp tác để phát triển cùng nhau.
          </p>
        </div>
      </section>

      <section className="aicoach-training-wall">
        <h2 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '16px', padding: '0 20px' }}>
          KHÔNG DẠY LÝ THUYẾT SUÔNG.<br/> <span className="aicoach-gold">CHÚNG TÔI THỰC CHIẾN.</span>
        </h2>
        <div className="aicoach-divider" />
        <p style={{ textAlign: 'center', color: '#9CA3AF', maxWidth: '650px', margin: '0 auto 40px', fontSize: '1.15rem', padding: '0 20px' }}>
          Hành trình đồng hành và chuyển hóa trực tiếp cùng hàng ngũ CEO, Doanh nhân và Tổ chức. Bức tường này là minh chứng đanh thép nhất cho những gì chúng tôi sẽ chuyển giao cho bạn.
        </p>

        {/* Tầng 1: Cuộn Trái */}
        <div className="training-marquee-container">
          <div className="training-marquee-track scroll-left">
            {trainingRow1.map((filename, i) => (
              <div className="training-photo-card" key={`t1-org-${i}`}>
                <img src={`/images/training/${filename}`} loading="lazy" alt={`Training ${i}`} />
              </div>
            ))}
            {trainingRow1.map((filename, i) => (
              <div className="training-photo-card" key={`t1-dup-${i}`}>
                <img src={`/images/training/${filename}`} loading="lazy" alt={`Training Dup ${i}`} />
              </div>
            ))}
          </div>
        </div>

        {/* Tầng 2: Cuộn Phải */}
        <div className="training-marquee-container" style={{ marginTop: '20px' }}>
          <div className="training-marquee-track scroll-right">
            {trainingRow2.map((filename, i) => (
              <div className="training-photo-card" key={`t2-org-${i}`}>
                <img src={`/images/training/${filename}`} loading="lazy" alt={`Training 2 ${i}`} />
              </div>
            ))}
            {trainingRow2.map((filename, i) => (
              <div className="training-photo-card" key={`t2-dup-${i}`}>
                <img src={`/images/training/${filename}`} loading="lazy" alt={`Training Dup 2 ${i}`} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          8. GRAND SLAM OFFER (The Kill)
          ============================================================ */}
      <section className="aicoach-offer-section">
        <div className="aicoach-offer-stack">
          <h2 style={{ textAlign: 'center', fontSize: '3rem', marginBottom: '16px' }}>
            THE GRAND SLAM OFFER
          </h2>
          <div className="aicoach-divider" />
          <p style={{ textAlign: 'center', color: '#9CA3AF', marginBottom: '50px', fontSize: '1.1rem' }}>
            Tổng hợp mọi thứ bạn nhận được khi tham gia chương trình:
          </p>

          <div className="aicoach-offer-item">
            <div className="item-desc"><span>🎓</span> Bản vẽ Hệ Thống Doanh Nhân Thông Tin 20K USD/tháng</div>
            <div className="price">50.000.000₫</div>
          </div>
          <div className="aicoach-offer-item">
            <div className="item-desc"><span>📋</span> Chuyển giao kịch bản Phễu 3 tầng (Cheap → Core → High-End)</div>
            <div className="price">20.000.000₫</div>
          </div>
          <div className="aicoach-offer-item">
            <div className="item-desc"><span>👨‍🏫</span> Coach 1:1 đồng hành + Mentor sát cánh (30-90 ngày)</div>
            <div className="price">30.000.000₫</div>
          </div>
          <div className="aicoach-offer-item">
            <div className="item-desc"><span>🤖</span> Biệt đội AI Agents vận hành tự động (CSKH, Follow, Chốt Sale)</div>
            <div className="price">10.000.000₫</div>
          </div>
          <div className="aicoach-offer-item">
            <div className="item-desc"><span>📊</span> Template Grand Slam Offer + Kịch bản chốt sale High-Ticket</div>
            <div className="price">5.000.000₫</div>
          </div>
          <div className="aicoach-offer-item golden">
            <div className="item-desc"><span>👑</span> Mastermind: Cộng đồng Doanh Nhân Thông Tin trọn đời</div>
            <div className="price">VÔ GIÁ</div>
          </div>

          <div className="aicoach-total-box">
            <div className="aicoach-total-label">Tổng Giá Trị Bao Gồm</div>
            <div className="aicoach-total-strike">115.000.000₫</div>
            <div className="aicoach-total-today">Khoản Đầu Tư Của Bạn Ngay Hôm Nay:</div>
            <div className="aicoach-total-final">19.997.000₫</div>
            <div className="aicoach-savings">
              💰 TIẾT KIỆM 95.003.000₫ (82%)
            </div>

            <button className="aicoach-btn" onClick={openModal}>
              👉 ĐĂNG KÝ NGAY
            </button>
          </div>
        </div>
      </section>

      {/* ============================================================
          9. FAQ + GUARANTEE (Objection Handling)
          ============================================================ */}
      <section className="aicoach-section-alt">
        <div className="aicoach-section">
          <h2 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '16px' }}>
            CÂU HỎI THƯỜNG GẶP
          </h2>
          <div className="aicoach-divider" />

          <details className="aicoach-faq-item">
            <summary>Q: Tôi có cần kiến thức chuyên sâu trước khi bắt đầu không?</summary>
            <p>Chắc chắn có kiến thức sẽ tốt hơn! Nhưng đó không phải yêu cầu bắt buộc. Chúng tôi sẽ chia sẻ các chiến lược được thiết kế không chỉ giúp bạn đạt thu nhập đề ra mà còn phát triển kinh nghiệm trong thị trường sản phẩm thông tin.</p>
          </details>

          <details className="aicoach-faq-item">
            <summary>Q: Tôi không thích "nghiên cứu" hoặc sắp xếp thông tin, thì sao?</summary>
            <p>99.999% mọi người thuộc thể loại này! Giải pháp: Hãy tìm chiến thắng nhỏ đầu tiên và sự yêu thích sẽ tìm đến bạn. Chúng tôi sẽ thiết kế hệ thống giúp bạn có những chiến thắng nhỏ nhưng tràn đầy cảm hứng.</p>
          </details>

          <details className="aicoach-faq-item">
            <summary>Q: Mất bao lâu để thấy kết quả?</summary>
            <p>Tùy thuộc vào mức độ nỗ lực, thông thường những học viên cam kết sẽ thấy kết quả đầu tiên trong 30-90 ngày đầu. Hệ thống được thiết kế để bạn có "chiến thắng nhỏ" ngay từ tuần đầu tiên.</p>
          </details>

          {/* Guarantee */}
          <div className="aicoach-guarantee">
            <div className="guarantee-icon">🛡️</div>
            <h3>BẢO HÀNH 100% HOÀN TIỀN</h3>
            <p>Nếu sau 14 ngày bạn cảm thấy chương trình không phù hợp, chúng tôi hoàn tiền 100% — không hỏi thêm bất cứ điều gì. Bạn giữ luôn toàn bộ tài liệu bonus.</p>
          </div>
        </div>
      </section>

      {/* ============================================================
          10. ĐƠN ỨNG TUYỂN + PS (Final CTA)
          ============================================================ */}
      <section className="aicoach-form-section" id="apply-form">
        <div className="aicoach-form-container">
          <h3>Đơn Ứng Tuyển</h3>
          <p style={{ color: '#9CA3AF', marginBottom: '30px' }}>
            AI Coach Không Dành Cho Số Đông. Vui lòng điền thông tin bên dưới để chuyên gia của chúng tôi gọi điện phỏng vấn thẩm định.
          </p>

          <button className="aicoach-btn" onClick={openModal} style={{ width: '100%', fontSize: '1.2rem', padding: '22px 40px' }}>
            📋 ĐIỀN ĐƠN ỨNG TUYỂN NGAY
          </button>

          <div className="aicoach-steps">
            *BƯỚC 1: Điền form ứng tuyển.<br />
            *BƯỚC 2: Chuyên gia gọi điện phỏng vấn.<br />
            *BƯỚC 3: Nếu phù hợp → Chuyển khoản → Kích hoạt hành trình.
          </div>
        </div>

        {/* PS */}
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div className="aicoach-ps">
            <strong>P.S.</strong> Nếu bạn kéo ngay đến đây mà chưa đọc những phần thông điệp bên trên, chắc chắn bạn đã bỏ lỡ nhiều thông tin quan trọng và cơ hội trong ngành này. Hãy quay lại đọc kỹ thêm lần nữa — <strong>cơ hội không chờ đợi ai cả.</strong>
          </div>
        </div>
      </section>

      {/* --- MỎ NEO CHỐT SALE MOBILE BÁM ĐÁY --- */}
      <div className="mobile-sticky-cta">
        <button className="aicoach-btn" onClick={openModal}>
          🚀 TÔI MUỐN ỨNG TUYỂN
        </button>
      </div>

      {/* LEAD MODAL — Logic giữ nguyên */}
      <LeadModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        courseId="khoa-hoc-3"
        courseName="AI COACH: AI Coach / AI Trainer"
      />

      {/* FOOTER */}
      <footer className="aicoach-footer">
        © 2026 HUNGNPV. All rights reserved.<br />
        HUNGNPV AI.VIBE.CODE<br />
        🔒 Bảo mật SSL | Thanh toán an toàn
      </footer>
    </div>
  );
};

export default AICoachPage;
