import React, { useState, useEffect } from 'react';
import { Users, DollarSign, Activity, WalletCards, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { supabase } from '../../lib/supabase';
import Skeleton from '../../components/common/Skeleton';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    activeAffiliates: 0,
    totalRevenue: 0,
    totalPaid: 0,
    pendingPayouts: 0,
  });
  const [topAffiliates, setTopAffiliates] = useState([]);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        // 1. Tổng Affiliates active
        const { count: activeCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('approval_status', 'active');

        // 2. Tổng doanh số từ conversions
        const { data: conversions } = await supabase
          .from('conversions')
          .select('sale_amount, commission_amount, status, created_at');

        const totalRevenue = conversions?.reduce((sum, c) => sum + Number(c.sale_amount || 0), 0) || 0;
        const totalPaid = conversions
          ?.filter(c => c.status === 'approved')
          .reduce((sum, c) => sum + Number(c.commission_amount || 0), 0) || 0;

        // 3. Tổng payouts pending
        const { data: pendingPayoutsData } = await supabase
          .from('payouts')
          .select('amount')
          .in('status', ['pending', 'processing']);

        const pendingPayouts = pendingPayoutsData?.reduce((sum, p) => sum + Number(p.amount || 0), 0) || 0;

        setStats({
          activeAffiliates: activeCount || 0,
          totalRevenue,
          totalPaid,
          pendingPayouts,
        });

        // 4. Top Affiliates
        const { data: topAffs } = await supabase
          .from('profiles')
          .select('id, full_name, email, total_earned, role')
          .eq('role', 'affiliate')
          .order('total_earned', { ascending: false })
          .limit(5);

        setTopAffiliates(topAffs || []);

        // 5. Chart: group conversions by month (simple aggregation)
        const monthMap = {};
        conversions?.forEach(c => {
          const d = new Date(c.created_at);
          const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
          const label = d.toLocaleDateString('vi-VN', { month: 'short', year: 'numeric' });
          if (!monthMap[key]) monthMap[key] = { name: label, revenue: 0 };
          monthMap[key].revenue += Number(c.sale_amount || 0);
        });

        const sortedChart = Object.entries(monthMap)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([, v]) => v);

        setChartData(sortedChart.length > 0 ? sortedChart : [
          { name: 'Chưa có dữ liệu', revenue: 0 }
        ]);
      } catch (err) {
        console.error('Error fetching admin stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const formatAmount = (amount) => {
    return Math.round(Number(amount)).toLocaleString('vi-VN');
  };

  const handleExportCSV = () => {
    const headers = ['Tên', 'Email', 'Thu Nhập Ròng'];
    const rows = topAffiliates.map(a => [a.full_name || 'N/A', a.email, a.total_earned || 0]);
    const csvContent = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `top-affiliates-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const rankColors = ['#F59E0B', '#3B82F6', '#10B981', '#8B5CF6', '#EC4899'];

  return (
    <div className="admin-dashboard-container">
      <div className="admin-header-row">
        <h1>Tổng Quan Hệ Thống</h1>
        <p>Báo cáo hiệu suất theo thời gian thực của toàn bộ Mạng lưới Affiliate</p>
      </div>

      {/* Overview Stats */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card" style={{"--icon-bg": "#EFF6FF", "--icon-color": "#3B82F6", "--bg-accent": "rgba(59, 130, 246, 0.08)"}}>
          <div className="stat-header">
            <div className="stat-icon-wrapper"><Users size={24} /></div>
          </div>
          <div className="stat-title">Tài khoản Hoạt động</div>
          <div className="stat-value">{loading ? <Skeleton width="80px" height="32px" /> : stats.activeAffiliates.toLocaleString()}</div>
        </div>

        <div className="admin-stat-card" style={{"--icon-bg": "#F0FDF4", "--icon-color": "#10B981", "--bg-accent": "rgba(16, 185, 129, 0.08)"}}>
          <div className="stat-header">
            <div className="stat-icon-wrapper"><Activity size={24} /></div>
          </div>
          <div className="stat-title">Tổng Doanh Số Phễu</div>
          <div className="stat-value">{loading ? <Skeleton width="100px" height="32px" /> : <>{formatAmount(stats.totalRevenue)}</>}</div>
        </div>

        <div className="admin-stat-card" style={{"--icon-bg": "#FEF2F2", "--icon-color": "#EF4444", "--bg-accent": "rgba(239, 68, 68, 0.08)"}}>
          <div className="stat-header">
            <div className="stat-icon-wrapper"><DollarSign size={24} /></div>
          </div>
          <div className="stat-title">Hoa Hồng Đã Trả</div>
          <div className="stat-value">{loading ? <Skeleton width="100px" height="32px" /> : <>{formatAmount(stats.totalPaid)}</>}</div>
        </div>

        <div className="admin-stat-card" style={{"--icon-bg": "#FFFBEB", "--icon-color": "#F59E0B", "--bg-accent": "rgba(245, 158, 11, 0.08)"}}>
          <div className="stat-header">
            <div className="stat-icon-wrapper"><WalletCards size={24} /></div>
            {stats.pendingPayouts > 0 && <div className="stat-trend" style={{background: '#FEF3C7', color: '#D97706'}}>Cần duyệt</div>}
          </div>
          <div className="stat-title">Chờ Duyệt Thanh Toán</div>
          <div className="stat-value">{loading ? <Skeleton width="100px" height="32px" /> : <>{formatAmount(stats.pendingPayouts)}</>}</div>
        </div>
      </div>

      <div className="admin-main-grid">
        {/* Global Chart */}
        <div className="admin-panel">
          <div className="panel-header">
            <h3>Hiệu Suất Doanh Thu Toàn Hệ Thống</h3>
          </div>
          <div className="chart-container-inner">
            {loading ? (
              <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%'}}>
                <Skeleton width="90%" height="200px" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}}
                    itemStyle={{fontWeight: 700, color: '#3B82F6'}}
                    formatter={(value) => [`${Number(value).toLocaleString('vi-VN')}`, 'Doanh thu']}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* System Activity & Notice */}
        <div className="admin-panel">
          <div className="panel-header">
            <h3>Hoạt Động Duyệt Chi</h3>
          </div>
          <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
            {stats.pendingPayouts > 0 ? (
              <div style={{padding: '16px', background: '#FFFBEB', borderLeft: '4px solid #F59E0B', borderRadius: '4px 8px 8px 4px'}}>
                <h4 style={{margin: '0 0 4px 0', fontSize: '14px', color: '#92400E'}}>⏳ Đang chờ duyệt</h4>
                <p style={{margin: 0, fontSize: '13px', color: '#B45309'}}>{formatAmount(stats.pendingPayouts)} hoa hồng đang chờ admin xác nhận thanh toán.</p>
              </div>
            ) : (
              <div style={{padding: '16px', background: '#F0FDF4', borderLeft: '4px solid #10B981', borderRadius: '4px 8px 8px 4px'}}>
                <h4 style={{margin: '0 0 4px 0', fontSize: '14px', color: '#065F46'}}>✅ Ổn định</h4>
                <p style={{margin: 0, fontSize: '13px', color: '#059669'}}>Không có yêu cầu thanh toán nào đang chờ duyệt.</p>
              </div>
            )}
            <div style={{padding: '16px', background: '#EFF6FF', borderLeft: '4px solid #3B82F6', borderRadius: '4px 8px 8px 4px'}}>
              <h4 style={{margin: '0 0 4px 0', fontSize: '14px', color: '#1E40AF'}}>📊 Tổng quan</h4>
              <p style={{margin: 0, fontSize: '13px', color: '#1D4ED8'}}>
                {stats.activeAffiliates} đại lý đang hoạt động. Tổng doanh thu phễu: {formatAmount(stats.totalRevenue)}.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Affiliates */}
      <div className="admin-panel">
        <div className="panel-header">
          <h3>Đại Lý Xuất Sắc (Top Affiliates)</h3>
          <button className="custom-select" style={{background: 'white', cursor: 'pointer'}} onClick={handleExportCSV}>Xuất Báo Cáo CSV</button>
        </div>
        
        <div style={{overflowX: 'auto'}}>
          <table className="affiliate-leaderboard">
            <thead>
              <tr>
                <th>Thông Tin Đại Lý</th>
                <th style={{textAlign: 'right'}}>Thu Nhập Ròng</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td><Skeleton width="200px" height="20px" /></td>
                    <td style={{textAlign: 'right'}}><Skeleton width="120px" height="20px" style={{marginLeft: 'auto'}} /></td>
                  </tr>
                ))
              ) : topAffiliates.length === 0 ? (
                <tr>
                  <td colSpan="2" style={{textAlign: 'center', padding: '32px', color: '#9CA3AF'}}>
                    Chưa có đại lý nào có thu nhập.
                  </td>
                </tr>
              ) : topAffiliates.map((aff, i) => (
                <tr key={aff.id}>
                  <td>
                    <div className="aff-user-cell">
                      <div className="aff-avatar" style={{backgroundColor: rankColors[i] || '#6B7280'}}>
                        {(aff.full_name || '?').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="aff-name">{aff.full_name || 'Chưa cập nhật'}</div>
                        <div className="aff-email">{aff.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="numeric-cell money-green">{Number(aff.total_earned || 0).toLocaleString('vi-VN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;
