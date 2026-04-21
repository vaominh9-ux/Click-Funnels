---
name: css-hover-clipping-fix
description: Cẩm nang khắc phục lỗi phần tử bị xén/cắt đuôi (Clipping) khi thi triển hiệu ứng Hover (nhảy lên, bung bóng đổ) bên trong những Container bọc kín (overflow: hidden). AI Agent PHẢI áp dụng kỹ năng này khi thiết kế Marquee hoặc Card Hover.
---

# ✂️ CSS Hover Clipping Fix (Chống Xén Viền Hiệu Ứng)

## 1. TÌNH TRẠNG LỖI (THE PROBLEM)
Khi thiết kế các Website cao cấp chứa giao diện Card (Thẻ bài), Marquee (Băng chuyền), hay Slider:
- Băng chuyền được bọc trong một rào kín bằng lệnh `overflow: hidden;` để giới hạn tầm nhìn và ngăn chặn thanh cuộn ngang làm lanh bành vỡ trang.
- Các hạt nhân (Cards) bên trong thường có hiệu ứng Tương Tác Cấp Cao khi rê chuột (Hover) như:
   - `transform: translateY(-10px);` (Nhảy lên)
   - `box-shadow: 0 10px 30px rgba(...)` (Bung tỏa bóng đổ)
   - `transform: scale(1.05);` (Phình to ra)
- **Hệ Quả:** Phần nảy lên hoặc vùng bóng tỏa bị lọt ra ngoài mép kích thước thật tĩnh của Container. Lập tức bị máy chém `overflow: hidden` gọt lẹm mắt. Dẫn đến giao diện tương tác bị đứt đoạn, mất mép sắc cạnh cực kỳ thiếu chuyên nghiệp.

## 2. NGUYÊN LÝ KHẮC PHỤC 
Tuyệt đối KHÔNG được gỡ bỏ `overflow: hidden` (vì sẽ làm rách bố cục trang). 
Thay vào đó, nguyên lý khắc phục cốt lõi là: **Nới rộng không gian hấp thụ quang học** của Container (Padding).

## 3. CÔNG THỨC ÁP DỤNG

### ❌ Code Mẫu Gây Lỗi:
```css
.marquee-container {
  overflow: hidden; 
  /* Khung bọc khít sát 100% kích thước khối Card bên trong */
}
.logo-card:hover {
  transform: translateY(-10px); 
  box-shadow: 0 10px 25px rgba(0,0,0,0.5); /* Chắc chắn bị xén mất đầu và bóng */
}
```

### ✅ Code Tiêu Chuẩn Điểm 10:
Bổ sung `padding` vào lòng Container để thừa ra khoảng không vật lý.
```css
.marquee-container {
  overflow: hidden; 
  
  /* 🔑 Bắt buộc: Nới rộng lòng trần và sàn thêm 20px (hoặc 4 cạnh) 
  để chừa đất diễn cho Box-Shadow và Transform */
  padding: 20px 0; 
  
  /* 💡 Tùy chọn: Nếu cấu trúc trang đẩy các mục khác xuống thấp, hãy hút chúng lại 
  bằng Margin Âm để bảo toàn khung viền gốc. */
  margin: -20px 0; 
}
.logo-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 10px 25px rgba(0,0,0,0.5);
}
```

## 4. CHỈ THỊ BẢO MẬT GIAO DIỆN (CHO AI AGENT)
- Khi AI Agent xây dựng Form, List, Card, hoặc Băng chuyền Marquee có chứa hiệu ứng Animations / Hover: **Luôn luôn kiểm đếm hệ tọa độ trục Z và Transform.**
- Nếu Parent Container sử dụng `overflow: hidden`, bắt buộc quy trình là phải chủ động cài `padding` chênh lệch tối thiểu +15px đến +30px để hứng trọn vẹn các lớp Box-Shadow và Transform Scale. 
- Mọi thiết kế phải trơn tru, bao bọc và hoàn hảo từ lần Build đầu tiên! KHÔNG để User phàn nàn về lỗi "Cụt Đầu" thẻ bài thêm một lần nào nữa!
