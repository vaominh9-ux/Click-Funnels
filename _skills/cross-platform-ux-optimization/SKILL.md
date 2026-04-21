---
name: cross-platform-ux-optimization
description: Tiêu chuẩn tối ưu hóa trải nghiệm người dùng (UX) và giao diện chức năng (UI) chuẩn mực cao nhất để đảm bảo chuyển đổi liên tục trên Điện thoại (Mobile) và Máy tính (Desktop).
---

# 📱 Đạo Luật Tối Ưu UX/UI Chéo Nền Tảng (Mobile & Desktop UX Optimization)

Đây là tài liệu tiêu chuẩn kỹ thuật (Playbook) **BẮT BUỘC ĐỌC VÀ ÁP DỤNG** mỗi khi AI Agent thiết kế, code chức năng mới, hoặc tinh chỉnh Layout. Mục tiêu tối thượng của Skill này là biến mọi Component thành một cỗ máy thu Lead và chốt Sale với tỷ lệ thoát trang cực thấp.

---

## MỤC 1: TRUY NAM THIẾT KẾ ĐIỆN THOẠI (Mobile-First Ergonomics)

Hơn 80% lưu lượng truy cập nằm trên Mobile. Người dùng sẽ sử dụng MỘT TAY (Ngón cái) để thao tác. Hệ thống phải phục tùng thói quen này.

### 1.1. Kích Thước Vùng Chạm Tiêu Chuẩn (Touch Targets)
- **Tối thiểu:** MỌI Nút bấm (Button), Link, Icon tắt (Close icon) **phải có kích thước chạm tối thiểu là `44px` x `44px`**.
- **Padding:** Tuyệt đối không để 2 link sát nhau. Phải có margin an toàn (`gap` hoặc `margin` ít nhất `8px - 12px`) để tránh "Bấm nhầm" (Fat-finger errors).
- **Code mẫu:** Nếu icon nhỏ `24px`, phải add thẻ bọc `<button className="p-2">` để nới rộng vùng cọ xát ngón tay.

### 1.2. CTA Bám Dính Nhằm Chốt Sale (Sticky Bottom CTA)
- Đối với những trang bán hàng dài, phải cấu trúc thiết kế 1 nút bấm (CTA) **"Bám dính vĩnh viễn ở cạnh đáy màn hình"** (Sticky/Fixed) trên nền Mobile để tạo đòn bẩy kích thích nhấn bất cứ khi nào.
- Đáy của màn hình Mobile có "Safe Area" (Thanh Home Indicator của iPhone/Android). Luôn phải code `padding-bottom: env(safe-area-inset-bottom);` tránh bị cấn thanh vuốt.

### 1.3. Ngăn Ngừa Lỗi Phóng To Trình Duyệt Ngớ Ngẩn
- Bắt buộc CSS font-size của `<input>`, `<select>`, `<textarea>` tối thiểu phải là `16px`. Dưới `16px`, iOS Safari sẽ TỰ ĐỘNG ZOOM MÀN HÌNH CHẾT CHÓC làm vỡ nát layout khi khách điền Form.

---

## MỤC 2: QUẢN LÝ MÀN HÌNH KHÔNG TRANH CHẤP (Desktop Scalability)

Desktop mang lại sự rộng rãi, nhưng quá rộng sẽ dẫn tới loãng nội dung.

### 2.1. Căn Độ Rộng Mắt Đọc (Reading Line Length)
- Các đoạn text mô tả dài/thuyết phục (Sales Copy) **không bao giờ được phép** kéo dài vô tận từ trái qua phải trên Desktop. 
- Giới hạn dòng lý tưởng là `ch-60` đến `ch-80` hoặc giới hạn khung bài rà soát độ tĩnh (`max-width: 800px`).

### 2.2. Kiểm Soát Trạng Thái Chuột (Hover State Pitfalls)
- **Luật Cứng:** Trên Desktop, mọi thứ tương tác được đều PHẢI có `:hover` (Đổi màu nhẹ, nổi bóng, mũi tên di chuyển).
- **Tuy nhiên:** `:hover` là tính năng gây TAI HỌA trên Mobile (Mobile lưu trạng thái hover thành 1 lần nhấp kép - Sticky Hover). 
- *Cách giải quyết tiêu chuẩn:* Luôn quấn hiệu ứng Hover trong `[ @media (hover: hover) ]{}` hoặc áp dụng thư viện CSS Utility chuẩn. Trên Mobile, ưu tiên dùng `:active` (`transform: scale(0.98)`).

---

## MỤC 3: MƯỢT MÀ TÂM LÝ & BẢO VỆ CHỈ SỐ LỖI (Micro-Interactions & CLS)

### 3.1. Phản Hồi Tựa Haptic (Haptic-Like Visual Feedback)
Bất cứ khi nào người dùng tương tác với App, họ cần thấy ngay kết quả trên hệ thần kinh mắt:
- **Button Click:** Phải lún xuống 1 chút (`active:scale-95`).
- **Loaders:** Khi submit form hoặc tải dữ liệu, Button phải hiện Icon quay (Spinner) & Vô hiệu hoá Click lần 2 (`disabled={true}`). Khách hay có tật bấm điên cuồng báo Submit.

### 3.2. Chống Rung Cấu Trúc (Cumulative Layout Shift - CLS)
Mọi bức ảnh (`<img>`) chèn vào cấu trúc đều BẮT BUỘC:
- Áp dụng CSS dạng tỷ lệ cứng: `aspect-ratio`, hoặc Khai báo rõ `width` và `height`.
- Việc tải ảnh từ thẻ chậm sẽ làm vỡ Layout khi Render lại trang, đẩy mắt người dùng trật khỏi nút bấm dẫn tới UX tồi tệ.

---

## 🛑 AGENT CHECKLIST KHI THAO TÁC GIAO DIỆN MỚI
Mỗi khi AI Agent nhận lệnh code hoặc thiết kế mới trên bất kỳ File Frontend nào, Agent PHẢI dừng lại 1 giây tự duyệt:
1. `[ ]` Mình đã set `env(safe-area)` và `padding` đủ cho nút bấm dùng ngón cái chưa?
2. `[ ]` Touch targets đã đủ 44px chưa?
3. `[ ]` Font chữ trong form Input có vướng lỗi bị zoom (bé hơn 16px) không?
4. `[ ]` Khi click vào button/card, trạng thái `:active` bóp lún đã được chèn chưa?

*(Hoàn tất kiểm duyệt. Tuân lệnh tuyệt đối)*
