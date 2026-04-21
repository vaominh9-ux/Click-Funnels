import React, { useState, useEffect, useMemo } from 'react';
import { Users, DollarSign, Activity, WalletCards, TrendingUp, BarChart3, Shield, ArrowUpRight } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { supabase } from '../../lib/supabase';
import Skeleton from '../../components/common/Skeleton';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30d');
  const [conversions, setConversions] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [payoutsData, setPayoutsData] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [allLinks, setAllLinks] = useState([]);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [convRes, profRes, payRes, auditRes, linksRes] = await Promise.all([
        supabase.from('conversions').select('*, campaigns(name)').order('created_at', { ascending: false }),
        supabase.from('profiles').select('id, full_name, email, total_earned, balance, role, approval_status, tier, created_at'),
        supabase.from('payouts').select('amount, status').in('status', ['pending', 'processing']),
        supabase.from('audit_logs').select('*').order('created_at', { ascending: false }).limit(20),
        supabase.from('affiliate_links').select('id, campaign_id, clicks, leads, campaigns(name, status)'),
      ]);

      setConversions(convRes.data || []);
      setProfiles(profRes.data || []);
      setPayoutsData(payRes.data || []);
      setAuditLogs(auditRes.data || []);
      setAllLinks(linksRes.data || []);
    } catch (err) {
      console.error('Error fetching admin stats:', err);
    } finally {
      setLoading(false);
    }
  };

  // ─── Date filtering ───
  const filteredConversions = useMemo(() => {
    if (dateRange === 'all') return conversions;
    const now = new Date();
    const days = dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : dateRange === 'today' ? 0 : 30;
    const cutoff = new Date(now);
    if (days === 0) { cutoff.setHours(0, 0, 0, 0); }
    else { cutoff.setDate(now.getDate() - days); }
    return conversions.filter(c => new Date(c.created_at) >= cutoff);
  }, [conversions, dateRange]);

  // ─── Statistics ───
  const stats = useMemo(() => {
    const activeAffiliates = profiles.filter(p => p.approval_status === 'active' && p.role === 'affiliate').length;
    const totalRevenue = filteredConversions.reduce((sum, c) => sum + Number(c.sale_amount || 0), 0);
    const totalCommissionPaid = filteredConversions.filter(c => c.status === 'approved').reduce((sum, c) => sum + Number(c.commission_amount || 0), 0);
    const pendingPayouts = payoutsData.reduce((sum, p) => sum + Number(p.amount || 0), 0);
    const approvedCount = filteredConversions.filter(c => c.status === 'approved').length;
    const totalOrders = filteredConversions.length;
    const conversionRate = totalOrders > 0 ? ((approvedCount / totalOrders) * 100).toFixed(1) : 0;

    return { activeAffiliates, totalRevenue, totalCommissionPaid, pendingPayouts, approvedCount, totalOrders, conversionRate };
  }, [filteredConversions, profiles, payoutsData]);

  // ─── Revenue Chart (by day) ───
  const revenueChartData = useMemo(() => {
    const dayMap = {};
    filteredConversions.forEach(c => {
      const d = new Date(c.created_at);
      const key = `${d.getDate()}/${d.getMonth() + 1}`;
      if (!dayMap[key]) dayMap[key] = { name: key, revenue: 0, commission: 0, orders: 0 };
      dayMap[key].revenue += Number(c.sale_amount || 0);
      if (c.status === 'approved') dayMap[key].commission += Number(c.commission_amount || 0);
      dayMap[key].orders += 1;
    });
    const sorted = Object.values(dayMap).sort((a, b) => {
      const [da, ma] = a.name.split('/');
      const [db, mb] = b.name.split('/');
      return (Number(ma) * 100 + Number(da)) - (Number(mb) * 100 + Number(db));
    });
    return sorted.length > 0 ? sorted : [{ name: 'N/A', revenue: 0, commission: 0, orders: 0 }];
  }, [filteredConversions]);

  // ─── Status Pie ───
  const statusPie = useMemo(() => {
    const pending = filteredConversions.filter(c => c.status === 'pending').length;
    const approved = filteredConversions.filter(c => c.status === 'approved').length;
    const rejected = filteredConversions.filter(c => c.status === 'rejected').length;
    return [
      { name: 'Chờ duyệt', value: pending, color: '#F59E0B' },
      { name: 'Đã duyệt', value: approved, color: '#10B981' },
      { name: 'Từ chối', value: rejected, color: '#EF4444' },
    ].filter(s => s.value > 0);
  }, [filteredConversions]);

  // ─── Top Affiliates table data ───
  const topAffiliates = useMemo(() => {
    // Build affiliate stats from conversions
    const affMap = {};
    conversions.forEach(c => {
      if (!c.affiliate_id) return;
      if (!affMap[c.affiliate_id]) affMap[c.affiliate_id] = { orders: 0, approved: 0, revenue: 0, commission: 0 };
      affMap[c.affiliate_id].orders += 1;
      affMap[c.affiliate_id].revenue += Number(c.sale_amount || 0);
      if (c.status === 'approved') {
        affMap[c.affiliate_id].approved += 1;
        affMap[c.affiliate_id].commission += Number(c.commission_amount || 0);
      }
    });

    return profiles
      .filter(p => p.role === 'affiliate')
      .map(p => ({
        ...p,
        orders: affMap[p.id]?.orders || 0,
        approvedOrders: affMap[p.id]?.approved || 0,
        totalRevenue: affMap[p.id]?.revenue || 0,
        totalCommission: affMap[p.id]?.commission || 0,
        rate: affMap[p.id]?.orders > 0 ? ((affMap[p.id]?.approved / affMap[p.id]?.orders) * 100).toFixed(0) : 0,
      }))
      .sort((a, b) => b.totalCommission - a.totalCommission)
      .slice(0, 8);
  }, [profiles, conversions]); // Affiliates leaderboard considers ALL conversions, or filtered? We use 'conversions' here.

  // ─── Top Campaigns table data ───
  const topCampaigns = useMemo(() => {
    const campMap = {};

    // 1. Phân tích Clicks & Leads thô từ affiliate_links
    allLinks.forEach(link => {
      if (!link.campaign_id || !link.campaigns) return;
      const cId = link.campaign_id;
      if (!campMap[cId]) {
        campMap[cId] = { id: cId, name: link.campaigns.name, status: link.campaigns.status, clicks: 0, rawLeads: 0, orders: 0, approved: 0, revenue: 0 };
      }
      campMap[cId].clicks += (link.clicks || 0);
      campMap[cId].rawLeads += (link.leads || 0);
    });

    // 2. Phân tích Orders và Revenue thực thụ từ conversions
    // Dùng filteredConversions để bảng Khóa học Lọc theo ngày
    filteredConversions.forEach(c => {
      let cId = c.campaign_id;
      
      // Nếu conversion chưa lưu campaign_id (đơn hàng cũ), truy ngược từ link_id
      if (!cId && c.link_id) {
        const foundLink = allLinks.find(l => l.id === c.link_id);
        if (foundLink) cId = foundLink.campaign_id;
      }

      if (!cId) return;

      if (!campMap[cId]) {
        campMap[cId] = { id: cId, name: c.campaigns?.name || 'Chiến dịch vô danh', clicks: 0, rawLeads: 0, orders: 0, approved: 0, revenue: 0, status: 'unknown' };
      }
      campMap[cId].orders += 1;
      if (c.status === 'approved') {
        campMap[cId].approved += 1;
        campMap[cId].revenue += Number(c.sale_amount || 0);
      }
    });

    return Object.values(campMap)
      .map(c => ({
         ...c, 
         conversionRate: c.clicks > 0 ? ((c.approved / c.clicks) * 100).toFixed(1) : 0
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 8); // Top 8 chiến dịch
  }, [filteredConversions, allLinks]);

  const formatAmount = (v) => Math.round(Number(v)).toLocaleString('vi-VN');
  const formatShort = (v) => {
    if (v >= 1e9) return (v / 1e9).toFixed(1) + 'B';
    if (v >= 1e6) return (v / 1e6).toFixed(1) + 'Tr';
    if (v >= 1e3) return (v / 1e3).toFixed(0) + 'K';
    return v.toString();
  };

  const rankColors = ['#F59E0B', '#3B82F6', '#10B981', '#8B5CF6', '#EC4899', '#6366F1', '#14B8A6', '#F97316'];

  // ─── Audit action labels ───
  const getAuditLabel = (log) => {
    const labels = {
      'conversion.approve': { text: 'Duyệt đơn hàng', color: '#10B981', bg: '#F0FDF4' },
      'conversion.reject': { text: 'Từ chối đơn hàng', color: '#EF4444', bg: '#FEF2F2' },
      'conversion.create': { text: 'Tạo đơn mới', color: '#3B82F6', bg: '#EFF6FF' },
      'payout.complete': { text: 'Thanh toán', color: '#8B5CF6', bg: '#F5F3FF' },
      'payout.bulk_complete': { text: 'Thanh toán hàng loạt', color: '#8B5CF6', bg: '#F5F3FF' },
    };
    return labels[log.action] || { text: log.action, color: '#6B7280', bg: '#F3F4F6' };
  };

  const handleExportCSV = () => {
    const headers = ['Hạng', 'Tên', 'Email', 'Đơn hàng', 'Duyệt', 'Tỷ lệ', 'Doanh thu', 'Hoa hồng'];
    const rows = topAffiliates.map((a, i) => [i + 1, a.full_name || '', a.email, a.orders, a.approvedOrders, a.rate + '%', a.totalRevenue, a.totalCommission]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="admin-dashboard-container">
      <div className="admin-header-row">
        <div>
          <h1>Trung Tâm Phân Tích</h1>
          <p>Bảng điều khiển phân tích hiệu suất toàn hệ thống thời gian thực</p>
        </div>
        <div className="admin-date-filters">
          {[{ key: 'today', label: 'Hôm nay' }, { key: '7d', label: '7 ngày' }, { key: '30d', label: '30 ngày' }, { key: 'all', label: 'Tất cả' }].map(f => (
            <button key={f.key} className={`date-filter-btn ${dateRange === f.key ? 'active' : ''}`} onClick={() => setDateRange(f.key)}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* ─── Stats Grid ─── */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card" style={{ "--icon-bg": "#EFF6FF", "--icon-color": "#3B82F6", "--bg-accent": "rgba(59, 130, 246, 0.08)" }}>
          <div className="stat-header">
            <div className="stat-icon-wrapper"><Users size={24} /></div>
          </div>
          <div className="stat-title">Đại Lý Hoạt Động</div>
          <div className="stat-value">{loading ? <Skeleton width="80px" height="32px" /> : stats.activeAffiliates}</div>
        </div>

        <div className="admin-stat-card stat-wide" style={{ "--icon-bg": "#F0FDF4", "--icon-color": "#10B981", "--bg-accent": "rgba(16, 185, 129, 0.08)" }}>
          <div className="stat-header">
            <div className="stat-icon-wrapper"><Activity size={24} /></div>
            {stats.totalRevenue > 0 && <div className="stat-trend positive"><ArrowUpRight size={14} /> Live</div>}
          </div>
          <div className="stat-title">Tổng Doanh Thu Phễu</div>
          <div className="stat-value">{loading ? <Skeleton width="100px" height="32px" /> : formatAmount(stats.totalRevenue)}</div>
        </div>

        <div className="admin-stat-card stat-wide" style={{ "--icon-bg": "#FEF2F2", "--icon-color": "#EF4444", "--bg-accent": "rgba(239, 68, 68, 0.08)" }}>
          <div className="stat-header">
            <div className="stat-icon-wrapper"><DollarSign size={24} /></div>
          </div>
          <div className="stat-title">Hoa Hồng Đã Trả</div>
          <div className="stat-value">{loading ? <Skeleton width="100px" height="32px" /> : formatAmount(stats.totalCommissionPaid)}</div>
        </div>

        <div className="admin-stat-card" style={{ "--icon-bg": "#FDF4FF", "--icon-color": "#A855F7", "--bg-accent": "rgba(168, 85, 247, 0.08)" }}>
          <div className="stat-header">
            <div className="stat-icon-wrapper"><TrendingUp size={24} /></div>
          </div>
          <div className="stat-title">Tỷ Lệ Chuyển Đổi</div>
          <div className="stat-value">{loading ? <Skeleton width="60px" height="32px" /> : <>{stats.conversionRate}<span style={{ fontSize: '18px', fontWeight: 500 }}>%</span></>}</div>
          <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px' }}>{stats.approvedCount}/{stats.totalOrders} đơn duyệt</div>
        </div>
      </div>

      {/* ─── Charts Row ─── */}
      <div className="admin-main-grid">
        {/* Revenue Chart */}
        <div className="admin-panel">
          <div className="panel-header">
            <h3><BarChart3 size={18} style={{ verticalAlign: 'text-bottom', marginRight: '8px' }} />Doanh Thu & Hoa Hồng Theo Ngày</h3>
          </div>
          <div className="chart-container-inner">
            {loading ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                <Skeleton width="90%" height="200px" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorCommission" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} tickFormatter={formatShort} />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.15)', padding: '12px 16px' }}
                    formatter={(value, name) => [`${Number(value).toLocaleString('vi-VN')}`, name === 'revenue' ? 'Doanh thu' : 'Hoa hồng']}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRevenue)" />
                  <Area type="monotone" dataKey="commission" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorCommission)" strokeDasharray="5 5" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Status Pie + Audit Feed */}
        <div className="admin-panel" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Mini Pie */}
          <div>
            <div className="panel-header" style={{ marginBottom: '12px' }}>
              <h3>Phân Bổ Trạng Thái Đơn</h3>
            </div>
            {loading ? (
              <Skeleton width="100%" height="160px" />
            ) : statusPie.length > 0 ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <ResponsiveContainer width={140} height={140}>
                  <PieChart>
                    <Pie data={statusPie} cx="50%" cy="50%" innerRadius={35} outerRadius={60} paddingAngle={3} dataKey="value">
                      {statusPie.map((entry, idx) => <Cell key={idx} fill={entry.color} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {statusPie.map((s, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                      <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: s.color, flexShrink: 0 }} />
                      <span style={{ color: '#4B5563' }}>{s.name}: <strong>{s.value}</strong></span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p style={{ color: '#9CA3AF', fontSize: '14px' }}>Chưa có dữ liệu</p>
            )}
          </div>

          {/* Audit Feed */}
          <div style={{ flex: 1, minHeight: 0 }}>
            <div className="panel-header" style={{ marginBottom: '12px' }}>
              <h3><Shield size={16} style={{ verticalAlign: 'text-bottom', marginRight: '6px' }} />Nhật Ký Quản Trị</h3>
            </div>
            <div className="audit-feed-container">
              {auditLogs.length === 0 ? (
                <p style={{ color: '#9CA3AF', fontSize: '13px', textAlign: 'center', padding: '20px 0' }}>Chưa có hoạt động nào được ghi nhận.</p>
              ) : (
                auditLogs.slice(0, 8).map((log, i) => {
                  const label = getAuditLabel(log);
                  const timeAgo = getTimeAgo(log.created_at);
                  return (
                    <div key={log.id || i} className="audit-feed-item">
                      <div className="audit-dot" style={{ background: label.color }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                          <span className="audit-action-badge" style={{ background: label.bg, color: label.color }}>{label.text}</span>
                          <span className="audit-time">{timeAgo}</span>
                        </div>
                        <div className="audit-actor">{log.actor_email || 'System'}</div>
                        {log.details?.affiliate_name && (
                          <div className="audit-detail">→ {log.details.affiliate_name} {log.details?.amount ? `• ${Number(log.details.amount).toLocaleString('vi-VN')}` : ''}</div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ─── Bottom Grid for Tables ─── */}
      <div className="admin-bottom-grid">
        
        {/* ─── Top Campaigns Enhanced ─── */}
        <div className="admin-panel" style={{ margin: 0 }}>
          <div className="panel-header">
            <h3>🔥 Chiến Dịch Hiệu Quả (Top Funnels)</h3>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="affiliate-leaderboard">
              <thead>
                <tr>
                  <th>Tên Chiến Dịch</th>
                  <th style={{ textAlign: 'center' }}>Click</th>
                  <th style={{ textAlign: 'center' }}>Đơn</th>
                  <th style={{ textAlign: 'center' }}>TL Chốt</th>
                  <th style={{ textAlign: 'right' }}>Doanh Thu</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      <td><Skeleton width="150px" height="20px" /></td>
                      <td><Skeleton width="40px" height="20px" style={{ margin: '0 auto' }} /></td>
                      <td><Skeleton width="40px" height="20px" style={{ margin: '0 auto' }} /></td>
                      <td><Skeleton width="50px" height="20px" style={{ margin: '0 auto' }} /></td>
                      <td style={{ textAlign: 'right' }}><Skeleton width="100px" height="20px" style={{ marginLeft: 'auto' }} /></td>
                    </tr>
                  ))
                ) : topCampaigns.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '32px', color: '#9CA3AF' }}>
                      Chưa có dữ liệu chiến dịch.
                    </td>
                  </tr>
                ) : topCampaigns.map((camp, i) => (
                  <tr key={camp.id}>
                    <td>
                      <div style={{ fontWeight: 600, color: '#111827', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {i < 3 && <span style={{ fontSize: '14px' }}>{i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}</span>}
                        {camp.name}
                        {camp.status === 'inactive' && <span style={{ fontSize: '10px', padding: '2px 4px', background: '#FEE2E2', color: '#EF4444', borderRadius: '4px', fontWeight: 700 }}>ĐÓNG</span>}
                      </div>
                    </td>
                    <td style={{ textAlign: 'center', fontWeight: 600, color: '#3B82F6' }}>{camp.clicks}</td>
                    <td style={{ textAlign: 'center', fontWeight: 600 }}>{camp.approved}<span style={{color: '#9CA3AF', fontSize: '12px', fontWeight: 500}}>.{camp.orders}</span></td>
                    <td style={{ textAlign: 'center' }}>
                      <span className={`rate-badge ${Number(camp.conversionRate) >= 10 ? 'rate-high' : Number(camp.conversionRate) >= 2 ? 'rate-mid' : 'rate-low'}`}>
                        {camp.conversionRate}%
                      </span>
                    </td>
                    <td className="numeric-cell money-green">{formatAmount(camp.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ─── Top Affiliates Enhanced ─── */}
        <div className="admin-panel" style={{ margin: 0 }}>
          <div className="panel-header">
            <h3>🏆 Bảng Xếp Hạng Đại Lý</h3>
            <button className="custom-select" style={{ background: 'white', cursor: 'pointer' }} onClick={handleExportCSV}>Xuất CSV</button>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="affiliate-leaderboard">
              <thead>
                <tr>
                  <th>Đại Lý</th>
                  <th style={{ textAlign: 'center' }}>Đơn</th>
                  <th style={{ textAlign: 'center' }}>Tỷ Lệ</th>
                  <th style={{ textAlign: 'right' }}>Hoa Hồng</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      <td><Skeleton width="150px" height="20px" /></td>
                      <td><Skeleton width="40px" height="20px" style={{ margin: '0 auto' }} /></td>
                      <td><Skeleton width="50px" height="20px" style={{ margin: '0 auto' }} /></td>
                      <td style={{ textAlign: 'right' }}><Skeleton width="100px" height="20px" style={{ marginLeft: 'auto' }} /></td>
                    </tr>
                  ))
                ) : topAffiliates.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', padding: '32px', color: '#9CA3AF' }}>
                      Chưa có đại lý nào.
                    </td>
                  </tr>
                ) : topAffiliates.map((aff, i) => (
                  <tr key={aff.id}>
                    <td>
                      <div className="aff-user-cell" style={{ gap: '8px' }}>
                        <div className="rank-number" style={{ background: rankColors[i] || '#9CA3AF', flexShrink: 0, width: '22px', height: '22px', fontSize: '11px' }}>{i + 1}</div>
                        <div>
                          <div className="aff-name" style={{ fontSize: '13px' }}>{aff.full_name || 'Chưa cập nhật'}</div>
                          <div className="aff-email" style={{ fontSize: '11px' }}>{aff.email.split('@')[0]}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ textAlign: 'center', fontWeight: 600 }}>{aff.approvedOrders}<span style={{color: '#9CA3AF', fontSize: '12px', fontWeight: 500}}>.{aff.orders}</span></td>
                    <td style={{ textAlign: 'center' }}>
                      <span className={`rate-badge ${Number(aff.rate) >= 70 ? 'rate-high' : Number(aff.rate) >= 40 ? 'rate-mid' : 'rate-low'}`}>
                        {aff.rate}%
                      </span>
                    </td>
                    <td className="numeric-cell money-green">{formatAmount(aff.totalCommission)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

function getTimeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Vừa xong';
  if (mins < 60) return `${mins} phút trước`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} giờ trước`;
  const days = Math.floor(hrs / 24);
  return `${days} ngày trước`;
}

export default AdminDashboard;
