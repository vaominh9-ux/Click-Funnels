import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, CheckCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import TopNav from '../../components/common/TopNav';
import CourseSidebar from '../../components/training/CourseSidebar';
import VideoPlayer from '../../components/training/VideoPlayer';
import { ALL_COURSES } from './TrainingCourses';
import './CourseDetail.css';

const getEmbedUrl = (url) => {
  if (!url) return '';
  let videoId = '';
  if (url.includes('youtu.be/')) videoId = url.split('youtu.be/')[1].split('?')[0];
  else if (url.includes('youtube.com/watch?v=')) videoId = url.split('v=')[1].split('&')[0];
  else if (url.includes('/embed/')) videoId = url.split('/embed/')[1].split('?')[0];

  return videoId ? `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&showinfo=0&iv_load_policy=3&color=white` : url;
};

const getYouTubeThumbnail = (url) => {
  if (!url) return 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=400&q=80';
  let videoId = '';
  if (url.includes('youtu.be/')) videoId = url.split('youtu.be/')[1].split('?')[0];
  else if (url.includes('youtube.com/watch?v=')) videoId = url.split('v=')[1].split('&')[0];
  else if (url.includes('/embed/')) videoId = url.split('/embed/')[1].split('?')[0];
  
  return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=400&q=80';
};

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const course = ALL_COURSES.find(c => c.id === courseId);
  const [videos, setVideos] = useState([]);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [completedVideos, setCompletedVideos] = useState(new Set());
  const [isMarking, setIsMarking] = useState(false);

  // Layout states
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentViewTopic, setCurrentViewTopic] = useState('top');

  const topics = [...new Set(videos.map(v => v.topic))];
  const videosByTopic = topics.reduce((acc, topic) => {
    acc[topic] = videos.filter(v => v.topic === topic);
    return acc;
  }, {});

  useEffect(() => {
    if (!course) {
      navigate('/portal/courses');
      return;
    }
    fetchCourseData();
  }, [courseId]);

  const fetchCourseData = async () => {
    setLoading(true);
    try {
      // 1. Fetch videos
      const { data: videoData, error: videoError } = await supabase
        .from('replay_videos')
        .select('*')
        .eq('course_id', courseId)
        .eq('is_published', true)
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: true });

      if (videoError) throw videoError;

      setVideos(videoData || []);
      if (videoData && videoData.length > 0) {
        setCurrentVideo(videoData[0]);
      }

      // Fetch user progress
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: progress } = await supabase
          .from('user_video_progress')
          .select('video_id')
          .eq('user_id', session.user.id);
        if (progress) {
          setCompletedVideos(new Set(progress.map(p => p.video_id)));
        }
      }
    } catch (err) {
      console.error('Error fetching course detail:', err);
      setError('Không thể tải khóa học. Có thể bảng chưa được cấu hình.');
    } finally {
      setLoading(false);
    }
  };

  const handleLessonSelect = (video) => {
    setCurrentVideo(video);
    const container = document.querySelector('.page-wrapper');
    if (container) {
      container.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const scrollToTopic = (topicName) => {
    setCurrentViewTopic(topicName);
    if (topicName === 'top') {
      const el = document.getElementById('topic-top');
      if (el) {
        document.querySelector('.page-wrapper').scrollTo({ top: el.offsetTop - 20, behavior: 'smooth' });
      }
      return;
    }

    const el = document.getElementById(`topic-${topicName}`);
    if (el) {
      document.querySelector('.page-wrapper').scrollTo({ top: el.offsetTop - 20, behavior: 'smooth' });
    }
  };

  const toggleComplete = async () => {
    if (!currentVideo) return;
    setIsMarking(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const isCompleted = completedVideos.has(currentVideo.id);

      if (isCompleted) {
        await supabase
          .from('user_video_progress')
          .delete()
          .eq('user_id', session.user.id)
          .eq('video_id', currentVideo.id);
          
        const newSet = new Set(completedVideos);
        newSet.delete(currentVideo.id);
        setCompletedVideos(newSet);
      } else {
        await supabase
          .from('user_video_progress')
          .insert({
            user_id: session.user.id,
            video_id: currentVideo.id,
            completed: true
          });
          
        const newSet = new Set(completedVideos);
        newSet.add(currentVideo.id);
        setCompletedVideos(newSet);
      }
    } catch (err) {
      console.error('Error toggling progress:', err);
    } finally {
      setIsMarking(false);
    }
  };

  if (loading) return (
    <div className="app-container">
      <div className="main-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#6b7280' }}>Đang tải nội dung khóa học...</p>
      </div>
    </div>
  );

  if (error || !course) return (
    <div className="app-container">
      <div className="main-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#ef4444' }}>Lỗi: {error || 'Không tìm thấy khóa học'}</p>
      </div>
    </div>
  );

  if (!videos || videos.length === 0) return (
    <div className="app-container">
      <div className="main-content">
        <TopNav title={course.name} onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <div className="page-wrapper" style={{ padding: 40, textAlign: 'center' }}>
          <h2>Khóa học đang được cập nhật video</h2>
          <p>Video sẽ sớm được Admin đưa lên hệ thống.</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="app-container">
      {/* SIDEBAR */}
      <div className="cf-sidebar-wrapper" style={{ display: 'contents' }}>
        <CourseSidebar
          course={course}
          topics={topics}
          currentTopic={currentViewTopic}
          onTopicSelect={scrollToTopic}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
      </div>

      {/* MAIN CONTENT */}
      <div className="main-content">
        <div
          className={`mobile-overlay ${isSidebarOpen ? 'open' : ''}`}
          onClick={() => setIsSidebarOpen(false)}
        ></div>

        <TopNav title={course.name} onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

        <div className="page-wrapper" style={{ padding: 0 }}>
          {/* Hero Section */}
          <div id="topic-top" className="cd-hero-full">
            <div className="cd-hero-wrapper-full">
              <VideoPlayer url={currentVideo.youtube_url} title={currentVideo.title} />
            </div>

            <div className="cd-hero-info">
              <h2>Đang xem: {currentVideo.title}</h2>
              <div className="cd-hero-meta-row">
                <p style={{ margin: 0 }}>{currentVideo.topic} • {currentVideo.duration}</p>
                
                <button 
                  className={`cd-btn-complete ${completedVideos.has(currentVideo.id) ? 'completed' : ''}`}
                  onClick={toggleComplete}
                  disabled={isMarking}
                >
                  <CheckCircle size={18} />
                  {completedVideos.has(currentVideo.id) ? 'Đã Hoàn Thành' : 'Đánh Dấu Hoàn Thành'}
                </button>
              </div>
            </div>
          </div>

          {/* Module Lists */}
          <div className="cd-topics-full">
            {topics.map(topic => (
              <div key={topic} id={`topic-${topic}`} className="cd-topic-section">
                <h3 className="cd-topic-title">{topic}</h3>

                <div className="cd-carousel">
                  {videosByTopic[topic].map((video) => {
                    const isPlaying = currentVideo.id === video.id;
                    return (
                      <div
                        key={video.id}
                        className={`cd-lesson-card ${isPlaying ? 'playing' : ''}`}
                        onClick={() => handleLessonSelect(video)}
                      >
                        <div className="cd-lesson-thumb">
                          <img src={getYouTubeThumbnail(video.youtube_url)} alt={video.title} loading="lazy" />
                          <div className="cd-play-icon">
                            <Play fill="currentColor" size={20} style={{ marginLeft: 2 }} />
                          </div>
                          {video.duration && (
                            <div className="cd-lesson-duration">
                              {video.duration}
                            </div>
                          )}
                          {completedVideos.has(video.id) && (
                            <div className="cd-completed-badge" title="Đã hoàn thành">
                              <CheckCircle size={14} />
                            </div>
                          )}
                        </div>
                        <div className="cd-lesson-title">
                          {video.title}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            <div style={{ height: 100 }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
