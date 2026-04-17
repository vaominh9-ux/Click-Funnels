import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Megaphone, Users, Wallet, Settings, Search, Bell, Plus, Hexagon, Settings2, DollarSign, UserCheck, Zap, Link as LinkIcon, LogOut, ContactRound } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import './Sidebar.css';

const Sidebar = ({ onClose }) => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);

  const [openGroups, setOpenGroups] = useState({
    campaigns: true,
    network: false
  });

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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/auth/login');
  };

  const toggleGroup = (group) => {
    setOpenGroups(prev => ({
      ...prev,
      [group]: !prev[group]
    }));
  };

  return (
    <aside className="cf-sidebar">
      <div className="sidebar-header flex-between mb-4">
        <div className="brand-logo" style={{display: 'flex', flexDirection: 'row', alignItems: 'center', flexWrap: 'nowrap', gap: '8px', height: '100%'}}>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
            <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13 18.5V26C13 27.1046 12.1046 28 11 28H6C4.89543 28 4 27.1046 4 26V8C4 6.89543 4.89543 6 6 6H11C12.1046 6 13 6.89543 13 8V18.5Z" fill="#3B82F6"/>
              <path d="M19 13.5V6C19 4.89543 19.8954 4 21 4H26C27.1046 4 28 4.89543 28 6V24C28 25.1046 27.1046 26 26 26H21C19.8954 26 19 25.1046 19 24V13.5Z" fill="#EF4444"/>
              <path d="M10 18.5L22 13.5V18C19 19.5 14 20 10 18.5Z" fill="#1E3A8A" opacity="0.6"/>
            </svg>
          </div>
          <div style={{display: 'flex', alignItems: 'center', whiteSpace: 'nowrap'}}>
            <span style={{fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.3px', fontSize: '20px'}}>Click</span>
            <span style={{fontWeight: 400, color: '#E5E7EB', letterSpacing: '0px', fontSize: '20px'}}>Funnels</span>
          </div>
        </div>
        <div className="header-actions" style={{display: 'flex', gap: '12px', color: '#9CA3AF'}}>
          <Search size={18} />
          <Bell size={18} />
        </div>
      </div>
      
      <div className="sidebar-scroll-area">
        <nav className="sidebar-nav">
          {/* TOP LEVEL NAVIGATION */}
          <NavLink to="/portal" end className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={onClose}>
            <LayoutDashboard size={18} />
            <span>Thống Kê Cá Nhân</span>
          </NavLink>

          <NavLink to="/affiliate/store" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={onClose}>
            <Zap size={18} />
            <span>Cửa Hàng Bậc B2B</span>
          </NavLink>

          <NavLink to="/portal/customers" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={onClose}>
            <Users size={18} />
            <span>Khách Hàng & CTV</span>
          </NavLink>

          <div className="sidebar-divider"></div>

          {/* APPS - TIẾP THỊ */}
          <div className="nav-group-wrapper">
            <div className="nav-group-header" onClick={() => toggleGroup('apps')}>
              <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                <Megaphone size={18} />
                <span>Tiếp Thị</span>
              </div>
            </div>
            
            {openGroups.apps && (
              <div className="nav-sub-items-tree">
                <NavLink to="/affiliate/links" className={({ isActive }) => `nav-sub-item-tree ${isActive ? 'active' : ''}`} onClick={onClose}>
                  <span className="nav-sub-item-text">Lấy Link</span>
                </NavLink>
                <NavLink to="/portal/campaigns/locked" className={({ isActive }) => `nav-sub-item-tree ${isActive ? 'active' : ''}`} onClick={onClose}>
                  <span className="nav-sub-item-text">Chiến Dịch Khóa</span>
                </NavLink>
              </div>
            )}
          </div>

          {/* MẠNG LƯỚI */}
          <div className="nav-group-wrapper">
            <div className="nav-group-header" onClick={() => toggleGroup('network')}>
              <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                <Users size={18} />
                <span>Mạng Lưới</span>
              </div>
            </div>
            
            {openGroups.network && (
              <div className="nav-sub-items-tree">
                <NavLink to="/portal/network/direct" className={({ isActive }) => `nav-sub-item-tree ${isActive ? 'active' : ''}`} onClick={onClose}>
                  <span className="nav-sub-item-text">Trực Tiếp F1</span>
                </NavLink>
                <NavLink to="/affiliate/ledger" className={({ isActive }) => `nav-sub-item-tree ${isActive ? 'active' : ''}`} onClick={onClose}>
                  <span className="nav-sub-item-text">Sao Kê</span>
                </NavLink>
              </div>
            )}
          </div>

          {/* QUẢN TRỊ HỆ THỐNG */}
          <div className="nav-group-wrapper">
            <div className="nav-group-header" onClick={() => toggleGroup('admin')}>
              <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                <Settings2 size={18} />
                <span>Hệ Thống</span>
              </div>
            </div>
            
            {openGroups.admin && (
              <div className="nav-sub-items-tree">
                <NavLink to="/admin" end className={({ isActive }) => `nav-sub-item-tree ${isActive ? 'active' : ''}`} onClick={onClose}>
                  <span className="nav-sub-item-text">Tổng Quan Admin</span>
                </NavLink>
                <NavLink to="/admin/commissions" className={({ isActive }) => `nav-sub-item-tree ${isActive ? 'active' : ''}`} onClick={onClose}>
                  <span className="nav-sub-item-text">Cấu Hình Hoa Hồng</span>
                </NavLink>
                <NavLink to="/admin/payouts" className={({ isActive }) => `nav-sub-item-tree ${isActive ? 'active' : ''}`} onClick={onClose}>
                  <span className="nav-sub-item-text">Duyệt Rút Tiền</span>
                </NavLink>
                <NavLink to="/admin/staff" className={({ isActive }) => `nav-sub-item-tree ${isActive ? 'active' : ''}`} onClick={onClose}>
                  <span className="nav-sub-item-text">Nhân Sự</span>
                </NavLink>
                <NavLink to="/admin/campaign-links" className={({ isActive }) => `nav-sub-item-tree ${isActive ? 'active' : ''}`} onClick={onClose}>
                  <span className="nav-sub-item-text">Nguồn Link</span>
                </NavLink>
                <NavLink to="/admin/leads" className={({ isActive }) => `nav-sub-item-tree ${isActive ? 'active' : ''}`} onClick={onClose}>
                  <span className="nav-sub-item-text">CRM</span>
                </NavLink>
                <NavLink to="/admin/conversions" className={({ isActive }) => `nav-sub-item-tree ${isActive ? 'active' : ''}`} onClick={onClose}>
                  <span className="nav-sub-item-text">Đơn Hàng & Hoa Hồng</span>
                </NavLink>
              </div>
            )}
          </div>

        </nav>
      </div>

      <div className="sidebar-footer">
        <NavLink to="/portal/settings" className="nav-item mb-2" style={{color: '#D1D5DB'}} onClick={onClose}>
          <Settings size={18} />
          <span>Cài Đặt Hệ Thống</span>
        </NavLink>
        
        <div className="user-profile-card">
          {avatarUrl ? (
            <img src={avatarUrl} alt="Avatar" className="user-avatar" style={{objectFit: 'cover', border: 'none'}} />
          ) : (
            <div className="user-avatar">{profile?.full_name ? profile.full_name.substring(0,2).toUpperCase() : 'U'}</div>
          )}
          <div className="user-info">
            <div className="user-team" style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '120px'}}>{profile?.full_name || 'Affiliate User'}</div>
            <div className="user-sub">{profile?.role === 'admin' ? 'Super Admin' : 'Đối Tác (Affiliate)'}</div>
          </div>
          <button className="logout-btn" onClick={handleLogout} title="Đăng xuất" style={{background: 'transparent', border: 'none', color: '#9CA3AF', cursor: 'pointer', marginLeft: 'auto', padding: '4px'}}>
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
