import React, { useState, useEffect } from 'react';
import { Menu, Moon, Sun } from 'lucide-react';

const TopNav = ({ title = "Dashboard", onToggleSidebar }) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDark(true);
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

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
        <div className="profile-circle">
          AD
        </div>
      </div>
    </header>
  );
};

export default TopNav;
