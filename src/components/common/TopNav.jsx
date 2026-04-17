import React, { useState, useEffect } from 'react';
import { Menu, Moon, Sun } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const TopNav = ({ title = "Dashboard", onToggleSidebar }) => {
  const [isDark, setIsDark] = useState(false);
  const [profile, setProfile] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDark(true);
      document.documentElement.setAttribute('data-theme', 'dark');
    }
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

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  return (
    <header className="topbar">
      <div style={{display: 'flex', alignItems: 'center'}}>
        <button 
          className="hamburger-btn" 
          onClick={onToggleSidebar}
        >
          <Menu size={20} />
        </button>
        <div className="topbar-title">{title}</div>
      </div>
      
      <div className="topbar-actions" style={{display: 'flex', gap: '16px', alignItems: 'center'}}>
        <button 
          onClick={toggleTheme} 
          style={{background: 'none', border: 'none', cursor: 'pointer', color: 'var(--cf-text-muted)'}}
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <div className="profile-circle" style={{ overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>
          {avatarUrl ? (
            <img src={avatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <span>{profile?.full_name ? profile.full_name.substring(0,2).toUpperCase() : 'AD'}</span>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopNav;
