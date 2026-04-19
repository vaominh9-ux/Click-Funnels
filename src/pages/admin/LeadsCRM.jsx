import React, { useState, useEffect, useCallback } from 'react';
import { Search, Plus, X, Phone, Mail, MessageSquare, Calendar, ArrowRight, User, MapPin } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useToast } from '../../components/common/Toast';
import Skeleton from '../../components/common/Skeleton';
import './LeadsCRM.css';

const STAGES = [
  { key: 'new', label: 'Mới', emoji: '🆕' },
  { key: 'contacted', label: 'Đã Liên Hệ', emoji: '📞' },
  { key: 'consulting', label: 'Đang Tư Vấn', emoji: '💬' },
  { key: 'closed_won', label: 'Chốt Đơn', emoji: '✅' },
  { key: 'closed_lost', label: 'Mất Khách', emoji: '❌' },
];

const SOURCES = [
  { key: 'facebook', label: 'Facebook' },
  { key: 'tiktok', label: 'TikTok' },
  { key: 'youtube', label: 'YouTube' },
  { key: 'zalo', label: 'Zalo' },
  { key: 'website', label: 'Website' },
  { key: 'direct', label: 'Trực Tiếp' },
  { key: 'referral', label: 'Giới Thiệu' },
  { key: 'other', label: 'Khác' },
];

const ACTIVITY_TYPES = [
  { key: 'call', label: 'Gọi điện', icon: Phone },
  { key: 'note', label: 'Ghi chú', icon: MessageSquare },
  { key: 'email', label: 'Email', icon: Mail },
  { key: 'meeting', label: 'Gặp mặt', icon: Calendar },
];

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

