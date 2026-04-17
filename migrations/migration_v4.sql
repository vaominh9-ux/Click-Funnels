-- ============================================
-- Migration V4: Commission Engine & Click Tracking
-- Chạy file này trên Supabase SQL Editor
-- ============================================

-- 1. Bổ sung cột cho conversions (tên khách, sản phẩm)
ALTER TABLE public.conversions
  ADD COLUMN IF NOT EXISTS customer_name TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS product_name TEXT DEFAULT '';

-- 2. Nâng cấp trigger process_approved_conversion
-- Giờ khi duyệt conversion:
--   a) Cộng balance cho affiliate
--   b) Tự động tạo F1 upline commission (10% cho người giới thiệu)
CREATE OR REPLACE FUNCTION public.process_approved_conversion()
RETURNS trigger AS $$
DECLARE
  upline_id UUID;
  upline_commission NUMERIC;
BEGIN
  IF NEW.status = 'approved' AND (OLD.status IS NULL OR OLD.status != 'approved') THEN
    -- a) Cộng tiền vào balance affiliate
    UPDATE public.profiles 
    SET balance = balance + NEW.commission_amount,
        total_earned = total_earned + NEW.commission_amount,
        updated_at = NOW()
    WHERE id = NEW.affiliate_id;
    
    -- b) Cập nhật sales count trên affiliate_links
    IF NEW.link_id IS NOT NULL THEN
      UPDATE public.affiliate_links 
      SET sales = COALESCE(sales, 0) + 1 
      WHERE id = NEW.link_id;
    END IF;

    -- c) F1 Upline Commission (10% của commission affiliate)
    SELECT referred_by INTO upline_id
    FROM public.profiles
    WHERE id = NEW.affiliate_id;

    IF upline_id IS NOT NULL THEN
      upline_commission := ROUND(NEW.commission_amount * 0.10);
      
      IF upline_commission > 0 THEN
        -- Cộng commission cho upline
        UPDATE public.profiles
        SET balance = balance + upline_commission,
            total_earned = total_earned + upline_commission,
            updated_at = NOW()
        WHERE id = upline_id;

        -- Ghi nhận conversion cho upline (để tracking)
        INSERT INTO public.conversions (
          affiliate_id, sale_amount, commission_amount, 
          customer_name, product_name, customer_info, 
          status, type
        ) VALUES (
          upline_id,
          NEW.sale_amount,
          upline_commission,
          NEW.customer_name,
          NEW.product_name,
          jsonb_build_object(
            'source', 'f1_override',
            'original_affiliate_id', NEW.affiliate_id,
            'original_conversion_id', NEW.id
          ),
          'approved',
          'sale'
        );
      END IF;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate trigger
DROP TRIGGER IF EXISTS on_conversion_approved ON public.conversions;
CREATE TRIGGER on_conversion_approved
  AFTER UPDATE ON public.conversions
  FOR EACH ROW EXECUTE PROCEDURE public.process_approved_conversion();

-- 3. RLS: cho phép affiliate đọc clicks trên links (cả admin)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Public can update affiliate_links clicks' AND tablename = 'affiliate_links'
  ) THEN
    CREATE POLICY "Public can update affiliate_links clicks" ON public.affiliate_links FOR UPDATE USING (true);
  END IF;
END $$;

-- 4. Cho phép anonymous user đọc profiles (cho click tracker tìm ref_code)
-- Đã có policy "Public profiles are viewable by everyone" từ schema gốc

-- 5. Cho phép anonymous user đọc campaigns (cho click tracker)
-- Đã có policy "Campaigns viewable by everyone" từ schema gốc
