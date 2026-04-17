import React, { useState } from 'react';
import { Shield, Plus, Edit2, Lock, Unlock, Mail, ShieldAlert, X } from 'lucide-react';

const initialStaff = [
  { id: 'STF-001', name: 'Quản Trị Viên', email: 'admin@clickfunnels.vn', role: 'Super Admin', status: 'Hoạt động', lastLogin: 'Vừa xong' },
  { id: 'STF-002', name: 'Trần Kế Toán', email: 'ketoan@clickfunnels.vn', role: 'Kế Toán', status: 'Hoạt động', lastLogin: '2 giờ trước' },
  { id: 'STF-003', name: 'Lê Nội Dung', email: 'content@clickfunnels.vn', role: 'Biên Tập Viên', status: 'Hoạt động', lastLogin: '1 ngày trước' },
  { id: 'STF-004', name: 'Phạm Hỗ Trợ', email: 'support@clickfunnels.vn', role: 'CSKH', status: 'Tạm khóa', lastLogin: '1 tháng trước' },
];

const StaffManagement = () => {
  const [staffList, setStaffList] = useState(initialStaff);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  
  // Form states
  const [editingId, setEditingId] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', role: 'Biên Tập Viên', status: 'Hoạt động' });

  const getRoleBadge = (role) => {
    switch (role) {
      case 'Super Admin':
        return <span className="badge" style={{background: '#EF4444', color: 'white'}}>Quyền cao nhất</span>;
      case 'Kế Toán':
        return <span className="badge" style={{background: '#10B981', color: 'white'}}>Kế Toán</span>;
      case 'Biên Tập Viên':
        return <span className="badge" style={{background: '#F59E0B', color: 'white'}}>Nội Dung</span>;
      case 'CSKH':
        return <span className="badge" style={{background: '#3B82F6', color: 'white'}}>Hỗ Trợ</span>;
      default:
        return <span className="badge badge-pending">{role}</span>;
    }
  };

  const openAddModal = () => {
    setModalMode('add');
    setFormData({ name: '', email: '', role: 'Biên Tập Viên', status: 'Hoạt động' });
    setIsModalOpen(true);
  };

  const openEditModal = (staff) => {
    setModalMode('edit');
    setEditingId(staff.id);
    setFormData({ name: staff.name, email: staff.email, role: staff.role, status: staff.status });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (modalMode === 'add') {
      const newStaff = {
        id: `STF-00${staffList.length + 1}`,
        name: formData.name,
        email: formData.email,
        role: formData.role,
        status: formData.status,
        lastLogin: 'Chưa đăng nhập'
      };
      setStaffList([newStaff, ...staffList]);
    } else {
      setStaffList(staffList.map(s => 
        s.id === editingId ? { ...s, name: formData.name, email: formData.email, role: formData.role, status: formData.status } : s
      ));
    }
    closeModal();
  };

  const toggleStatus = (id) => {
    setStaffList(staffList.map(s => 
      s.id === id ? { ...s, status: s.status === 'Hoạt động' ? 'Tạm khóa' : 'Hoạt động' } : s
    ));
  };

  // Inline CSS for the Modal overlay
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
          <div className="font-bold text-3xl">{staffList.length} Người</div>
        </div>
        <div className="cf-card" style={{borderTop: '4px solid #EF4444'}}>
          <h3 className="text-muted text-sm font-bold uppercase mb-2">Quyền Super Admin</h3>
          <div className="font-bold text-3xl">{staffList.filter(s => s.role === 'Super Admin').length} Người</div>
        </div>
        <div className="cf-card" style={{borderTop: '4px solid #F59E0B'}}>
          <h3 className="text-muted text-sm font-bold uppercase mb-2">Đang Bị Khóa</h3>
          <div className="font-bold text-3xl">{staffList.filter(s => s.status === 'Tạm khóa').length} Người</div>
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
              {staffList.map((staff, i) => (
                <tr key={i}>
                  <td>
                    <div className="font-bold">{staff.name}</div>
                    <div className="text-sm text-muted flex-align-center" style={{gap: '4px', marginTop: '4px'}}>
                      <Mail size={12}/> {staff.email}
                    </div>
                  </td>
                  <td>{getRoleBadge(staff.role)}</td>
                  <td>
                    {staff.status === 'Hoạt động' ? (
                      <span className="badge badge-cleared"><Unlock size={12} style={{marginRight: '4px', display:'inline'}}/>Đang mở</span>
                    ) : (
                      <span className="badge badge-pending"><Lock size={12} style={{marginRight: '4px', display:'inline'}}/>Đã khóa</span>
                    )}
                  </td>
                  <td className="text-muted text-sm">{staff.lastLogin}</td>
                  <td style={{textAlign: 'right'}}>
                    <div className="flex-align-center" style={{justifyContent: 'flex-end', gap: '8px'}}>
                      <button className="cf-btn-outline" style={{padding: '4px 8px', fontSize: '13px'}} title="Chỉnh sửa quyền" onClick={() => openEditModal(staff)}>
                        <Edit2 size={14} />
                      </button>
                      <button 
                        className="cf-btn-outline" 
                        style={{padding: '4px 8px', fontSize: '13px', color: staff.status === 'Hoạt động' ? '#EF4444' : '#10B981', borderColor: staff.status === 'Hoạt động' ? '#EF4444' : '#10B981'}} 
                        title={staff.status === 'Hoạt động' ? 'Khóa tài khoản' : 'Mở khóa'}
                        onClick={() => toggleStatus(staff.id)}
                      >
                        {staff.status === 'Hoạt động' ? <ShieldAlert size={14} /> : <Unlock size={14} />}
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
                {modalMode === 'add' ? 'Thêm Quản Trị Viên' : 'Chỉnh Sửa Quyền'}
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
                  style={{width: '100%', padding: '10px 12px', border: '1px solid #E5E7EB', borderRadius: '8px', outline: 'none'}}
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  placeholder="email@clickfunnels.vn"
                />
              </div>

              <div>
                <label style={{display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px'}}>Phân quyền (Role)</label>
                <select 
                  style={{width: '100%', padding: '10px 12px', border: '1px solid #E5E7EB', borderRadius: '8px', outline: 'none'}}
                  value={formData.role}
                  onChange={e => setFormData({...formData, role: e.target.value})}
                >
                  <option value="Super Admin">Super Admin (Quyền cao nhất)</option>
                  <option value="Kế Toán">Kế Toán (Quản lý rút tiền/phễu)</option>
                  <option value="Biên Tập Viên">Biên Tập Viên (Nội dung/Landing Page)</option>
                  <option value="CSKH">CSKH (Hỗ trợ đại lý)</option>
                </select>
              </div>

              <div style={{marginTop: '16px', display: 'flex', justifyContent: 'flex-end', gap: '12px'}}>
                <button type="button" onClick={closeModal} style={{padding: '10px 16px', background: '#F3F4F6', color: '#4B5563', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600}}>
                  Hủy Bỏ
                </button>
                <button type="submit" className="cf-btn-primary" style={{padding: '10px 24px', border: 'none', borderRadius: '8px', cursor: 'pointer'}}>
                  {modalMode === 'add' ? 'Tạo Tài Khoản' : 'Lưu Thay Đổi'}
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