export default function LeadsCRM() {
  const addToast = useToast();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [activities, setActivities] = useState([]);
  const [newActivity, setNewActivity] = useState({ type: 'note', content: '' });
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', source: 'direct', stage: 'new', notes: '', value: 0
  });

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('leads')
      .select('*, profiles:affiliate_id(full_name, email), campaigns:campaign_id(name)')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching leads:', error);
      addToast('Không thể tải danh sách khách hàng', 'error');
    } else {
      setLeads(data || []);
    }
    setLoading(false);
  }, [addToast]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const fetchActivities = async (leadId) => {
    const { data } = await supabase
      .from('lead_activities')
      .select('*, profiles:created_by(full_name)')
      .eq('lead_id', leadId)
      .order('created_at', { ascending: false });
    setActivities(data || []);
  };

  const handleAddLead = async () => {
    if (!formData.name.trim()) {
      addToast('Vui lòng nhập tên khách hàng', 'error');
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase.from('leads').insert({
      name: formData.name,
      email: formData.email || null,
      phone: formData.phone || null,
      source: formData.source,
      stage: formData.stage,
      notes: formData.notes || null,
      value: Number(formData.value) || 0,
      affiliate_id: user.id,
    });

    if (error) {
      addToast('Lỗi khi thêm khách: ' + error.message, 'error');
    } else {
      addToast('Đã thêm khách hàng mới!', 'success');
      setShowAddModal(false);
      setFormData({ name: '', email: '', phone: '', source: 'direct', stage: 'new', notes: '', value: 0 });
      fetchLeads();
    }
  };

  const handleStageChange = async (leadId, newStage) => {
    const { data: { user } } = await supabase.auth.getUser();
    const lead = leads.find(l => l.id === leadId);
    const oldStage = STAGES.find(s => s.key === lead?.stage)?.label || lead?.stage;
    const newStageLabel = STAGES.find(s => s.key === newStage)?.label || newStage;

    const { error } = await supabase
      .from('leads')
      .update({ stage: newStage, updated_at: new Date().toISOString() })
      .eq('id', leadId);

    if (!error) {
      // Log activity
      await supabase.from('lead_activities').insert({
        lead_id: leadId,
        type: 'status_change',
        content: `Chuyển từ "${oldStage}" → "${newStageLabel}"`,
        created_by: user.id,
      });

      addToast(`Đã chuyển sang "${newStageLabel}"`, 'success');
      fetchLeads();
      if (selectedLead?.id === leadId) {
        setSelectedLead(prev => ({ ...prev, stage: newStage }));
        fetchActivities(leadId);
      }
    }
  };

  const handleAddActivity = async () => {
    if (!newActivity.content.trim() || !selectedLead) return;

    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase.from('lead_activities').insert({
      lead_id: selectedLead.id,
      type: newActivity.type,
      content: newActivity.content,
      created_by: user.id,
    });

    if (!error) {
      addToast('Đã thêm ghi chú!', 'success');
      setNewActivity({ type: 'note', content: '' });
      fetchActivities(selectedLead.id);
    }
  };

  const openLeadDetail = (lead) => {
    setSelectedLead(lead);
    fetchActivities(lead.id);
  };

  const filteredLeads = leads.filter(lead =>
    lead.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lead.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lead.phone?.includes(searchQuery)
  );

  const getLeadsByStage = (stage) => filteredLeads.filter(l => l.stage === stage);

  if (loading) {
    return (
      <div className="crm-container">
        <div className="crm-header">
          <h1>CRM Khách Hàng</h1>
          <Skeleton width="200px" height="36px" />
        </div>
        <div className="crm-stats-bar">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} width="120px" height="30px" style={{ borderRadius: '20px' }} />
          ))}
        </div>
        <div className="kanban-board">
          {Array.from({ length: 5 }).map((_, colIdx) => (
            <div className="kanban-column" key={colIdx}>
              <div className="kanban-column-header">
                <Skeleton width="100px" height="24px" />
              </div>
              <div className="kanban-cards">
                {Array.from({ length: 3 }).map((_, cardIdx) => (
                  <div className="lead-card" key={cardIdx} style={{ padding: '12px' }}>
                    <Skeleton width="80%" height="20px" style={{ marginBottom: '8px' }} />
                    <Skeleton width="60%" height="14px" style={{ marginBottom: '4px' }} />
                    <Skeleton width="70%" height="14px" style={{ marginBottom: '12px' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Skeleton width="40%" height="20px" style={{ borderRadius: '12px' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="crm-container">
      {/* Header */}
      <div className="crm-header">
        <h1>CRM Khách Hàng</h1>
        <div className="crm-header-actions">
          <div className="crm-search">
            <Search size={16} color="#9CA3AF" />
            <input
              type="text"
              placeholder="Tìm tên, SĐT, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="crm-btn-add" onClick={() => setShowAddModal(true)}>
            <Plus size={16} />
            Thêm Khách
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="crm-stats-bar">
        {STAGES.map(stage => {
          const count = getLeadsByStage(stage.key).length;
          const colors = {
            new: '#3B82F6', contacted: '#F59E0B', consulting: '#F97316',
            closed_won: '#10B981', closed_lost: '#EF4444'
          };
          return (
            <div className="crm-stat-chip" key={stage.key}>
              <div className="stat-dot" style={{ background: colors[stage.key] }}></div>
              <span className="stat-count">{count}</span>
              <span className="stat-label">{stage.label}</span>
            </div>
          );
        })}
        <div className="crm-stat-chip">
          <span className="stat-count" style={{ color: '#10B981' }}>
            {leads.reduce((sum, l) => sum + (Number(l.value) || 0), 0).toLocaleString('vi-VN')}
          </span>
          <span className="stat-label">Tổng GT Pipeline</span>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="kanban-board">
        {STAGES.map(stage => (
          <div className={`kanban-column stage-${stage.key}`} key={stage.key}>
            <div className="kanban-column-header">
              <span>{stage.emoji} {stage.label}</span>
              <span className="col-count">{getLeadsByStage(stage.key).length}</span>
            </div>
            <div className="kanban-cards">
              {getLeadsByStage(stage.key).length === 0 ? (
                <div className="kanban-empty">Chưa có khách nào</div>
              ) : (
                getLeadsByStage(stage.key).map(lead => (
                  <div className="lead-card" key={lead.id} onClick={() => openLeadDetail(lead)}>
                    <div className="lead-card-actions">
                      {stage.key !== 'closed_won' && stage.key !== 'closed_lost' && (
                        <button
                          title="Chuyển giai đoạn tiếp"
                          onClick={(e) => {
                            e.stopPropagation();
                            const currentIdx = STAGES.findIndex(s => s.key === stage.key);
                            if (currentIdx < STAGES.length - 2) {
                              handleStageChange(lead.id, STAGES[currentIdx + 1].key);
                            }
                          }}
                        >
                          <ArrowRight size={14} />
                        </button>
                      )}
                    </div>

                    <div className="lead-card-name">{lead.name}</div>
                    <div className="lead-card-info">
                      {lead.phone && <span><Phone size={12} /> {lead.phone}</span>}
                      {lead.email && <span><Mail size={12} /> {lead.email}</span>}
                      {lead.profiles?.full_name && <span><User size={12} /> {lead.profiles.full_name}</span>}
                    </div>
                    <div className="lead-card-footer">
                      <span className={`lead-source-badge source-${lead.source}`}>
                        {SOURCES.find(s => s.key === lead.source)?.label || lead.source}
                      </span>
                      {lead.value > 0 && (
                        <span className="lead-value">{Number(lead.value).toLocaleString('vi-VN')}</span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Lead Modal */}
      {showAddModal && (
        <div className="crm-modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="crm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="crm-modal-header">
              <h2>Thêm Khách Hàng Mới</h2>
              <button className="crm-modal-close" onClick={() => setShowAddModal(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="crm-modal-body">
              <div className="crm-form-grid">
                <div className="crm-form-group">
                  <label>Họ & Tên *</label>
                  <input type="text" placeholder="Nguyễn Văn A" value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                </div>
                <div className="crm-form-group">
                  <label>Số Điện Thoại</label>
                  <input type="text" placeholder="0901 234 567" value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                </div>
                <div className="crm-form-group">
                  <label>Email</label>
                  <input type="email" placeholder="email@example.com" value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                </div>
                <div className="crm-form-group">
                  <label>Nguồn Khách</label>
                  <select value={formData.source} onChange={(e) => setFormData({ ...formData, source: e.target.value })}>
                    {SOURCES.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
                  </select>
                </div>
                <div className="crm-form-group">
                  <label>Giai Đoạn</label>
                  <select value={formData.stage} onChange={(e) => setFormData({ ...formData, stage: e.target.value })}>
                    {STAGES.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
                  </select>
                </div>
                <div className="crm-form-group">
                  <label>Giá Trị Dự Kiến (VNĐ)</label>
                  <input type="number" placeholder="0" value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })} />
                </div>
              </div>
              <div className="crm-form-grid full-width">
                <div className="crm-form-group">
                  <label>Ghi Chú Ban Đầu</label>
                  <textarea placeholder="Khách quan tâm sản phẩm gì, ngân sách, thời điểm..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })} />
                </div>
              </div>
            </div>
            <div className="crm-modal-footer">
              <button className="crm-btn-cancel" onClick={() => setShowAddModal(false)}>Hủy</button>
              <button className="crm-btn-save" onClick={handleAddLead}>Thêm Khách Hàng</button>
            </div>
          </div>
        </div>
      )}

      {/* Lead Detail Modal */}
      {selectedLead && (
        <div className="crm-modal-backdrop" onClick={() => setSelectedLead(null)}>
          <div className="crm-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '700px' }}>
            <div className="crm-modal-header">
              <h2>Chi Tiết Khách Hàng</h2>
              <button className="crm-modal-close" onClick={() => setSelectedLead(null)}>
                <X size={18} />
              </button>
            </div>
            <div className="crm-modal-body">
              {/* Info Section */}
              <div className="lead-detail-section">
                <h3>Thông Tin Liên Hệ</h3>
                <div className="lead-detail-grid">
                  <div className="lead-detail-item">
                    <span className="label">Họ Tên</span>
                    <span className="value">{selectedLead.name}</span>
                  </div>
                  <div className="lead-detail-item">
                    <span className="label">Điện Thoại</span>
                    <span className="value">{selectedLead.phone || '—'}</span>
                  </div>
                  <div className="lead-detail-item">
                    <span className="label">Email</span>
                    <span className="value">{selectedLead.email || '—'}</span>
                  </div>
                  <div className="lead-detail-item">
                    <span className="label">Nguồn</span>
                    <span className="value">
                      <span className={`lead-source-badge source-${selectedLead.source}`}>
                        {SOURCES.find(s => s.key === selectedLead.source)?.label || selectedLead.source}
                      </span>
                    </span>
                  </div>
                  <div className="lead-detail-item">
                    <span className="label">Affiliate Phụ Trách</span>
                    <span className="value">{selectedLead.profiles?.full_name || '—'}</span>
                  </div>
                  <div className="lead-detail-item">
                    <span className="label">Giá Trị</span>
                    <span className="value" style={{ color: '#10B981', fontWeight: 700 }}>
                      {Number(selectedLead.value || 0).toLocaleString('vi-VN')}đ
                    </span>
                  </div>
                  <div className="lead-detail-item">
                    <span className="label">Ngày Tạo</span>
                    <span className="value">{formatDate(selectedLead.created_at)}</span>
                  </div>
                </div>
                {selectedLead.notes && (
                  <div style={{ marginTop: 12, padding: '10px 14px', background: '#F9FAFB', borderRadius: 8, fontSize: '0.85rem', color: '#374151' }}>
                    <strong>Ghi chú:</strong> {selectedLead.notes}
                  </div>
                )}
              </div>

              {/* Stage Selector */}
              <div className="lead-detail-section">
                <h3>Giai Đoạn Hiện Tại</h3>
                <div className="stage-selector">
                  {STAGES.map(s => (
                    <button
                      key={s.key}
                      className={`stage-btn s-${s.key} ${selectedLead.stage === s.key ? 'active' : ''}`}
                      onClick={() => handleStageChange(selectedLead.id, s.key)}
                    >
                      {s.emoji} {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Activity Timeline */}
              <div className="lead-detail-section">
                <h3>Lịch Sử Chăm Sóc ({activities.length})</h3>
                {activities.length > 0 ? (
                  <div className="activity-timeline">
                    {activities.map(act => (
                      <div className="activity-item" key={act.id}>
                        <div className={`activity-dot type-${act.type}`}></div>
                        <div className="activity-content">{act.content}</div>
                        <div className="activity-meta">
                          {ACTIVITY_TYPES.find(t => t.key === act.type)?.label || act.type}
                          {' • '}
                          {act.profiles?.full_name || 'Hệ thống'}
                          {' • '}
                          {formatDate(act.created_at)}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ color: '#9CA3AF', fontSize: '0.85rem' }}>Chưa có hoạt động nào được ghi nhận.</div>
                )}

                {/* Add Activity */}
                <div className="add-activity-form">
                  <select
                    value={newActivity.type}
                    onChange={(e) => setNewActivity({ ...newActivity, type: e.target.value })}
                  >
                    {ACTIVITY_TYPES.map(t => (
                      <option key={t.key} value={t.key}>{t.label}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="Ghi chú hoạt động..."
                    value={newActivity.content}
                    onChange={(e) => setNewActivity({ ...newActivity, content: e.target.value })}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddActivity()}
                  />
                  <button onClick={handleAddActivity}>Thêm</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
