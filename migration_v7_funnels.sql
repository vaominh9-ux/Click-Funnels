-- ============================================
-- Migration V7: Cấu hình RLS cho Funnels (Thêm Lead & Thanh toán)
-- Chạy đoạn mã này trong thẻ SQL Editor của Supabase
-- ============================================

-- 1. Bật toàn quyền thêm mới Khách hàng (Leads) cho khách ẩn danh (Anonymous)
-- Vì người dùng điền form Landing Page là khách người ngoài, chưa đăng nhập
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Public can insert leads' AND tablename = 'leads'
  ) THEN
    CREATE POLICY "Public can insert leads" ON public.leads FOR INSERT WITH CHECK (true);
  END IF;
END $$;

-- 2. Bật toàn quyền thêm mới Đơn hàng (Conversions) cho khách ẩn danh
-- Khi khách click "Đã Thanh Toán", hệ thống sẽ tạo Đơn Hàng trạng thái 'pending'
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Public can insert conversions' AND tablename = 'conversions'
  ) THEN
    CREATE POLICY "Public can insert conversions" ON public.conversions FOR INSERT WITH CHECK (true);
  END IF;
END $$;

-- Xin lưu ý: Bảng leads và conversions nên được BẬT (Enable) RLS
-- (Row Level Security) từ trước. Script này chỉ mở luồng INSERT.
