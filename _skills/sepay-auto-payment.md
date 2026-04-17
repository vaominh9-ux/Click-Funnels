---
name: sepay-auto-payment
description: Hướng dẫn toàn diện tích hợp SePay Webhook để xác nhận thanh toán tự động cho Landing Page. Bao gồm cấu hình SePay, Vercel API, Supabase DB, và Checkout UI với polling xác nhận realtime.
---

# SePay Auto Payment — Skill Tích Hợp Thanh Toán Tự Động

## Tổng Quan

Skill này hướng dẫn tích hợp **SePay Webhook** vào bất kỳ Landing Page nào sử dụng stack:
- **Frontend**: Vite + React
- **Backend**: Vercel Serverless Functions
- **Database**: Supabase (PostgreSQL)
- **Payment QR**: VietQR API

### Luồng Hoạt Động

```
Khách hàng → Điền form → Tạo đơn (payment_code: CF-XXXXXX)
                ↓
           Quét QR → Chuyển khoản (nội dung: CF-XXXXXX)
                ↓
           SePay phát hiện giao dịch → POST webhook
                ↓
           Vercel API nhận → Tìm đơn theo mã → status = "approved"
                ↓
           Checkout polling 3s → Phát hiện "approved" → Hiện ✅ Thành công
```

---

## Yêu Cầu Trước Khi Bắt Đầu

