---
name: vercel-api-fetch-standards
description: Cẩm nang cốt lõi sửa lỗi kết nối Fetch API, CORS localhost, và lỗi 500 Syntax Error ở Vercel Serverless NodeJS.
---

# 🚀 Vercel API & Error Handling Standards

Kỹ năng này là bộ quy tắc sống còn mà AI Agent **BẮT BUỘC ĐỌC VÀ LÀM THEO** khi xử lý bất kỳ Logic gọi API, Fetch/Gửi dữ liệu, hoặc viết hàm Backend (Serverless Vercel) trên dự án React/Vite. Kỹ năng này được tổng hợp từ bài học xương máu chống lại lỗi "Failed to fetch" và "500 Internal Server".

---

## 📌 1. LỖI FETCH URL (VITE LOCALHOST VS VERCEL PROD)
Khi React (Vite) gọi một hàm Backend (API) nội bộ (ví dụ: `/api/email/xyz`), cấu trúc URL cần phải thích ứng với cả 2 môi trường: lúc Dev ở Local và lúc chạy Live trên Vercel. 
- Ở Local: Frontend (5173) gọi `/api...` sẽ bị 404 vì Vite không gánh Backend. Phải trỏ sang `http://localhost:3000` (nơi `vercel dev` đang chạy).
- Ở Production: Nếu gán cứng chữ `localhost:3000` thì web trên mạng sẽ tự chọc ngược về máy chủ cục bộ gây lỗi Failed to fetch.

**✅ GIẢI PHÁP CHUẨN:** Luôn bọc hàm Fetch theo quy tắc cấu hình biến định tuyến (Routing variables).
```javascript
// KIỂU CHUẨN (Áp dụng cho mọi API call React):
const baseUrl = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:3000' : '');

fetch(`${baseUrl}/api/v1/your-endpoint`, {
  method: 'POST',
...
```
*Lưu ý: Không dùng kiểm tra Node `process.env.NODE_ENV` ở phía Frontend vì Vite dùng `import.meta.env`.*

---

## 📌 2. SÁT THỦ NGẦM: LỖI CÚ PHÁP Ở SERVERLESS
Khi làm việc với các file Backend API (`.js`), AI hoặc các hệ thống chèn nội dung thường vô tình sinh ra ký tự chéo ngược Escape `\` trước các biến Template Literals JS.
Ví dụ sai lầm: 
`const auth = \`Bearer \${SUPABASE_KEY}\`;`
-> Nếu bị dính chữ `\${`, Node.js ngay lập tức dừng chạy, tung lỗi Syntax Error, và toàn bộ Route đó sẽ trả về `500 Server Error` ngay trước cả khi nó kịp In ra Log.

**✅ QUY TRÌNH Fix & Phòng Bệnh Bắt Buộc cho AI:**
1. Khi viết nội dung code Backend NodeJS, tuyệt đối KHÔNG escape dấu phân tách biến (`${}`) thành dạng chuỗi nguyên thuỷ. Phải giữ nguyên: `const auth = \`Bearer ${SUPABASE_KEY}\`;`
2. Sau khi ghi hoặc sửa file Serverless, **AI Agent BẮT BUỘC PHẢI CHẠY LỆNH TEST:**
`node path/to/api/file.js`
Nó sẽ phun lỗi ngay lập tức ra terminal nếu thiếu móc, thừa ngoặc, hoặc dính Backslash. Nếu chạy xong không báo gì tức là file sạch. Mới được báo cáo hoàn tất cho User.

---

## 📌 3. KHÔNG BAO GIỜ DÙNG FETCH "TU MÙ" (SILENT FAILURES)
Các tác vụ bất đồng bộ mang tính quyết định (như Gửi Mail Biên Lai, Thanh Toán) ở màn hình chốt Sale, tuyệt đối không được dùng Catch âm thầm (`.catch(err => console.log(err))`). Điều này khiến User (Admin) lầm tưởng hệ thống đang trơn tru trong khi nó đang gãy nát.

**✅ GIẢI PHÁP:**
Phải thiết lập Hệ thống Toaster thông báo hiển thị lên màn hình người thiết lập / người dùng để họ biết có sự cố API:

```javascript
// Gọi Toaster UI đầu tiên
addToast('Đang gọi API...', 'info');

fetch(...).then(async r => {
  const data = await r.json();
  if (r.ok && data.success) {
    addToast('Hoàn tất thành công!', 'success');
  } else {
    // Luôn bắn lỗi Response rõ ràng lên UI
    addToast('Lỗi Server: ' + (data.message || r.statusText), 'error');
  }
}).catch(err => {
  // Lỗi mạng hoặc URL Fail sẽ rơi vào đây
  addToast('Lỗi Mạng/CORS: Không thể kết nối tới máy chủ.', 'error');
});
```

---
*TÓM LẠI: Định tuyến bằng DEV Env -> Báo lỗi rành mạch ra UI -> Kiểm tra Syntax NodeJS trước khi báo User gật đầu.*
