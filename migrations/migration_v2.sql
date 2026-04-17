-- ============================================
-- Migration V2: Backend Integration
-- Chạy file này trên Supabase SQL Editor
-- ============================================

-- 1. Bổ sung cột tracking cho affiliate_links
ALTER TABLE public.affiliate_links 
  ADD COLUMN IF NOT EXISTS sub_id1 TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS clicks INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS leads INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS sales INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS short_code TEXT;

-- Xóa constraint UNIQUE cũ (sub_id), thêm constraint mới (sub_id1)
ALTER TABLE public.affiliate_links DROP CONSTRAINT IF EXISTS affiliate_links_affiliate_id_campaign_id_sub_id_key;
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'affiliate_links_unique_combo'
  ) THEN
    ALTER TABLE public.affiliate_links ADD CONSTRAINT affiliate_links_unique_combo UNIQUE (affiliate_id, campaign_id, sub_id1);
  END IF;
END $$;

-- 2. Bổ sung cột cho commission_plans
ALTER TABLE public.commission_plans 
  ADD COLUMN IF NOT EXISTS applied_scope TEXT DEFAULT 'Tất cả Đại lý';

-- 3. RLS: Admin có thể cập nhật conversions
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Admins can update conversions' AND tablename = 'conversions'
  ) THEN
    CREATE POLICY "Admins can update conversions" ON public.conversions FOR UPDATE USING (
      EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'staff'))
    );
  END IF;
END $$;

-- 4. RLS: Admin có thể insert conversions
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Admins can insert conversions' AND tablename = 'conversions'
  ) THEN
    CREATE POLICY "Admins can insert conversions" ON public.conversions FOR INSERT WITH CHECK (
      EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'staff'))
    );
  END IF;
END $$;

-- 5. Trigger: Tự động cập nhật balance khi conversion được approve
CREATE OR REPLACE FUNCTION public.process_approved_conversion()
RETURNS trigger AS $$
BEGIN
  IF NEW.status = 'approved' AND (OLD.status IS NULL OR OLD.status != 'approved') THEN
    -- Cộng tiền vào balance và total_earned
    UPDATE public.profiles 
    SET balance = balance + NEW.commission_amount,
        total_earned = total_earned + NEW.commission_amount,
        updated_at = NOW()
    WHERE id = NEW.affiliate_id;
    
    -- Cập nhật sales count trên affiliate_links
    IF NEW.link_id IS NOT NULL THEN
      UPDATE public.affiliate_links 
      SET sales = sales + 1 
      WHERE id = NEW.link_id;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_conversion_approved ON public.conversions;
CREATE TRIGGER on_conversion_approved
  AFTER UPDATE ON public.conversions
  FOR EACH ROW EXECUTE PROCEDURE public.process_approved_conversion();

-- 6. Trigger: Trừ balance khi payout hoàn tất
CREATE OR REPLACE FUNCTION public.process_completed_payout()
RETURNS trigger AS $$
BEGIN
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    UPDATE public.profiles
    SET balance = balance - NEW.amount,
        updated_at = NOW()
    WHERE id = NEW.affiliate_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_payout_completed ON public.payouts;
CREATE TRIGGER on_payout_completed
  AFTER UPDATE ON public.payouts
  FOR EACH ROW EXECUTE PROCEDURE public.process_completed_payout();

-- 7. Enable Realtime cho các bảng quan trọng
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.affiliate_links;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.payouts;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.commission_plans;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
