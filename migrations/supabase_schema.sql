-- Supabase ClickFunnels Affiliate Portal Schema
-- Run this block in the Supabase SQL Editor

-- Clean start (Optional but recommended for fresh setup)
DROP TABLE IF EXISTS public.payouts CASCADE;
DROP TABLE IF EXISTS public.conversions CASCADE;
DROP TABLE IF EXISTS public.affiliate_links CASCADE;
DROP TABLE IF EXISTS public.commission_plans CASCADE;
DROP TABLE IF EXISTS public.campaigns CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- 1. Create Profiles table (combines Staff and Affiliates)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'affiliate' CHECK (role IN ('admin', 'staff', 'affiliate')),
  approval_status TEXT DEFAULT 'pending' CHECK (approval_status IN ('pending', 'active', 'rejected')),
  ref_code TEXT UNIQUE,
  referred_by UUID REFERENCES public.profiles(id),
  balance NUMERIC DEFAULT 0,
  total_earned NUMERIC DEFAULT 0,
  payment_info JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone."
  ON public.profiles FOR SELECT
  USING ( true );

CREATE POLICY "Users can insert their own profile."
  ON public.profiles FOR INSERT
  WITH CHECK ( auth.uid() = id );

CREATE POLICY "Users can update own profile."
  ON public.profiles FOR UPDATE
  USING ( auth.uid() = id );

-- Auto create profile trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url, ref_code, role, approval_status)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url',
    substring(regexp_replace(new.id::text, '-', '', 'g') from 1 for 8), -- Generates a ref code from user ID
    COALESCE(new.raw_user_meta_data->>'role', 'affiliate'),
    CASE WHEN COALESCE(new.raw_user_meta_data->>'role', 'affiliate') = 'affiliate' THEN 'pending' ELSE 'active' END
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 2. Campaigns table
CREATE TABLE IF NOT EXISTS public.campaigns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  landing_page_url TEXT NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'locked')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Campaigns viewable by everyone." ON public.campaigns FOR SELECT USING (true);
CREATE POLICY "Admins can modify campaigns." ON public.campaigns FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'staff'))
);

-- 3. Commission Plans
CREATE TABLE IF NOT EXISTS public.commission_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT DEFAULT 'default' CHECK (type IN ('default', 'product', 'user_override')),
  rate_percent NUMERIC,
  rate_fixed NUMERIC,
  applied_to JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.commission_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Plans viewable by everyone." ON public.commission_plans FOR SELECT USING (true);
CREATE POLICY "Admins can modify plans." ON public.commission_plans FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'staff'))
);

-- 4. Affiliate Links
CREATE TABLE IF NOT EXISTS public.affiliate_links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  affiliate_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  campaign_id UUID REFERENCES public.campaigns(id) ON DELETE CASCADE,
  generated_url TEXT NOT NULL,
  sub_id TEXT,
  clicks_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(affiliate_id, campaign_id, sub_id)
);

ALTER TABLE public.affiliate_links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Affiliates can view own links" ON public.affiliate_links FOR SELECT USING (auth.uid() = affiliate_id);
CREATE POLICY "Affiliates can create own links" ON public.affiliate_links FOR INSERT WITH CHECK (auth.uid() = affiliate_id);
CREATE POLICY "Admins can view all links" ON public.affiliate_links FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'staff'))
);

-- 5. Conversions
CREATE TABLE IF NOT EXISTS public.conversions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  affiliate_id UUID REFERENCES public.profiles(id),
  campaign_id UUID REFERENCES public.campaigns(id),
  link_id UUID REFERENCES public.affiliate_links(id),
  customer_info JSONB,
  sale_amount NUMERIC NOT NULL,
  commission_amount NUMERIC NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  type TEXT DEFAULT 'sale' CHECK (type IN ('lead', 'sale')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.conversions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Affiliates can view own conversions" ON public.conversions FOR SELECT USING (auth.uid() = affiliate_id);
CREATE POLICY "Admins can view all conversions" ON public.conversions FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'staff'))
);
CREATE POLICY "System can insert conversions" ON public.conversions FOR INSERT WITH CHECK (true); -- We will rely on Edge Functions for secure inserts

-- 6. Payouts
CREATE TABLE IF NOT EXISTS public.payouts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  affiliate_id UUID REFERENCES public.profiles(id),
  amount NUMERIC NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'rejected')),
  method TEXT,
  bank_details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.payouts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Affiliates can view own payouts" ON public.payouts FOR SELECT USING (auth.uid() = affiliate_id);
CREATE POLICY "Affiliates can request payouts" ON public.payouts FOR INSERT WITH CHECK (auth.uid() = affiliate_id);
CREATE POLICY "Admins can manage payouts" ON public.payouts FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'staff'))
);

-- Enable Realtime for conversions
alter publication supabase_realtime add table public.conversions;

-- 7. Leads (CRM - Quản lý khách hàng)
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  source TEXT DEFAULT 'direct' CHECK (source IN ('facebook', 'tiktok', 'youtube', 'zalo', 'website', 'direct', 'referral', 'other')),
  stage TEXT DEFAULT 'new' CHECK (stage IN ('new', 'contacted', 'consulting', 'closed_won', 'closed_lost')),
  affiliate_id UUID REFERENCES public.profiles(id),
  campaign_id UUID REFERENCES public.campaigns(id),
  notes TEXT,
  value NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Affiliates can view own leads" ON public.leads FOR SELECT USING (auth.uid() = affiliate_id);
CREATE POLICY "Affiliates can insert own leads" ON public.leads FOR INSERT WITH CHECK (auth.uid() = affiliate_id);
CREATE POLICY "Affiliates can update own leads" ON public.leads FOR UPDATE USING (auth.uid() = affiliate_id);
CREATE POLICY "Admins can manage all leads" ON public.leads FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'staff'))
);

-- 8. Lead Activities (Lịch sử chăm sóc khách)
CREATE TABLE IF NOT EXISTS public.lead_activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
  type TEXT DEFAULT 'note' CHECK (type IN ('call', 'note', 'email', 'meeting', 'status_change')),
  content TEXT NOT NULL,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.lead_activities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view activities of their leads" ON public.lead_activities FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.leads WHERE leads.id = lead_id AND (leads.affiliate_id = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND role IN ('admin', 'staff'))))
);
CREATE POLICY "Users can insert activities" ON public.lead_activities FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Admins can manage all activities" ON public.lead_activities FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'staff'))
);
