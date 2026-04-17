-- ============================================
-- Migration V16: Enable Realtime for Dashboard Metrics
-- ============================================

-- Kích hoạt Realtime (REPLICA IDENTITY FULL) và xuất bản lên supabase_realtime
-- Điều này cho phép Front-end lắng nghe thay đổi thông qua supabase.channel() 
-- mà không cần F5 load lại trang khi có Khách hàng mới hoặc nổ Sale.

-- 1. Cho phép bảng affiliate_links phát sóng qua mạng (Realtime)
ALTER TABLE public.affiliate_links REPLICA IDENTITY FULL;
-- 2. Cho phép bảng leads phát sóng
ALTER TABLE public.leads REPLICA IDENTITY FULL;
-- 3. Cho phép bảng conversions phát sóng
ALTER TABLE public.conversions REPLICA IDENTITY FULL;
-- 4. Cho phép bảng profiles phát sóng
ALTER TABLE public.profiles REPLICA IDENTITY FULL;

-- Thêm các bảng vào Publication của Supabase Realtime
DO $$ BEGIN
  -- Nếu chưa có publication supabase_realtime thì tạo mới (Supabase tự có, nhưng đề phòng)
  IF NOT EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    CREATE PUBLICATION supabase_realtime;
  END IF;
END $$;

-- Thêm từng bảng vào tính năng phát Realtime (bỏ qua nếu đã được thêm)
ALTER PUBLICATION supabase_realtime ADD TABLE public.affiliate_links;
ALTER PUBLICATION supabase_realtime ADD TABLE public.leads;
ALTER PUBLICATION supabase_realtime ADD TABLE public.conversions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;

-- Nếu có bảng nào bị lỗi do đã tồn tại trong publication, có thể bỏ qua bước trên, 
-- chạy cú pháp này để an toàn hơn:
-- SELECT set_config('realtime.subscription_active', 'on', false);
