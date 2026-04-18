-- ============================================
-- Migration V9: Fix 300 Multiple Choices RPC
-- Chạy đoạn này trên Supabase SQL Editor
-- ============================================

-- Hàm cũ có 2 tham số: (text, uuid)
DROP FUNCTION IF EXISTS public.record_affiliate_click(text, uuid);

-- Đảm bảo chỉ còn lại 1 hàm duy nhất có 3 tham số.
-- Không cần chạy lại hàm V8 nếu bạn đã chạy ở bước trước.
