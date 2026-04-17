import React, { useState, useEffect } from 'react';
import { Settings2, Plus, Edit, X, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useToast } from '../../components/common/Toast';
import Skeleton from '../../components/common/Skeleton';
import { FUNNEL_COURSES } from '../funnels/config';

// Danh sách khóa học để chọn trong dropdown
const COURSE_OPTIONS = Object.values(FUNNEL_COURSES).map(c => ({ id: c.id, name: c.name }));

const overlayStyle = {
  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999,
  display: 'flex', alignItems: 'center', justifyContent: 'center'
};
const modalStyle = {
  background: 'white', borderRadius: '12px', width: '480px', padding: '24px',
  boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'
};

const AdminCommissionPlans = () => {
  const addToast = useToast();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: '', type: 'default', rate_percent: '', rate_fixed: '', applied_scope: 'Tất cả Đại lý', applied_to: [] });

  const fetchPlans = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('commission_plans')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      addToast('Không thể tải danh sách chính sách', 'error');
    } else {
      setPlans(data || []);
    }
    setLoading(false);
  };

  useEffect(() => { fetchPlans(); }, []);

  const getTypeLabel = (type) => {
    switch (type) {
      case 'default': return 'Mặc định';
      case 'product': return 'Ghi đè Sản phẩm';
      case 'user_override': return 'Ghi đè Cộng tác viên';
      default: return type;
    }
  };

  const getRateDisplay = (plan) => {
    if (plan.rate_fixed && Number(plan.rate_fixed) > 0) {
      return `${Number(plan.rate_fixed).toLocaleString('vi-VN')} (Cố định)`;
    }
    return `${plan.rate_percent || 0}%`;
  };

  const openAdd = () => {
    setModalMode('add');
    setForm({ name: '', type: 'default', rate_percent: '', rate_fixed: '', applied_scope: 'Tất cả Đại lý', applied_to: [] });
    setIsModalOpen(true);
  };

  const openEdit = (plan) => {
    setModalMode('edit');
    setEditingId(plan.id);
    setForm({
      name: plan.name,
      type: plan.type,
      rate_percent: plan.rate_percent || '',
      rate_fixed: plan.rate_fixed || '',
      applied_scope: plan.applied_scope || 'Tất cả Đại lý',
      applied_to: plan.applied_to || []
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    // Xây dựng applied_scope & applied_to dựa trên type
    let appliedScope = form.applied_scope;
    let appliedTo = form.applied_to || [];

    if (form.type === 'product' && appliedTo.length > 0) {
      // Tự động lấy tên khóa học từ ID để hiển thị dễ xem
      const courseNames = appliedTo.map(id => {
        const course = FUNNEL_COURSES[id];
        return course ? course.name : id;
      });
      appliedScope = courseNames.join(', ');
    } else if (form.type === 'default') {
      appliedScope = 'Tất cả Đại lý';
      appliedTo = [];
    }

    const payload = {
      name: form.name,
      type: form.type,
      rate_percent: form.rate_percent ? Number(form.rate_percent) : null,
      rate_fixed: form.rate_fixed ? Number(form.rate_fixed) : null,
      applied_scope: appliedScope,
      applied_to: appliedTo,
    };

    if (modalMode === 'add') {
      const { error } = await supabase.from('commission_plans').insert(payload);
      if (error) {
        addToast('Lỗi khi tạo chính sách: ' + error.message, 'error');
      } else {
        addToast('Đã tạo chính sách hoa hồng mới!', 'success');
      }
    } else {
      const { error } = await supabase.from('commission_plans').update(payload).eq('id', editingId);
      if (error) {
        addToast('Lỗi khi cập nhật: ' + error.message, 'error');
      } else {
        addToast('Đã cập nhật chính sách!', 'success');
      }
    }

    setSubmitting(false);
    setIsModalOpen(false);
    fetchPlans();
  };

  return (
    <div className="admin-page-wrapper">
      <div className="flex-between mb-6">
        <div>
          <h2>Chính Sách Hoa Hồng</h2>
          <p className="text-muted mt-2">Cấu hình mức hoa hồng mặc định, các chế độ ghi đè cho từng cá nhân, và mức % theo từng sản phẩm.</p>
        </div>
        <button className="cf-btn-primary flex-align-center" style={{gap: '10px', padding: '10px 20px'}} onClick={openAdd}>
          <Plus size={18} /> Thêm Mức Mới
        </button>
      </div>

      <div className="cf-card mb-6" style={{background: 'var(--cf-bg-canvas)', borderLeft: '4px solid var(--cf-primary)'}}>
        <h4 className="font-bold flex-align-center" style={{display:'flex', gap:'8px'}}>
          <Settings2 size={18} className="text-primary"/> Quy Tắc Ưu Tiên Áp Dụng
        </h4>
        <p className="text-sm mt-2 text-muted" style={{lineHeight: 1.6}}>
          Khi tính toán hoa hồng, hệ thống sẽ kiểm tra theo thứ tự ưu tiên sau:<br/>
          <strong>1. Ghi đè Sản phẩm/Đại lý:</strong> Mức ưu tiên cao nhất. Mức riêng biệt khi một đại lý cụ thể bán một sản phẩm cụ thể.<br/>
          <strong>2. Ghi đè Đại lý:</strong> VD: Đối tác VIP sẽ luôn nhận mức sàn 50% cho mọi sản phẩm.<br/>
          <strong>3. Ghi đè Sản phẩm:</strong> VD: Một sản phẩm phễu mồi (front-end) đặc biệt trả 100% cho mọi đại lý bán được.<br/>
          <strong>4. Mức Tiêu Chuẩn Toàn Hệ Thống:</strong> Mức hoa hồng cơ bản (VD: 30%) sẽ được áp dụng nếu không có quy tắc ghi đè nào khớp.
        </p>
      </div>

      <div className="cf-card p-0">
        <div className="table-responsive">
          <table className="cf-table">
            <thead>
              <tr>
                <th>Tên Chính Sách</th>
                <th>Phân Loại</th>
                <th>Tỷ Lệ Hoa Hồng</th>
                <th>Phạm Vi Áp Dụng</th>
                <th style={{textAlign: 'right'}}>Hành Động</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i}>
                    <td><Skeleton width="150px" height="20px" /></td>
                    <td><Skeleton width="120px" height="24px" style={{borderRadius: 12}} /></td>
                    <td><Skeleton width="80px" height="20px" /></td>
                    <td><Skeleton width="120px" height="20px" /></td>
                    <td style={{textAlign: 'right'}}><Skeleton width="40px" height="28px" style={{marginLeft: 'auto'}} /></td>
                  </tr>
                ))
              ) : plans.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{textAlign: 'center', padding: '32px', color: '#9CA3AF'}}>
                    Chưa có chính sách nào. Nhấn "Thêm Mức Mới" để bắt đầu.
                  </td>
                </tr>
              ) : plans.map((plan) => (
                <tr key={plan.id}>
                  <td className="font-bold">{plan.name}</td>
                  <td>
                    <span className={`badge ${plan.type === 'product' ? 'badge-cleared' : (plan.type === 'default' ? 'badge-padding' : 'badge-paid')}`}>
                      {getTypeLabel(plan.type)}
                    </span>
                  </td>
                  <td className="font-bold text-success">{getRateDisplay(plan)}</td>
                  <td className="text-muted">{plan.applied_scope || 'Tất cả'}</td>
                  <td style={{textAlign: 'right'}}>
                    <button className="cf-btn-outline" style={{padding: '4px 8px', fontSize: '13px'}} onClick={() => openEdit(plan)} title="Chỉnh sửa">
                      <Edit size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div style={overlayStyle}>
          <div style={modalStyle}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px'}}>
              <h3 style={{margin: 0, fontSize: '18px', fontWeight: 700}}>
                {modalMode === 'add' ? 'Thêm Chính Sách Hoa Hồng' : 'Chỉnh Sửa Chính Sách'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} style={{background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280', padding: '4px', display: 'flex', alignItems: 'center'}}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
              <div>
                <label style={{display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px'}}>Tên chính sách</label>
                <input required type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                  style={{width: '100%', padding: '10px 12px', border: '1px solid #E5E7EB', borderRadius: '8px', outline: 'none'}}
                  placeholder="VD: VIP Gold Tier" />
              </div>
              <div>
                <label style={{display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px'}}>Phân loại</label>
                <select value={form.type} onChange={e => setForm({...form, type: e.target.value})}
                  style={{width: '100%', padding: '10px 12px', border: '1px solid #E5E7EB', borderRadius: '8px', outline: 'none'}}>
                  <option value="default">Mặc định</option>
                  <option value="user_override">Ghi đè Cộng tác viên</option>
                  <option value="product">Ghi đè Sản phẩm</option>
                </select>
              </div>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px'}}>
                <div>
                  <label style={{display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px'}}>Tỷ lệ % (Phần trăm)</label>
                  <input type="number" step="0.1" min="0" max="100" value={form.rate_percent} onChange={e => setForm({...form, rate_percent: e.target.value})}
                    style={{width: '100%', padding: '10px 12px', border: '1px solid #E5E7EB', borderRadius: '8px', outline: 'none'}}
                    placeholder="VD: 30" />
                </div>
                <div>
                  <label style={{display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px'}}>Số tiền cố định</label>
                  <input type="number" min="0" value={form.rate_fixed} onChange={e => setForm({...form, rate_fixed: e.target.value})}
                    style={{width: '100%', padding: '10px 12px', border: '1px solid #E5E7EB', borderRadius: '8px', outline: 'none'}}
                    placeholder="VD: 5000000" />
                </div>
              </div>
              <div>
                <label style={{display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px'}}>
                  {form.type === 'product' ? 'Chọn Khóa Học áp dụng' : 'Phạm vi áp dụng'}
                </label>
                {form.type === 'product' ? (
                  <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
                    {COURSE_OPTIONS.map(course => (
                      <label key={course.id} style={{display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', border: '1px solid #E5E7EB', borderRadius: '8px', cursor: 'pointer', background: (form.applied_to || []).includes(course.id) ? '#EEF2FF' : 'white'}}>
                        <input
                          type="checkbox"
                          checked={(form.applied_to || []).includes(course.id)}
                          onChange={(e) => {
                            const current = form.applied_to || [];
                            if (e.target.checked) {
                              setForm({...form, applied_to: [...current, course.id]});
                            } else {
                              setForm({...form, applied_to: current.filter(id => id !== course.id)});
                            }
                          }}
                          style={{accentColor: '#4F46E5'}}
                        />
                        <span style={{fontSize: '14px'}}>{course.name}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <input required type="text" value={form.applied_scope} onChange={e => setForm({...form, applied_scope: e.target.value})}
                    style={{width: '100%', padding: '10px 12px', border: '1px solid #E5E7EB', borderRadius: '8px', outline: 'none'}}
                    placeholder="VD: Tất cả Đại lý" />
                )}
              </div>

              <div style={{marginTop: '16px', display: 'flex', justifyContent: 'flex-end', gap: '12px'}}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{padding: '10px 16px', background: '#F3F4F6', color: '#4B5563', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600}}>
                  Hủy Bỏ
                </button>
                <button type="submit" className="cf-btn-primary" style={{padding: '10px 24px', border: 'none', borderRadius: '8px', cursor: 'pointer'}} disabled={submitting}>
                  {submitting ? <Loader2 size={16} className="spin" /> : (modalMode === 'add' ? 'Tạo Chính Sách' : 'Lưu Thay Đổi')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCommissionPlans;
