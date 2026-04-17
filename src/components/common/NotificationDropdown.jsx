import React, { useState, useEffect } from 'react';
import { Bell, ShoppingBag, User } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import './NotificationDropdown.css';

const NotificationDropdown = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Tính thời điểm 24h trước
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const isoYesterday = yesterday.toISOString();

      // 1. Phập Leads mới nhất trong 24h
      const { data: recentLeads } = await supabase
        .from('leads')
        .select('id, name, created_at')
        .eq('affiliate_id', user.id)
        .gte('created_at', isoYesterday)
        .order('created_at', { ascending: false })
        .limit(3);

      // 2. Phập Đơn hàng vừa duyệt hoặc đăng ký trong 24h
      const { data: recentConvs } = await supabase
        .from('conversions')
        .select('id, customer_name, status, sale_amount, created_at')
        .eq('affiliate_id', user.id)
        .gte('created_at', isoYesterday)
        .order('created_at', { ascending: false })
        .limit(3);

      const combined = [];
      
      (recentConvs || []).forEach(c => {
        combined.push({
          id: `conv_${c.id}`,
          type: c.status === 'approved' ? 'success' : 'info',
          title: c.status === 'approved' ? 'Đã duyệt hoa hồng' : 'Đơn hàng mới',
          desc: c.status === 'approved' 
                ? `Hoa hồng đơn của ${c.customer_name} vừa được mở khóa!` 
                : `${c.customer_name} vừa bấm thanh toán một đơn hàng.`,
          time: new Date(c.created_at),
          icon: ShoppingBag
        });
      });

      (recentLeads || []).forEach(l => {
        // Chỉ thêm nếu không trùng lặp (ví dụ lead đã nhảy sang conv)
        combined.push({
          id: `lead_${l.id}`,
          type: 'new',
          title: 'Khách hàng quan tâm',
          desc: `${l.name} vừa để lại thông tin quan tâm.`,
          time: new Date(l.created_at),
          icon: User
        });
      });

      combined.sort((a, b) => b.time - a.time);
      
      // Lọc bớt nếu quá nhiều (chỉ hiện 5 cái mới nhất)
      setNotifications(combined.slice(0, 5));
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  if (!isOpen) return null;

  const timeAgo = (date) => {
    const min = Math.floor((new Date() - date) / 60000);
    if (min < 60) return `${min || 1} phút trước`;
    if (min < 1440) return `${Math.floor(min/60)} giờ trước`;
    return 'Hôm qua';
  };

  return (
    <>
      <div className="noti-overlay-invisible" onClick={onClose}></div>
      <div className="noti-dropdown">
        <div className="noti-header">
          <div className="font-bold">Thông báo mới</div>
          {notifications.length > 0 && <span className="noti-badge-count">{notifications.length}</span>}
        </div>
        
        <div className="noti-list">
          {loading ? (
            <div className="noti-empty">Đang kiểm tra tin mới...</div>
          ) : notifications.length === 0 ? (
            <div className="noti-empty">
              <Bell size={24} style={{opacity: 0.2, margin: '0 auto 8px'}} />
              Bạn chưa có cập nhật nào mới trong 24h qua.
            </div>
          ) : (
            notifications.map(n => {
              const Icon = n.icon;
              return (
                <div className="noti-item" key={n.id}>
                  <div className={`noti-icon ${n.type}`}>
                    <Icon size={16} />
                  </div>
                  <div className="noti-content">
                    <div className="noti-title">{n.title}</div>
                    <div className="noti-desc">{n.desc}</div>
                    <div className="noti-time">{timeAgo(n.time)}</div>
                  </div>
                </div>
              );
            })
          )}
        </div>
        
        {notifications.length > 0 && (
          <div className="noti-footer" onClick={onClose}>
            Đóng tất cả
          </div>
        )}
      </div>
    </>
  );
};

export default NotificationDropdown;
