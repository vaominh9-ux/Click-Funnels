import React, { useState, useEffect } from 'react';
import { Shield, Plus, Edit2, Lock, Unlock, Mail, ShieldAlert, X, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useToast } from '../../components/common/Toast';
import Skeleton from '../../components/common/Skeleton';

const StaffManagement = () => {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const addToast = useToast();
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [saving, setSaving] = useState(false);
  
  // Form states
  const [editingId, setEditingId] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', role: 'staff', status: 'active' });

  useEffect(() => {
    loadStaff();
  }, []);

  const loadStaff = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .in('role', ['admin', 'staff'])
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Lỗi khi lấy danh sách nhân sự:', error);
      addToast('Không thể tải danh sách nhân sự', 'error');
    } else {
      setStaffList(data || []);
    }
    setLoading(false);
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin':
        return <span className="badge" style={{background: '#EF4444', color: 'white'}}>Super Admin</span>;
      case 'staff':
        return <span className="badge" style={{background: '#3B82F6', color: 'white'}}>Nhân viên</span>;
      default:
        return <span className="badge badge-pending">{role}</span>;
    }
  };

  const getStatusBadge = (status) => {
    if (status === 'active') {
      return <span className="badge badge-cleared"><Unlock size={12} style={{marginRight: '4px', display:'inline'}}/>Đang mở</span>;
    }
    return <span className="badge badge-pending"><Lock size={12} style={{marginRight: '4px', display:'inline'}}/>Đã khóa</span>;
  };

  const openAddModal = () => {
    setModalMode('add');
    setFormData({ name: '', email: '', role: 'staff', status: 'active' });
    setIsModalOpen(true);
  };

  const openEditModal = (staff) => {
    setModalMode('edit');
    setEditingId(staff.id);
    setFormData({ name: staff.full_name || '', email: staff.email, role: staff.role, status: staff.approval_status || 'active' });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    if (modalMode === 'add') {
      // Tạo user mới qua Supabase Auth (admin invite)
      // Note: Trong thực tế, cần Supabase Admin API hoặc Edge Function
      // Ở đây tạm update profile nếu đã tồn tại
      const { data: existing } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', formData.email)
        .single();

      if (existing) {
        const { error } = await supabase
          .from('profiles')
          .update({ 
            full_name: formData.name, 
            role: formData.role,
            approval_status: 'active',
            updated_at: new Date().toISOString()
          })
          .eq('id', existing.id);

        if (error) {
          console.error('Lỗi khi cập nhật:', error);
          addToast('Cập nhật thất bại!', 'error');
        } else {
          addToast('Đã cấp quyền nhân sự thành công', 'success');
          loadStaff();
        }
      } else {
        addToast('Email chưa có trong hệ thống. Người này cần đăng ký tài khoản trước.', 'warning');
      }
    } else {
      // Edit existing staff
      const { error } = await supabase
        .from('profiles')
        .update({ 
          full_name: formData.name,
          role: formData.role,
          approval_status: formData.status,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingId);

      if (error) {
        console.error('Lỗi khi cập nhật:', error);
        addToast('Cập nhật thất bại!', 'error');
      } else {
        addToast('Đã cập nhật quyền nhân sự', 'success');
        loadStaff();
      }
    }

    setSaving(false);
    closeModal();
  };

  const toggleStatus = async (staff) => {
    const newStatus = staff.approval_status === 'active' ? 'rejected' : 'active';
    
    // Optimistic update
    setStaffList(staffList.map(s => 
      s.id === staff.id ? { ...s, approval_status: newStatus } : s
    ));

    const { error } = await supabase
      .from('profiles')
      .update({ approval_status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', staff.id);

    if (error) {
      console.error('Lỗi khi cập nhật trạng thái:', error);
      // Revert
      setStaffList(staffList.map(s => 
        s.id === staff.id ? { ...s, approval_status: staff.approval_status } : s
      ));
      addToast('Cập nhật trạng thái thất bại!', 'error');
    } else {
      addToast(newStatus === 'active' ? 'Đã mở khóa tài khoản' : 'Đã khóa tài khoản', 'success');
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now - d;
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Vừa xong';
    if (diffMins < 60) return `${diffMins} phút trước`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} giờ trước`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 30) return `${diffDays} ngày trước`;
    return d.toLocaleDateString('vi-VN');
  };

  // Stats
  const totalStaff = staffList.length;
  const totalAdmin = staffList.filter(s => s.role === 'admin').length;
  const totalLocked = staffList.filter(s => s.approval_status !== 'active').length;

  const modalOverlayStyle = {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999,
    display: 'flex', alignItems: 'center', justifyContent: 'center'
  };

  const modalContentStyle = {
    background: 'white', borderRadius: '12px', width: '450px', padding: '24px',
    boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'
  };

  return (
    <div className="admin-page-wrapper">
      <div className="flex-between mb-6">
        <div>
          <h2>Quản Lý Nhân Sự & Phân Quyền</h2>
          <p className="text-muted mt-2">Quản lý đội ngũ vận hành hệ thống, cấp quyền truy cập theo vai trò.</p>
        </div>
        <button className="cf-btn-primary flex-align-center" style={{gap: '10px', padding: '10px 20px'}} onClick={openAddModal}>
          <Plus size={18} /> Thêm Quản Trị Mới
        </button>
      </div>

      <div className="stats-grid mb-6">
        <div className="cf-card" style={{borderTop: '4px solid #8B5CF6'}}>
          <h3 className="text-muted text-sm font-bold uppercase mb-2">Tổng Nhân Sự</h3>
          <div className="font-bold text-3xl">{loading ? <Skeleton width="80px" height="36px" /> : `${totalStaff} Người`}</div>
        </div>
        <div className="cf-card" style={{borderTop: '4px solid #EF4444'}}>
          <h3 className="text-muted text-sm font-bold uppercase mb-2">Quyền Super Admin</h3>
          <div className="font-bold text-3xl">{loading ? <Skeleton width="80px" height="36px" /> : `${totalAdmin} Người`}</div>
        </div>
        <div className="cf-card" style={{borderTop: '4px solid #F59E0B'}}>
          <h3 className="text-muted text-sm font-bold uppercase mb-2">Đang Bị Khóa</h3>
          <div className="font-bold text-3xl">{loading ? <Skeleton width="80px" height="36px" /> : `${totalLocked} Người`}</div>
        </div>
      </div>

      <div className="cf-card p-0">
        <div className="p-4 flex-between" style={{borderBottom: '1px solid var(--cf-border)'}}>
          <h3 className="font-bold flex-align-center" style={{gap: '8px'}}>
            <Shield size={18} className="text-primary"/> Danh Sách Phân Quyền
          </h3>
        </div>
        
        <div className="table-responsive">
          <table className="cf-table">
            <thead>
              <tr>
                <th>Họ Tên / Email</th>
                <th>Vai Trò (Role)</th>
                <th>Trạng Thái</th>
                <th>Cập Nhật Cuối</th>
                <th style={{textAlign: 'right'}}>Hành Động</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i}>
                    <td><Skeleton width="120px" height="20px" /><div style={{marginTop: 4}}><Skeleton width="180px" height="14px" /></div></td>
                    <td><Skeleton width="100px" height="24px" style={{borderRadius: 12}} /></td>
                    <td><Skeleton width="100px" height="24px" style={{borderRadius: 12}} /></td>
                    <td><Skeleton width="80px" height="14px" /></td>
                    <td style={{textAlign: 'right'}}><Skeleton width="60px" height="28px" style={{marginLeft: 'auto'}} /></td>
                  </tr>
                ))
              ) : staffList.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{textAlign: 'center', padding: '40px', color: '#6B7280'}}>
                    Chưa có nhân sự nào. Nhấn "Thêm Quản Trị Mới" để bắt đầu.
                  </td>
                </tr>
              ) : staffList.map((staff) => (
                <tr key={staff.id}>
                  <td>
                    <div className="font-bold">{staff.full_name || 'Chưa cập nhật'}</div>
                    <div className="text-sm text-muted flex-align-center" style={{gap: '4px', marginTop: '4px'}}>
                      <Mail size={12}/> {staff.email}
                    </div>
                  </td>
                  <td>{getRoleBadge(staff.role)}</td>
                  <td>{getStatusBadge(staff.approval_status)}</td>
                  <td className="text-muted text-sm">{formatDate(staff.updated_at)}</td>
                  <td style={{textAlign: 'right'}}>
                    <div className="flex-align-center" style={{justifyContent: 'flex-end', gap: '8px'}}>
                      <button className="cf-btn-outline" style={{padding: '4px 8px', fontSize: '13px'}} title="Chỉnh sửa quyền" onClick={() => openEditModal(staff)}>
                        <Edit2 size={14} />
                      </button>
                      <button 
                        className="cf-btn-outline" 
                        style={{padding: '4px 8px', fontSize: '13px', color: staff.approval_status === 'active' ? '#EF4444' : '#10B981', borderColor: staff.approval_status === 'active' ? '#EF4444' : '#10B981'}} 
                        title={staff.approval_status === 'active' ? 'Khóa tài khoản' : 'Mở khóa'}
                        onClick={() => toggleStatus(staff)}
                      >
                        {staff.approval_status === 'active' ? <ShieldAlert size={14} /> : <Unlock size={14} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL THÊM / SỬA */}
      {isModalOpen && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px'}}>
              <h3 style={{margin: 0, fontSize: '18px', fontWeight: 700}}>
                {modalMode === 'add' ? 'Thêm / Cấp Quyền Quản Trị' : 'Chỉnh Sửa Quyền'}
              </h3>
              <button onClick={closeModal} style={{background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280', padding: '4px', display: 'flex', alignItems: 'center'}}>
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
              <div>
                <label style={{display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px'}}>Họ và Tên</label>
                <input 
                  type="text" 
                  required
                  style={{width: '100%', padding: '10px 12px', border: '1px solid #E5E7EB', borderRadius: '8px', outline: 'none'}}
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  placeholder="Nhập tên nhân sự..."
                />
              </div>

              <div>
                <label style={{display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px'}}>Email đăng nhập</label>
                <input 
                  type="email" 
                  required
                  disabled={modalMode === 'edit'}
                  style={{width: '100%', padding: '10px 12px', border: '1px solid #E5E7EB', borderRadius: '8px', outline: 'none', opacity: modalMode === 'edit' ? 0.6 : 1}}
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  placeholder="email@clickfunnels.vn"
                />
                {modalMode === 'add' && (
                  <span style={{fontSize: '12px', color: '#9CA3AF', marginTop: '4px', display: 'block'}}>
                    Người này phải đã đăng ký tài khoản trên hệ thống trước.
                  </span>
                )}
              </div>

              <div>
                <label style={{display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px'}}>Phân quyền (Role)</label>
                <select 
                  style={{width: '100%', padding: '10px 12px', border: '1px solid #E5E7EB', borderRadius: '8px', outline: 'none'}}
                  value={formData.role}
                  onChange={e => setFormData({...formData, role: e.target.value})}
                >
                  <option value="admin">Admin (Quyền cao nhất)</option>
                  <option value="staff">Staff (Nhân viên hỗ trợ)</option>
                </select>
              </div>

              <div style={{marginTop: '16px', display: 'flex', justifyContent: 'flex-end', gap: '12px'}}>
                <button type="button" onClick={closeModal} style={{padding: '10px 16px', background: '#F3F4F6', color: '#4B5563', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600}}>
                  Hủy Bỏ
                </button>
                <button type="submit" className="cf-btn-primary" disabled={saving} style={{padding: '10px 24px', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px'}}>
                  {saving ? <Loader2 size={16} className="animate-spin" /> : null}
                  {modalMode === 'add' ? 'Cấp Quyền' : 'Lưu Thay Đổi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffManagement;
