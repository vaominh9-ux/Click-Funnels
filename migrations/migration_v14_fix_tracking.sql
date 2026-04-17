-- ============================================
-- Migration V14: Fix Affiliate Link Tracking (Leads)
-- ============================================

-- 1. Thêm cột link_id vào bảng leads
ALTER TABLE public.leads 
  ADD COLUMN IF NOT EXISTS link_id UUID REFERENCES public.affiliate_links(id) ON DELETE SET NULL;

-- 2. Trigger tự động cộng leads cho affiliate_links
CREATE OR REPLACE FUNCTION public.process_new_lead()
RETURNS trigger AS $$
BEGIN
  IF NEW.link_id IS NOT NULL THEN
    UPDATE public.affiliate_links 
    SET leads = COALESCE(leads, 0) + 1 
    WHERE id = NEW.link_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Gắn Trigger vào bảng leads
DROP TRIGGER IF EXISTS on_new_lead ON public.leads;
CREATE TRIGGER on_new_lead
  AFTER INSERT ON public.leads
  FOR EACH ROW EXECUTE PROCEDURE public.process_new_lead();
