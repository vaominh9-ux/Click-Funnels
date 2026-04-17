import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { 
  DollarSign, CreditCard, TrendingUp, Users, 
  MousePointerClick, Link2, ArrowUpRight, 
  Zap, Target, Award, ChevronRight, Camera
} from 'lucide-react';
import Skeleton from '../../components/common/Skeleton';
import LeaderboardWidget from '../../components/common/LeaderboardWidget/LeaderboardWidget';
import './Dashboard.css'; /* Original global classes required by other pages */
import './DashboardDribbble.css'; /* Completely isolated new UI classes */

const AffiliateDashboard = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [badges, setBadges] = useState([]);
  const [dashboardData, setDashboardData] = useState({
    totalEarned: 0,
    balance: 0,
    clicks: 0,
    leads: 0,
    recentConversions: []
  });
  const [loading, setLoading] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [avatarError, setAvatarError] = useState(false);

  const loadData = async (userId) => {
    try {
      const [{ data: profile }, { data: conversions }, { data: links }, { data: userBadges }] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', userId).single(),
        supabase.from('conversions').select('*, campaigns(name)').eq('affiliate_id', userId).order('created_at', { ascending: false }).limit(5),
        supabase.from('affiliate_links').select('clicks, leads').eq('affiliate_id', userId),
        supabase.from('user_badges').select('*').eq('affiliate_id', userId)
      ]);

      const totalClicks = links?.reduce((sum, link) => sum + (link.clicks || 0), 0) || 0;
      const totalLeads = links?.reduce((sum, link) => sum + (link.leads || 0), 0) || 0;

      if (profile) {
        setProfile(profile);
        setBadges(userBadges || []);
        setDashboardData({
          totalEarned: profile.total_earned || 0,
          balance: profile.balance || 0,
          clicks: totalClicks,
          leads: totalLeads,
          recentConversions: conversions || []
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

  const conversionRate = dashboardData.clicks > 0 
    ? ((dashboardData.leads / dashboardData.clicks) * 100).toFixed(1) 
    : '0.0';

  const tierLabel = profile?.tier?.toUpperCase() || 'STARTER';

  const currentHour = new Date().getHours();
  let greetingText = 'Chào mừng trở lại';
  if (currentHour < 12) greetingText = 'Chào buổi sáng';
  else if (currentHour < 18) greetingText = 'Chào buổi chiều';
  else greetingText = 'Chào buổi tối';

  return (
    <div className="dashboard-wrapper">
      
      {/* ── 2-COLUMN ASYMMETRIC GRID ── */}
      <div className="dashboard-grid">
        
        {/* =========================================
            LEFT COLUMN (MAIN CONTENT) 
            ========================================= */}
        <div className="dashboard-main-col">
          
          {/* WELCOME BANNER (DRIBBBLE) */}
          <div className="welcome-banner-dribbble">
            <div className="welcome-top-dribbble">
              <div className="welcome-left-dribbble">
                <h1>{greetingText}, <span>{profile?.full_name || 'Đại Lý'}</span></h1>
                <p>Mạng lưới Đối tác Affiliate Premium. Sẵn sàng chinh phục mọi kỷ lục mới ngay hôm nay.</p>
              </div>
            </div>
          </div>

          {/* BENTO GRID METRICS */}
          <div className="bento-grid">
            
            {/* TOTAL EARNED - SPANS 2 COLS WITH WAVE */}
            <div className="bento-box bento-col-2" style={{ paddingBottom: '60px' }}>
              <div className="qa-icon qa-green" style={{ marginBottom: 16 }}>
                <DollarSign size={22} />
              </div>
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--cf-text-muted)', textTransform: 'uppercase', marginBottom: 8 }}>Tổng Thu Nhập</div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--cf-text-main)', marginBottom: 12 }}>
                  {loading ? <Skeleton width="180px" height="36px" /> : new Intl.NumberFormat('vi-VN').format(dashboardData.totalEarned)}
                </div>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 700, padding: '4px 10px', borderRadius: 8, background: '#10b981', color: '#fff', width: 'fit-content' }}>
                  <ArrowUpRight size={14} /> Tăng trưởng ấn tượng
                </span>
              </div>
              <div className="bento-wave-bg"></div>
              <div className="bento-wave-line"></div>
            </div>

            {/* BALANCE - VISA CARD STYLE */}
            <div className="bento-box bento-visa-card">
              <div className="visa-chip"></div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', marginBottom: 24, marginTop: 8 }}>Số Dư Khả Dụng</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, fontFamily: 'monospace', textShadow: '0 2px 4px rgba(0,0,0,0.3)', marginBottom: 20 }}>
                {loading ? <Skeleton width="120px" height="32px" baseColor="#374151" highlightColor="#4b5563" /> : new Intl.NumberFormat('vi-VN').format(dashboardData.balance)}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', fontSize: 12, color: 'rgba(255,255,255,0.6)', fontWeight: 600, textTransform: 'uppercase' }}>
                <span>{profile?.full_name || 'PARTNER'}</span>
                <span style={{ fontSize: 10 }}>VALID THRU<br/><span style={{fontSize: 14, color: '#fff'}}>12/28</span></span>
              </div>
            </div>

            {/* CLICKS - SMALL BOX */}
            <div className="bento-box">
              <div className="qa-icon qa-purple" style={{ marginBottom: 12 }}>
                <MousePointerClick size={22} />
              </div>
              <div style={{ zIndex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--cf-text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>Lượt Click</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--cf-text-main)', marginBottom: 10 }}>
                  {loading ? <Skeleton width="60px" height="28px" /> : dashboardData.clicks.toLocaleString()}
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#8b5cf6' }}>
                  Chuyển đổi {conversionRate}%
                </span>
              </div>
            </div>

            {/* LEADS - SMALL BOX */}
            <div className="bento-box">
              <div className="qa-icon" style={{ background: '#ffedd5', color: '#ea580c', marginBottom: 12 }}>
                <Users size={22} />
              </div>
              <div style={{ zIndex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--cf-text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>Khách Tiềm Năng</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--cf-text-main)', marginBottom: 10 }}>
                  {loading ? <Skeleton width="50px" height="28px" /> : dashboardData.leads.toLocaleString()}
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#ea580c' }}>
                  Đăng ký chờ duyệt
                </span>
              </div>
            </div>

          </div>

          {/* RECENT ORDERS */}
          <div className="cf-glass-card orders-card-glass">
            <div className="orders-header-glass">
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                Đơn Hàng Gần Đây
                <span style={{ width: 8, height: 8, backgroundColor: '#10b981', borderRadius: '50%' }}></span>
              </h3>
              <button 
                onClick={() => navigate('/portal/customers')}
                style={{ background: 'transparent', color: 'var(--cf-primary)', fontWeight: 600, fontSize: 14, display: 'flex', alignItems: 'center', gap: 4, border: 'none', cursor: 'pointer' }}
              >
                Xem chi tiết <ChevronRight size={14} />
              </button>
            </div>
            
            <table className="cf-table">
              <thead>
                <tr>
                  <th>Khách Hàng</th>
                  <th>Sản Phẩm</th>
                  <th>Trạng Thái</th>
                  <th style={{textAlign: 'right'}}>Hoa Hồng</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array(3).fill(0).map((_, i) => (
                    <tr key={i}>
                      <td colSpan="4"><Skeleton height="40px" width="100%" /></td>
                    </tr>
                  ))
                ) : dashboardData.recentConversions.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{textAlign: 'center', padding: '40px 20px', color: 'var(--cf-text-muted)'}}>
                      <Target size={32} strokeWidth={1.5} style={{marginBottom: 8, opacity: 0.4}} /><br />
                      Chưa có đơn hàng nào. Hãy chia sẻ link để tạo sale đầu tiên!
                    </td>
                  </tr>
                ) : dashboardData.recentConversions.map(conv => (
                  <tr key={conv.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--cf-bg-canvas)', border: '1px solid var(--cf-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'var(--cf-text-muted)' }}>
                          {conv.customer_name?.charAt(0).toUpperCase() || '?'}
                        </div>
                        <div>
                          <div style={{fontWeight: 600}}>{conv.customer_name || 'Khách hàng'}</div>
                          <div style={{fontSize: '0.75rem', color: 'var(--cf-text-muted)'}}>{new Date(conv.created_at).toLocaleDateString('vi-VN')}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{fontWeight: 600, color: 'var(--cf-text-main)'}}>{conv.campaigns?.name || 'Sản phẩm'}</td>
                    <td>
                      {conv.status === 'rejected' ? (
                        <span style={{ padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, backgroundColor: 'rgba(239,68,68,0.1)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.2)', backdropFilter: 'blur(4px)'}}>Từ chối</span>
                      ) : (
                        <span style={{ padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, backgroundColor: conv.status === 'approved' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)', color: conv.status === 'approved' ? '#059669' : '#d97706', border: conv.status === 'approved' ? '1px solid rgba(16,185,129,0.2)' : '1px solid rgba(245,158,11,0.2)', backdropFilter: 'blur(4px)'}}>
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

          {/* LEADERBOARD */}
          <LeaderboardWidget currentUserId={profile?.id} />

        </div>


        {/* =========================================
            RIGHT COLUMN (PROFILE & ACTIONS)
            ========================================= */}
        <div className="dashboard-sidebar-col">
          
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
                  <div className="profile-meta-data" style={{fontSize: 12, marginBottom: 8}}>Thành Tích Đạt Được</div>
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

          {/* QUICK ACTIONS */}
          <div className="quick-actions-widget">
            <h3 className="widget-title">Thao Tác Nhanh</h3>
            <button className="quick-action-btn" onClick={() => navigate('/portal/campaigns/locked')}>
              <div className="qa-icon qa-blue"><Link2 size={20} /></div>
              <div className="qa-text">
                <span>Lấy Link Chia Sẻ</span>
                <span>Sao chép & quảng bá</span>
              </div>
              <ChevronRight size={18} style={{color: 'var(--cf-text-muted)', marginLeft: 'auto'}} />
            </button>
            <button className="quick-action-btn" onClick={() => navigate('/affiliate/store')}>
              <div className="qa-icon qa-purple"><Zap size={20} /></div>
              <div className="qa-text">
                <span>Nâng Hạng VIP</span>
                <span>Mở khóa mốc hoa hồng</span>
              </div>
              <ChevronRight size={18} style={{color: 'var(--cf-text-muted)', marginLeft: 'auto'}} />
            </button>
          </div>

          {/* PROGRESS WIDGET */}
          <div className="cf-glass-card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8, margin: '0 0 24px 0' }}>
              <TrendingUp size={18} color="#F59E0B" /> KPI Tăng Trưởng
            </h3>
            
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, alignItems: 'flex-end' }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--cf-text-main)'}}>Mục tiêu Doanh Số (50M)</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--cf-text-muted)'}}>{Math.round((dashboardData.totalEarned / 50000000) * 100)}%</div>
              </div>
              <div style={{ width: '100%', height: 8, background: 'var(--cf-border)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{height: '100%', borderRadius: 4, transition: 'width 1s ease-in-out', width: `${Math.min((dashboardData.totalEarned / 50000000) * 100, 100)}%`, background: 'linear-gradient(90deg, #10b981, #059669)'}}></div>
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, alignItems: 'flex-end' }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--cf-text-main)'}}>Mục tiêu Click (100)</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--cf-text-muted)'}}>{dashboardData.clicks}/100</div>
              </div>
              <div style={{ width: '100%', height: 8, background: 'var(--cf-border)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{height: '100%', borderRadius: 4, transition: 'width 1s ease-in-out', width: `${Math.min((dashboardData.clicks / 100) * 100, 100)}%`, background: 'linear-gradient(90deg, #3b82f6, #6366f1)'}}></div>
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, alignItems: 'flex-end' }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--cf-text-main)'}}>Mục tiêu Lead (50)</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--cf-text-muted)'}}>{dashboardData.leads}/50</div>
              </div>
              <div style={{ width: '100%', height: 8, background: 'var(--cf-border)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{height: '100%', borderRadius: 4, transition: 'width 1s ease-in-out', width: `${Math.min((dashboardData.leads / 50) * 100, 100)}%`, background: 'linear-gradient(90deg, #8b5cf6, #a855f7)'}}></div>
              </div>
            </div>
            
            <div style={{ marginTop: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--cf-text-muted)' }}>Tỷ lệ chuyển đổi: <strong style={{color: '#f97316'}}>{conversionRate}%</strong></div>
            </div>
          </div>
          
        </div>

      </div>

    </div>
  );
};

export default AffiliateDashboard;
