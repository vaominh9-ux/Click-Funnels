-- Migration v17: Audit Logs
-- Ghi nhận mọi hành động quan trọng của Admin trên hệ thống

CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  actor_id UUID REFERENCES public.profiles(id),       -- Admin thực hiện
  actor_email TEXT,                                      -- Email snapshot
  action TEXT NOT NULL,                                  -- VD: 'conversion.approve', 'payout.complete'
  entity_type TEXT NOT NULL,                             -- 'conversion', 'payout', 'profile', 'campaign'
  entity_id TEXT,                                        -- ID của đối tượng bị tác động
  details JSONB DEFAULT '{}'::jsonb,                     -- Chi tiết bổ sung
  ip_address TEXT,                                       -- IP (nếu bắt được)
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index cho query theo thời gian và entity
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON public.audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON public.audit_logs(actor_id);

-- RLS: chỉ Admin/Staff đọc được
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view audit logs" ON public.audit_logs FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'staff'))
);

-- Bất kỳ authenticated user nào cũng có thể insert (vì ghi từ frontend khi admin thao tác)
CREATE POLICY "Authenticated users can insert audit logs" ON public.audit_logs FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);
