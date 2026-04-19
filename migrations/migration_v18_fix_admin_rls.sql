-- ============================================
-- Migration V18: Fix Admin RLS Infinite Recursion
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. Create a secure function to check admin role without triggering RLS recursively
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
DECLARE
  user_role text;
BEGIN
  -- We query profiles directly bypassing RLS using SECURITY DEFINER
  SELECT role INTO user_role FROM public.profiles WHERE id = auth.uid();
  RETURN user_role IN ('admin', 'staff');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Drop the old broken policy that causes Infinite Recursion (from V3)
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;

-- 3. Create the new, safe policy
CREATE POLICY "Admins can update all profiles" ON public.profiles 
FOR UPDATE 
USING ( public.is_admin() );

-- 4. Also fix delete policy if needed
DROP POLICY IF EXISTS "Admins can delete profiles" ON public.profiles;
CREATE POLICY "Admins can delete profiles" ON public.profiles 
FOR DELETE 
USING ( public.is_admin() );
