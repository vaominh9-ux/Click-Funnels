-- ============================================
-- Migration V6: Lead Tracking Increment
-- Chạy file này trên Supabase SQL Editor
-- ============================================

CREATE OR REPLACE FUNCTION public.record_affiliate_lead(
  p_ref_code TEXT,
  p_campaign_id UUID DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  v_affiliate_id UUID;
  v_link_id UUID;
BEGIN
  -- 1. Tìm affiliate theo giới thiệu (ref_code)
  SELECT id INTO v_affiliate_id FROM public.profiles WHERE ref_code = p_ref_code;

  IF v_affiliate_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'ref_code_not_found');
  END IF;

  -- 2. Tìm đúng Affiliate Link
  IF p_campaign_id IS NOT NULL THEN
    SELECT id INTO v_link_id FROM public.affiliate_links 
    WHERE affiliate_id = v_affiliate_id AND campaign_id = p_campaign_id LIMIT 1;
  ELSE
    SELECT id INTO v_link_id FROM public.affiliate_links 
    WHERE affiliate_id = v_affiliate_id LIMIT 1;
  END IF;

  -- 3. Tự động tăng số Lead đếm được + 1
  IF v_link_id IS NOT NULL THEN
    UPDATE public.affiliate_links
    SET leads = COALESCE(leads, 0) + 1
    WHERE id = v_link_id;
  END IF;

  RETURN jsonb_build_object('success', true, 'affiliate_id', v_affiliate_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
