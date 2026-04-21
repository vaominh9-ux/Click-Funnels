---
name: domain-migration
description: Quy trình chuẩn để di chuyển tên miền (Domain Migration) cho hệ thống ClickFunnels. Bao gồm checklist đầy đủ các vị trí cần cập nhật trên Vercel, Supabase, SePay, Git, và toàn bộ mã nguồn. AI Agent PHẢI đọc skill này trước khi thực hiện bất kỳ thao tác đổi tên miền nào.
---

# 🌐 DOMAIN MIGRATION — Quy Trình Chuyển Đổi Tên Miền ClickFunnels

> **Mục đích:** Đảm bảo khi đổi tên miền, KHÔNG CÒN SÓT bất kỳ hardcoded domain nào trong toàn hệ thống. Một URL sót lại = lỗi thanh toán, lỗi tracking, lỗi auth.

---

## THÔNG TIN HIỆN TẠI

| Mục | Giá trị |
|-----|---------|
| **Domain hiện tại** | `ai.duhava.com` |
| **Domain cũ (đã xoá)** | `click-funnels.vercel.app` |
| **Vercel Project** | `click-funnels` |
| **Git Repo** | `github.com/vaominh9-ux/Click-Funnels` |
| **Supabase Project** | `iykdzwuqwlemszawpove` |

---

## QUY TRÌNH 5 BƯỚC

### BƯỚC 1: VERCEL — Thêm Domain Mới
1. Mở **Vercel Dashboard** → Project → **Settings** → **Domains**
2. Nhập tên miền mới → Bấm **Add**
3. Vercel sẽ hiển thị bản ghi DNS cần trỏ

### BƯỚC 2: DNS — Trỏ Tên Miền
Vào nhà cung cấp domain → Quản lý DNS → Thêm bản ghi:

**Nếu là Subdomain (vd: `ai.duhava.com`):**
| Type | Name | Value |
|------|------|-------|
| `CNAME` | `ai` | `cname.vercel-dns.com` |

**Nếu là Root Domain (vd: `duhava.com`):**
| Type | Name | Value |
|------|------|-------|
| `A` | `@` | `76.76.21.21` |
| `CNAME` | `www` | `cname.vercel-dns.com` |

→ Chờ Vercel hiển thị ✅ Valid Configuration + SSL Certificate.

### BƯỚC 3: MÃ NGUỒN — Thay Thế Domain (Quan trọng nhất)

#### 3.1 File Cấu Hình Môi Trường
```
.env                    → VITE_APP_URL, VITE_TRACKING_DOMAIN
.env.example            → VITE_APP_URL, VITE_TRACKING_DOMAIN
```

#### 3.2 Frontend — Thư mục `src/` (Hardcoded Fallback URLs)
```
src/pages/public/ClickTracker.jsx         → hostname override khi localhost
src/pages/funnels/utils/notifyWebhook.js  → API_BASE fallback
src/pages/funnels/Free3Day/FreeLeadModal.jsx → API_BASE fallback
src/pages/affiliate/AffiliateLinks.jsx    → trackingDomain (2 chỗ)
src/pages/affiliate/Network.jsx           → domain ref link
src/pages/affiliate/Campaigns.jsx         → trackingDomain
src/pages/admin/WebhookSettings.jsx       → API_BASE fallback
src/pages/admin/PaymentSettings.jsx       → webhookUrl hiển thị cho SePay
```

#### 3.3 Backend API — Thư mục `api/`
```
api/sepay-webhook.js                      → appUrl fallback gửi email
```

#### 3.4 Data Files
```
_db_campaigns.json                        → landing_page_url (5 campaigns)
```

#### 3.5 Lệnh Thay Thế Nhanh
AI Agent chạy lệnh grep toàn cục để tìm domain cũ:
```
grep_search(Query="DOMAIN_CŨ", SearchPath="c:\Users\ASUS\Desktop\ClickFunnels")
```
Sau đó dùng `replace_file_content` với `AllowMultiple=true` cho từng file.

**KIỂM TRA SAU KHI SỬA:**
```
grep_search(Query="DOMAIN_CŨ", SearchPath="c:\Users\ASUS\Desktop\ClickFunnels")
→ Phải trả về: "No results found"
```

### BƯỚC 4: DỊCH VỤ BÊN NGOÀI — Cập Nhật Dashboard

