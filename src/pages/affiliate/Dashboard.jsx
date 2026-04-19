import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import {
  DollarSign, CreditCard, TrendingUp, Users,
  MousePointerClick, Link2, ArrowUpRight,
  Zap, Target, Award, ChevronRight, Camera, Calendar, Bell, Activity
} from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip
} from 'recharts';
import Skeleton from '../../components/common/Skeleton';
import LeaderboardWidget from '../../components/common/LeaderboardWidget/LeaderboardWidget';
import './Dashboard.css';
import './DashboardDribbble.css';

const AffiliateDashboard = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [badges, setBadges] = useState([]);

  // RAW Data
  const [rawData, setRawData] = useState({
    conversions: [],
    links: [],
    totalEarned: 0,
    balance: 0
  });

  const [dateRange, setDateRange] = useState('30d'); // 'today', '7d', '30d', 'all'
  const [loading, setLoading] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [avatarError, setAvatarError] = useState(false);

  const loadData = async (userId) => {
    try {
      const [{ data: profile }, { data: conversions }, { data: links }, { data: userBadges }] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', userId).single(),
        supabase.from('conversions').select('*, campaigns(name)').eq('affiliate_id', userId).order('created_at', { ascending: false }),
        supabase.from('affiliate_links').select('clicks, leads').eq('affiliate_id', userId),
        supabase.from('user_badges').select('*').eq('affiliate_id', userId)
      ]);

      if (profile) {
        setProfile(profile);
        setBadges(userBadges || []);

        setRawData({
          conversions: conversions || [],
          links: links || [],
          totalEarned: profile.total_earned || 0,
          balance: profile.balance || 0
        });

        if (profile.avatar_url) {
          setAvatarUrl(profile.avatar_url);
        }
      }
    } catch (err) {
      console.error('Data load error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initDashboard = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        await loadData(user.id);

        const profileSub = supabase.channel('dashboard_profile')
          .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'profiles', filter: `id=eq.${user.id}` },
            () => loadData(user.id))
          .subscribe();

        const convSub = supabase.channel('dashboard_conversions')
          .on('postgres_changes', { event: '*', schema: 'public', table: 'conversions', filter: `affiliate_id=eq.${user.id}` },
            () => loadData(user.id))
          .subscribe();

        const linksSub = supabase.channel('dashboard_links')
          .on('postgres_changes', { event: '*', schema: 'public', table: 'affiliate_links', filter: `affiliate_id=eq.${user.id}` },
            () => loadData(user.id))
          .subscribe();

        return () => {
          supabase.removeChannel(profileSub);
          supabase.removeChannel(convSub);
          supabase.removeChannel(linksSub);
        };
      } catch (err) {
        console.error('Lỗi thiết lập realtime dashboard:', err);
      }
    };

    const cleanup = initDashboard();
    return () => {
      cleanup.then(cleanFn => { if (typeof cleanFn === 'function') cleanFn(); });
    };
  }, []);

  // ====== DATA PROCESSING BASED ON FILTER ======

  const filteredData = useMemo(() => {
    const now = new Date();
    let startDate = new Date(0); // All time by default

    if (dateRange === 'today') {
      startDate = new Date(now.setHours(0, 0, 0, 0));
    } else if (dateRange === '7d') {
      startDate = new Date(now.setDate(now.getDate() - 7));
    } else if (dateRange === '30d') {
      startDate = new Date(now.setDate(now.getDate() - 30));
    }

    const filteredConversions = rawData.conversions.filter(c => new Date(c.created_at) >= startDate);

    // Derived Stats
    const filteredEarned = filteredConversions
      .filter(c => c.status === 'approved')
      .reduce((sum, c) => sum + (c.commission_amount || 0), 0);

    const filteredRevenue = filteredConversions
      .filter(c => c.status === 'approved')
      .reduce((sum, c) => sum + Number(c.sale_amount || 0), 0);

    const filteredLeads = filteredConversions.length; // Simplified proxy for leads generated in period
    const totalClicks = rawData.links.reduce((sum, link) => sum + (link.clicks || 0), 0) || 0;
    // Usually clicks should also be timestamped, but since fake data uses total count, we display total.

    // Chart Data Generation
    const chartMap = {};
    const daysToShow = dateRange === '7d' ? 7 : (dateRange === '30d' ? 30 : 15);

    // Init empty buckets
    for (let i = daysToShow - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = `${d.getDate()}/${d.getMonth() + 1}`;
      chartMap[dateStr] = { date: dateStr, amount: 0 };
    }

    // Fill buckets
    filteredConversions.forEach(c => {
      if (c.status === 'approved') {
        const d = new Date(c.created_at);
        const dateStr = `${d.getDate()}/${d.getMonth() + 1}`;
        if (chartMap[dateStr]) {
          chartMap[dateStr].amount += c.commission_amount;
        }
      }
    });

    const chartDataObj = Object.values(chartMap);

    return {
      earnedStr: dateRange === 'all' ? rawData.totalEarned : filteredEarned,
      revenueStr: filteredRevenue,
      conversions: filteredConversions,
      leads: dateRange === 'all' ? rawData.links.reduce((sum, link) => sum + (link.leads || 0), 0) : filteredLeads,
      clicks: totalClicks,
      chartData: chartDataObj
    };
  }, [rawData, dateRange]);


  const conversionRate = filteredData.clicks > 0
    ? ((filteredData.leads / filteredData.clicks) * 100).toFixed(1)
    : '0.0';

  // Format số gọn tinh tế (Tách giá trị và Đơn vị để làm đẹp UI)
  const formatCompactParts = (num) => {
    if (!num) return { value: '0', unit: 'đ' };
    if (num >= 1e9) {
      return { value: (num / 1e9).toLocaleString('vi-VN', { maximumFractionDigits: 1 }), unit: 'Tỷ' };
    }
    if (num >= 1e6) {
      return { value: (num / 1e6).toLocaleString('vi-VN', { maximumFractionDigits: 1 }), unit: 'Tr' };
    }
    return { value: new Intl.NumberFormat('vi-VN').format(num), unit: 'đ' };
  };

  const tierLabel = profile?.tier?.toUpperCase() || 'STARTER';

  // Custom Tooltip for Chart
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-chart-tooltip">
          <p className="tooltip-date">{label}</p>
          <p className="tooltip-val">+{new Intl.NumberFormat('vi-VN').format(payload[0].value)} đ</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="dashboard-wrapper">

      {/* FILTER BAR */}
      <div className="dashboard-top-bar mt-2 mb-4">
        <h2 className="text-xl font-bold text-gray-800 hidden md:block">Tổng Quan Kinh Doanh</h2>
        <div className="date-filter-group">
          <div className="date-filter-icon"><Calendar size={16} /></div>
          <button className={`date-filter-btn ${dateRange === 'today' ? 'active' : ''}`} onClick={() => setDateRange('today')}>Hôm nay</button>
          <button className={`date-filter-btn ${dateRange === '7d' ? 'active' : ''}`} onClick={() => setDateRange('7d')}>7 Ngày</button>
          <button className={`date-filter-btn ${dateRange === '30d' ? 'active' : ''}`} onClick={() => setDateRange('30d')}>30 Ngày</button>
          <button className={`date-filter-btn ${dateRange === 'all' ? 'active' : ''}`} onClick={() => setDateRange('all')}>Tất cả</button>
        </div>
      </div>

      {/* ── 2-COLUMN ASYMMETRIC GRID ── */}
      <div className="dashboard-grid">

        {/* =========================================
            LEFT COLUMN (MAIN CONTENT) 
            ========================================= */}
        <div className="dashboard-main-col">

          {/* METRIC CARDS */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>

            {/* THẺ DOANH THU ĐƯỢC THIẾT KẾ FOMO - GLOWING EFFECT */}
            <div className="cf-card fomo-glow-card" style={{ display: 'flex', flexDirection: 'column', padding: '24px', gridColumn: 'span 2', position: 'relative', overflow: 'hidden' }}>
              <div className="fomo-shimmer"></div>

              {/* Định vị tuyệt đối cho Badge để luôn neo ở góc phải, không bị chữ dài đẩy mất */}
              <div className="fomo-badge" style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 2 }}>
                🚀 TOP 5% Tuần Này
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', zIndex: 1, paddingRight: '120px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                  <div className="qa-icon" style={{ background: '#FFF1F2', color: '#E11D48', boxShadow: '0 0 15px rgba(225,29,72,0.3)', flexShrink: 0 }}>
                    <Target size={24} className="fomo-pulse-icon" />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 800, color: '#BE123C', textTransform: 'uppercase', marginBottom: 6, letterSpacing: '0.5px' }}>
                      🔥 Tổng Doanh Số Bán Hàng
                    </div>
                    {/* Dùng nowrap và format rút gọn để đảm bảo luôn chỉ 1 dòng cực mượt */}
                    <div
                      title={new Intl.NumberFormat('vi-VN').format(filteredData.revenueStr) + ' đ'}
                      style={{
                        fontSize: '3.6rem',
                        fontWeight: 900,
                        color: '#9F1239',
                        textShadow: '0 2px 10px rgba(159,18,57,0.15)',
                        lineHeight: '1',
                        whiteSpace: 'nowrap',
                        display: 'flex',
                        alignItems: 'baseline',
                        gap: '8px',
                        letterSpacing: '-1px'
                      }}
                    >
                      {loading ? <Skeleton width="200px" height="48px" /> : (
                        <>
                          {formatCompactParts(filteredData.revenueStr).value}
                          <span style={{ fontSize: '0.45em', opacity: 0.85, letterSpacing: 'normal', fontWeight: 800 }}>
                            {formatCompactParts(filteredData.revenueStr).unit}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ marginTop: 'auto', paddingTop: '16px', display: 'flex', alignItems: 'center', zIndex: 1 }}>
                <div style={{ fontSize: 13, color: '#881337', fontWeight: 500, background: 'rgba(255,228,230,0.5)', padding: '6px 12px', borderRadius: '20px', display: 'inline-block' }}>
                  * Khoản tiền khổng lồ bạn mang về cho hệ thống. Khoe ngay!
                </div>
              </div>
            </div>

            <div className="cf-card" style={{ display: 'flex', flexDirection: 'column', transition: 'transform 0.2s', padding: '24px' }}>
              <div className="qa-icon qa-green" style={{ marginBottom: 16 }}>
                <DollarSign size={22} />
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--cf-text-muted)', textTransform: 'uppercase', marginBottom: 8 }}>Thu Nhập Theo Lọc</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--cf-text-main)', marginBottom: 12, display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                {loading ? <Skeleton width="120px" height="28px" /> : new Intl.NumberFormat('vi-VN').format(filteredData.earnedStr)}
                <span style={{ fontSize: '0.6em', color: 'var(--cf-text-muted)' }}>đ</span>
              </div>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600, padding: '4px 8px', borderRadius: 6, background: 'rgba(16,185,129,0.1)', color: '#059669', width: 'fit-content' }}>
                <ArrowUpRight size={14} /> Tăng trưởng mạnh
              </span>
            </div>

            <div className="cf-card" style={{ display: 'flex', flexDirection: 'column', transition: 'transform 0.2s', padding: '24px' }}>
              <div className="qa-icon qa-purple" style={{ marginBottom: 16 }}>
                <MousePointerClick size={22} />
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--cf-text-muted)', textTransform: 'uppercase', marginBottom: 8 }}>Lượt Click (Tổng)</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--cf-text-main)', marginBottom: 12 }}>
                {loading ? <Skeleton width="60px" height="28px" /> : filteredData.clicks.toLocaleString()}
              </div>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600, padding: '4px 8px', borderRadius: 6, background: 'rgba(16,185,129,0.1)', color: '#059669', width: 'fit-content' }}>
                <ArrowUpRight size={14} /> Chuyển đổi {conversionRate}%
              </span>
            </div>

            <div className="cf-card" style={{ display: 'flex', flexDirection: 'column', transition: 'transform 0.2s', padding: '24px' }}>
              <div className="qa-icon" style={{ background: '#ffedd5', color: '#ea580c', marginBottom: 16 }}>
                <Users size={22} />
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--cf-text-muted)', textTransform: 'uppercase', marginBottom: 8 }}>Khách Đăng Ký</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--cf-text-main)', marginBottom: 12 }}>
                {loading ? <Skeleton width="50px" height="28px" /> : filteredData.leads.toLocaleString()}
              </div>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600, padding: '4px 8px', borderRadius: 6, background: 'rgba(16,185,129,0.1)', color: '#059669', width: 'fit-content' }}>
                <ArrowUpRight size={14} /> Điền form
              </span>
            </div>

          </div>

          {/* =========================================
              TREND CHART WIDGET 
              ========================================= */}
          <div className="cf-glass-card p-6 mt-6">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', padding: '12px 20px 0 20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>
                Biểu đồ Tăng trưởng Doanh số
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'var(--cf-text-muted)', fontWeight: 500 }}>
                <Activity size={16} /> <span>Cập nhật Live</span>
              </div>
            </div>

            <div style={{ height: '300px', width: '100%' }}>
              {loading ? (
                <Skeleton width="100%" height="100%" />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={filteredData.chartData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                    <defs>
                      <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dy={10} />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: '#6B7280' }}
                      tickFormatter={(value) => `${value / 1000000}Tr`}
                      dx={-10}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(59, 130, 246, 0.2)', strokeWidth: 2, fill: 'transparent' }} />
                    <Area type="monotone" dataKey="amount" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorAmount)" activeDot={{ r: 6, strokeWidth: 0, fill: '#2563EB' }} />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* LEADERBOARD (BẢNG VÀNG) ĐƯỢC ĐẨY LÊN TRÊN */}
          <LeaderboardWidget currentUserId={profile?.id} />

          {/* RECENT ORDERS */}
          <div className="cf-glass-card orders-card-glass">
            <div className="orders-header-glass">
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                Đơn Hàng & Khách (Trong chu kỳ lọc)
                <span className="pulse-dot"></span>
              </h3>
              <button
                onClick={() => navigate('/portal/customers')}
                style={{ background: 'transparent', color: 'var(--cf-primary)', fontWeight: 600, fontSize: 14, display: 'flex', alignItems: 'center', gap: 4, border: 'none', cursor: 'pointer' }}
              >
                Xem tất cả <ChevronRight size={14} />
              </button>
            </div>

            <table className="cf-table">
              <thead>
                <tr>
                  <th>Khách Hàng</th>
                  <th>Dự Án Quan Tâm</th>
                  <th>Trạng Thái</th>
                  <th style={{ textAlign: 'right' }}>Hoa Hồng</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array(3).fill(0).map((_, i) => (
                    <tr key={i}>
                      <td colSpan="4"><Skeleton height="40px" width="100%" /></td>
                    </tr>
                  ))
                ) : filteredData.conversions.slice(0, 5).length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--cf-text-muted)' }}>
                      <Target size={32} strokeWidth={1.5} style={{ marginBottom: 8, opacity: 0.4 }} /><br />
                      Chưa có phát sinh trong khoảng thời gian này.
                    </td>
                  </tr>
                ) : filteredData.conversions.slice(0, 5).map(conv => (
                  <tr key={conv.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div className="avatar-circle">
                          {conv.customer_name?.charAt(0).toUpperCase() || '?'}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600 }}>{conv.customer_name || 'Khách hàng'}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--cf-text-muted)' }}>{new Date(conv.created_at).toLocaleDateString('vi-VN')}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontWeight: 600, color: 'var(--cf-text-main)' }}>{conv.campaigns?.name || 'Gói Dịch Vụ / B2B'}</td>
                    <td>
                      {conv.status === 'rejected' ? (
                        <span style={{ padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, backgroundColor: 'rgba(239,68,68,0.1)', color: '#EF4444' }}>Thất bại</span>
                      ) : (
                        <span style={{ padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, backgroundColor: conv.status === 'approved' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)', color: conv.status === 'approved' ? '#059669' : '#d97706' }}>
                          {conv.status === 'approved' ? 'Chốt thành công' : 'Đang xử lý / Tư vấn'}
                        </span>
                      )}
                    </td>
                    <td style={{ textAlign: 'right', fontWeight: 'bold', color: conv.status === 'rejected' ? '#9CA3AF' : '#10B981' }}>
                      +{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(conv.commission_amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>


        {/* =========================================
            RIGHT COLUMN (PROFILE & ACTIONS)
            ========================================= */}
        <div className="dashboard-sidebar-col" style={{ position: 'sticky', top: '24px', height: 'fit-content', alignSelf: 'flex-start' }}>

          {/* WELCOME BANNER (MOVED TO SIDEBAR AS A MINI CARD) */}
          <div className="welcome-banner-dribbble" style={{ padding: '24px' }}>
            <div className="welcome-top-dribbble">
              <div className="welcome-left-dribbble">
                <h1 style={{ fontSize: '18px', marginBottom: 4 }}>Hi, <span>{profile?.full_name?.split(" ")[0] || 'Đối Tác'}</span> 👋</h1>
                <p style={{ fontSize: '13px' }}>Chúc bạn ngày mới bùng nổ doanh số B2B!</p>
              </div>
            </div>
          </div>

          {/* PROFILE CARD */}
          <div className="cf-glass-card profile-widget">
            <div className="profile-widget-bg"></div>
            <div className="profile-widget-content">
              <div className="profile-avatar-wrapper" onClick={() => navigate('/affiliate/settings')}>
                {avatarUrl && !avatarError ? (
                  <img src={avatarUrl} alt="" className="profile-avatar-img" onError={() => setAvatarError(true)} />
                ) : (
                  <div className="profile-avatar-placeholder">
                    {profile?.full_name?.charAt(0).toUpperCase() || 'A'}
                  </div>
                )}
                <div className="profile-avatar-edit"><Camera size={14} /></div>
              </div>

              <h2 className="profile-name">{profile?.full_name || 'Đại Lý VIP'}</h2>
              <div className="profile-meta-data">{profile?.email}</div>

              <div className="profile-tier-badge">
                <Award size={16} /> {tierLabel}
              </div>

              {/* GAMIFICATION BADGES */}
              {badges.length > 0 && (
                <div className="profile-badges-container">
                  <div className="profile-meta-data" style={{ fontSize: 12, marginBottom: 8 }}>Thành Tích Đạt Được</div>
                  <div className="achievements-showcase-sidebar">
                    {badges.map(b => (
                      <div key={b.id} className="digital-badge-dribbble" title={b.badge_name}>
                        {b.badge_id === 'first_blood' ? '🗡️' : '🔥'}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* LIVESTREAM / NOTIFICATION FEED */}
          <div className="activity-feed-widget">
            <div className="feed-header">
              <Bell size={16} /> Hoạt Động Mới Nhất
            </div>
            <div className="feed-list">
              <div className="feed-item pulse">
                <div className="feed-icon approved"><DollarSign size={14} /></div>
                <div className="feed-content">
                  <p>Bạn vừa được cộng <strong>+1,500,000 đ</strong> từ đơn hàng Khách ERP.</p>
                  <span>Ngay bây giờ</span>
                </div>
              </div>
              <div className="feed-item">
                <div className="feed-icon new-lead"><Users size={14} /></div>
                <div className="feed-content">
                  <p>Admin đang gọi điện tư vấn cho KH <strong>Anh Nguyễn Văn A</strong></p>
                  <span>2 giờ trước</span>
                </div>
              </div>
              <div className="feed-item">
                <div className="feed-icon system"><Zap size={14} /></div>
                <div className="feed-content">
                  <p>Đã ra mắt Cấp bậc <strong>ĐỐI TÁC CỔ ĐÔNG</strong> chiến lược.</p>
                  <span>1 ngày trước</span>
                </div>
              </div>
            </div>
          </div>

          {/* QUICK ACTIONS */}
          <div className="quick-actions-widget mt-2">
            <h3 className="widget-title">Thao Tác Nhanh</h3>
            <button className="quick-action-btn" onClick={() => navigate('/affiliate/links')}>
              <div className="qa-icon qa-blue"><Link2 size={20} /></div>
              <div className="qa-text">
                <span>Lấy Link Chia Sẻ</span>
                <span>Sao chép & quảng bá</span>
              </div>
              <ChevronRight size={18} style={{ color: 'var(--cf-text-muted)', marginLeft: 'auto' }} />
            </button>
            <button className="quick-action-btn" onClick={() => navigate('/affiliate/store')}>
              <div className="qa-icon qa-purple"><Zap size={20} /></div>
              <div className="qa-text">
                <span>Gửi Khách VIP B2B</span>
                <span>Nhận ưu đãi 20tr/deal</span>
              </div>
              <ChevronRight size={18} style={{ color: 'var(--cf-text-muted)', marginLeft: 'auto' }} />
            </button>
          </div>

          {/* HOT CAMPAIGN BANNER (GIẢI PHÁP LẤP KHOẢNG TRỐNG) */}
          <div className="cf-glass-card mt-6" style={{ background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 100%)', color: 'white', border: 'none', position: 'relative', overflow: 'hidden', padding: '24px' }}>
            <div style={{ position: 'absolute', top: '-10%', right: '-10%', opacity: 0.1 }}>
              <Target size={120} />
            </div>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'inline-block', background: 'rgba(99, 102, 241, 0.3)', color: '#C7D2FE', fontSize: 11, fontWeight: 800, padding: '4px 10px', borderRadius: 20, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                🔥 Tham Gia Đu Trend
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 8, lineHeight: 1.3, color: 'white' }}>
                Hệ thống ERP Doanh Nghiệp <br /><span style={{ color: '#FCD34D' }}>Hoa hồng khủng 30%</span>
              </h3>
              <p style={{ fontSize: 13, color: '#A5B4FC', marginBottom: 20, lineHeight: 1.5 }}>
                Sản phẩm đang được B2B quan tâm nhất. Tỉ lệ chốt hiện tại lên đến 15%. Vã ngay!
              </p>
              <button
                onClick={() => navigate('/affiliate/links')}
                style={{ background: '#4F46E5', color: 'white', border: 'none', padding: '12px 16px', borderRadius: 10, fontWeight: 700, fontSize: 14, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', width: '100%', justifyContent: 'center', transition: 'all 0.2s', boxShadow: '0 4px 14px rgba(79, 70, 229, 0.4)' }}
              >
                Lấy Link Đi Chạy Ngay <ChevronRight size={16} />
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default AffiliateDashboard;
