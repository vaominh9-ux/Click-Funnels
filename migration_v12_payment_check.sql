-- Function kiểm tra trạng thái thanh toán (bypass RLS)
-- Chỉ trả về status, không lộ thông tin nhạy cảm
CREATE OR REPLACE FUNCTION public.check_payment_status(p_payment_code TEXT)
RETURNS TEXT AS $$
  SELECT status FROM public.conversions 
  WHERE payment_code = p_payment_code 
  LIMIT 1;
$$ LANGUAGE SQL SECURITY DEFINER;
