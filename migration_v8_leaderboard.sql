-- ============================================
-- Migration V8: Leaderboard RPC
-- Chạy đoạn mã này trong SQL Editor của Supabase
-- ============================================

-- 1. Hàm lấy Top Doanh Số theo tháng
CREATE OR REPLACE FUNCTION public.get_leaderboard_revenue(
  p_month INT DEFAULT EXTRACT(MONTH FROM NOW())::INT,
  p_year INT DEFAULT EXTRACT(YEAR FROM NOW())::INT,
  p_limit INT DEFAULT 10
)
RETURNS TABLE (
  rank BIGINT,
  affiliate_id UUID,
  full_name TEXT,
  avatar_url TEXT,
  tier TEXT,
  total_revenue NUMERIC,
  total_conversions BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ROW_NUMBER() OVER (ORDER BY COALESCE(SUM(c.sale_amount), 0) DESC) AS rank,
    p.id AS affiliate_id,
    p.full_name,
    p.avatar_url,
    p.tier,
    COALESCE(SUM(c.sale_amount), 0) AS total_revenue,
    COUNT(c.id) AS total_conversions
  FROM public.profiles p
  LEFT JOIN public.conversions c 
    ON c.affiliate_id = p.id 
    AND c.status = 'approved'
    AND EXTRACT(MONTH FROM c.created_at) = p_month
    AND EXTRACT(YEAR FROM c.created_at) = p_year
  WHERE p.role IN ('affiliate', 'admin')
  GROUP BY p.id, p.full_name, p.avatar_url, p.tier
  HAVING COALESCE(SUM(c.sale_amount), 0) > 0
  ORDER BY total_revenue DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Hàm lấy Top Leads theo tháng
CREATE OR REPLACE FUNCTION public.get_leaderboard_leads(
  p_month INT DEFAULT EXTRACT(MONTH FROM NOW())::INT,
  p_year INT DEFAULT EXTRACT(YEAR FROM NOW())::INT,
  p_limit INT DEFAULT 10
)
RETURNS TABLE (
  rank BIGINT,
  affiliate_id UUID,
  full_name TEXT,
  avatar_url TEXT,
  tier TEXT,
  total_leads BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ROW_NUMBER() OVER (ORDER BY COUNT(l.id) DESC) AS rank,
    p.id AS affiliate_id,
    p.full_name,
    p.avatar_url,
    p.tier,
    COUNT(l.id) AS total_leads
  FROM public.profiles p
  LEFT JOIN public.leads l 
    ON l.affiliate_id = p.id 
    AND EXTRACT(MONTH FROM l.created_at) = p_month
    AND EXTRACT(YEAR FROM l.created_at) = p_year
  WHERE p.role IN ('affiliate', 'admin')
  GROUP BY p.id, p.full_name, p.avatar_url, p.tier
  HAVING COUNT(l.id) > 0
  ORDER BY total_leads DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
