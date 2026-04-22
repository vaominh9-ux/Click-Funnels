-- ==============================================================================
-- Bảng: user_video_progress 
-- Mục đích: Đánh dấu tiến độ học thuật của từng học viên (các video đã xem)
-- Lưu ý: Chạy trong trình SQL Editor của Supabase
-- ==============================================================================

-- 1. Tạo bảng theo dõi tiến độ
CREATE TABLE IF NOT EXISTS public.user_video_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    video_id UUID NOT NULL REFERENCES public.replay_videos(id) ON DELETE CASCADE,
    completed BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, video_id) -- Mỗi user chỉ có 1 record đánh dấu trên 1 video
);

-- 2. Tối ưu hoá truy vấn bằng Index
CREATE INDEX IF NOT EXISTS user_video_progress_user_id_idx ON public.user_video_progress(user_id);
CREATE INDEX IF NOT EXISTS user_video_progress_video_id_idx ON public.user_video_progress(video_id);

-- 3. Bật RLS (Row Level Security) bảo mật mức độ dòng
ALTER TABLE public.user_video_progress ENABLE ROW LEVEL SECURITY;

-- 4. Phân Quyền (Policies)
-- Người dùng tự do xem danh sách các video mình đã hoàn thành
CREATE POLICY "Users can view their own progress" 
ON public.user_video_progress FOR SELECT 
USING (auth.uid() = user_id);

-- Người dùng có thể tự thêm (đánh dấu) video mình đã hoàn thành
CREATE POLICY "Users can insert their own progress" 
ON public.user_video_progress FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Người dùng có thể xoá (bỏ đánh dấu) video của mình
CREATE POLICY "Users can delete their own progress" 
ON public.user_video_progress FOR DELETE 
USING (auth.uid() = user_id);

-- Kích hoạt Realtime (Nhanh, không bắt buộc, nhưng tốt cho hệ sinh thái SPA)
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_video_progress;
