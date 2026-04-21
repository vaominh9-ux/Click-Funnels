import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Link as LinkIcon, Copy, Loader2, X, Pause, Play } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useToast } from '../../components/common/Toast';
import Skeleton from '../../components/common/Skeleton';
import './CampaignManager.css';

export default function AdminCampaignManager() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State quản lý việc Thêm mới
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCampaignName, setNewCampaignName] = useState('');
  const [newCampaignUrl, setNewCampaignUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State quản lý Edit
  const [editingCampaignId, setEditingCampaignId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editUrl, setEditUrl] = useState('');

  // Lấy dữ liệu từ Supabase khi vừa vào trang
  useEffect(() => {
    const loadCampaigns = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Lỗi khi lấy dữ liệu Campaigns:', error);
        alert('Không thể kết nối đến cơ sở dữ liệu. Vui lòng thử lại!');
      } else {
        setCampaigns(data || []);
      }
      setLoading(false);
    };

    loadCampaigns();
  }, []);

  const handleAddCampaign = async (e) => {
    e.preventDefault();
    if (!newCampaignName || !newCampaignUrl) return;

    setIsSubmitting(true);
    const { data, error } = await supabase
      .from('campaigns')
      .insert([
        { 
          name: newCampaignName, 
          landing_page_url: newCampaignUrl,
          status: 'active'
        }
      ])
      .select();

    if (error) {
      console.error('Lỗi khi chèn dữ liệu:', error);
      alert('Đã xảy ra lỗi khi tạo dự án!');
    } else if (data) {
      // Chèn trực tiếp vào đầu mảng bằng state cho mượt
      setCampaigns([data[0], ...campaigns]);
      // Reset form
      setNewCampaignName('');
      setNewCampaignUrl('');
      setShowAddForm(false);
    }
    setIsSubmitting(false);
  };

  const toggleStatus = async (id, currentStatus) => {
    const nextStatus = currentStatus === 'active' ? 'inactive' : 'active';
    
    // Cập nhật UI ngay lập tức để tạo cảm giác mượt (Optimistic UI)
    setCampaigns(campaigns.map(c => 
      c.id === id ? { ...c, status: nextStatus } : c
    ));

    // Gọi lên Backend
    const { error } = await supabase
      .from('campaigns')
      .update({ status: nextStatus })
      .eq('id', id);

    if (error) {
      console.error('Lỗi khi cập nhật trạng thái:', error);
      // Nếu lỗi thì revert lại
      setCampaigns(campaigns.map(c => 
        c.id === id ? { ...c, status: currentStatus } : c
      ));
      alert('Cập nhật trạng thái thất bại!');
    }
  };

  const deleteCampaign = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn XÓA vĩnh viễn dự án này? Các link của đại lý sẽ bị ảnh hưởng.')) {
      return;
    }

    // Xóa từ UI
    const previousCampaigns = [...campaigns];
    setCampaigns(campaigns.filter(c => c.id !== id));

    // Xóa từ Database
    const { error } = await supabase
      .from('campaigns')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Lỗi khi xóa:', error);
      setCampaigns(previousCampaigns); // Hoàn tác
      alert('Xóa dự án thất bại! Lưu ý: Nếu dự án này đã có Đại lý lấy link để chạy, hệ thống sẽ không cho xóa để bảo vệ dữ liệu đo lường. Hãy chuyển trạng thái sang "Tạm Dừng".');
    }
  };

  const startEdit = (camp) => {
    setEditingCampaignId(camp.id);
    setEditName(camp.name);
    setEditUrl(camp.landing_page_url);
  };

  const saveEdit = async (id) => {
    const previousCampaigns = [...campaigns];
    setCampaigns(campaigns.map(c => c.id === id ? { ...c, name: editName, landing_page_url: editUrl } : c));
    setEditingCampaignId(null);
    
    const { error } = await supabase
      .from('campaigns')
      .update({ name: editName, landing_page_url: editUrl })
      .eq('id', id);

    if (error) {
      console.error('Lỗi khi cập nhật:', error);
      setCampaigns(previousCampaigns);
      alert('Cập nhật tên/link chiến dịch thất bại!');
    }
  };

  return (
    <div className="admin-campaign-container">
      <div className="campaign-header">
        <div>
          <h1>Quản Lý Nguồn Link</h1>
          <p>Cấu hình các Landing Page gốc để Affiliate lấy link đi quảng bá.</p>
        </div>
        <button 
          className="btn-primary" 
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? <X size={18} /> : <Plus size={18} />} 
          {showAddForm ? 'Hủy' : 'Thêm Landing Page Mới'}
        </button>
      </div>

      {showAddForm && (
        <form className="campaign-card" style={{ marginBottom: '24px', background: '#F8FAFC' }} onSubmit={handleAddCampaign}>
          <h3 style={{marginTop: 0, marginBottom: '16px', fontSize: '16px', color: '#1E293B'}}>Tạo mới Nguồn Link</h3>
          <div className="campaign-form-row">
            <div style={{flex: 1}}>
              <input 
                type="text" 
                placeholder="Tên Dự Án (VD: Sự kiện Offline Hà Nội)" 
                style={{width: '100%', padding: '10px 12px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '14px', outline: 'none'}}
                value={newCampaignName}
                onChange={(e) => setNewCampaignName(e.target.value)}
                required
              />
            </div>
            <div style={{flex: 2}}>
              <input 
                type="url" 
                placeholder="Link Landing Page Gốc (VD: https://domain.com/landing)" 
                style={{width: '100%', padding: '10px 12px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '14px', outline: 'none'}}
                value={newCampaignUrl}
                onChange={(e) => setNewCampaignUrl(e.target.value)}
                required
              />
              <div style={{ marginTop: '8px', display: 'flex', gap: '8px', fontSize: '12px', flexWrap: 'wrap' }}>
                <span style={{ color: '#64748B' }}>Điền nhanh nguồn nội bộ:</span>
                {[
                  { name: '3 Ngày Miễn Phí', path: '/khoa-hoc/3-ngay-mien-phi' },
                  { name: 'STARTER', path: '/khoa-hoc/khoa-hoc-1' },
                  { name: 'MASTER', path: '/khoa-hoc/khoa-hoc-2' },
                  { name: 'AI COACH', path: '/khoa-hoc/khoa-hoc-3' },
                  { name: 'AI PARTNER', path: '/khoa-hoc/khoa-hoc-4' },
                ].map((course, idx) => (
                  <button 
                    key={idx}
                    type="button" 
                    onClick={() => {
                      setNewCampaignName(course.name);
                      setNewCampaignUrl(`${window.location.hostname === 'localhost' ? 'http://localhost:5173' : window.location.origin}${course.path}`);
                    }}
                    style={{ background: 'none', border: 'none', color: '#3B82F6', cursor: 'pointer', padding: 0, textDecoration: 'underline' }}
                  >
                    {course.name}
                  </button>
                ))}
              </div>
            </div>
            <button 
              type="submit" 
              className="btn-primary" 
              style={{height: '42px', minWidth: '120px'}}
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : 'Lưu Dự Án'}
            </button>
          </div>
        </form>
      )}

      <div className="campaign-card">
        {loading ? (
          <div style={{ padding: '20px' }}>
            {Array.from({ length: 5 }).map((_, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '20px', marginBottom: '16px' }}>
                <Skeleton width="25%" height="40px" />
                <Skeleton width="45%" height="40px" />
                <Skeleton width="15%" height="40px" />
                <Skeleton width="15%" height="40px" />
              </div>
            ))}
          </div>
        ) : campaigns.length === 0 ? (
          <div style={{display: 'flex', justifyContent: 'center', padding: '40px', color: '#64748B'}}>
            Chưa có dự án nào được tạo. Nhấn "Thêm Landing Page" ở trên để bắt đầu!
          </div>
        ) : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{width: '25%'}}>TÊN DỰ ÁN / KHÓA HỌC</th>
                  <th style={{width: '45%'}}>LINK LANDING PAGE (BASE URL)</th>
                  <th style={{width: '15%'}}>TRẠNG THÁI</th>
                  <th style={{width: '15%', textAlign: 'right'}}>THAO TÁC</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((camp) => (
                  <tr key={camp.id}>
                    {editingCampaignId === camp.id ? (
                      <>
                        <td>
                          <input 
                            value={editName} 
                            onChange={e => setEditName(e.target.value)} 
                            style={{width:'100%', padding:'8px', border:'1px solid #CBD5E1', borderRadius:'4px', fontSize:'14px'}}
                          />
                        </td>
                        <td>
                          <input 
                            value={editUrl} 
                            onChange={e => setEditUrl(e.target.value)} 
                            style={{width:'100%', padding:'8px', border:'1px solid #CBD5E1', borderRadius:'4px', fontSize:'14px'}}
                          />
                        </td>
                        <td>
                          <span className={`status-badge ${camp.status}`}>
                            {camp.status === 'active' ? 'Đang Chạy' : 'Tạm Dừng'}
                          </span>
                        </td>
                        <td style={{textAlign: 'right'}}>
                          <div style={{display: 'flex', gap: '8px', justifyContent: 'flex-end'}}>
                            <button 
                              onClick={() => saveEdit(camp.id)}
                              style={{background:'#10B981', color:'white', border:'none', padding:'6px 12px', borderRadius:'4px', cursor:'pointer'}}
                            >
                              Lưu
                            </button>
                            <button 
                              onClick={() => setEditingCampaignId(null)}
                              style={{background:'#64748B', color:'white', border:'none', padding:'6px 12px', borderRadius:'4px', cursor:'pointer'}}
                            >
                              Hủy
                            </button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td>
                          <div className="campaign-name">{camp.name}</div>
                        </td>
                        <td>
                          <div className="campaign-url flex-align-center" style={{gap: '6px', fontSize: '13px', color: '#64748B', wordBreak: 'break-all'}}>
                            <LinkIcon size={14} style={{flexShrink: 0}} /> {camp.landing_page_url}
                          </div>
                        </td>
                        <td>
                          <span 
                            className={`status-badge ${camp.status}`}
                            style={{cursor: 'pointer'}}
                            onClick={() => toggleStatus(camp.id, camp.status)}
                          >
                            {camp.status === 'active' ? 'Đang Chạy' : 'Tạm Dừng'}
                          </span>
                        </td>
                        <td style={{textAlign: 'right'}}>
                          <div style={{display: 'flex', gap: '8px', justifyContent: 'flex-end'}}>
                            <button className="action-btn" title={camp.status === 'active' ? 'Tạm Dừng' : 'Kích Hoạt'} onClick={() => toggleStatus(camp.id, camp.status)}>
                              {camp.status === 'active' ? <Pause size={16} /> : <Play size={16} />}
                            </button>
                            <button className="action-btn" title="Chỉnh sửa" onClick={() => startEdit(camp)}>
                              <Edit2 size={16} />
                            </button>
                            <button className="action-btn delete" title="Xóa bỏ" onClick={() => deleteCampaign(camp.id)}>
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
