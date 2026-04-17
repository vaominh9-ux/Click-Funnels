-- ============================================
-- MIGRATION V9: GAMIFICATION (BADGES & QUESTS)
-- Chạy đoạn mã này trong bảng SQL Editor của Supabase
-- ============================================

-- 1. Tabel Quản Lý Huy Hiệu Của Đại Lý
CREATE TABLE IF NOT EXISTS public.user_badges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  affiliate_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  badge_id TEXT NOT NULL,          -- vd: 'first_blood', 'combo_5', 'shark_100m'
  badge_name TEXT NOT NULL,        -- vd: 'Chiến Công Đầu'
  reward_amount NUMERIC DEFAULT 0, -- Tiền thưởng lúc nhận giải
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(affiliate_id, badge_id)   -- 1 Đại lý chỉ nhận 1 loại huy hiệu 1 lần
);

-- Bật RLS
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Cho phép xem huy hiệu công khai"
  ON public.user_badges FOR SELECT
  USING (true);

CREATE POLICY "Admin toàn quyền quản lý badge"
  ON public.user_badges FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- 2. Hàm Tự Động Định Giá Khen Thưởng (Logic Máy Chủ)
CREATE OR REPLACE FUNCTION public.evaluate_affiliate_achievements(p_affiliate_id UUID)
RETURNS VOID AS $$
DECLARE
  v_approved_count BIGINT;
  v_has_badge BOOLEAN;
BEGIN
  -- Đếm tổng số đơn đã duyệt của người này
  SELECT COUNT(*) INTO v_approved_count
  FROM public.conversions
  WHERE affiliate_id = p_affiliate_id AND status = 'approved';

  -- A) NHIỆM VỤ 1: CHỐT ĐƠN ĐẦU TIÊN (First Blood)
  IF v_approved_count >= 1 THEN
    -- Check xem đã có badge này chưa
    SELECT EXISTS(SELECT 1 FROM public.user_badges WHERE affiliate_id = p_affiliate_id AND badge_id = 'first_blood') INTO v_has_badge;
    
    IF NOT v_has_badge THEN
      -- Cấp Huy hiệu + Thưởng nóng 200,000đ
      INSERT INTO public.user_badges (affiliate_id, badge_id, badge_name, reward_amount)
      VALUES (p_affiliate_id, 'first_blood', 'Chiến Công Đầu', 200000);
      
      -- Cộng thẳng tiền nạp vào số dư
      UPDATE public.profiles
      SET balance = balance + 200000,
          total_earned = total_earned + 200000
      WHERE id = p_affiliate_id;
    END IF;
  END IF;

  -- B) NHIỆM VỤ 2: Liên Hoàn 5 Đơn (Combo Master)
  IF v_approved_count >= 5 THEN
    SELECT EXISTS(SELECT 1 FROM public.user_badges WHERE affiliate_id = p_affiliate_id AND badge_id = 'combo_5') INTO v_has_badge;
    
    IF NOT v_has_badge THEN
      -- Cấp Huy hiệu + Thưởng nóng 1,000,000đ
      INSERT INTO public.user_badges (affiliate_id, badge_id, badge_name, reward_amount)
      VALUES (p_affiliate_id, 'combo_5', 'Bàn Tay Lửa (5 Sale)', 1000000);
      
      UPDATE public.profiles
      SET balance = balance + 1000000,
          total_earned = total_earned + 1000000
      WHERE id = p_affiliate_id;
    END IF;
  END IF;

END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 3. Nâng cấp Trigger duyệt Hoa Hồng (Gắn máy quét Gamification vào cuối)
-- Việc này đảm bảo mỗi khi bật "approved", nó sẽ chấm công luôn
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

    -- c) F1 Upline Commission
    SELECT referred_by INTO upline_id
    FROM public.profiles
    WHERE id = NEW.affiliate_id;

    IF upline_id IS NOT NULL THEN
      upline_commission := ROUND(NEW.commission_amount * 0.10);
      
      IF upline_commission > 0 THEN
        UPDATE public.profiles
        SET balance = balance + upline_commission,
            total_earned = total_earned + upline_commission,
            updated_at = NOW()
        WHERE id = upline_id;

        INSERT INTO public.conversions (
          affiliate_id, sale_amount, commission_amount, 
          customer_name, product_name, customer_info, 
          status, type
        ) VALUES (
          upline_id, NEW.sale_amount, upline_commission, 
          'Tuyến Dưới: ' || COALESCE(NEW.customer_name, 'Ẩn danh'),
          'Hoa Hồng F1', '{}', 'approved', 'upline_commission'
        );
      END IF;
    END IF;

    -- ========================================================
    -- [MỚI V9] GỌI MÁY QUÉT GAMIFICATION CHẤM CÔNG THƯỞNG NÓNG
    -- ========================================================
    PERFORM public.evaluate_affiliate_achievements(NEW.affiliate_id);

  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
