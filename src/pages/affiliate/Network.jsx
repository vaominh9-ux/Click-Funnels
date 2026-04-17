import React, { useState, useEffect } from 'react';
import { Users, DollarSign, UserPlus, Copy, Share2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useToast } from '../../components/common/Toast';
import Skeleton from '../../components/common/Skeleton';
import '../affiliate/Dashboard.css';

const AffiliateNetwork = () => {
  const [loading, setLoading] = useState(true);
  const [downlines, setDownlines] = useState([]);
  const [stats, setStats] = useState({ f1Count: 0, totalRevenue: 0 });
  const [refLink, setRefLink] = useState('');
  const addToast = useToast();

  useEffect(() => {
    let subscription = null;

    const initNetwork = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Lấy ref_code để hiển thị Link giới thiệu
      const { data: profile } = await supabase
        .from('profiles')
        .select('ref_code')
        .eq('id', user.id)
        .single();

      if (profile?.ref_code) {
        const domain = import.meta.env.VITE_TRACKING_DOMAIN || window.location.origin;
        setRefLink(`${domain}/auth/register?ref=${profile.ref_code}`);
      }

      await loadNetwork(user.id);

      subscription = supabase
        .channel('realtime_network')
        .on('postgres_changes', { 
          event: '*', schema: 'public', table: 'profiles' 
        }, () => loadNetwork(user.id))
        .subscribe();
    };

    initNetwork();
    return () => {
      if (subscription) supabase.removeChannel(subscription);
    };
  }, []);

  const loadNetwork = async (userId) => {
    setLoading(true);
    try {
      // Chỉ lấy F1 — Đối tác trực tiếp (1 cấp duy nhất)
      const { data: f1List, error } = await supabase
        .from('profiles')
        .select('id, full_name, email, created_at, approval_status, tier, total_earned')
        .eq('referred_by', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Lỗi lấy F1:', error);
        addToast('Không thể tải mạng lưới', 'error');
        setLoading(false);
        return;
      }

      setDownlines(f1List || []);

      const totalRevenue = (f1List || []).reduce((acc, p) => acc + (Number(p.total_earned) || 0), 0);
      setStats({
        f1Count: (f1List || []).length,
        totalRevenue
      });

    } catch (err) {
      console.error('Unexpected error:', err);
    }
    setLoading(false);
  };

  const formatCurrency = (num) => Number(num || 0).toLocaleString('vi-VN') + ' ₫';

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('vi-VN', { day: '2-digit', month: 'long', year: 'numeric' });
  };

  const handleCopyRefLink = () => {
    if (refLink) {
      navigator.clipboard.writeText(refLink);
      addToast('Đã sao chép link giới thiệu!', 'success');
    }
  };

  return (
    <div className="dashboard-wrapper">
      <div className="flex-between mb-6">
        <div>
          <h2>Mạng Lưới Đối Tác</h2>
          <p className="text-muted mt-2">Theo dõi đội nhóm đối tác trực tiếp (F1) do bạn giới thiệu.</p>
        </div>
      </div>

      {/* LINK GIỚI THIỆU */}
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

      {/* STATS — Chỉ 2 thẻ: Số F1 + Tổng doanh thu F1 */}
      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px'}}>
        <div className="cf-card" style={{borderTop: '4px solid #3B82F6'}}>
          <h3 className="text-muted text-sm font-bold uppercase mb-2" style={{display:'flex',alignItems:'center',gap:'8px'}}>
            <Users size={16}/> Đối Tác Trực Tiếp (F1)
          </h3>
          <div className="font-bold" style={{fontSize:'32px'}}>{loading ? <Skeleton width="60px" height="36px" /> : stats.f1Count}</div>
          <p className="text-muted text-sm mt-1">Người do bạn giới thiệu</p>
        </div>
        <div className="cf-card" style={{borderTop: '4px solid #10B981'}}>
          <h3 className="text-muted text-sm font-bold uppercase mb-2" style={{display:'flex',alignItems:'center',gap:'8px'}}>
            <DollarSign size={16}/> Thu Nhập Từ F1
          </h3>
          <div className="font-bold" style={{fontSize:'32px',color:'#059669'}}>{loading ? <Skeleton width="160px" height="36px" /> : formatCurrency(stats.totalRevenue)}</div>
          <p className="text-muted text-sm mt-1">Tổng doanh số đội nhóm</p>
        </div>
      </div>

      {/* BẢNG DANH SÁCH F1 */}
      <div className="cf-card" style={{padding: 0}}>
        <div style={{padding: '16px 24px', borderBottom: '1px solid var(--cf-border)'}}>
          <h3 className="font-bold">Danh Sách Đối Tác F1</h3>
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
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i}>
                    <td><Skeleton width="120px" height="20px" /></td>
                    <td><Skeleton width="80px" height="20px" /></td>
                    <td><Skeleton width="140px" height="20px" /></td>
                    <td><Skeleton width="100px" height="24px" style={{borderRadius: 12}} /></td>
                    <td style={{textAlign: 'right'}}><Skeleton width="120px" height="20px" style={{marginLeft: 'auto'}} /></td>
                  </tr>
                ))
              ) : downlines.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{textAlign: 'center', padding: '48px 20px', color: '#6B7280'}}>
                    <UserPlus size={36} strokeWidth={1.5} style={{marginBottom: 12, opacity: 0.4}} /><br />
                    Chưa có đối tác nào. Chia sẻ link giới thiệu phía trên để xây dựng đội nhóm!
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
                  <td>
                    <span className={`badge ${user.approval_status === 'active' ? 'badge-cleared' : 'badge-pending'}`}>
                      {user.approval_status === 'active' ? 'Hoạt động' : user.approval_status === 'pending' ? 'Chờ duyệt' : 'Bị khóa'}
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
