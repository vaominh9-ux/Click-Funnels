-- Migration V11: SePay Payment Verification
-- Thêm cột hỗ trợ xác thực thanh toán tự động qua SePay webhook

-- 1. Thêm cột payment_code (mã thanh toán duy nhất cho mỗi đơn)
ALTER TABLE public.conversions 
ADD COLUMN IF NOT EXISTS payment_code TEXT UNIQUE;

-- 2. Thêm cột sepay_ref (mã tham chiếu từ SePay, chống trùng)
ALTER TABLE public.conversions 
ADD COLUMN IF NOT EXISTS sepay_ref TEXT;

-- 3. Thêm cột sepay_transaction_id (ID giao dịch trên SePay)
ALTER TABLE public.conversions 
ADD COLUMN IF NOT EXISTS sepay_transaction_id BIGINT;

-- 4. Thêm cột paid_at (thời điểm xác nhận thanh toán)
ALTER TABLE public.conversions 
ADD COLUMN IF NOT EXISTS paid_at TIMESTAMPTZ;

-- 5. Index cho tìm kiếm nhanh theo payment_code
CREATE INDEX IF NOT EXISTS idx_conversions_payment_code 
ON public.conversions(payment_code);

-- 6. Index cho chống trùng theo sepay_ref
CREATE INDEX IF NOT EXISTS idx_conversions_sepay_ref 
ON public.conversions(sepay_ref);
