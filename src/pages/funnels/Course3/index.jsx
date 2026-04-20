import React, { useState } from 'react';
import LeadModal from '../components/LeadModal';
import './c3-premium.css';

const AICoachPage = () => {
  const [showModal, setShowModal] = useState(false);

  const openModal = () => setShowModal(true);

  return (
    <div className="aicoach-wrapper">
      {/* ============================================================
          1. HERO — Hook & CTA
          ============================================================ */}
      <section className="aicoach-hero">
        <div className="aicoach-kicker">
          ⚠️ Lưu Ý: Cần đọc cẩn thận nội dung bên dưới để tránh bỏ lỡ cơ hội mới
        </div>

        <h1>
          Sự thật đằng sau một Doanh Nhân Thông Tin có thu nhập{' '}
          <span className="aicoach-highlight">20,000 USD</span> hàng tháng...
        </h1>

        <div className="lead-in">
          <p>
            "Sản phẩm thông tin" bao gồm mọi thứ, từ cuốn ebook vài đô la cho đến những khóa học chuyên sâu trị giá 50,000 USD.
          </p>
          <p>
            Những người như <strong>Tai Lopez, Sam Ovens, Grant Cardone</strong> đều đạt <strong>8 con số mỗi năm</strong> từ bán "thông tin". Và rất nhiều cá nhân khác cũng kiếm <strong className="aicoach-gold">6-7 con số</strong> bằng sản phẩm thông tin trong thị trường ngách.
          </p>
          <p className="closing-line">
            "Cơn sốt vàng" sản phẩm thông tin chưa kết thúc — <span className="aicoach-highlight">nó chỉ mới bắt đầu.</span>
          </p>
        </div>

        <button className="aicoach-btn" onClick={openModal}>
          📋 TÔI MUỐN ỨNG TUYỂN VÀO AI COACH
        </button>
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

            <div className="aicoach-math-grid">
              <div className="aicoach-math-item">
                <span className="math-number">100.000</span>
                <span className="math-label">lần bán × $10</span>
              </div>
              <div className="aicoach-math-item">
                <span className="math-number">10.000</span>
                <span className="math-label">lần bán × $100</span>
              </div>
              <div className="aicoach-math-item">
                <span className="math-number">1.000</span>
                <span className="math-label">lần bán × $1.000</span>
              </div>
              <div className="aicoach-math-item">
                <span className="math-number">100</span>
                <span className="math-label">lần bán × $10.000</span>
              </div>
            </div>

            <p>Mặc dù phép toán không sai, nhưng kiếm được hơn 1.000 khách hàng mua ngay một sản phẩm là <strong className="aicoach-white">siêu thử thách</strong>.</p>
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

            <button className="aicoach-btn" onClick={openModal} style={{ fontSize: '1.4rem', padding: '24px 48px' }}>
              👉 ĐĂNG KÝ ỨNG TUYỂN NGAY
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

          <div className="aicoach-faq-item">
            <h4>Q: Tôi có cần kiến thức chuyên sâu trước khi bắt đầu không?</h4>
            <p>Chắc chắn có kiến thức sẽ tốt hơn! Nhưng đó không phải yêu cầu bắt buộc. Chúng tôi sẽ chia sẻ các chiến lược được thiết kế không chỉ giúp bạn đạt thu nhập đề ra mà còn phát triển kinh nghiệm trong thị trường sản phẩm thông tin.</p>
          </div>

          <div className="aicoach-faq-item">
            <h4>Q: Tôi không thích "nghiên cứu" hoặc sắp xếp thông tin, thì sao?</h4>
            <p>99.999% mọi người thuộc thể loại này! Giải pháp: Hãy tìm chiến thắng nhỏ đầu tiên và sự yêu thích sẽ tìm đến bạn. Chúng tôi sẽ thiết kế hệ thống giúp bạn có những chiến thắng nhỏ nhưng tràn đầy cảm hứng.</p>
          </div>

          <div className="aicoach-faq-item">
            <h4>Q: Mất bao lâu để thấy kết quả?</h4>
            <p>Tùy thuộc vào mức độ nỗ lực, thông thường những học viên cam kết sẽ thấy kết quả đầu tiên trong 30-90 ngày đầu. Hệ thống được thiết kế để bạn có "chiến thắng nhỏ" ngay từ tuần đầu tiên.</p>
          </div>

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
