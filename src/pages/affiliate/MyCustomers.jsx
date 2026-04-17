import React, { useState, useEffect } from 'react';
import { Users, Search, Filter, DollarSign, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useToast } from '../../components/common/Toast';
import Skeleton from '../../components/common/Skeleton';
import './MyCustomers.css';

const MyCustomers = () => {
  const [loading, setLoading] = useState(true);
  const [conversions, setConversions] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [filterCampaign, setFilterCampaign] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({ total: 0, approved: 0, pending: 0, totalCommission: 0 });
  const addToast = useToast();

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Lấy tất cả conversions của affiliate này (không giới hạn 5 như Dashboard)
      const { data: convData, error } = await supabase
        .from('conversions')
        .select('*, campaigns(name)')
        .eq('affiliate_id', user.id)
        .neq('type', 'upline_commission') // Loại bỏ commission từ tuyến dưới
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading customers:', error);
        addToast('Không thể tải danh sách khách hàng', 'error');
        return;
      }

      setConversions(convData || []);

      // Lấy danh sách campaigns để làm bộ lọc
      const uniqueCampaigns = [];
      const seen = new Set();
      (convData || []).forEach(c => {
        const name = c.campaigns?.name || c.product_name || 'Chưa phân loại';
        if (!seen.has(name)) {
          seen.add(name);
          uniqueCampaigns.push(name);
        }
      });
      setCampaigns(uniqueCampaigns);

      // Tính stats
      const approved = (convData || []).filter(c => c.status === 'approved');
      const pending = (convData || []).filter(c => c.status === 'pending');
      const totalCommission = approved.reduce((sum, c) => sum + (c.commission_amount || 0), 0);

      setStats({
        total: (convData || []).length,
        approved: approved.length,
        pending: pending.length,
        totalCommission
      });

    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  // Lọc dữ liệu
  const filtered = conversions.filter(c => {
    const campaignName = c.campaigns?.name || c.product_name || '';
    const matchCampaign = filterCampaign === 'all' || campaignName === filterCampaign;
    const matchStatus = filterStatus === 'all' || c.status === filterStatus;
    const matchSearch = !searchTerm || 
      (c.customer_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (campaignName).toLowerCase().includes(searchTerm.toLowerCase());
    return matchCampaign && matchStatus && matchSearch;
  });

  const formatCurrency = (num) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num || 0);
  const formatDate = (d) => d ? new Date(d).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }) : 'N/A';

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved': return <span className="mc-badge mc-badge-approved"><CheckCircle2 size={12} /> Thành công</span>;
      case 'rejected': return <span className="mc-badge mc-badge-rejected"><XCircle size={12} /> Từ chối</span>;
      default: return <span className="mc-badge mc-badge-pending"><Clock size={12} /> Chờ duyệt</span>;
    }
  };

  return (
    <div className="dashboard-wrapper">
      <div className="mc-header">
        <div>
          <h2>Khách Hàng Của Tôi</h2>
          <p className="text-muted mt-2">Theo dõi tất cả khách hàng bạn đã giới thiệu, phân theo từng khóa học / sản phẩm.</p>
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="mc-stats-grid">
        <div className="mc-stat-card">
          <div className="mc-stat-icon mc-blue"><Users size={20} /></div>
          <div>
            <div className="mc-stat-label">Tổng Khách Hàng</div>
            <div className="mc-stat-value">{loading ? <Skeleton width="40px" height="28px" /> : stats.total}</div>
          </div>
        </div>
        <div className="mc-stat-card">
          <div className="mc-stat-icon mc-green"><CheckCircle2 size={20} /></div>
          <div>
            <div className="mc-stat-label">Đã Duyệt</div>
            <div className="mc-stat-value">{loading ? <Skeleton width="40px" height="28px" /> : stats.approved}</div>
          </div>
        </div>
        <div className="mc-stat-card">
          <div className="mc-stat-icon mc-orange"><Clock size={20} /></div>
          <div>
            <div className="mc-stat-label">Chờ Duyệt</div>
            <div className="mc-stat-value">{loading ? <Skeleton width="40px" height="28px" /> : stats.pending}</div>
          </div>
        </div>
        <div className="mc-stat-card">
          <div className="mc-stat-icon mc-purple"><DollarSign size={20} /></div>
          <div>
            <div className="mc-stat-label">Tổng Hoa Hồng</div>
            <div className="mc-stat-value mc-green-text">{loading ? <Skeleton width="100px" height="28px" /> : formatCurrency(stats.totalCommission)}</div>
          </div>
        </div>
      </div>

      {/* FILTERS */}
      <div className="mc-filters">
        <div className="search-bar">
          <Search size={16} className="text-muted" />
          <input
            type="text"
            placeholder="Tìm theo tên khách hàng..."
            className="cf-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="mc-filter-group">
          <Filter size={14} className="text-muted" />
          <select className="cf-input mc-select" value={filterCampaign} onChange={e => setFilterCampaign(e.target.value)}>
            <option value="all">Tất cả khóa học</option>
            {campaigns.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select className="cf-input mc-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="all">Mọi trạng thái</option>
            <option value="approved">Thành công</option>
            <option value="pending">Chờ duyệt</option>
            <option value="rejected">Từ chối</option>
          </select>
        </div>
      </div>

      {/* TABLE */}
      <div className="cf-card" style={{padding: 0}}>
        <div className="table-responsive">
          <table className="cf-table">
            <thead>
              <tr>
                <th>Khách Hàng</th>
                <th>Khóa Học / Sản Phẩm</th>
                <th>Ngày Mua</th>
                <th>Trạng Thái</th>
                <th style={{textAlign: 'right'}}>Giá Trị Đơn</th>
                <th style={{textAlign: 'right'}}>Hoa Hồng</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td><Skeleton width="130px" height="20px" /></td>
                    <td><Skeleton width="150px" height="20px" /></td>
                    <td><Skeleton width="90px" height="20px" /></td>
                    <td><Skeleton width="90px" height="24px" style={{borderRadius: 12}} /></td>
                    <td><Skeleton width="100px" height="20px" style={{marginLeft: 'auto'}} /></td>
                    <td><Skeleton width="100px" height="20px" style={{marginLeft: 'auto'}} /></td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{textAlign: 'center', padding: '48px 20px', color: '#6B7280'}}>
                    <Users size={36} strokeWidth={1.5} style={{marginBottom: 12, opacity: 0.4}} /><br />
                    {searchTerm || filterCampaign !== 'all' || filterStatus !== 'all'
                      ? 'Không tìm thấy kết quả phù hợp với bộ lọc.'
                      : 'Chưa có khách hàng nào. Hãy chia sẻ link affiliate để bắt đầu!'}
                  </td>
                </tr>
              ) : filtered.map(conv => (
                <tr key={conv.id}>
                  <td>
                    <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                      <div className="mc-avatar">{(conv.customer_name || '?').charAt(0).toUpperCase()}</div>
                      <div>
                        <div className="font-bold">{conv.customer_name || 'Khách hàng'}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="mc-course-tag">{conv.campaigns?.name || conv.product_name || 'Sản phẩm'}</span>
                  </td>
                  <td className="text-muted">{formatDate(conv.created_at)}</td>
                  <td>{getStatusBadge(conv.status)}</td>
                  <td style={{textAlign: 'right', fontWeight: 500}}>{formatCurrency(conv.sale_amount)}</td>
                  <td style={{textAlign: 'right', fontWeight: 700, color: conv.status === 'approved' ? '#10B981' : conv.status === 'rejected' ? '#9CA3AF' : '#F59E0B'}}>
                    +{formatCurrency(conv.commission_amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SUMMARY FOOTER */}
      {!loading && filtered.length > 0 && (
        <div className="mc-footer">
          Hiển thị <strong>{filtered.length}</strong> / {conversions.length} khách hàng
        </div>
      )}
    </div>
  );
};

export default MyCustomers;
