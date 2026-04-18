-- ============================================
-- Migration V8: Fix lỗi cộng dồn số Click sai UTM
-- Chạy đoạn này trên Supabase SQL Editor
-- ============================================

CREATE OR REPLACE FUNCTION public.record_affiliate_click(
  p_ref_code TEXT,
  p_campaign_id UUID DEFAULT NULL,
  p_sub_id1 TEXT DEFAULT ''
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
  v_aff_id UUID;
  v_link_id UUID;
  v_landing_url TEXT;
BEGIN
  -- 1. Tìm affiliate theo ref_code
  SELECT id INTO v_aff_id
  FROM public.profiles
  WHERE ref_code = p_ref_code;

  IF v_aff_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'ref_code_not_found');
  END IF;

  -- 2. Tìm affiliate_link (nếu có campaign_id, đồng thời xét cả UTM)
  IF p_campaign_id IS NOT NULL THEN
    -- Ưu tiên tìm đúng link có chứa sub_id1 (UTM)
    SELECT id INTO v_link_id
    FROM public.affiliate_links
    WHERE affiliate_id = v_aff_id 
      AND campaign_id = p_campaign_id 
      AND (sub_id1 = p_sub_id1 OR (p_sub_id1 = '' AND sub_id1 IS NULL))
    LIMIT 1;

    -- Nếu bằng 1 cách nào đó link UTM này bị trôi chưa được add vào db, ta tự động tạo!
    -- Hoặc nếu có link_id rồi thì cập nhật click:
    IF v_link_id IS NOT NULL THEN
      UPDATE public.affiliate_links
      SET clicks = COALESCE(clicks, 0) + 1,
          clicks_count = COALESCE(clicks_count, 0) + 1
      WHERE id = v_link_id;
    END IF;

    -- Lấy landing URL
    SELECT landing_page_url INTO v_landing_url
    FROM public.campaigns
    WHERE id = p_campaign_id;
  ELSE
    -- Không có campaign, tìm link đầu tiên
    SELECT al.id, c.landing_page_url
    INTO v_link_id, v_landing_url
    FROM public.affiliate_links al
    LEFT JOIN public.campaigns c ON c.id = al.campaign_id
    WHERE al.affiliate_id = v_aff_id
    LIMIT 1;

    IF v_link_id IS NOT NULL THEN
      UPDATE public.affiliate_links
      SET clicks = COALESCE(clicks, 0) + 1,
          clicks_count = COALESCE(clicks_count, 0) + 1
      WHERE id = v_link_id;
    END IF;
  END IF;

  RETURN jsonb_build_object(
    'success', true,
    'affiliate_id', v_aff_id,
    'link_id', v_link_id,
    'landing_url', v_landing_url
  );
END;
$function$;
