import React, { useState, useEffect } from 'react';
import { Menu, Moon, Sun, Search, Bell } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import GlobalSearchModal from './GlobalSearchModal';
import NotificationDropdown from './NotificationDropdown';

const TopNav = ({ title = "Dashboard", onToggleSidebar }) => {
  const [isDark, setIsDark] = useState(false);
  const [profile, setProfile] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotiOpen, setIsNotiOpen] = useState(false);

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
    <>
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
        
        <div className="topbar-actions" style={{display: 'flex', gap: '12px', alignItems: 'center'}}>
          {/* Nút Lấy Link Affiliate - CTA Chuyển đổi */}
          <button 
            className="cf-btn-primary"
            style={{ padding: '6px 14px', fontSize: '13px', borderRadius: '6px', display: 'flex', gap: '6px', alignItems: 'center', marginRight: '8px' }}
            onClick={() => window.location.href = '/portal/campaigns'}
          >
            <span style={{ fontSize: '14px' }}>🚀</span>
            Lấy Link Affiliate
          </button>

          {/* Nút Tìm Kiếm Toàn Cục */}
          <button 
            onClick={() => setIsSearchOpen(true)} 
            style={{background: 'none', border: 'none', cursor: 'pointer', color: 'var(--cf-text-muted)', padding: 4, borderRadius: 6, transition: 'color 0.2s'}}
            title="Tìm kiếm nhanh"
          >
            <Search size={20} />
          </button>

          {/* Nút Thông Báo */}
          <div style={{position: 'relative'}}>
            <button 
              onClick={() => setIsNotiOpen(!isNotiOpen)} 
              style={{background: 'none', border: 'none', cursor: 'pointer', color: 'var(--cf-text-muted)', padding: 4, borderRadius: 6, transition: 'color 0.2s'}}
              title="Thông báo"
            >
              <Bell size={20} />
              {/* Chấm đỏ nhấp nháy */}
              <span style={{
                position: 'absolute', top: 2, right: 2,
                width: 8, height: 8, borderRadius: '50%',
                background: '#EF4444',
                boxShadow: '0 0 0 2px var(--surface-color, #fff)',
                animation: 'pulse 2s infinite'
              }}></span>
            </button>
            <NotificationDropdown isOpen={isNotiOpen} onClose={() => setIsNotiOpen(false)} />
          </div>

          {/* Nút Dark Mode */}
          <button 
            onClick={toggleTheme} 
            style={{background: 'none', border: 'none', cursor: 'pointer', color: 'var(--cf-text-muted)'}}
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* Avatar */}
          <div className="profile-circle" style={{ overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <span>{profile?.full_name ? profile.full_name.substring(0,2).toUpperCase() : 'AD'}</span>
            )}
          </div>
        </div>
      </header>

      {/* Search Modal - render ngoài header để z-index không bị sidebar chèn */}
      <GlobalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Pulse animation cho chấm đỏ */}
      <style>{`
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.5); }
          70% { box-shadow: 0 0 0 6px rgba(239, 68, 68, 0); }
          100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
        }
      `}</style>
    </>
  );
};

export default TopNav;
