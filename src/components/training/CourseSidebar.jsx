import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Folder, UserCircle } from 'lucide-react';
import '../affiliate/Sidebar.css';

const CourseSidebar = ({ course, topics, currentTopic, onTopicSelect, isOpen, onClose }) => {
  const navigate = useNavigate();

  return (
    <aside className={`cf-sidebar ${isOpen ? 'mobile-open' : ''}`}>
      <div className="sidebar-header flex-between">
        <div className="brand-logo" style={{display: 'flex', flexDirection: 'row', alignItems: 'center', flexWrap: 'nowrap', gap: '8px', height: '100%'}}>
          <div style={{display: 'flex', alignItems: 'center', width: '100%', overflow: 'hidden'}}>
            <span style={{fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.3px', fontSize: '16px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%'}}>
              Trung Tâm Đào Tạo
            </span>
          </div>
        </div>
      </div>
      
      <div className="sidebar-scroll-area">
        <nav className="sidebar-nav">
          <div className="nav-item" onClick={() => navigate('/portal/courses')} style={{ cursor: 'pointer', background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444' }}>
            <ArrowLeft size={18} style={{ flexShrink: 0 }} />
            <span style={{fontWeight: 600}}>Quay Lại Danh Sách</span>
          </div>

          <div className="sidebar-divider"></div>
          
          <div className="nav-group-title">Menu Học Tập</div>

          <div 
            className={`nav-item ${currentTopic === 'top' ? 'active' : ''}`}
            onClick={() => { onTopicSelect('top'); onClose && onClose(); }}
            style={{ cursor: 'pointer' }}
          >
            <Star size={18} style={{ flexShrink: 0 }} />
            <span>Start Here</span>
          </div>
          
          {topics.map((topic, i) => (
            <div 
              key={topic} 
              className={`nav-item ${currentTopic === topic ? 'active' : ''}`}
              onClick={() => { onTopicSelect(topic); onClose && onClose(); }}
              style={{ cursor: 'pointer' }}
            >
              <Folder size={18} style={{ flexShrink: 0 }} />
              <span>{topic}</span>
            </div>
          ))}

        </nav>
      </div>

    </aside>
  );
};

export default CourseSidebar;
