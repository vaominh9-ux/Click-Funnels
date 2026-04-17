import React, { useState, useEffect } from 'react';
import { Users, GitBranch, ArrowUpRight } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useToast } from '../../components/common/Toast';
import Skeleton from '../../components/common/Skeleton';
import '../affiliate/Dashboard.css';

const AffiliateNetwork = () => {
  const [loading, setLoading] = useState(true);
  const [downlines, setDownlines] = useState([]);
  const [stats, setStats] = useState({ f1Count: 0, f2Count: 0, branchRevenue: 0 });
  const addToast = useToast();

  useEffect(() => {
    loadNetwork();
  }, []);

  const loadNetwork = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // 1. Lấy F1 — người được giới thiệu trực tiếp bởi user hiện tại
      const { data: f1List, error: f1Error } = await supabase
        .from('profiles')
        .select('id, full_name, email, created_at, approval_status, tier, total_earned')
        .eq('referred_by', user.id)
        .order('created_at', { ascending: false });

      if (f1Error) {
        console.error('Lỗi lấy F1:', f1Error);
        addToast('Không thể tải mạng lưới', 'error');
        setLoading(false);
        return;
      }

      const f1Ids = (f1List || []).map(f => f.id);
      let f2List = [];

      // 2. Lấy F2 — người được giới thiệu bởi F1
      if (f1Ids.length > 0) {
        const { data: f2Data } = await supabase
          .from('profiles')
          .select('id, full_name, email, created_at, approval_status, tier, total_earned, referred_by')
          .in('referred_by', f1Ids)
          .order('created_at', { ascending: false });
        f2List = f2Data || [];
      }

      // 3. Tổng hợp downlines
      const allDownlines = [
        ...(f1List || []).map(p => ({ ...p, level: 'F1 (Trực tiếp)' })),
        ...f2List.map(p => ({ ...p, level: 'F2 (Nhánh)' }))
      ];

      setDownlines(allDownlines);

      // 4. Tính stats
      const totalBranchRevenue = allDownlines.reduce((acc, p) => acc + (Number(p.total_earned) || 0), 0);
      setStats({
        f1Count: (f1List || []).length,
        f2Count: f2List.length,
        branchRevenue: totalBranchRevenue
      });

    } catch (err) {
      console.error('Unexpected error:', err);
    }
    setLoading(false);
  };

  const formatCurrency = (num) => {
    return Number(num || 0).toLocaleString('vi-VN') + ' ₫';
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('vi-VN', { day: '2-digit', month: 'long', year: 'numeric' });
  };

  return (
    <div className="dashboard-wrapper">
      <div className="flex-between mb-6">
        <div>
          <h2>Mạng Lưới Bán Hàng</h2>
          <p className="text-muted mt-2">Theo dõi hiệu suất của các đối tác tuyến dưới và thu nhập nhánh.</p>
        </div>
      </div>

      <div className="stats-grid mb-6">
        <div className="cf-card" style={{borderTop: '4px solid #3B82F6'}}>
          <h3 className="text-muted text-sm font-bold uppercase mb-2" style={{display:'flex',alignItems:'center',gap:'8px'}}>
            <Users size={16}/> Đối Tác Trực Tiếp (F1)
          </h3>
          <div className="font-bold" style={{fontSize:'28px'}}>{loading ? <Skeleton width="60px" height="36px" /> : stats.f1Count}</div>
        </div>
        <div className="cf-card" style={{borderTop: '4px solid #8B5CF6'}}>
          <h3 className="text-muted text-sm font-bold uppercase mb-2" style={{display:'flex',alignItems:'center',gap:'8px'}}>
            <GitBranch size={16}/> Tuyến Dưới (F2)
          </h3>
          <div className="font-bold" style={{fontSize:'28px'}}>{loading ? <Skeleton width="60px" height="36px" /> : stats.f2Count}</div>
        </div>
        <div className="cf-card" style={{borderTop: '4px solid #10B981'}}>
          <h3 className="text-muted text-sm font-bold uppercase mb-2" style={{display:'flex',alignItems:'center',gap:'8px'}}>
            <ArrowUpRight size={16}/> Doanh Số Nhánh
          </h3>
          <div className="font-bold" style={{fontSize:'28px',color:'#059669'}}>{loading ? <Skeleton width="160px" height="36px" /> : formatCurrency(stats.branchRevenue)}</div>
        </div>
      </div>

      <div className="cf-card" style={{padding: 0}}>
        <div style={{padding: '16px 24px', borderBottom: '1px solid var(--cf-border)'}}>
          <h3 className="font-bold">Hoạt Động Tuyến Dưới (Downline)</h3>
        </div>
        <div className="table-responsive">
          <table className="cf-table">
            <thead>
              <tr>
                <th>Tên Đối Tác</th>
                <th>Cấp Bậc</th>
                <th>Ngày Tham Gia</th>
                <th>Trạng Thái</th>
                <th style={{textAlign: 'right'}}>Doanh Số</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i}>
                    <td><Skeleton width="120px" height="20px" /></td>
                    <td><Skeleton width="100px" height="20px" /></td>
                    <td><Skeleton width="140px" height="20px" /></td>
                    <td><Skeleton width="120px" height="24px" style={{borderRadius: 12}} /></td>
                    <td style={{textAlign: 'right'}}><Skeleton width="120px" height="20px" style={{marginLeft: 'auto'}} /></td>
                  </tr>
                ))
              ) : downlines.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{textAlign: 'center', padding: '40px', color: '#6B7280'}}>
                    Chưa có đối tác tuyến dưới nào. Chia sẻ link giới thiệu để xây dựng mạng lưới!
                  </td>
                </tr>
              ) : downlines.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className="font-bold">{user.full_name || 'Chưa cập nhật'}</div>
                    <div className="text-sm text-muted">{user.email}</div>
                  </td>
                  <td className="text-muted">{user.level}</td>
                  <td>{formatDate(user.created_at)}</td>
                  <td>
                    <span className={`badge ${user.approval_status === 'active' ? 'badge-cleared' : 'badge-pending'}`}>
                      {user.approval_status === 'active' ? 'Đang hoạt động' : user.approval_status === 'pending' ? 'Chờ duyệt' : 'Bị khóa'}
                    </span>
                  </td>
                  <td style={{textAlign: 'right'}} className="font-bold">{formatCurrency(user.total_earned)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AffiliateNetwork;
