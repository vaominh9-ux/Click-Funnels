-- ========================================================
-- SCRIPT TẠO DỮ LIỆU GIẢ (MOCK DATA) CHO BẢNG VÀNG & DASHBOARD
-- Chạy đoạn mã này trong SQL Editor của Supabase
-- ========================================================

DO $$
DECLARE
  v_aff_1 UUID := gen_random_uuid();
  v_aff_2 UUID := gen_random_uuid();
  v_aff_3 UUID := gen_random_uuid();
  v_aff_4 UUID := gen_random_uuid();
  v_camp_id UUID;
BEGIN

  -- 0. Lấy 1 campaign_id bất kỳ đã tồn tại (cần cho affiliate_links)
  SELECT id INTO v_camp_id FROM public.campaigns LIMIT 1;

  -- 1. Tạo user giả trong auth.users (để thỏa Foreign Key -> profiles)
  INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at) VALUES 
  (v_aff_1, 'authenticated', 'authenticated', 'hung.mock@example.com', 'mock_pwd', NOW(), NOW(), NOW()),
  (v_aff_2, 'authenticated', 'authenticated', 'tra.mock@example.com', 'mock_pwd', NOW(), NOW(), NOW()),
  (v_aff_3, 'authenticated', 'authenticated', 'kiet.mock@example.com', 'mock_pwd', NOW(), NOW(), NOW()),
  (v_aff_4, 'authenticated', 'authenticated', 'bao.mock@example.com', 'mock_pwd', NOW(), NOW(), NOW());

  -- 2. Cập nhật Profile (trigger on auth.users tự tạo row trong profiles)
  UPDATE public.profiles SET full_name = 'Hùng Marketing',   role = 'affiliate', tier = 'ai-partner', balance = 21500000, total_earned = 42000000 WHERE id = v_aff_1;
  UPDATE public.profiles SET full_name = 'Lê Thị Thu Trà',   role = 'affiliate', tier = 'master',     balance = 18000000, total_earned = 31000000 WHERE id = v_aff_2;
  UPDATE public.profiles SET full_name = 'Nguyễn Tuấn Kiệt', role = 'affiliate', tier = 'ai-coach',   balance = 9500000,  total_earned = 15000000 WHERE id = v_aff_3;
  UPDATE public.profiles SET full_name = 'Phạm Vũ Bảo',      role = 'affiliate', tier = 'starter',    balance = 3000000,  total_earned = 6000000  WHERE id = v_aff_4;

  -- 3. Bơm Doanh Số (Conversions) — tháng hiện tại
  INSERT INTO public.conversions (affiliate_id, customer_name, product_name, sale_amount, commission_amount, status, created_at) VALUES 
  (v_aff_1, 'Khách Doanh Nghiệp A',  'Khóa AI Đối Tác',    50000000, 15000000, 'approved', NOW() - INTERVAL '1 day'),
  (v_aff_1, 'Anh Khảo HCM',          'Khóa Master Class',   10000000, 3000000,  'approved', NOW() - INTERVAL '3 days'),
  (v_aff_1, 'Chị Hằng Đà Nẵng',      'Khóa AI Đối Tác',    50000000, 15000000, 'pending',  NOW() - INTERVAL '1 hour'),
  (v_aff_2, 'Anh Khang Bình Dương',   'Khóa Master Class',   10000000, 3000000,  'approved', NOW() - INTERVAL '2 days'),
  (v_aff_2, 'Bác sĩ Minh HN',        'Khóa Đào Tạo AI',    20000000, 6000000,  'approved', NOW() - INTERVAL '5 days'),
  (v_aff_3, 'Sinh Viên Hà Nội',       'Khóa Học Starter',     2000000, 600000,   'approved', NOW() - INTERVAL '6 days');

  -- 4. Bơm Clicks/Leads (đúng schema: generated_url NOT NULL, campaign_id)
  IF v_camp_id IS NOT NULL THEN
    INSERT INTO public.affiliate_links (id, affiliate_id, campaign_id, generated_url, clicks, leads) VALUES
    (gen_random_uuid(), v_aff_1, v_camp_id, 'https://mock-link.com/hung1',  12450, 420),
    (gen_random_uuid(), v_aff_2, v_camp_id, 'https://mock-link.com/tra1',   8500,  150),
    (gen_random_uuid(), v_aff_3, v_camp_id, 'https://mock-link.com/kiet1',  24000, 890),
    (gen_random_uuid(), v_aff_4, v_camp_id, 'https://mock-link.com/bao1',   450,   12);
  END IF;

  -- 5. Bơm Huy Hiệu (Badges) 
  INSERT INTO public.user_badges (affiliate_id, badge_id, badge_name, reward_amount) VALUES 
  (v_aff_1, 'shark_top',   'Quái Vật Doanh Số',       5000000),
  (v_aff_1, 'combo_5',     'Bàn Tay Lửa (5 Sale)',    1000000),
  (v_aff_2, 'first_blood', 'Chiến Công Đầu',          200000),
  (v_aff_3, 'leads_king',  'Bậc Thầy Kéo Leads',      1000000);

END $$;
