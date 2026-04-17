import React, { useState } from 'react';
import Sidebar from '../components/affiliate/Sidebar';
import TopNav from '../components/common/TopNav';

const AffiliateLayout = ({ children, title = "Overview" }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="app-container">
      <div 
        className={`cf-sidebar-wrapper ${isSidebarOpen ? 'mobile-open' : ''}`}
        style={{ display: 'contents' }}
      >
        <div className={`cf-sidebar ${isSidebarOpen ? 'mobile-open' : ''}`}>
          <Sidebar onClose={() => setIsSidebarOpen(false)} />
        </div>
      </div>
      
      {/* Overlay to close sidebar on mobile */}
      <div 
        className={`mobile-overlay ${isSidebarOpen ? 'open' : ''}`} 
        onClick={() => setIsSidebarOpen(false)}
      ></div>

      <div className="main-content">
        <TopNav title={title} onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <div className="page-wrapper">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AffiliateLayout;
