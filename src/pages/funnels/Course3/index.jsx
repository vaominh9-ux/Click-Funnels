import React from 'react';
import './c3-premium.css';

const AICoachPage = () => {
  const scrollToForm = () => {
    const formSection = document.getElementById('apply-form');
    if (formSection) {
      formSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="aicoach-wrapper">
      {/* 1. HERO SECTION */}
      <section className="aicoach-hero">
        <div className="aicoach-kicker">
          ⚠️ Lưu Ý: Cần đọc cẩn thận nội dung bên dưới để tránh bỏ lỡ cơ hội mới
        </div>

        <h1>Sự thật đằng sau một Doanh Nhân Thông Tin có thu nhập <span className="aicoach-highlight">20,000 USD</span> hàng tháng...</h1>

        <div className="lead-in">
          <p>
            "Sản phẩm thông tin" bao gồm mọi thứ, từ cuốn ebook vài đô la cho đến những khóa học chuyên sâu trị giá 50,000 USD.
          </p>
          <p>
            Những người như <strong>Tai Lopez, Sam Ovens, Grant Cardone</strong> đều đạt <strong>8 con số mỗi năm</strong> từ bán "thông tin". Và rất nhiều cá nhân khác cũng kiếm <strong>6-7 con số</strong> bằng sản phẩm thông tin trong thị trường ngách.
          </p>
          <p style={{ fontWeight: 700, marginTop: '20px', color: '#111827' }}>
            "Cơn sốt vàng" sản phẩm thông tin chưa kết thúc — <span className="aicoach-highlight">nó chỉ mới bắt đầu.</span>
          </p>
        </div>

        <button className="aicoach-btn" onClick={scrollToForm}>
          📋 TÔI MUỐN ỨNG TUYỂN VÀO AI COACH
        </button>
      </section>

      {/* 2. STORY SECTION */}
      <section className="aicoach-story-section">
        <div className="aicoach-letter">
          <p style={{ fontWeight: '600' }}>Bài viết này trả lời 3 câu hỏi:</p>
          <p><strong>1.</strong> Còn CƠ HỘI nào cho những người muốn thâm nhập vào thế giới sản phẩm thông tin không?</p>
          <p><strong>2.</strong> Ai nên (và ai KHÔNG nên) xem xét việc xây dựng sản phẩm thông tin?</p>
          <p><strong>3.</strong> Cần gì để tung ra sản phẩm thông tin thành công? Làm sao giảm tối đa sai lầm?</p>

          <div className="aicoach-blockquote">
            Và cuối cùng — một chiến lược sát thủ đang rất hiệu quả trong thị trường này.<br />
            <strong>Nhưng trước đó, hãy nói về... những con bọ.</strong>
          </div>

          <h3>🐛 Tinh Hoàn Của Bọ Cánh Cứng Dạy Bạn Điều Gì Về Kinh Doanh Online?</h3>

          <p>Sinh vật mạnh nhất hành tinh không phải voi châu Phi — mà là <strong>con bọ cánh cứng nhỏ xíu</strong>, với sức mạnh bằng 1,141 lần trọng lượng cơ thể.</p>
          <p>Nhưng sức mạnh lại tạo ra một vấn đề độc đáo... Có 2 loại bọ đực:</p>

          <p>🦬 <strong>Bọ lớn có sừng:</strong> Dành phần lớn thời gian choảng nhau với các con đực khác và xây hầm bảo vệ con cái. Mạnh nhưng kiệt sức.</p>
          <p>🐜 <strong>Bọ nhỏ không sừng:</strong> Trong khi bọ lớn đang đánh nhau và xây hầm, bọ nhỏ lẻn vào, liên lạc với nhiều con cái, hưởng chiến lợi phẩm.</p>

          <div className="aicoach-blockquote">
            <strong>Bài Học Kinh Doanh:</strong> Chiến lược có thể đánh bại lợi thế.<br />
            Nếu bạn không phải ông lớn, không mạnh — hãy dùng sự linh hoạt và đa dạng hóa cơ hội để đạt mục tiêu.
          </div>

          <p><strong>Người Tí Hon có lợi thế linh hoạt.</strong> Khi mọi thứ không như mong đợi? Chúng ta dễ dàng chỉnh sửa, thậm chí đập đi xây lại. Điều bất khả thi với doanh nghiệp cồng kềnh.</p>
        </div>
      </section>

      {/* 3. QUALIFICATION SECTION */}
      <section className="aicoach-qualifications">
        <div className="aicoach-qualifications-inner">
          <h2 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '10px' }}>Ai Nên Tham Gia?</h2>
          <p style={{ textAlign: 'center', color: '#6b7280', fontSize: '1.2rem' }}>Không Phải Ai Cũng Phù Hợp. Bạn Có Những Phẩm Chất Này Không?</p>

          <ul>
            <li>Không ngại đầu tư thời gian và năng lượng để <strong>học cách sáng tạo liên tục</strong>.</li>
            <li>Đủ khiêm tốn để thừa nhận <strong>cần giúp đỡ</strong> — và đủ quyết tâm để tìm ra nó.</li>
            <li>Sẵn sàng <strong>lắng nghe nhu cầu khán giả</strong> thay vì cố chấp sở thích cá nhân.</li>
            <li>Hiểu rằng nỗi sợ hãi là sản phẩm của sự thiếu hiểu biết — cần <strong>dùng kiến thức làm sáng tỏ</strong>.</li>
            <li>Thích <strong>phát triển bản thân</strong> và giúp người khác cùng phát triển.</li>
            <li><strong>Kiên nhẫn và quyết tâm</strong> tới cùng với mục tiêu.</li>
          </ul>

          <div className="aicoach-blockquote" style={{ textAlign: 'center', borderColor: '#000' }}>
            "Tin xấu: Nó không dễ dàng. Nhưng tin tốt: VÌ nó không dễ dàng — đó chính là bộ lọc cho những ai sớm từ bỏ. Nếu ai cũng làm được, ai cũng kiếm 20K USD/tháng rồi."
          </div>
        </div>
      </section>

      {/* 4. GRAND SLAM OFFER */}
      <section className="aicoach-offer-section">
        <div className="aicoach-offer-stack">
          <h2 style={{ textAlign: 'center', fontSize: '3rem', marginBottom: '50px' }}>THE GRAND SLAM OFFER</h2>

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
          <div className="aicoach-offer-item" style={{ background: '#fffbeb', borderColor: '#fef08a' }}>
            <div className="item-desc"><span>👑</span> Mastermind: Cộng đồng Doanh Nhân Thông Tin trọn đời</div>
            <div className="price" style={{ color: '#d97706', fontWeight: '900' }}>VÔ GIÁ</div>
          </div>

          <div className="aicoach-total-box">
            <h3 style={{ fontSize: '1.5rem', color: '#4b5563', marginBottom: '20px' }}>Tổng Giá Trị Bao Gồm:</h3>
            <div className="aicoach-total-strike">115.000.000₫</div>
            <div style={{ fontSize: '1.2rem', marginBottom: '10px', color: '#111827', fontWeight: 600 }}>Khoản Đầu Tư Của Bạn Ngay Hôm Nay:</div>
            <div className="aicoach-total-final">19.997.000₫</div>

            <button className="aicoach-btn" onClick={scrollToForm} style={{ fontSize: '1.5rem', padding: '24px 40px' }}>
              👉 ĐĂNG KÝ ỨNG TUYỂN NGAY
            </button>
          </div>
        </div>
      </section>

      {/* 5. FORM SECTION */}
      <section className="aicoach-form-section" id="apply-form">
        <div className="aicoach-form-container">
          <h3>Đơn Ứng Tuyển</h3>
          <p style={{ color: '#6b7280', marginBottom: '30px', textAlign: 'center' }}>
            AI Coach Không Dành Cho Số Đông. Vui lòng điền thông tin bên dưới để chuyên gia của chúng tôi gọi điện phỏng vấn thẩm định.
          </p>

          <form onSubmit={(e) => { e.preventDefault(); alert('Đơn đăng ký mô phỏng thành công! Flow tiếp theo: Chuyên gia gọi điện.'); }}>
            <div className="aicoach-form-group">
              <label>Họ và Tên</label>
              <input type="text" placeholder="Nhập họ tên của bạn..." required />
            </div>

            <div className="aicoach-form-group">
              <label>Số điện thoại (Có Zalo)</label>
              <input type="tel" placeholder="Nhập số điện thoại..." required />
            </div>

            <div className="aicoach-form-group">
              <label>Nghề nghiệp / Doanh thu hiện tại</label>
              <input type="text" placeholder="Ví dụ: Freelancer, 20tr/tháng..." required />
            </div>

            <button type="submit" className="aicoach-btn" style={{ width: '100%', marginTop: '10px' }}>
              GỬI YÊU CẦU ỨNG TUYỂN
            </button>
          </form>

          <div style={{ marginTop: '30px', fontSize: '0.85rem', color: '#9ca3af', textAlign: 'center' }}>
            *BƯỚC 1: Điền form ứng tuyển.<br />
            *BƯỚC 2: Chuyên gia gọi điện phỏng vấn.<br />
            *BƯỚC 3: Nếu phù hợp → Chuyển khoản → Kích hoạt hành trình.
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="aicoach-footer">
        © 2026 HUNGNPV. All rights reserved.<br />
        HUNGNPV AI.VIBE.CODE <br />
        🔒 Bảo mật SSL | Thanh toán an toàn
      </footer>
    </div>
  );
};

export default AICoachPage;
