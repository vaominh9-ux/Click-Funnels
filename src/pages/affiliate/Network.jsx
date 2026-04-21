import React, { useState, useEffect } from 'react';
import { Users, DollarSign, UserPlus, Copy, Share2, CheckCircle, XCircle, Clock, Shield } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useToast } from '../../components/common/Toast';
import Skeleton from '../../components/common/Skeleton';
import '../affiliate/Dashboard.css';

const AffiliateNetwork = () => {
  const [loading, setLoading] = useState(true);
  const [downlines, setDownlines] = useState([]);
  const [stats, setStats] = useState({ f1Count: 0, totalRevenue: 0, pendingCount: 0 });
  const [refLink, setRefLink] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const addToast = useToast();

  useEffect(() => {
    let subscription = null;

    const initNetwork = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setCurrentUserId(user.id);

      const { data: profile } = await supabase
        .from('profiles')
        .select('ref_code, role')
        .eq('id', user.id)
        .single();

      const adminMode = profile?.role === 'admin';
      setIsAdmin(adminMode);

      if (profile?.ref_code) {
        const domain = import.meta.env.VITE_TRACKING_DOMAIN || (window.location.hostname === 'localhost' ? 'https://ai.duhava.com' : window.location.origin);
        setRefLink(`${domain}/auth/register?ref=${profile.ref_code}`);
      }

      await loadNetwork(user.id, adminMode);

      subscription = supabase
        .channel('realtime_network')
        .on('postgres_changes', { 
          event: '*', schema: 'public', table: 'profiles' 
        }, () => loadNetwork(user.id, adminMode))
        .subscribe();
    };

    initNetwork();
    return () => {
      if (subscription) supabase.removeChannel(subscription);
    };
  }, []);

  const loadNetwork = async (userId, adminMode) => {
    setLoading(true);
    try {
      let query = supabase
        .from('profiles')
        .select('id, full_name, email, created_at, approval_status, tier, total_earned, role')
        .order('created_at', { ascending: false });

      if (adminMode) {
        query = query.eq('role', 'affiliate');
      } else {
        query = query.eq('referred_by', userId);
      }

      const { data: f1List, error } = await query;

      if (error) {
        console.error('Lỗi lấy danh sách:', error);
        addToast('Không thể tải mạng lưới', 'error');
        setLoading(false);
        return;
      }

      setDownlines(f1List || []);

      const totalRevenue = (f1List || []).reduce((acc, p) => acc + (Number(p.total_earned) || 0), 0);
      const pendingCount = (f1List || []).filter(p => p.approval_status === 'pending').length;
      setStats({ f1Count: (f1List || []).length, totalRevenue, pendingCount });

    } catch (err) {
      console.error('Unexpected error:', err);
    }
    setLoading(false);
  };

  const handleApproval = async (id, newStatus) => {
    const { error } = await supabase
      .from('profiles')
      .update({ approval_status: newStatus })
      .eq('id', id);

    if (!error) {
      addToast(newStatus === 'active' ? '✅ Đã duyệt CTV thành công!' : '🔒 Đã khóa CTV.', newStatus === 'active' ? 'success' : 'warning');
      loadNetwork(currentUserId, isAdmin);
    } else {
      addToast('Lỗi cập nhật trạng thái', 'error');
    }
  };

  const formatCurrency = (num) => Number(num || 0).toLocaleString('vi-VN') + ' ₫';

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const handleCopyRefLink = () => {
    if (refLink) {
      navigator.clipboard.writeText(refLink);
      addToast('Đã sao chép link giới thiệu!', 'success');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active': return <span className="badge badge-cleared" style={{display:'inline-flex',alignItems:'center',gap:4}}><CheckCircle size={12}/> Hoạt động</span>;
      case 'pending': return <span className="badge badge-pending" style={{display:'inline-flex',alignItems:'center',gap:4}}><Clock size={12}/> Chờ duyệt</span>;
      case 'rejected': return <span className="badge" style={{background:'#FEE2E2',color:'#991B1B',display:'inline-flex',alignItems:'center',gap:4}}><XCircle size={12}/> Bị khóa</span>;
      default: return <span className="badge" style={{background:'#FEE2E2',color:'#991B1B',display:'inline-flex',alignItems:'center',gap:4}}><XCircle size={12}/> Bị khóa</span>;
    }
  };

  return (
    <div className="dashboard-wrapper">
      <div className="flex-between mb-6">
        <div>
          <h2>{isAdmin ? 'Quản Lý Thành Viên CTV' : 'Mạng Lưới Đối Tác'}</h2>
          <p className="text-muted mt-2">
            {isAdmin 
              ? 'Duyệt, quản lý và theo dõi toàn bộ Cộng Tác Viên trên hệ thống.' 
              : 'Theo dõi đội nhóm đối tác trực tiếp (F1) do bạn giới thiệu.'}
          </p>
        </div>
      </div>

      {refLink && (
        <div className="cf-card mb-6" style={{display: 'flex', alignItems: 'center', gap: '16px', background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.2)'}}>
          <Share2 size={20} style={{color: '#3B82F6', flexShrink: 0}} />
          <div style={{flex: 1, minWidth: 0}}>
            <div className="text-sm font-bold" style={{color: '#3B82F6', marginBottom: 4}}>Link Giới Thiệu Của Bạn</div>
            <div className="text-sm text-muted" style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontFamily: 'monospace'}}>{refLink}</div>
          </div>
          <button className="cf-btn-primary" onClick={handleCopyRefLink} style={{flexShrink: 0, display: 'flex', alignItems: 'center', gap: '6px'}}>
            <Copy size={14} /> Sao chép
          </button>
        </div>
      )}

      <div style={{display: 'grid', gridTemplateColumns: isAdmin ? '1fr 1fr 1fr' : '1fr 1fr', gap: '20px', marginBottom: '24px'}}>
        <div className="cf-card" style={{borderTop: '4px solid #3B82F6'}}>
          <h3 className="text-muted text-sm font-bold uppercase mb-2" style={{display:'flex',alignItems:'center',gap:'8px'}}>
            <Users size={16}/> {isAdmin ? 'Tổng CTV' : 'Đối Tác Trực Tiếp (F1)'}
          </h3>
          <div className="font-bold" style={{fontSize:'32px'}}>{loading ? <Skeleton width="60px" height="36px" /> : stats.f1Count}</div>
          <p className="text-muted text-sm mt-1">{isAdmin ? 'Trên toàn hệ thống' : 'Người do bạn giới thiệu'}</p>
        </div>
        {isAdmin && (
          <div className="cf-card" style={{borderTop: '4px solid #F59E0B'}}>
            <h3 className="text-muted text-sm font-bold uppercase mb-2" style={{display:'flex',alignItems:'center',gap:'8px'}}>
              <Clock size={16}/> Chờ Duyệt
            </h3>
            <div className="font-bold" style={{fontSize:'32px', color: '#D97706'}}>{loading ? <Skeleton width="60px" height="36px" /> : stats.pendingCount}</div>
            <p className="text-muted text-sm mt-1">CTV đang chờ bạn phê duyệt</p>
          </div>
        )}
        <div className="cf-card" style={{borderTop: '4px solid #10B981'}}>
          <h3 className="text-muted text-sm font-bold uppercase mb-2" style={{display:'flex',alignItems:'center',gap:'8px'}}>
            <DollarSign size={16}/> Thu Nhập Từ {isAdmin ? 'CTV' : 'F1'}
          </h3>
          <div className="font-bold" style={{fontSize:'32px',color:'#059669'}}>{loading ? <Skeleton width="160px" height="36px" /> : formatCurrency(stats.totalRevenue)}</div>
          <p className="text-muted text-sm mt-1">Tổng doanh số đội nhóm</p>
        </div>
      </div>

      <div className="cf-card" style={{padding: 0}}>
        <div style={{padding: '16px 24px', borderBottom: '1px solid var(--cf-border)'}}>
          <h3 className="font-bold">{isAdmin ? 'Tất Cả Cộng Tác Viên' : 'Danh Sách Đối Tác F1'}</h3>
        </div>
        <div className="table-responsive">
          <table className="cf-table">
            <thead>
              <tr>
                <th>Tên Đối Tác</th>
                <th>Hạng</th>
                <th>Ngày Tham Gia</th>
                <th>Trạng Thái</th>
                <th style={{textAlign: 'right'}}>Doanh Số</th>
                {isAdmin && <th style={{textAlign: 'center'}}>Thao Tác</th>}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i}>
                    <td><Skeleton width="120px" height="20px" /></td>
                    <td><Skeleton width="80px" height="20px" /></td>
                    <td><Skeleton width="100px" height="20px" /></td>
                    <td><Skeleton width="100px" height="24px" style={{borderRadius: 12}} /></td>
                    <td style={{textAlign: 'right'}}><Skeleton width="120px" height="20px" style={{marginLeft: 'auto'}} /></td>
                    {isAdmin && <td><Skeleton width="80px" height="30px" /></td>}
                  </tr>
                ))
              ) : downlines.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin ? 6 : 5} style={{textAlign: 'center', padding: '48px 20px', color: '#6B7280'}}>
                    <UserPlus size={36} strokeWidth={1.5} style={{marginBottom: 12, opacity: 0.4}} /><br />
                    {isAdmin ? 'Chưa có CTV nào đăng ký trên hệ thống.' : 'Chưa có đối tác nào. Chia sẻ link giới thiệu phía trên để xây dựng đội nhóm!'}
                  </td>
                </tr>
              ) : downlines.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className="font-bold">{user.full_name || 'Chưa cập nhật'}</div>
                    <div className="text-sm text-muted">{user.email}</div>
                  </td>
                  <td>
                    <span className="badge" style={{backgroundColor: 'rgba(59,130,246,0.1)', color: '#3B82F6'}}>
                      {(user.tier || 'starter').toUpperCase()}
                    </span>
                  </td>
                  <td>{formatDate(user.created_at)}</td>
                  <td>{getStatusBadge(user.approval_status)}</td>
                  <td style={{textAlign: 'right'}} className="font-bold">{formatCurrency(user.total_earned)}</td>
                  {isAdmin && (
                    <td style={{textAlign: 'center'}}>
                      {user.approval_status === 'pending' ? (
                        <button 
                          onClick={() => handleApproval(user.id, 'active')}
                          style={{background: '#059669', color: 'white', border: 'none', padding: '6px 14px', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4}}
                        >
                          <CheckCircle size={14}/> Duyệt
                        </button>
                      ) : user.approval_status === 'active' ? (
                        <button 
                          onClick={() => handleApproval(user.id, 'rejected')}
                          style={{background: '#FEE2E2', color: '#991B1B', border: 'none', padding: '6px 14px', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4}}
                        >
                          <XCircle size={14}/> Khóa
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleApproval(user.id, 'active')}
                          style={{background: '#E0E7FF', color: '#4338CA', border: 'none', padding: '6px 14px', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4}}
                        >
                          <CheckCircle size={14}/> Mở khóa
                        </button>
                      )}
                    </td>
                  )}
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
