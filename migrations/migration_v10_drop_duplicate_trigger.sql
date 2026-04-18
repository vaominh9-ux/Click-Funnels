-- ============================================
-- Migration V10: Fix Double Counting Leads
-- Chạy đoạn này trên Supabase SQL Editor
-- ============================================

-- Xóa trigger tự động cộng dồn lead để tránh trùng lặp 
-- với hàm record_affiliate_lead đã có sẵn.
DROP TRIGGER IF EXISTS on_new_lead ON public.leads;
