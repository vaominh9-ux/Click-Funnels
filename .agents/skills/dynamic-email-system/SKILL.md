---
description: Hướng dẫn setup Hệ Thống Quản Trị Email Động với Visual Editor, kết nối Supabase, và gửi tự động qua Vercel API + Nodemailer.
---

# Dynamic Email System (Hệ Thống Quản Trị Email Động)

Hệ thống cho phép Quản trị viên tùy chỉnh giao diện và nội dung Email bằng HTML trực tiếp trên giao diện Admin, hỗ trợ **Live Visual Editor** (wysiwyg thông qua iFrame) và thay thế biến số tự động (dynamic variables) khi gửi.

Kỹ sư AI **PHẢI** đọc và làm theo tuần tự 4 bước sau khi User yêu cầu "cài đặt hệ thống email" cho dự án mới.

---

## BƯỚC 1: Khởi tạo Database (Supabase)

Hệ thống lưu cấu hình qua một bảng chung tên là `system_settings`. Cần đảm bảo file Migration sau được chạy trên DB.

**SQL Table:**
```sql
CREATE TABLE IF NOT EXISTS public.system_settings (
    key text PRIMARY KEY,
    value jsonb NOT NULL,
    updated_at timestamp with time zone DEFAULT now(),
    updated_by uuid REFERENCES auth.users(id)
);
```

**Các Key cần thiết khởi tạo:**
- `email_template_registration` (subject, htmlBody)
- `email_template_payment` (subject, htmlBody)

---

## BƯỚC 2: Tích hợp Giao diện Quản trị Email (React / Vite)

Tạo trang **`src/pages/admin/EmailSettings.jsx`**. Luôn đảm bảo:
1. Giao diện chia 2 phần: Chỉnh sửa (Trái) và Hướng dẫn (Phải).
2. Tích hợp thanh Toolbar có 2 chế độ: **Trực Quan** (Visual Mode - iFrame) và **Mã Code** (Code Mode - Textarea).
3. Sử dụng `iframe` với thuộc tính `doc.designMode = 'on'` để biến nó thành một Visual Editor nguyên bản. KHÔNG nên cài thêm các thư viện WYSIWYG nặng nề vì sẽ làm bể layout HTML có sẵn.
4. Gắn hàm `handleSendTest()` để test ngay trên UI.

**Đoạn code Core cho Visual Editor (useEffect hook):**
```javascript
  useEffect(() => {
    if (viewMode === 'visual' && iframeRef.current) {
      const doc = iframeRef.current.contentDocument;
      if (doc) {
        doc.open();
        doc.write(currentHtml);
        doc.close();
        doc.designMode = 'on';

        // Xóa scrollbar cho đẹp
        const style = doc.createElement('style');
        style.textContent = `
          body { cursor: text; }
          ::-webkit-scrollbar { width: 8px; }
          ::-webkit-scrollbar-thumb { background: #333; }
        `;
        doc.head.appendChild(style);

        const handleInput = () => {
          const docHTML = doc.body.innerHTML;
          const cssText = doc.body.style.cssText;
          const headHTML = doc.head.innerHTML;
          const html = '<!DOCTYPE html>\\n<html>\\n<head>\\n' + headHTML + '\\n</head>\\n<body style="' + cssText + '">\\n' + docHTML + '\\n</body>\\n</html>';
          let cleanHtml = html.replace(new RegExp('<style>[^<]*cursor: text[^<]*</style>', 'g'), '');
          setHtmlContent(cleanHtml);
        };
        doc.body.addEventListener('input', handleInput);
      }
    }
  }, [viewMode, currentHtml]);
```

**Thiết kế CSS chuẩn (`EmailSettings.css`):**
Quy tắc: Sử dụng Light Theme nền trắng (`#FFFFFF`), `padding: 0`, chia Grid chuẩn (`grid-template-columns: 1fr 300px;`) đồng bộ với các trang hệ thống. Card bọc lại với Box Shadow chuẩn (`0 1px 3px rgba(0,0,0,0.06)`).

---

## BƯỚC 3: Xây dựng Backend Gửi Email Cơ Bản (Serverless Function)

Backend sử dụng Nodemailer. Tất cả hàm gửi email cần:
1. Load nội dung Template trực tiếp từ bảng `system_settings`.
2. Tạo hàm phân tích và thay thế biến (Dynamic Var Replacement).

**Hàm Replace Variable Mẫu:**
```javascript
const replaceTemplateVariables = (template, data) => {
  if (!template) return '';
  let result = template;
  for (const [key, value] of Object.entries(data)) {
    const regex = new RegExp(\`\\{\\{$\{key}\\}\\}\`, 'g');
    result = result.replace(regex, value);
  }
  return result;
};
```

**Logic Gửi Template:**
```javascript
import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';

// Thay the regex và tao nodemailer transporter o day.

export default async function handler(req, res) {
  // 1. Fetch template tu DB
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
  const { data: tmplData } = await supabase.from('system_settings').select('value').eq('key', 'email_template_registration').single();
  
  // 2. Lay du lieu tu template hoặc cung cap fallback
  const subject = tmplData?.value?.subject || 'Fallback Subject';
  const htmlBody = tmplData?.value?.htmlBody || 'Fallback HTML';

  // 3. Noi vao bien Replace 
  const finalSubject = replaceTemplateVariables(subject, payloadTieuChuan);
  const finalHtml = replaceTemplateVariables(htmlBody, payloadTieuChuan);

  // 4. Send thong qua Nodemailer...
}
```

---

## BƯỚC 4: Tạo Cơ Chế Test Nhanh (API Route)

Luôn luôn tạo Route `/api/email/send-test`. Route này đóng vai trò gửi trực tiếp `subject` và `htmlBody` nhận từ Frontend thay vì đọc DB. Điều này giúp Admin "Gửi Test Mẫu Này" ngay khi đang chỉnh sửa chưa cần bấm "Lưu".

### Cấu trúc Mock Data chuẩn cho hàm Send-Test:
```javascript
    const testData = {
      firstName: 'Tên Ngắn',
      name: 'Tên Đầy Đủ (Test)',
      courseName: 'Khóa Học Demo',
      formattedPrice: '990,000',
      paymentCode: 'TESTCODE',
      year: new Date().getFullYear().toString(),
      bankName: 'VCB',
      accountNo: 'xxxx123456',
      accountName: 'TEST USER',
      formattedDate: new Date().toLocaleString('vi-VN')
    };
```

---
*Lưu ý bảo mật: Mật khẩu ứng dụng Email (GMAIL_APP_PASSWORD) phải luôn giữ ở cấu hình Environment Variables (`.env`) không được hardcode.*
