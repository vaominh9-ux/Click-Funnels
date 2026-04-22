-- ============================================
-- MIGRATION: TẠO BẢNG REPLAY VIDEOS
-- Chạy đoạn mã này trong bảng SQL Editor của Supabase
-- ============================================

CREATE TABLE IF NOT EXISTS public.replay_videos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    youtube_url TEXT NOT NULL,
    course_id TEXT NOT NULL,
    topic TEXT NOT NULL,
    description TEXT,
    duration TEXT,
    thumbnail_url TEXT,
    sort_order INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tạo Index để tăng tốc độ truy vấn khi lọc theo Khóa học
CREATE INDEX IF NOT EXISTS idx_replay_videos_course_id ON public.replay_videos(course_id);

-- Cấp quyền bảo mật Row Level Security (RLS)
ALTER TABLE public.replay_videos ENABLE ROW LEVEL SECURITY;

-- Cho phép tất cả mọi người (kể cả chưa đăng nhập) có thể XEM (SELECT) các video đã published
CREATE POLICY "Cho phép mọi người xem video đã publish" 
ON public.replay_videos 
FOR SELECT 
USING (is_published = true);

-- Chỉ cho phép ADMIN được quyền Thêm/Sửa/Xóa (INSERT/UPDATE/DELETE)
-- (Giả định bạn đang dùng bảng profiles có trường role = 'admin')
CREATE POLICY "Chỉ Admin được thao tác" 
ON public.replay_videos 
FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
);

-- ============================================
-- KIỂM TRA & CẤP QUYỀN
-- ============================================
GRANT ALL ON TABLE public.replay_videos TO anon, authenticated, service_role;
