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
    const initData = async () => {
      await loadCustomers();
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const leadsSub = supabase.channel('mycustomers_leads')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'leads', filter: `affiliate_id=eq.${user.id}` }, 
          () => loadCustomers())
        .subscribe();

      const convSub = supabase.channel('mycustomers_conversions')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'conversions', filter: `affiliate_id=eq.${user.id}` }, 
          () => loadCustomers())
        .subscribe();

      return () => {
        supabase.removeChannel(leadsSub);
        supabase.removeChannel(convSub);
      };
    };

    const cleanup = initData();
    return () => {
      cleanup.then(cleanFn => { if (typeof cleanFn === 'function') cleanFn(); });
    };
  }, []);

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // 1. Fetch ALL leads for this affiliate (Ngay khi vừa điền Form)
      const { data: leadsData, error: leadsErr } = await supabase
        .from('leads')
        .select('*')
        .eq('affiliate_id', user.id)
        .order('created_at', { ascending: false });

      // 2. Lấy tất cả conversions của affiliate này (Đã qua trang Checkout)
      const { data: convData, error: convErr } = await supabase
        .from('conversions')
        .select('*, campaigns(name)')
        .eq('affiliate_id', user.id)
        .neq('type', 'upline_commission');

      if (leadsErr || convErr) {
        console.error('Error loading customers:', leadsErr || convErr);
        addToast('Không thể tải danh sách khách hàng', 'error');
        return;
      }

      // 3. Hợp nhất: Nối Lead chưa thanh toán và Lead đã thanh toán
      const mergedList = (leadsData || []).map(lead => {
         // Tìm Conversion tương ứng từ Lead ID
         const matchingConv = (convData || []).find(c => c.customer_info?.lead_id === lead.id);
         
         return {
            id: lead.id,
            customer_name: lead.name,
            phone: lead.phone,
            email: lead.email,
            product_name: matchingConv ? (matchingConv.campaigns?.name || matchingConv.product_name) : (lead.notes?.replace('Đăng ký từ khóa học: ', '') || 'Khóa học'),
            created_at: lead.created_at,
            status: matchingConv ? matchingConv.status : 'unpaid', // Thêm trạng thái Chưa Thanh Toán
            sale_amount: matchingConv ? matchingConv.sale_amount : 0,
            commission_amount: matchingConv ? matchingConv.commission_amount : 0,
         };
      });

      // Nhét bổ sung các Conversions cũ (không map được qua lead)
      (convData || []).forEach(c => {
         const leadID = c.customer_info?.lead_id;
         if (!leadsData?.find(l => l.id === leadID)) {
             mergedList.push({
                 id: c.id,
                 customer_name: c.customer_name,
                 phone: c.customer_info?.phone || 'N/A',
                 email: 'N/A',
                 product_name: c.campaigns?.name || c.product_name,
                 created_at: c.created_at,
                 status: c.status,
                 sale_amount: c.sale_amount,
                 commission_amount: c.commission_amount
             });
         }
      });
      
      // Sắp xếp lại theo thời gian mới nhất
      mergedList.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      setConversions(mergedList);

      // Lấy danh sách campaigns để làm bộ lọc
      const uniqueCampaigns = [];
      const seen = new Set();
      mergedList.forEach(c => {
        const name = c.product_name || 'Chưa phân loại';
        if (!seen.has(name)) {
          seen.add(name);
          uniqueCampaigns.push(name);
        }
      });
      setCampaigns(uniqueCampaigns);

      // Tính stats
      const approved = mergedList.filter(c => c.status === 'approved');
      const pending = mergedList.filter(c => c.status === 'pending');
      const unpaid = mergedList.filter(c => c.status === 'unpaid');
      const totalCommission = approved.reduce((sum, c) => sum + (c.commission_amount || 0), 0);

      setStats({
        total: mergedList.length,
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
      case 'unpaid': return <span className="mc-badge" style={{backgroundColor: '#F3F4F6', color: '#4B5563', border: '1px solid #E5E7EB'}}><Clock size={12} /> Chưa thanh toán</span>;
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
            <option value="unpaid">Chưa thanh toán</option>
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
                <th>Ngày Cập Nhật</th>
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
                        <div className="text-sm text-muted" style={{marginTop: '2px'}}>{conv.phone || 'Không có SĐT'}</div>
                        {conv.email && conv.email !== 'N/A' && <div className="text-xs text-muted">{conv.email}</div>}
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="mc-course-tag">{conv.product_name}</span>
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
