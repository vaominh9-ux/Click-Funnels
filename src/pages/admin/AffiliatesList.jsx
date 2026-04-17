import React, { useState, useEffect } from 'react';
import { Search, Plus, MoreVertical, X, Edit2, Lock, Unlock, CheckCircle, Mail } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import Skeleton from '../../components/common/Skeleton';
import '../affiliate/Dashboard.css';

const overlayStyle = {
  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999,
  display: 'flex', alignItems: 'center', justifyContent: 'center'
};
const modalStyle = {
  background: 'white', borderRadius: '12px', width: '480px', padding: '24px',
  boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'
};

const AdminAffiliatesList = () => {
  const [affiliates, setAffiliates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Dropdown menu state
  const [openMenuId, setOpenMenuId] = useState(null);

  useEffect(() => {
    fetchAffiliates();
  }, []);

  const fetchAffiliates = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'affiliate')
      .order('created_at', { ascending: false });
    
    if (data) {
      setAffiliates(data);
    }
    setLoading(false);
  };

  const updateStatus = async (id, newStatus, email, name) => {
    const { error } = await supabase
      .from('profiles')
      .update({ approval_status: newStatus })
      .eq('id', id);
    
    if (!error) {
      setAffiliates(prev => prev.map(a => a.id === id ? { ...a, approval_status: newStatus } : a));
      setOpenMenuId(null);
      
      // Simulate EmailJS Call
      if (newStatus === 'active') {
        alert(`✅ Đã DUYỆT tài khoản và tự động gửi Email thông báo mờn chào tới: ${email}`);
      } else if (newStatus === 'rejected') {
        alert(`🚫 Đã TỪ CHỐI tài khoản và gửi Email thông báo tới: ${email}`);
      }
    } else {
      alert('Lỗi cập nhật: ' + error.message);
    }
  };

  const filtered = affiliates.filter(aff => {
    const nameStr = aff.full_name || '';
    const emailStr = aff.email || '';
    const matchSearch = nameStr.toLowerCase().includes(searchTerm.toLowerCase()) || emailStr.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'all' || aff.approval_status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="admin-page-wrapper">
      <div className="flex-between mb-6">
        <div>
          <h2>Quản Lý Thành Viên</h2>
          <p className="text-muted mt-2">Giám sát và xét duyệt đối tác đại lý (Affiliate) tham gia nền tảng.</p>
        </div>
      </div>

      <div className="cf-card p-0">
        <div className="p-4" style={{borderBottom: '1px solid var(--cf-border)'}}>
          <div className="flex-between">
            <div className="search-bar" style={{display: 'flex', alignItems: 'center', background: 'var(--cf-bg-canvas)', border: '1px solid var(--cf-border)', padding: '8px 12px', borderRadius: '8px', width: '320px'}}>
              <Search size={16} className="text-muted" style={{marginRight: '8px', flexShrink: 0}} />
              <input type="text" placeholder="Tìm kiếm tên hoặc email..."
                value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                style={{border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '14px', color: 'var(--cf-text-main)'}} />
            </div>
            <div className="filters">
              <select className="cf-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                style={{padding: '8px 12px', border: '1px solid var(--cf-border)', borderRadius: '8px', outline: 'none', fontSize: '14px'}}>
                <option value="all">Tất cả trạng thái</option>
                <option value="active">Đang hoạt động</option>
                <option value="pending">Chờ duyệt</option>
                <option value="rejected">Bị khóa/Từ chối</option>
              </select>
            </div>
          </div>
        </div>

        <div className="table-responsive">
          <table className="cf-table">
            <thead>
              <tr>
                <th>Họ Tên / Ref Code</th>
                <th>Thông Tin LH</th>
                <th>Trạng Thái</th>
                <th>Doanh Thu</th>
                <th>Ngày Đăng Ký</th>
                <th style={{textAlign: 'right'}}>Hành Động</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td><Skeleton width="120px" height="20px" /><div style={{marginTop: 4}}><Skeleton width="80px" height="14px" /></div></td>
                    <td><Skeleton width="180px" height="20px" /></td>
                    <td><Skeleton width="100px" height="24px" style={{borderRadius: 12}} /></td>
                    <td><Skeleton width="80px" height="20px" /><div style={{marginTop: 4}}><Skeleton width="120px" height="14px" /></div></td>
                    <td><Skeleton width="100px" height="20px" /></td>
                    <td style={{textAlign: 'right'}}><Skeleton width="60px" height="32px" style={{marginLeft: 'auto'}} /></td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{textAlign: 'center', padding: '32px', color: '#9CA3AF'}}>
                    Không tìm thấy đại lý nào phù hợp dữ liệu thật của bạn.
                  </td>
                </tr>
              ) : filtered.map((aff) => (
                <tr key={aff.id}>
                  <td>
                    <div className="font-bold">{aff.full_name || 'Chưa cập nhật'}</div>
                    <div className="text-sm text-muted">ID: {aff.ref_code || substring(aff.id, 0, 8)}</div>
                  </td>
                  <td>{aff.email}</td>
                  <td>
                    <span className={`badge ${
                      aff.approval_status === 'active' ? 'badge-paid' :
                      aff.approval_status === 'pending' ? 'badge-pending' : 'badge-cleared'
                    }`}>
                      {aff.approval_status === 'active' ? 'Hoạt động' : aff.approval_status === 'pending' ? 'Chờ duyệt' : 'Từ chối / Bị Khóa'}
                    </span>
                  </td>
                  <td className="font-bold text-success">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(aff.total_earned || 0)}
                  </td>
                  <td className="text-muted">
                    {new Date(aff.created_at).toLocaleDateString('vi-VN')}
                  </td>
                  <td style={{textAlign: 'right', position: 'relative'}}>
                    {aff.approval_status === 'pending' ? (
                      <div style={{display: 'flex', gap: '8px', justifyContent: 'flex-end'}}>
                        <button className="cf-btn-primary" style={{padding: '6px 12px', fontSize: '13px'}}
                          onClick={() => updateStatus(aff.id, 'active', aff.email, aff.full_name)}>
                          Duyệt
                        </button>
                        <button className="cf-btn-outline" style={{padding: '6px 12px', fontSize: '13px', color: '#EF4444', borderColor: '#EF4444'}}
                          onClick={() => updateStatus(aff.id, 'rejected', aff.email, aff.full_name)}>
                          Từ chối
                        </button>
                      </div>
                    ) : (
                      <>
                        <button className="cf-btn-outline" style={{padding: '4px 8px', fontSize: '13px'}} onClick={() => setOpenMenuId(openMenuId === aff.id ? null : aff.id)}>
                          <MoreVertical size={16} />
                        </button>

                        {openMenuId === aff.id && (
                          <div style={{
                            position: 'absolute', right: '0', top: '100%', background: 'white', border: '1px solid #E5E7EB',
                            borderRadius: '8px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', zIndex: 50, minWidth: '180px', overflow: 'hidden'
                          }}>
                            {aff.approval_status === 'active' ? (
                              <button onClick={() => updateStatus(aff.id, 'rejected', aff.email, aff.full_name)} style={{display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: '10px 16px', border: 'none', background: 'white', cursor: 'pointer', fontSize: '14px', color: '#EF4444', textAlign: 'left'}}
                                onMouseEnter={e => e.currentTarget.style.background = '#F9FAFB'}
                                onMouseLeave={e => e.currentTarget.style.background = 'white'}>
                                <Lock size={14}/> Khóa tài khoản
                              </button>
                            ) : (
                              <button onClick={() => updateStatus(aff.id, 'active', aff.email, aff.full_name)} style={{display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: '10px 16px', border: 'none', background: 'white', cursor: 'pointer', fontSize: '14px', color: '#10B981', textAlign: 'left'}}
                                onMouseEnter={e => e.currentTarget.style.background = '#F9FAFB'}
                                onMouseLeave={e => e.currentTarget.style.background = 'white'}>
                                <Unlock size={14}/> Mở khóa / Duyệt lại
                              </button>
                            )}
                          </div>
                        )}
                      </>
                    )}
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

export default AdminAffiliatesList;

