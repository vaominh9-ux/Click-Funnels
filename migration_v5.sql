-- ============================================
-- Migration V5: Fix Click Tracking RLS + Atomic Increment
-- Chạy file này trên Supabase SQL Editor
-- ============================================

-- 1. Cho phép anonymous đọc affiliate_links (cần cho ClickTracker tìm link)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Public can read affiliate_links' AND tablename = 'affiliate_links'
  ) THEN
    CREATE POLICY "Public can read affiliate_links" ON public.affiliate_links FOR SELECT USING (true);
  END IF;
END $$;

-- 2. Tạo RPC function ghi nhận click (atomic, bypass RLS)
CREATE OR REPLACE FUNCTION public.record_affiliate_click(
  p_ref_code TEXT,
  p_campaign_id UUID DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  v_affiliate_id UUID;
  v_link_id UUID;
  v_landing_url TEXT;
BEGIN
  -- 1. Tìm affiliate theo ref_code
  SELECT id INTO v_affiliate_id
  FROM public.profiles
  WHERE ref_code = p_ref_code;

  IF v_affiliate_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'ref_code_not_found');
  END IF;

  -- 2. Tìm affiliate_link (nếu có campaign_id)
  IF p_campaign_id IS NOT NULL THEN
    SELECT id INTO v_link_id
    FROM public.affiliate_links
    WHERE affiliate_id = v_affiliate_id AND campaign_id = p_campaign_id
    LIMIT 1;

    -- Tăng click atomically
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
    WHERE al.affiliate_id = v_affiliate_id
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
    'affiliate_id', v_affiliate_id,
    'link_id', v_link_id,
    'landing_url', v_landing_url
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
