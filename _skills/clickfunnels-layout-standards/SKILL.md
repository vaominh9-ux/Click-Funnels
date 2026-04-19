---
name: clickfunnels-layout-standards
description: Hướng dẫn cốt lõi về quy tắc bảo vệ Padding, CSS Component và Margin Layout của hệ thống ClickFunnels tránh làm vỡ UI toàn cục.
---

# 🚀 Quy Chuẩn Layout & Giao Diện: ClickFunnels Project

Bộ kỹ năng này PHẢI ĐƯỢC AI AGENT ĐỌC KỸ TRƯỚC KHI thực hiện và chỉnh sửa bất kỳ giao diện, layout hoặc CSS nào trên dự án ClickFunnels (Vite + React) của người dùng.

## 📌 1. QUY TẮC BẢO VỆ PADDING (THE "DOUBLE-PADDING" TRAP)

Tất cả các khu vực làm việc (Page Components) được định tuyến trong `App.jsx` thông qua `<MainLayout>` hoặc `<AffiliateLayout>` đều **đã được tự động bọc trong class `.page-wrapper`**.

- Thẻ `.page-wrapper` trong `index.css` thực chất đã cài sẵn mức lề (padding) mặc định chuẩn của toàn bộ hệ thống là: `padding: 32px 40px;`

**❌ TUYỆT ĐỐI KHÔNG LÀM:**
Không được tự ý thêm `padding: 24px` hay `padding: 32px` vào thẻ bao bọc (Wrapper/Container) của Component Trang đó nữa. Hành động này sẽ gây ra lỗi **Cộng Dồn Lề (Double-Padding)** đẩy tụt màn hình hoặc làm lệch mép trái khiến tiêu đề lệch so với thanh TopNav (giống y hệt lỗi đã xảy ra trên trang Campaign Manager).

**✅ GIẢI PHÁP:**
- Khi build trang mới, hãy set class container wrapping là `padding: 0;` (VD: `.crm-container { padding: 0 }`).
- Để `page-wrapper` lo việc dãn cách lề tổng thể.

---

## 📌 2. QUY TẮC CÔ LẬP CSS KHI NÂNG CẤP GIAO DIỆN (ISOLATION)

Hệ thống sở hữu rất nhiều CSS Core dùng chung (Global Classes) như `.stats-grid`, `.cf-card`, v.v... Nếu bạn thực hiện "Nâng Cấp Giao Diện Dribbble" hay làm lưới 2 cột:

- **Tuyệt đối Không Overwrite (Đè code) trực tiếp lên thẻ cũ:** Nếu bạn chỉnh thẻ `.stats-grid` trong file `Dashboard.css`, bạn sẽ vô tình phá nát giao diện ở màn hình Nhân Sự (`StaffManagement.jsx`) hay Màn hình Admin khác vì chúng đang "mượn" class này.
- **Phương pháp Cô Lập hoàn toàn:** Tạo CSS mới hoàn toàn như `DashboardDribbble.css` và dùng class tên mới hoàn toàn (ví dụ `.dashboard-grid-new`). Sau đó import file này vào màn hình yêu cầu. Trả các class gốc về nguyên vẹn để bảo vệ ứng dụng.

---

## 📌 3. LƯU Ý KHI GHI FILE CSS / UTF-16 POWERSHELL BUG

Khi chèn hoặc sửa đổi các file CSS có chứa tiếng Việt hoặc cấu trúc sâu trong Source Code:
- **KHÔNG DÙNG:** Các câu lệnh PowerShell như `Add-Content` hay `echo >>`. Môi trường Windows của user có thể render ra UTF-16 LE BOM làm rỗng và hỏng hóc toàn bộ cấu trúc Cascading Style Sheets.
- **BẮT BUỘC DÙNG:** Sử dụng `default_api:multi_replace_file_content` , `write_to_file` hoặc nếu xé rào bằng terminal thì phải dùng chuẩn thao tác bằng Node (`node -e "fs.writeFileSync(...)"`).

---

## 📝 Tóm Lược
- Khi lệch lề trái: Kiểm tra thử ngay padding của thẻ con liệu đang bị gán thêm không. Trả nó về `0`.
- Khi thiết kế riêng lẻ: Viết class riêng, dùng tên biến thể thay vì chèn ép lên layout gốc.
- Khi avatar bị lỗi ảnh không hiện trên thanh header: Nhớ rằng Database hiện tại đang lưu `avatar_url` dưới dạng **Đường link đầy đủ (Absolute URL)**, vì vậy Agent KHÔNG ĐƯỢC bọc thêm lệnh `supabase.storage.getPublicUrl` bên ngoài nữa, mà phải trích xuất thẳng `data.avatar_url`.
