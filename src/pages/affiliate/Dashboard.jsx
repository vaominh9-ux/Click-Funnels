import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { DollarSign, CreditCard, TrendingUp, Users, CheckCircle, MousePointerClick } from 'lucide-react';
import StatCard from '../../components/common/StatCard';
import Skeleton from '../../components/common/Skeleton';
import './Dashboard.css';

const AffiliateDashboard = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    totalEarned: 0,
    balance: 0,
    clicks: 1240, // Mock for now until we aggregate affiliate_links
    leads: 85,
    rank: 'Gold Affiliate',
    recentConversions: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Fetch User Profile (Balance, etc)
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        // Fetch Recent Conversions
        const { data: conversions } = await supabase
          .from('conversions')
          .select('*, campaigns(name)')
          .eq('affiliate_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5);

        // Fetch Total Clicks/Leads from affiliate_links
        const { data: links } = await supabase
          .from('affiliate_links')
          .select('clicks, leads')
          .eq('affiliate_id', user.id);

        const totalClicks = links?.reduce((sum, link) => sum + (link.clicks || 0), 0) || 0;
        const totalLeads = links?.reduce((sum, link) => sum + (link.leads || 0), 0) || 0;

        if (profile) {
          setProfile(profile);
          setDashboardData({
            totalEarned: profile.total_earned || 0,
            balance: profile.balance || 0,
            rank: profile.rank || 'Tân binh',
            clicks: totalClicks,
            leads: totalLeads,
            recentConversions: conversions || []
          });
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  return (
    <div className="dashboard-wrapper">
      
      {/* Premium Hero Section */}
      <div className="hero-dashboard-grid">
        <div className="premium-card-green">
          <div className="rank-badge-gold">ĐẠI LÝ MASTER</div>
          <div className="hero-label">Tổng Thu Nhập Trọn Đời</div>
          <div className="hero-amount">
            {loading ? <Skeleton width="150px" height="40px" /> : new Intl.NumberFormat('vi-VN').format(profile?.total_earned || 0)}<sup style={{fontSize: '24px', opacity: 0.8, marginLeft: '4px'}}>₫</sup>
          </div>
          <div className="hero-subtext">
            <span>+ 14,500,000 ₫ trong 30 ngày qua</span>
          </div>
        </div>

        <div className="premium-card-red">
          <div className="rank-badge-gold" style={{background: 'rgba(255,255,255,0.2)', boxShadow: 'none'}}>FOMO ALERT</div>
          <div className="hero-label">Hoa Hồng Vuột Mất</div>
          <div className="hero-amount-red">
            15,000,000<sup style={{fontSize: '20px', opacity: 0.8, marginLeft: '4px'}}>₫</sup>
          </div>
          <div className="hero-subtext">
            Thiếu cấp độ để nhận hoa hồng từ nhánh dưới. Khách VIP vừa chốt đơn.
          </div>
          <button className="cf-btn-primary mt-4" style={{background: 'white', color: '#DC2626', width: '100%'}} onClick={() => navigate('/affiliate/store')}>Nâng Cấp Ngay</button>
        </div>
      </div>

      {/* Account Status Header (Based on Funnel Rules) */}
      <div className="cf-card mb-6" style={{ borderLeft: '4px solid var(--cf-accent)' }}>
        <div className="flex-between" style={{ alignItems: 'center' }}>
          <div>
            <h3 className="font-bold mb-1" style={{ fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
               <CheckCircle size={18} color="#059669" />Trạng Thái Tài Khoản: {profile?.role === 'admin' ? 'ADMIN' : 'BÌNH THƯỜNG'}
            </h3>
            <p className="text-muted text-sm">Bạn được phép nhận hoa hồng lên tới 50% cho các khóa Master trở xuống.</p>
          </div>
          
          <div style={{ textAlign: 'right', width: '350px' }}>
            <div className="flex-between mb-2">
              <span className="text-sm font-bold text-muted">Hạn Mức Hoạt Động Cần Thiết</span>
              <span className="text-sm font-bold" style={{ color: '#059669' }}>Còn 80 Ngày</span>
            </div>
            <div style={{ width: '100%', height: '10px', background: 'var(--cf-border)', borderRadius: '5px', overflow: 'hidden' }}>
              <div style={{ width: '20%', height: '100%', background: '#059669', transition: 'width 0.5s' }}></div>
            </div>
            <p className="text-muted mt-2" style={{ fontSize: '11px', lineHeight: 1.4 }}>
              Cần phát sinh 1 Click hoặc 1 Đơn trong 90 ngày để duy trì.
            </p>
          </div>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="stats-grid">
        <StatCard 
          title="Số Dư Khả Dụng" 
          value={loading ? <Skeleton width="100px" /> : <>{new Intl.NumberFormat('vi-VN').format(profile?.balance || 0)}<sup>₫</sup></>} 
          trend={0} 
          icon={<CreditCard />} 
          chartData={[5, 5, 5, 5, 5, 5, 5]} 
        />
        <StatCard 
          title="Tỷ lệ Chuyển Đổi" 
          value={loading ? <Skeleton width="80px" /> : (
            dashboardData.clicks > 0 
              ? `${((dashboardData.leads / dashboardData.clicks) * 100).toFixed(1)}%`
              : '0%'
          )} 
          trend={0} 
          icon={<TrendingUp />} 
          chartData={[10, 15, 12, 18, 20, 19, 22]} 
        />
        <StatCard 
          title="Lượt Truy Cập (Clicks)" 
          value={loading ? <Skeleton width="80px" /> : dashboardData.clicks.toLocaleString()} 
          trend={0} 
          icon={<MousePointerClick />} 
          chartData={[20, 25, 30, 45, 50, 70, 90]} 
        />
      </div>

      <div className="activity-section mt-6">
        <div className="cf-card recent-sales">
          <div className="flex-between mb-4">
            <h3 className="font-bold flex-align-center" style={{gap: '12px'}}>
              Đơn Hàng Gần Đây
              <span className="pulse-dot"></span>
            </h3>
            <button className="cf-btn-text" onClick={() => navigate('/affiliate/links')}>Xem chi tiết</button>
          </div>
          
          <table className="cf-table">
            <thead>
              <tr>
                <th>Khách Hàng</th>
                <th>Sản Phẩm</th>
                <th>Thông Báo Mới</th>
                <th style={{textAlign: 'right'}}>Trạng Thái</th>
                <th style={{textAlign: 'right'}}>Hoa Hồng Nhận</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array(3).fill(0).map((_, i) => (
                  <tr key={i}>
                    <td colSpan="5"><Skeleton height="40px" width="100%" /></td>
                  </tr>
                ))
              ) : dashboardData.recentConversions.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-muted">Chưa có đơn hàng nào được ghi nhận. Hãy chia sẻ link để tạo ra sale đầu tiên!</td>
                </tr>
              ) : dashboardData.recentConversions.map(conv => (
                <tr key={conv.id}>
                  <td>
                    <div className="flex-table-row">
                      <div className="avatar-circle">{conv.customer_name?.charAt(0).toUpperCase() || '?'}</div>
                      <div>
                        <div className="font-bold">{conv.customer_name || 'Khách hàng ẩn'}</div>
                        <div className="text-muted" style={{fontSize: '12px'}}>{new Date(conv.created_at).toLocaleDateString('vi-VN')}</div>
                      </div>
                    </div>
                  </td>
                  <td className="font-bold" style={{color: '#4B5563'}}>{conv.campaigns?.name || 'Sản phẩm chung'}</td>
                  <td>
                    {conv.status === 'rejected' ? (
                      <span className="text-muted" style={{color: '#EF4444', fontSize: '13px'}}>⚠️ Bị từ chối</span>
                    ) : conv.status === 'pending' ? (
                      <span className="text-muted" style={{color: '#F59E0B', fontSize: '13px'}}>⏳ Chờ đối soát</span>
                    ) : (
                      <span className="text-muted" style={{color: '#059669', fontSize: '13px'}}>✨ Hoa hồng chảy về</span>
                    )}
                  </td>
                  <td style={{textAlign: 'right'}}>
                    {conv.status === 'rejected' ? (
                      <span className="badge" style={{backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#EF4444'}}>
                        Từ chối
                      </span>
                    ) : (
                      <span className={`badge ${conv.status === 'approved' ? 'badge-cleared' : 'badge-pending'}`}>
                        {conv.status === 'approved' ? 'Thành công' : 'Chờ duyệt'}
                      </span>
                    )}
                  </td>
                  <td style={{textAlign: 'right', fontWeight: 'bold', color: conv.status === 'rejected' ? '#9CA3AF' : '#10B981'}}>
                    +{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(conv.commission_amount)}
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>
    </div>
  );
};

export default AffiliateDashboard;
