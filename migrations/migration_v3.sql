-- ============================================
-- Migration V3: Campaigns & Tier Integration
-- Chạy file này trên Supabase SQL Editor
-- ============================================

-- 1. Bổ sung cột tier cho profiles (để xác định hạng đại lý)
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS tier TEXT DEFAULT 'starter' CHECK (tier IN ('starter', 'master', 'ai-coach', 'ai-partner'));

-- 2. Bổ sung cột mô tả cho campaigns (để hiển thị trên trang Affiliate)
ALTER TABLE public.campaigns
  ADD COLUMN IF NOT EXISTS description TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS commission_text TEXT DEFAULT '50% Lifetime',
  ADD COLUMN IF NOT EXISTS image_url TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS tier_required INTEGER DEFAULT 1;
-- tier_required: 1=starter, 2=master, 3=ai-coach, 4=ai-partner

-- 3. Bổ sung cột cho bảng profiles phục vụ Staff Management  
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS phone TEXT DEFAULT '';

-- 4. RLS: Admin có thể UPDATE tất cả profiles (cho Staff Management, Affiliate Approval)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Admins can update all profiles' AND tablename = 'profiles'
  ) THEN
    CREATE POLICY "Admins can update all profiles" ON public.profiles FOR UPDATE USING (
      EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'staff'))
    );
  END IF;
END $$;

-- 5. Seed: Cập nhật campaigns sẵn có với thông tin mô tả (nếu đã có data)
-- Bạn có thể chạy thủ công hoặc bỏ qua nếu chưa có campaign nào
-- UPDATE public.campaigns SET description = 'Khóa học nền tảng...', commission_text = '50% Lifetime', tier_required = 1 WHERE name ILIKE '%starter%';
-- UPDATE public.campaigns SET description = 'Phương pháp nâng cao...', commission_text = '50% Lifetime', tier_required = 2 WHERE name ILIKE '%master%';
