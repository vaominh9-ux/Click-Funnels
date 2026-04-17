# 💳 Payment Feature — Xác Nhận Thanh Toán Tự Động (SePay)

Thư mục này chứa toàn bộ logic và component cho tính năng thanh toán tự động.

## Cấu trúc

```
src/features/payment/
├── README.md             ← File này
├── bankConfig.js         ← Cấu hình ngân hàng (BIN, số TK, tên TK)
├── paymentUtils.js       ← Utilities: sinh mã, tạo đơn, check status, QR URL
├── PaymentSuccess.jsx    ← Component hiển thị "Thanh toán thành công"
└── PaymentWaiting.jsx    ← Component hiển thị "Đang chờ xác nhận..."
```

## File liên quan (ngoài thư mục này)

| File | Vị trí | Mô tả |
|------|--------|-------|
| `sepay-webhook.js` | `api/` | Vercel API nhận webhook từ SePay |
| `Checkout.jsx` | `src/pages/public/` | Trang checkout sử dụng các component trên |
| `Checkout.css` | `src/pages/public/` | CSS cho checkout + animation |
| `migration_v11_sepay.sql` | Root | Migration thêm cột payment |
| `migration_v12_payment_check.sql` | Root | RPC function check status |

## Cách dùng cho landing page mới

```javascript
import { BANK_CONFIG } from '../features/payment/bankConfig';
import { generatePaymentCode, createPaymentOrder, checkPaymentStatus, generateQRUrl } from '../features/payment/paymentUtils';
import PaymentSuccess from '../features/payment/PaymentSuccess';
import PaymentWaiting from '../features/payment/PaymentWaiting';
```
