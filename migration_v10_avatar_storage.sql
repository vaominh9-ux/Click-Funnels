-- ============================================
-- MIGRATION V10: Tạo Storage Bucket cho Avatar
-- Chạy đoạn mã này trong SQL Editor của Supabase
-- ============================================

-- 1. Tạo bucket "avatars" (public access)
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Policy: Cho phép user đã đăng nhập upload avatar của chính mình
CREATE POLICY "Users can upload own avatar"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars'
  AND auth.role() = 'authenticated'
);

-- 3. Policy: Cho phép user update (overwrite) avatar của chính mình
CREATE POLICY "Users can update own avatar"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'avatars'
  AND auth.role() = 'authenticated'
);

-- 4. Policy: Cho phép tất cả mọi người xem avatar (public)
CREATE POLICY "Public can view avatars"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');
