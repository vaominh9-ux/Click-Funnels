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

-- Thêm từng bảng vào tính năng phát Realtime một cách an toàn (tránh lỗi đã tồn tại)
DO $$ 
BEGIN 
  -- Từng bảng một
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'affiliate_links') THEN 
    ALTER PUBLICATION supabase_realtime ADD TABLE public.affiliate_links; 
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'leads') THEN 
    ALTER PUBLICATION supabase_realtime ADD TABLE public.leads; 
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'conversions') THEN 
    ALTER PUBLICATION supabase_realtime ADD TABLE public.conversions; 
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'profiles') THEN 
    ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles; 
  END IF;
END $$;
