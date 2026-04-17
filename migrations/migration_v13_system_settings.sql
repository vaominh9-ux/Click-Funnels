-- Migration V13: Bảng system_settings lưu cấu hình hệ thống
-- Admin có thể thay đổi thông tin ngân hàng, thanh toán từ giao diện

CREATE TABLE IF NOT EXISTS public.system_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES public.profiles(id)
);

-- RLS: Ai cũng đọc được, chỉ Admin sửa
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read settings" 
ON public.system_settings FOR SELECT USING (true);

CREATE POLICY "Admins can modify settings" 
ON public.system_settings FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Insert cấu hình mặc định
INSERT INTO public.system_settings (key, value) VALUES 
('bank_config', '{"bankId": "970418", "accountNo": "96247NTH195", "accountName": "NGUYEN TRONG HUU", "bankName": "BIDV"}'::jsonb),
('payment_prefix', '"CF"'::jsonb)
ON CONFLICT (key) DO NOTHING;