#### 4.1 Vercel Environment Variables
Vào **Vercel → Settings → Environment Variables** → Sửa:
| Biến | Giá trị |
|------|---------|
| `VITE_APP_URL` | `https://DOMAIN_MỚI` |
| `VITE_TRACKING_DOMAIN` | `https://DOMAIN_MỚI` |

→ Sau đó bắt buộc **Redeploy** để nhận giá trị mới.

#### 4.2 Supabase Authentication
Vào **Supabase → Authentication → URL Configuration**:
| Mục | Giá trị |
|-----|---------|
| Site URL | `https://DOMAIN_MỚI` |
| Redirect URLs | Thêm `https://DOMAIN_MỚI/**` |

→ Xoá redirect URL domain cũ.

#### 4.3 Supabase Database (Campaigns)
Kiểm tra bảng `campaigns` trong Supabase xem cột `landing_page_url` có chứa domain cũ không. Nếu có, cập nhật qua SQL:
```sql
UPDATE campaigns 
SET landing_page_url = REPLACE(landing_page_url, 'DOMAIN_CŨ', 'DOMAIN_MỚI');
```

#### 4.4 SePay Webhook
Vào **my.sepay.vn/webhooks** → Sửa "Gọi đến URL" thành:
```
https://DOMAIN_MỚI/api/sepay-webhook
```

### BƯỚC 5: DEPLOY & KIỂM TRA

1. **Git commit + push:**
```bash
git add -A
git commit -m "chore: migrate domain to DOMAIN_MỚI"
git push origin main
```

2. **Vercel Redeploy** (nếu chưa tự deploy)

3. **Checklist kiểm tra sau deploy:**
- [ ] Trang chủ `https://DOMAIN_MỚI` load được
- [ ] Landing Pages (`/khoa-hoc/khoa-hoc-1`, `/khoa-hoc/khoa-hoc-2`, `/khoa-hoc/khoa-hoc-3`) hoạt động
- [ ] Form đăng ký Lead hoạt động (test submit)
- [ ] Affiliate Links hiển thị domain mới
- [ ] Trang Checkout + QR thanh toán hoạt động
- [ ] SePay Webhook nhận được (test giao dịch nhỏ)
- [ ] Đăng nhập/Đăng ký Auth hoạt động

---

## DANH SÁCH ĐẦY ĐỦ CÁC VỊ TRÍ (12 files)

| # | File | Nội dung cần sửa |
|---|------|-------------------|
| 1 | `.env` | `VITE_APP_URL`, `VITE_TRACKING_DOMAIN` |
| 2 | `.env.example` | `VITE_APP_URL`, `VITE_TRACKING_DOMAIN` |
| 3 | `_db_campaigns.json` | `landing_page_url` × 5 campaigns |
| 4 | `src/pages/public/ClickTracker.jsx` | `url.hostname` fallback |
| 5 | `src/pages/funnels/utils/notifyWebhook.js` | `API_BASE` fallback |
| 6 | `src/pages/funnels/Free3Day/FreeLeadModal.jsx` | `API_BASE` fallback |
| 7 | `src/pages/affiliate/AffiliateLinks.jsx` | `trackingDomain` × 2 |
| 8 | `src/pages/affiliate/Network.jsx` | `domain` ref link |
| 9 | `src/pages/affiliate/Campaigns.jsx` | `trackingDomain` |
| 10 | `src/pages/admin/WebhookSettings.jsx` | `API_BASE` fallback |
| 11 | `src/pages/admin/PaymentSettings.jsx` | `webhookUrl` display |
| 12 | `api/sepay-webhook.js` | `appUrl` fallback |

---

## GHI CHÚ QUAN TRỌNG

> ⚠️ **LUÔN LUÔN** chạy `grep_search` toàn bộ project với domain cũ SAU KHI sửa xong để đảm bảo không sót.

> ⚠️ **Vercel Env Vars** phải Redeploy sau khi sửa, nếu không serverless functions vẫn dùng giá trị cũ.

> ⚠️ **Supabase Redirect URLs** nếu không cập nhật sẽ gây lỗi đăng nhập (auth callback bị chặn).

> ⚠️ File `_db_campaigns.json` chỉ là backup local. Dữ liệu thực nằm trong Supabase DB — nhớ kiểm tra cả 2 nơi.
