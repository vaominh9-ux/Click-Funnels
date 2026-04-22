import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, BookOpen, ArrowRight } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import './TrainingCourses.css';

// Course definitions matching funnels/config.js
export const ALL_COURSES = [
  {
    id: 'free-3day',
    name: '3 Ngày Thực Chiến AI — MIỄN PHÍ',
    tier: 'FREE',
    tierClass: 'tc-tier-free',
    thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
    landingPage: '/khoa-hoc/3-ngay-mien-phi',
  },
  {
    id: 'khoa-hoc-1',
    name: 'Khởi Sự 0 Đồng Với AI',
    tier: 'STARTER',
    tierClass: 'tc-tier-starter',
    thumbnail: 'https://images.unsplash.com/photo-1616469829941-c7200edec809?auto=format&fit=crop&w=800&q=80',
    landingPage: '/khoa-hoc/khoa-hoc-1',
  },
  {
    id: 'khoa-hoc-2',
    name: 'Automation, Ads & Xây Hệ Thống Agency AI',
    tier: 'MASTER',
    tierClass: 'tc-tier-master',
    thumbnail: 'https://images.unsplash.com/photo-1556761175-5973dc0f32d7?auto=format&fit=crop&w=800&q=80',
    landingPage: '/khoa-hoc/khoa-hoc-2',
  },
  {
    id: 'khoa-hoc-3',
    name: 'AI Coach / AI Trainer',
    tier: 'AI COACH',
    tierClass: 'tc-tier-coach',
    thumbnail: 'https://images.unsplash.com/photo-1533750349088-cd871a92f312?auto=format&fit=crop&w=800&q=80',
    landingPage: '/khoa-hoc/khoa-hoc-3',
  },
  {
    id: 'khoa-hoc-4',
    name: 'Đỉnh Kim Tự Tháp',
    tier: 'AI PARTNER',
    tierClass: 'tc-tier-partner',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    landingPage: '/khoa-hoc/khoa-hoc-4',
  },
];

// Mock video counts per course (will be replaced by Supabase data)
const MOCK_VIDEO_COUNTS = {
  'free-3day': 3,
  'khoa-hoc-1': 8,
  'khoa-hoc-2': 12,
  'khoa-hoc-3': 6,
  'khoa-hoc-4': 4,
};

const TrainingCourses = () => {
  const navigate = useNavigate();
  const [purchasedCourses, setPurchasedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [videoCounts, setVideoCounts] = useState(MOCK_VIDEO_COUNTS);

  useEffect(() => {
    fetchPurchasedCourses();
    fetchVideoCounts();
  }, []);

  const fetchPurchasedCourses = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        setLoading(false);
        return;
      }

      // Check user role — admins can see all courses
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (profile?.role === 'admin' || profile?.role === 'staff') {
        // Admin/staff can access all courses
        setPurchasedCourses(ALL_COURSES.map(c => c.id));
        setLoading(false);
        return;
      }

      // For regular users, check their conversions (approved purchases)
      const { data: conversions } = await supabase
        .from('conversions')
        .select('customer_info')
        .eq('status', 'approved');

      if (conversions) {
        // Extract unique course IDs from customer_info
        const courseIds = new Set();
        
        // Also check if the user's email matches any conversion
        conversions.forEach(conv => {
          if (conv.customer_info) {
            const info = conv.customer_info;
            if (info.email === session.user.email && info.courseId) {
              courseIds.add(info.courseId);
            }
          }
        });

        // Free course is always accessible
        courseIds.add('free-3day');
        
        setPurchasedCourses([...courseIds]);
      } else {
        setPurchasedCourses(['free-3day']); // At least free course
      }
    } catch (err) {
      console.error('Error fetching purchased courses:', err);
      setPurchasedCourses(['free-3day']);
    }
    setLoading(false);
  };

  const fetchVideoCounts = async () => {
    try {
      const { data } = await supabase
        .from('replay_videos')
        .select('course_id')
        .eq('is_published', true);

      if (data && data.length > 0) {
        const counts = {};
        data.forEach(v => {
          counts[v.course_id] = (counts[v.course_id] || 0) + 1;
        });
        setVideoCounts(counts);
      }
    } catch {
      // Table might not exist yet, use mock data
    }
  };

  const isCoursePurchased = (courseId) => {
    return purchasedCourses.includes(courseId);
  };

  const handleCardClick = (course) => {
    if (isCoursePurchased(course.id)) {
      navigate(`/portal/courses/${course.id}`);
    }
  };

  if (loading) {
    return (
      <div>
        <div className="tc-page-header">
          <h1 className="tc-page-title">Khóa Học Đào Tạo</h1>
          <p className="tc-page-subtitle">Đang tải dữ liệu...</p>
        </div>
        <div className="tc-grid">
          {[1, 2, 3].map(i => (
            <div key={i} className="tc-card" style={{ opacity: 0.5 }}>
              <div className="tc-card-thumb" style={{ background: '#e2e8f0' }}></div>
              <div className="tc-card-body">
                <div style={{ height: 20, background: '#e2e8f0', borderRadius: 4, marginBottom: 8 }}></div>
                <div style={{ height: 14, background: '#f1f5f9', borderRadius: 4, width: '60%' }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="tc-page-header">
        <h1 className="tc-page-title">Khóa Học Đào Tạo</h1>
        <p className="tc-page-subtitle">Chọn khóa học để bắt đầu hoặc tiếp tục hành trình của bạn</p>
      </div>

      <div className="tc-grid">
        {ALL_COURSES.map(course => {
          const purchased = isCoursePurchased(course.id);
          const lessons = videoCounts[course.id] || 0;

          return (
            <div
              key={course.id}
              className="tc-card"
              onClick={() => handleCardClick(course)}
              style={{ cursor: purchased ? 'pointer' : 'default' }}
            >
              {/* Thumbnail */}
              <div className="tc-card-thumb">
                <img src={course.thumbnail} alt={course.name} loading="lazy" />

                {/* Lesson count badge */}
                {lessons > 0 && (
                  <div className="tc-card-badge">
                    <BookOpen size={12} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                    {lessons} bài học
                  </div>
                )}

                {/* Lock overlay if not purchased */}
                {!purchased && (
                  <div className="tc-card-lock">
                    <div className="tc-card-lock-icon">
                      <Lock size={22} />
                    </div>
                    <span className="tc-card-lock-text">Chưa mở khóa</span>
                  </div>
                )}
              </div>

              {/* Card body */}
              <div className="tc-card-body">
                <div className={`tc-card-tier ${course.tierClass}`}>
                  {course.tier}
                </div>
                <h3 className="tc-card-name">{course.name}</h3>

                {purchased ? (
                  <div className="tc-progress-container">
                    <div className="tc-progress-bar">
                      <div
                        className="tc-progress-fill"
                        style={{ width: '0%' }}
                      ></div>
                    </div>
                    <span className="tc-progress-text">0% HOÀN TẤT</span>
                  </div>
                ) : (
                  <a
                    href={course.landingPage}
                    className="tc-card-cta"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Tìm hiểu thêm <ArrowRight size={14} />
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TrainingCourses;
