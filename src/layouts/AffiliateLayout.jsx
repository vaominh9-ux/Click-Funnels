import React, { useState } from 'react';
import Sidebar from '../components/affiliate/Sidebar';
import TopNav from '../components/common/TopNav';

const AffiliateLayout = ({ children, title = "Overview" }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="app-container">
      <div 
        className="cf-sidebar-wrapper"
        style={{ display: 'contents' }}
      >
        <Sidebar onClose={() => setIsSidebarOpen(false)} isOpen={isSidebarOpen} />
      </div>
      
      <div className="main-content">
        {/* Overlay INSIDE main-content to fix z-index stacking with body zoom:80% */}
        <div 
          className={`mobile-overlay ${isSidebarOpen ? 'open' : ''}`} 
          onClick={() => setIsSidebarOpen(false)}
        ></div>
        <TopNav title={title} onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <div className="page-wrapper">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AffiliateLayout;
