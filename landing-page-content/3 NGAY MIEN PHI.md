# 🆓 3 NGÀY MIỄN PHÍ — ĐẦU PHỄU THU LEAD

**Giá**: 0đ
**Vị trí phễu**: Đầu phễu — Thu Lead → Chuyển vào Zalo Group
**Mục tiêu duy nhất**: Lấy Tên + Email + SĐT → Redirect Zalo Group + Gửi email xác nhận có nút "Thêm vào Lịch"

---

## 🔄 LUỒNG HOẠT ĐỘNG

```
1. Khách vào Landing Page
2. Điền Form: Tên, Email, SĐT
3. Bấm "Đăng Ký"
      │
      ├── Ngay lập tức → Redirect sang Link Zalo Group
      │
      └── Tự động gửi Email:
            ├── ✅ Xác nhận đăng ký thành công
            ├── 📅 Nút "THÊM VÀO LỊCH" (Google Calendar)
            ├── 💬 Link Zalo Group (backup)
            └── ⏰ Nhắc lịch 3 buổi
```

---

## 📐 NỘI DUNG LANDING PAGE

### PHẦN 1: HERO — Đơn giản, rõ ràng

**Badge**:
```
🆓 WORKSHOP MIỄN PHÍ
```

**Headline**:
> # 3 Buổi Tối Thực Hành AI
> Tự tay build ứng dụng — Không cần biết code

**Sub-headline**:
> Đăng ký miễn phí. Tham gia nhóm Zalo. Học LIVE 3 buổi tối.

**Thông tin buổi học**:
- 📅 3 buổi tối | 19h30 - 21h00
- 💻 LIVE qua Zoom
- 👨‍💻 Hướng dẫn: Mr. Hưng NPV

---

### PHẦN 2: 3 BUỔI HỌC GÌ?

> **Buổi 1** — Kích hoạt AI + Build Chatbot đầu tiên
> **Buổi 2** — Nâng cấp: Công cụ bán hàng AI
> **Buổi 3** — Cách biến AI thành thu nhập

---

### PHẦN 3: FORM ĐĂNG KÝ (3 trường)

> - Họ tên *
> - Email *
> - Số điện thoại *
>
> ```
> [ ĐĂNG KÝ MIỄN PHÍ ]
> ```

**Sau khi bấm → Redirect sang Link Zalo Group**

---

### PHẦN 4: FOOTER

> © 2026 HUNGNPV | 🔒 Bảo mật SSL

---

## 📅 CƠ CHẾ EMAIL + TỰ ĐỘNG LÊN LỊCH

### Khi khách đăng ký thành công → Gửi 1 email duy nhất:

**Subject**: ✅ Xác nhận đăng ký — 3 Buổi Tối Thực Hành AI

**Nội dung email**:
```
Chào [Tên],

Bạn đã đăng ký thành công Workshop 3 Buổi Tối Thực Hành AI.

📅 LỊCH HỌC:
━━━━━━━━━━━━━━━━━
 Buổi 1: [Ngày] | 19h30 - 21h00
 Buổi 2: [Ngày] | 19h30 - 21h00
 Buổi 3: [Ngày] | 19h30 - 21h00
━━━━━━━━━━━━━━━━━

👇 MỞ FILE ĐÍNH KÈM "workshop-ai.ics" ĐỂ THÊM CẢ 3 BUỔI VÀO LỊCH
   (1 lần bấm = 3 sự kiện + nhắc nhở tự động trước 30 phút)

💬 THAM GIA NHÓM ZALO:
 [ VÀO NHÓM ZALO NGAY ]

Link Zoom sẽ được gửi trong nhóm Zalo trước mỗi buổi học.

— Hưng NPV
```

---

### 🔧 KỸ THUẬT: LINK "THÊM VÀO GOOGLE CALENDAR"

Mỗi nút "Thêm vào Lịch" là 1 URL dạng:

```
https://calendar.google.com/calendar/r/eventedit
  ?text=Workshop+AI+Buổi+1+-+Kích+hoạt+AI+%26+Build+Chatbot
  &dates=20260501T123000Z/20260501T140000Z
  &details=🔗 Link Zoom: [URL]%0A%0AHướng dẫn: Mr. Hưng NPV
  &location=Online+-+Zoom
```

**Tham số**:
| Tham số | Ý nghĩa | Ví dụ |
|---------|---------|-------|
| `text` | Tên sự kiện | Workshop AI Buổi 1 |
| `dates` | Thời gian bắt đầu/kết thúc (UTC) | 20260501T123000Z/20260501T140000Z |
| `details` | Mô tả + Link Zoom | Link Zoom + nội dung buổi học |
| `location` | Địa điểm | Online - Zoom |

**Lưu ý**: Thời gian dùng format UTC (giờ VN - 7h). VD: 19h30 VN = 12h30 UTC.

### Cách tích hợp vào hệ thống:

```
1. Admin cấu hình:
   - Ngày bắt đầu workshop (VD: 01/05/2026)
   - Link Zoom
   - Link nhóm Zalo

2. API gửi email (Vercel + Nodemailer):
   - Nhận dữ liệu form (tên, email, sđt)
   - Tự động tạo 3 link Google Calendar cho 3 buổi
   - Render email HTML chứa 3 nút "Thêm vào Lịch"
   - Gửi email

3. Khách bấm nút → Mở Google Calendar → Sự kiện tự điền sẵn → Bấm Save
   → Google tự nhắc nhở trước 30 phút
```

---

## 🧭 CHIẾN LƯỢC (giữ đơn giản)

```
Landing Page: Ngắn gọn, rõ ràng, không pitch quá
  → Mục tiêu duy nhất: LẤY THÔNG TIN
  → Không nói về giá, không upsell
  → Chỉ nói: "3 buổi tối, miễn phí, học thực hành AI"

Zalo Group: Nơi nuôi dưỡng, gửi link Zoom, tương tác
Email: Xác nhận + Lên lịch tự động (Google Calendar)

Upsell STARTER chỉ xảy ra ở Buổi 3 (trong Zoom LIVE)
  — Không xảy ra trên Landing Page này
```
