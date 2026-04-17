-- ============================================
-- Migration V15: Sync Approved Conversions to CRM Leads
-- ============================================

-- Nâng cấp trigger process_approved_conversion
-- Bổ sung cơ chế: Tự động đổi trạng thái Lead trong CRM thành "Chốt Đơn" (closed_won) khi Đơn hàng Approved

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

    -- c) [TÍNH NĂNG MỚI] Đồng bộ trạng thái về CRM (bảng leads)
    IF NEW.customer_info IS NOT NULL AND NEW.customer_info->>'lead_id' IS NOT NULL THEN
      UPDATE public.leads 
      SET stage = 'closed_won',
          value = COALESCE(value, 0) + NEW.sale_amount,
          updated_at = NOW()
      WHERE id = (NEW.customer_info->>'lead_id')::UUID;
    END IF;

    -- d) F1 Upline Commission (10% của commission affiliate)
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
