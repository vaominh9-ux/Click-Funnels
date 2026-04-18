-- ============================================
-- Migration V7: Sửa quy trình nhảy Lead chính xác theo Link_ID (UTM)
-- Chạy file này trên **SQL Editor** của Supabase để cập nhật cấu trúc Database.
-- Giải quyết lỗi nhảy sai/không nhảy cột "Leads" trên trang Thống Kê khi đại lý chạy bằng UTM.
-- ============================================

CREATE OR REPLACE FUNCTION public.record_affiliate_lead(
  p_ref_code TEXT,
  p_campaign_id UUID DEFAULT NULL,
  p_link_id UUID DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  v_affiliate_id UUID;
  v_target_link_id UUID;
BEGIN
  -- 1. Tìm affiliate theo ref_code
  SELECT id INTO v_affiliate_id FROM public.profiles WHERE ref_code = p_ref_code;

  IF v_affiliate_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'ref_code_not_found');
  END IF;

  -- 2. Chọn chính xác Bảng tính (Link) nào cần đếm
  -- Ưu tiên TUYỆT ĐỐI cái thẻ link (link ID) mà khách hàng đã bấm vào (bao gồm đúng cả UTM)
  IF p_link_id IS NOT NULL THEN
    v_target_link_id := p_link_id;
  ELSIF p_campaign_id IS NOT NULL THEN
    -- Nếu bị rớt thẻ mất link_id, fallback xuống việc cộng bừa vào 1 link thuộc chiến dịch đó
    SELECT id INTO v_target_link_id FROM public.affiliate_links 
    WHERE affiliate_id = v_affiliate_id AND campaign_id = p_campaign_id LIMIT 1;
  ELSE
    SELECT id INTO v_target_link_id FROM public.affiliate_links 
    WHERE affiliate_id = v_affiliate_id LIMIT 1;
  END IF;

  -- 3. Cập nhật Số đếm (+1 Khách Đăng ký)
  IF v_target_link_id IS NOT NULL THEN
    UPDATE public.affiliate_links
    SET leads = COALESCE(leads, 0) + 1
    WHERE id = v_target_link_id;
  END IF;

  RETURN jsonb_build_object('success', true, 'affiliate_id', v_affiliate_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