### Tài khoản cần có:
1. **SePay** — [my.sepay.vn](https://my.sepay.vn) (đăng ký miễn phí)
2. **Supabase** — [supabase.com](https://supabase.com)
3. **Vercel** — [vercel.com](https://vercel.com)

### Thông tin cần thu thập:
| Thông tin | Ví dụ | Ghi chú |
|-----------|-------|---------|
| BIN Code ngân hàng | `970418` (BIDV) | [Danh sách BIN](https://www.vietqr.io/danh-sach-ngan-hang) |
| Số tài khoản VA | `96247NTH195` | Tài khoản ảo từ SePay |
| Tên chủ TK | `NGUYEN TRONG HUU` | Viết HOA, không dấu |
| SePay API Key | `ZWTFXPVR2EJ...` | Lấy từ SePay Dashboard |
| Supabase URL | `https://xxx.supabase.co` | Settings → API |
| Supabase Anon Key | `sb_publishable_...` | Settings → API Keys |
| Supabase Service Key | `sb_secret_...` | Settings → API Keys (Secret) |

### Bảng BIN Code phổ biến:
| Ngân hàng | BIN Code |
|-----------|----------|
| BIDV | `970418` |
| Vietcombank | `970436` |
| MB Bank | `970422` |
| Techcombank | `970407` |
| VPBank | `970432` |
| ACB | `970416` |
| TPBank | `970423` |
| Sacombank | `970403` |

---

## Bước 1: Database Migration

### 1.1 Thêm cột hỗ trợ thanh toán

Chạy SQL trên **Supabase SQL Editor**:

```sql
-- Thêm cột vào bảng conversions (hoặc bảng orders tương đương)
ALTER TABLE public.conversions 
ADD COLUMN IF NOT EXISTS payment_code TEXT UNIQUE;

ALTER TABLE public.conversions 
ADD COLUMN IF NOT EXISTS sepay_ref TEXT;

ALTER TABLE public.conversions 
ADD COLUMN IF NOT EXISTS sepay_transaction_id BIGINT;

ALTER TABLE public.conversions 
ADD COLUMN IF NOT EXISTS paid_at TIMESTAMPTZ;

-- Index tìm kiếm nhanh
CREATE INDEX IF NOT EXISTS idx_conversions_payment_code 
ON public.conversions(payment_code);

CREATE INDEX IF NOT EXISTS idx_conversions_sepay_ref 
ON public.conversions(sepay_ref);
```

### 1.2 Tạo RPC function kiểm tra trạng thái (bypass RLS)

> **QUAN TRỌNG**: Trang checkout thường KHÔNG YÊU CẦU đăng nhập (public page). Do đó RLS sẽ chặn SELECT. Cần tạo function SECURITY DEFINER để bypass.

```sql
CREATE OR REPLACE FUNCTION public.check_payment_status(p_payment_code TEXT)
RETURNS TEXT AS $$
  SELECT status FROM public.conversions 
  WHERE payment_code = p_payment_code 
  LIMIT 1;
$$ LANGUAGE SQL SECURITY DEFINER;
```

### 1.3 Đảm bảo RLS cho phép INSERT từ public

```sql
-- Kiểm tra policy INSERT đã mở cho public chưa
-- Nếu chưa có, thêm:
CREATE POLICY "Public can insert conversions" 
ON public.conversions FOR INSERT 
WITH CHECK (true);
```

---

## Bước 2: Cấu hình Bank + QR (Frontend)

### 2.1 File config

```javascript
// src/pages/funnels/config.js (hoặc tương đương)
export const BANK_CONFIG = {
  bankId: '970418',         // BIN Code ngân hàng
  accountNo: '96247NTH195', // Số tài khoản VA
  accountName: 'NGUYEN TRONG HUU', // Tên chủ TK (viết HOA)
};
```

### 2.2 Sinh mã thanh toán duy nhất

```javascript
// Sinh mã CF + 6 ký tự ngẫu nhiên (bỏ I,O,0,1 tránh nhầm lẫn)
const generatePaymentCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'CF'; // Prefix có thể đổi: DH, PAY, ORDER...
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};
```

### 2.3 Tạo QR VietQR

```javascript
const amount = 10000; // Số tiền
const paymentCode = 'CFABC123'; // Mã thanh toán
const qrImage = `https://img.vietqr.io/image/${BANK_CONFIG.bankId}-${BANK_CONFIG.accountNo}-print.png?amount=${amount}&addInfo=${paymentCode}&accountName=${encodeURIComponent(BANK_CONFIG.accountName)}`;
```

---

## Bước 3: Vercel API Route (Webhook Receiver)

### 3.1 Tạo file `api/sepay-webhook.js`

```javascript
// Vercel Serverless Function — SePay Webhook Receiver
// Route: POST /api/sepay-webhook

export default async function handler(req, res) {
  // Chỉ chấp nhận POST
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  // Xác thực API Key từ SePay
  const authHeader = req.headers['authorization'] || '';
  const expectedKey = process.env.SEPAY_API_KEY;
  
  if (expectedKey && authHeader !== `Apikey ${expectedKey}`) {
    console.warn('SePay webhook: Invalid API Key');
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  // ⚠️ BẮT BUỘC dùng SUPABASE_SERVICE_KEY (bypass RLS)
  const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY; // KHÔNG dùng anon key!

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('Missing Supabase credentials');
    return res.status(500).json({ success: false, message: 'Server config error' });
  }

  try {
    const data = req.body;
    console.log('SePay webhook received:', JSON.stringify(data));

    // Chỉ xử lý tiền VÀO
    if (data.transferType !== 'in') {
      return res.status(200).json({ success: true, message: 'Ignored: not incoming' });
    }

    const transferAmount = Number(data.transferAmount) || 0;
    const referenceCode = data.referenceCode || '';
    const sepayId = data.id;
    const transactionDate = data.transactionDate;
    const content = data.content || '';

    // Tìm mã thanh toán: ưu tiên SePay code, fallback regex content
    let matchCode = data.code;
    if (!matchCode) {
      // Tìm pattern CF + 6-8 ký tự trong nội dung CK
      const codeMatch = content.match(/CF[- ]?([A-Z0-9]{6,8})/i);
      if (codeMatch) {
        matchCode = 'CF' + codeMatch[1].replace('-', '');
      }
    }

    if (!matchCode) {
      return res.status(200).json({ success: true, message: 'No payment code found' });
    }

    matchCode = matchCode.replace(/-/g, '').toUpperCase();

    // --- CHỐNG TRÙNG LẶP ---
    const checkDupRes = await fetch(
      `${SUPABASE_URL}/rest/v1/conversions?sepay_ref=eq.${referenceCode}&select=id`,
      { headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` } }
    );
    const dupData = await checkDupRes.json();
    if (Array.isArray(dupData) && dupData.length > 0) {
      return res.status(200).json({ success: true, message: 'Duplicate' });
    }

    // --- TÌM ĐƠN HÀNG ---
    const findRes = await fetch(
      `${SUPABASE_URL}/rest/v1/conversions?payment_code=eq.${matchCode}&status=eq.pending&select=id,sale_amount`,
      { headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` } }
    );
    const orders = await findRes.json();

    if (!Array.isArray(orders) || orders.length === 0) {
      return res.status(200).json({ success: true, message: 'No matching order' });
    }

    // --- CẬP NHẬT → APPROVED ---
    const order = orders[0];
    const updateRes = await fetch(
      `${SUPABASE_URL}/rest/v1/conversions?id=eq.${order.id}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          status: 'approved',
          sepay_ref: referenceCode,
          sepay_transaction_id: sepayId,
          paid_at: transactionDate || new Date().toISOString()
        })
      }
    );

    if (!updateRes.ok) {
      const errText = await updateRes.text();
      console.error('Failed to update:', errText);
      return res.status(500).json({ success: false, message: 'Update failed' });
    }

    console.log(`Order ${order.id} → APPROVED ✅`);
    return res.status(200).json({ success: true, message: 'Payment verified' });

  } catch (error) {
    console.error('Webhook error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
}
```

---

## Bước 4: Checkout Page (React)

### 4.1 Luồng chính

```javascript
// 1. Sinh mã thanh toán khi mount
const [paymentCode] = useState(generatePaymentCode());

// 2. Khi bấm "Xác Nhận" → INSERT đơn vào DB
const { error } = await supabase
  .from('conversions')
  .insert([{
    payment_code: paymentCode,
    sale_amount: amount,
    status: 'pending',
    customer_name: '...',
    // ... other fields
  }]);
// ⚠️ KHÔNG dùng .select().single() sau INSERT (RLS chặn SELECT cho public user)

// 3. Polling kiểm tra trạng thái mỗi 3 giây
useEffect(() => {
  if (paymentStatus !== 'waiting') return;
  
  const poll = setInterval(async () => {
    const { data } = await supabase
      .rpc('check_payment_status', { p_payment_code: paymentCode });
    
    if (data === 'approved') {
      setPaymentStatus('success');
      clearInterval(poll);
    }
  }, 3000);
  
  return () => clearInterval(poll);
}, [paymentStatus, paymentCode]);
```

### 4.2 Các trạng thái UI

| State | Hiển thị |
|-------|----------|
| `idle` | Form + QR + nút "Xác Nhận & Chuyển Khoản" |
| `waiting` | "Đang chờ xác nhận...", timer đếm, spinner |
| `success` | ✅ "Thanh toán thành công!", chi tiết đơn |
| `error` | ⚠️ "Đã xảy ra lỗi", nút thử lại |

---

## Bước 5: Cấu Hình SePay Dashboard

### 5.1 Thêm Webhook

Vào **[my.sepay.vn/webhooks](https://my.sepay.vn/webhooks)** → **+ Thêm Webhooks**:

| Cài đặt | Giá trị |
|---------|---------|
| Sự kiện | Có tiền vào |
| Tài khoản | Chọn TK BIDV (hoặc TK đã liên kết) |
| Gọi đến URL | `https://YOUR-DOMAIN.vercel.app/api/sepay-webhook` |
| Xác thực thanh toán | ✅ Đúng |
| Kiểu chứng thực | **API Key** |
| API Key | Paste key SePay API của bạn |
| Content type | `application/json` |

### 5.2 Kiểm tra

- Vào **Nhật ký → Nhật ký Webhooks** để xem log
- Dùng **Giả lập giao dịch** để test (nếu có)
- Test chuyển khoản thật với số tiền nhỏ (10.000đ)

---

## Bước 6: Vercel Environment Variables

Thêm trên **Vercel Dashboard → Settings → Environment Variables**:

| Key | Value | Mục đích |
|-----|-------|----------|
| `VITE_SUPABASE_URL` | `https://xxx.supabase.co` | Frontend build |
| `VITE_SUPABASE_ANON_KEY` | `sb_publishable_...` | Frontend auth |
| `VITE_APP_URL` | `https://your-app.vercel.app` | App URL |
| `SUPABASE_SERVICE_KEY` | `sb_secret_...` | **Server-side bypass RLS** |
| `SEPAY_API_KEY` | SePay API Key | Xác thực webhook |

> ⚠️ **QUAN TRỌNG**: `SUPABASE_SERVICE_KEY` PHẢI là Service Role key (bypass RLS). KHÔNG dùng Anon Key cho webhook vì RLS sẽ chặn SELECT/UPDATE.

---

## Bẫy Thường Gặp (Gotchas)

### 🔴 Lỗi 1: "No matching order"
**Nguyên nhân**: Khách chuyển tiền TRƯỚC khi bấm "Xác Nhận", đơn chưa tạo trong DB.  
**Fix**: Đảm bảo UI buộc user bấm tạo đơn trước → sau đó mới hiện QR.

### 🔴 Lỗi 2: INSERT fail trên production (nhưng local OK)
**Nguyên nhân**: Dùng `.select().single()` sau INSERT. RLS chặn SELECT cho user không đăng nhập.  
**Fix**: Bỏ `.select().single()`, dùng `payment_code` làm key thay vì DB id.

### 🔴 Lỗi 3: Webhook trả 401 Unauthorized
**Nguyên nhân**: API Key trên SePay khác với key trên Vercel env.  
**Fix**: Đảm bảo cùng 1 key ở cả 2 nơi. SePay gửi header `Authorization: Apikey YOUR_KEY`.

### 🔴 Lỗi 4: Realtime subscription không nhận update
**Nguyên nhân**: Supabase Realtime bị RLS chặn cho anonymous user.  
**Fix**: Dùng **polling** với RPC function `SECURITY DEFINER` thay vì Realtime.

### 🔴 Lỗi 5: Vercel env vars không có hiệu lực
**Nguyên nhân**: Biến `VITE_*` cần có lúc BUILD TIME. Thêm env sau deploy → phải **Redeploy**.  
**Fix**: Sau khi thêm/sửa env → bấm Redeploy trên Vercel.

### 🔴 Lỗi 6: .env bị push lên Git (lộ API key)
**Fix**: Thêm `.env` vào `.gitignore` + `git rm --cached .env` để xóa khỏi tracking.

---

## Checklist Triển Khai Nhanh

```
□ 1. Thu thập: BIN code, số TK, tên TK, SePay API Key
□ 2. Chạy migration SQL (thêm cột + function)
□ 3. Tạo file config.js (BANK_CONFIG)
□ 4. Tạo api/sepay-webhook.js
□ 5. Cập nhật Checkout.jsx (payment code + polling)
□ 6. Thêm CSS cho trạng thái waiting/success
□ 7. Push code lên Git
□ 8. Thêm env vars trên Vercel (5 biến)
□ 9. Cấu hình webhook trên SePay Dashboard
□ 10. Test chuyển khoản thật
□ 11. Kiểm tra Nhật ký Webhooks trên SePay
```

---

## Tham Khảo

- [SePay Webhook Docs](https://docs.sepay.vn/tich-hop-webhooks.html)
- [SePay Lập Trình Webhooks](https://docs.sepay.vn/lap-trinh-webhooks.html)
- [VietQR API](https://www.vietqr.io/danh-sach-api)
- [Supabase RPC Functions](https://supabase.com/docs/guides/database/functions)
