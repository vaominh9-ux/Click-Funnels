-- ============================================
-- DỮ LIỆU MẪU (SEED DATA) CHO BẢNG MỚI TẠO: REPLAY VIDEOS
-- Bạn copy nguyên đoạn lệnh này bỏ vào SQL Editor Supabase và chạy nhé!
-- ============================================

INSERT INTO public.replay_videos (youtube_url, course_id, topic, title, duration, sort_order)
VALUES
-- KHÓA 3 NGÀY MIỄN PHÍ
('https://www.youtube.com/embed/dQw4w9WgXcQ', 'free-3day', 'Buổi 1: Mindset & Nền tảng', 'Video 1: Tại sao AI lại thay đổi cuộc chơi 2024?', '45 mins', 1),
('https://www.youtube.com/embed/dQw4w9WgXcQ', 'free-3day', 'Buổi 1: Mindset & Nền tảng', 'Video 2: Setup 3 công cụ cốt lõi nhất', '30 mins', 2),
('https://www.youtube.com/embed/dQw4w9WgXcQ', 'free-3day', 'Buổi 2: Ứng dụng thực tế', 'Video 3: Tự động hóa viết Content bằng ChatGPT', '55 mins', 3),
('https://www.youtube.com/embed/dQw4w9WgXcQ', 'free-3day', 'Buổi 2: Ứng dụng thực tế', 'Video 4: Làm kịch bản Short Video thu hút hàng ngàn Leads', '1h', 4),
('https://www.youtube.com/embed/dQw4w9WgXcQ', 'free-3day', 'Buổi 3: Triển khai', 'Video 5: Tổng kết và thiết lập Phễu Bán Hàng', '1h 15m', 5),

-- KHÓA HỌC 1: KHỞI SỰ 0 ĐỒNG VỚI AI
('https://www.youtube.com/embed/dQw4w9WgXcQ', 'khoa-hoc-1', 'Tuần 1: Tư Duy Nền Tảng', 'Bài 1: Tổng Quan Và Thiết Lập Mục Tiêu', '45 mins', 1),
('https://www.youtube.com/embed/dQw4w9WgXcQ', 'khoa-hoc-1', 'Tuần 1: Tư Duy Nền Tảng', 'Bài 2: Tạo Tài Khoản & Setup Công Cụ', '50 mins', 2),
('https://www.youtube.com/embed/dQw4w9WgXcQ', 'khoa-hoc-1', 'Tuần 2: Ứng Dụng Thực Chiến', 'Bài 3: Lệnh Prompt Siêu Cấp', '1h 10m', 3),
('https://www.youtube.com/embed/dQw4w9WgXcQ', 'khoa-hoc-1', 'Tuần 2: Ứng Dụng Thực Chiến', 'Bài 4: Sáng Tạo Hình Ảnh Bằng Midjourney & Banana Pro', '55 mins', 4),
('https://www.youtube.com/embed/dQw4w9WgXcQ', 'khoa-hoc-1', 'Tuần 3: Tự Động Hóa', 'Bài 5: Tool xây dựng hệ thống tự động trả lời', '1h 5m', 5);
