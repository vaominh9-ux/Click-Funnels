import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Link as LinkIcon, RefreshCw } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import './ReplayManager.css';

const COURSES = [
  { id: 'free-3day', name: '3 Ngày Thực Chiến AI — MIỄN PHÍ' },
  { id: 'khoa-hoc-1', name: 'Khởi Sự 0 Đồng Với AI' },
  { id: 'khoa-hoc-2', name: 'Automation, Ads & Xây Hệ Thống' },
  { id: 'khoa-hoc-3', name: 'AI Coach / AI Trainer' },
  { id: 'khoa-hoc-4', name: 'Đỉnh Kim Tự Tháp (Partner)' },
];

const INITIAL_FORM = {
  title: '',
  youtube_url: '',
  course_id: COURSES[0].id,
  topic: '',
  description: '',
  duration: '',
  sort_order: 0,
  is_published: true
};

const ReplayManager = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(COURSES[0].id);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [editingId, setEditingId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchVideos();
  }, [selectedCourse]);

  const fetchVideos = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('replay_videos')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false });
        
      if (selectedCourse !== 'all') {
        query = query.eq('course_id', selectedCourse);
      }

      const { data, error } = await query;
      
      if (error) {
        if (error.code === '42P01') {
          console.log('Table replay_videos does not exist yet. Please run SQL migration.');
        } else {
          console.error('Error fetching videos:', error);
        }
        setVideos([]);
      } else {
        setVideos(data || []);
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setVideos([]);
    }
    setLoading(false);
  };

  const handleOpenModal = (video = null) => {
    if (video) {
      setFormData(video);
      setEditingId(video.id);
    } else {
      setFormData({ ...INITIAL_FORM, course_id: selectedCourse !== 'all' ? selectedCourse : COURSES[0].id });
      setEditingId(null);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData(INITIAL_FORM);
    setEditingId(null);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      if (editingId) {
        const { error } = await supabase
          .from('replay_videos')
          .update(formData)
          .eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('replay_videos')
          .insert([formData]);
        if (error) throw error;
      }
      
      await fetchVideos();
      handleCloseModal();
    } catch (err) {
      alert('Lỗi lưu Video: ' + err.message);
    }
    setIsSaving(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa video này? (Hành động này không thể hoàn tác)')) return;
    
    try {
      const { error } = await supabase
        .from('replay_videos')
        .delete()
        .eq('id', id);
      if (error) throw error;
      await fetchVideos();
    } catch (err) {
      alert('Lỗi xóa video: ' + err.message);
    }
  };

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  return (
    <div className="rm-container">
      <div className="rm-header">
        <div>
          <h1>Quản Lý Video Phân Hệ Replay</h1>
          <p>Tải lên video bài học (YouTube Unlisted) và quản lý tiến trình cho học viên.</p>
        </div>
        <button className="cf-btn-primary flex-align-center" style={{gap: 8}} onClick={() => handleOpenModal()}>
          <Plus size={16} /> Thêm Video Mới
        </button>
      </div>

      <div className="rm-filters">
        <div className="rm-filter-group">
          <label>Lọc theo khóa học:</label>
          <select 
            className="rm-select"
            value={selectedCourse} 
            onChange={(e) => setSelectedCourse(e.target.value)}
          >
            <option value="all">-- Tất cả khóa học --</option>
            {COURSES.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        
        <div className="rm-filter-group" style={{justifyContent: 'flex-end'}}>
          <button className="cf-btn-outline flex-align-center" style={{gap: 6, padding: '10px 16px'}} onClick={fetchVideos}>
            <RefreshCw size={16} /> Làm mới
          </button>
        </div>
      </div>

      <div className="rm-table-card">
        {loading ? (
          <div style={{padding: 40, textAlign: 'center', color: '#6b7280'}}>Đang tải dữ liệu...</div>
        ) : videos.length === 0 ? (
           <div style={{padding: 60, textAlign: 'center'}}>
             <div style={{fontSize: 48, marginBottom: 16}}>📭</div>
             <h3 style={{fontSize: 18, fontWeight: 600, margin: '0 0 8px 0'}}>Chưa có video nào</h3>
             <p style={{color: '#6b7280', margin: 0}}>Chưa có video bài học cho khóa này. Hãy thêm video YouTube (Unlisted) ngay!</p>
             <p style={{color: '#ef4444', fontSize: 13, marginTop: 16, fontWeight: 500}}>
               Lưu ý: Bạn phải chạy câu lệnh SQL tạo bảng "replay_videos" trong Supabase trước.
             </p>
           </div>
        ) : (
          <div className="table-responsive">
            <table className="rm-table">
              <thead>
                <tr>
                  <th>Thứ tự</th>
                  <th>Video</th>
                  <th>Topic (Section/Tuần)</th>
                  <th>Khóa Học</th>
                  <th>Trạng Thái</th>
                  <th>Hành Động</th>
                </tr>
              </thead>
              <tbody>
                {videos.map(v => (
                  <tr key={v.id}>
                    <td style={{fontWeight: 700}}>{v.sort_order}</td>
                    <td>
                      <div className="rm-video-info">
                        <div className="rm-video-details">
                          <span className="rm-video-title">{v.title}</span>
                          <span style={{fontSize: 12, color: '#6b7280', display: 'flex', alignItems: 'center', gap: 4}}>
                            <LinkIcon size={12} /> {v.youtube_url?.substring(0, 30)}...
                          </span>
                        </div>
                      </div>
                    </td>
                    <td><span className="rm-video-topic">{v.topic}</span></td>
                    <td>{COURSES.find(c => c.id === v.course_id)?.name || v.course_id}</td>
                    <td>
                      <span className={`rm-badge ${v.is_published ? 'active' : 'inactive'}`}>
                        {v.is_published ? 'Hiển thị' : 'Đang ẩn'}
                      </span>
                    </td>
                    <td>
                      <div className="rm-row-actions">
                        <button className="rm-btn-icon" onClick={() => handleOpenModal(v)} title="Chỉnh sửa">
                          <Edit2 size={16} />
                        </button>
                        <button className="rm-btn-icon danger" onClick={() => handleDelete(v.id)} title="Xóa">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Thêm/Sửa */}
      {isModalOpen && (
        <div className="rm-modal-overlay">
          <form className="rm-modal" onSubmit={handleSave}>
            <div className="rm-modal-header">
              <h2>{editingId ? 'Chỉnh sửa Video' : 'Thêm Video Mới'}</h2>
              <button 
                type="button"
                onClick={handleCloseModal} 
                style={{background: 'none', color: '#6b7280'}}
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="rm-modal-body">
                <div className="rm-form-group">
                  <label>Khóa Học *</label>
                  <select name="course_id" value={formData.course_id} onChange={handleChange} required>
                    {COURSES.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                
                <div className="rm-form-group">
                  <label>Chủ Đề (Ví dụ: Tuần 1: Tư Duy Nền Tảng) *</label>
                  <input 
                    type="text" 
                    name="topic" 
                    value={formData.topic} 
                    onChange={handleChange} 
                    placeholder="Tuần 1: Khởi Động"
                    required 
                  />
                </div>

                <div className="rm-form-group">
                  <label>Tiêu đề bài học *</label>
                  <input 
                    type="text" 
                    name="title" 
                    value={formData.title} 
                    onChange={handleChange} 
                    required 
                  />
                </div>

                <div className="rm-form-group">
                  <label>YouTube Link (URL chia sẻ hoặc URL embed) *</label>
                  <input 
                    type="url" 
                    name="youtube_url" 
                    value={formData.youtube_url} 
                    onChange={handleChange} 
                    placeholder="https://www.youtube.com/watch?v=..."
                    required 
                  />
                  <span style={{fontSize: 11, color: '#ef4444'}}>Lưu ý: Up video dạng Unlisted trên YouTube để bảo mật.</span>
                </div>

                <div style={{display: 'flex', gap: 16}}>
                  <div className="rm-form-group" style={{flex: 1}}>
                    <label>Thời lượng (Ví dụ: 45 mins)</label>
                    <input 
                      type="text" 
                      name="duration" 
                      value={formData.duration} 
                      onChange={handleChange} 
                    />
                  </div>
                  
                  <div className="rm-form-group" style={{width: 120}}>
                    <label>Ưu tiên sắp xếp</label>
                    <input 
                      type="number" 
                      name="sort_order" 
                      value={formData.sort_order} 
                      onChange={handleChange} 
                    />
                  </div>
                </div>

                <div className="rm-form-group" style={{flexDirection: 'row', alignItems: 'center'}}>
                  <input 
                    type="checkbox" 
                    id="is_published"
                    name="is_published" 
                    checked={formData.is_published} 
                    onChange={handleChange}
                    style={{width: 'auto'}}
                  />
                  <label htmlFor="is_published" style={{margin: 0, cursor: 'pointer'}}>Hiển thị (Publish)</label>
                </div>
              </div>

              <div className="rm-modal-footer">
                <button type="button" className="cf-btn-outline" onClick={handleCloseModal} disabled={isSaving}>
                  Hủy bỏ
                </button>
                <button type="submit" className="cf-btn-primary" disabled={isSaving}>
                  {isSaving ? 'Đang lưu...' : 'Lưu Video'}
                </button>
              </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ReplayManager;
