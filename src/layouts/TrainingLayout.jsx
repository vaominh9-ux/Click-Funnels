import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Bell, ArrowLeft, GraduationCap } from 'lucide-react';
import { supabase } from '../lib/supabase';
import './TrainingLayout.css';

const TrainingLayout = ({ children }) => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      if (data) {
        setProfile(data);
        if (data.avatar_url) {
          setAvatarUrl(data.avatar_url);
        }
      }
    }
  };

  const getInitials = () => {
    if (profile?.full_name) {
      return profile.full_name.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  return (
    <div className="training-shell">
      {/* === TOP NAVIGATION BAR === */}
      <header className="training-topbar">
        <div className="training-topbar-left">
          {/* Logo */}
          <Link to="/portal" className="training-logo">
            <GraduationCap size={22} color="#3b82f6" />
            <div className="training-logo-text">
              Click<span>Funnels</span>
            </div>
          </Link>

          {/* Navigation Tabs */}
          <nav className="training-nav">
            <NavLink
              to="/portal/courses"
              className={({ isActive }) => `training-nav-item ${isActive ? 'active' : ''}`}
            >
              Khóa Học
            </NavLink>
          </nav>
        </div>

        <div className="training-topbar-right">
          {/* Back to Portal */}
          <Link to="/portal" className="training-back-btn">
            <ArrowLeft size={16} />
            <span>Quay lại Hệ Thống (Portal)</span>
          </Link>

          {/* Bell */}
          <div className="training-bell">
            <Bell size={18} />
          </div>

          {/* Avatar */}
          <div className="training-avatar" onClick={() => navigate('/portal/settings')}>
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" />
            ) : (
              getInitials()
            )}
          </div>
        </div>
      </header>

      {/* === MAIN CONTENT === */}
      <main className="training-content">
        {children}
      </main>
    </div>
  );
};

export default TrainingLayout;
