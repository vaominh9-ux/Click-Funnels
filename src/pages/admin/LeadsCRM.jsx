import React, { useState, useEffect, useCallback } from 'react';
import { Search, Plus, X, Phone, Mail, MessageSquare, Calendar, ArrowRight, User, MapPin, Filter, LayoutGrid, List } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useToast } from '../../components/common/Toast';
import { FUNNEL_COURSES } from '../funnels/config';
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

const EMAIL_TEMPLATES = {
  empty: {
    name: '-- Mẫu Trống (Tự gõ) --',
    subject: '',
    html: ''
  },
  zoom_free: {
    name: '🔴 [Nhắc Học] Khóa Lớp 3 Ngày - Đã đến giờ vào Zoom',
    subject: '🔴 [HỌC VIÊN] Đã đến giờ vào lớp 3 Ngày Thực Chiến AI - Zoom đang mở!',
    html: `<div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9fafb; padding: 20px; border-radius: 12px; border: 1px solid #e5e7eb;">
  
  <div style="text-align: center; padding-bottom: 20px; border-bottom: 2px solid #e5e7eb;">
    <h1 style="color: #ef4444; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">THÔNG BÁO VÀO LỚP</h1>
    <p style="color: #6b7280; font-size: 14px; margin-top: 5px;">Khóa học 3 Ngày Thực Chiến AI</p>
  </div>

  <div style="padding: 30px 20px; background: #ffffff; border-radius: 10px; margin-top: 20px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
    <h2 style="color: #1f2937; font-size: 20px; margin-bottom: 15px;">Xin chào {{name}}, 🎉</h2>
    
    <p style="color: #374151; line-height: 1.6; font-size: 15px;">
      Xin thông báo phòng Zoom hiện tại đã mở cửa. Vui lòng bấm vào nút dưới đây để tham gia lớp học ngay bây giờ để không bỏ lỡ phần nội dung cực kỳ quan trọng ở đầu buổi.
    </p>

    <div style="text-align: center; margin: 30px 0;">
      <a href="[ĐIỀN LINK ZOOM VÀO ĐÂY]" style="background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; font-size: 15px; display: inline-block;">👉 VÀO LỚP ZOOM NGAY</a>
    </div>

    <div style="background-color: #fffbeb; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 0 8px 8px 0;">
      <p style="margin: 0; color: #b45309; font-size: 14px;">
        💡 <strong>Passcode nếu có:</strong> [ĐIỀN PASS VÀO ĐÂY]
      </p>
    </div>
  </div>

  <div style="text-align: center; margin-top: 30px; color: #9ca3af; font-size: 12px; line-height: 1.5;">
    <p>© 2026 Admin System.<br>Bạn nhận được email này vì đã đăng ký tham gia khóa học.</p>
  </div>
</div>`
  },
  zoom_premium: {
    name: '💎 [Nhắc Học] Khóa Trả Phí - Đã đến giờ vào Zoom',
    subject: '💎 [HỌC VIÊN CHUYÊN SÂU] Mời bạn vào lớp (Link Zoom)',
    html: `<div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9fafb; padding: 20px; border-radius: 12px; border: 1px solid #e5e7eb;">
  <div style="padding: 30px 20px; background: #ffffff; border-radius: 10px; margin-top: 10px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
    <h2 style="color: #1f2937; font-size: 20px; margin-bottom: 15px;">Xin chào {{name}},</h2>
    <p style="color: #374151; line-height: 1.6; font-size: 15px;"> Lớp học chuyên sâu của chúng ta bắt đầu trong ít phút nữa. Bạn nhớ chuẩn bị tài liệu và mạng internet ổn định nhé.</p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="[ĐIỀN LINK ZOOM VÀO ĐÂY]" style="background-color: #10b981; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; font-size: 15px; display: inline-block;">VÀO PHÒNG ZOOM KÍN</a>
    </div>
  </div>
</div>`
  },
  consult: {
    name: '💼 [Tư Vấn] Gửi tài liệu và Lộ trình',
    subject: 'Tài liệu và Lộ trình cá nhân hóa đặc biệt dành riêng cho bạn ({{name}})',
    html: `<div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9fafb; padding: 20px; border-radius: 12px; border: 1px solid #e5e7eb;">
  <div style="padding: 30px 20px; background: #ffffff; border-radius: 10px; margin-top: 10px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
    <h2 style="color: #1f2937; font-size: 20px; margin-bottom: 15px;">Xin chào {{name}},</h2>
    <p style="color: #374151; line-height: 1.6; font-size: 15px;">Cảm ơn bạn đã trò chuyện và quan tâm tới sản phẩm của chúng tôi. Dưới đây là bộ tài liệu Lộ Trình mà tôi đã hứa gửi cho bạn.</p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="[LINK_TAI_LIEU_CUA_BAN]" style="background-color: #6366f1; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; font-size: 15px; display: inline-block;">📥 TẢI XUỐNG TÀI LIỆU</a>
    </div>
  </div>
</div>`
  }
};

export default function LeadsCRM() {
  const addToast = useToast();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [viewMode, setViewMode] = useState('kanban');
  const [funnelFilter, setFunnelFilter] = useState('');
  
  // Bulk Email states
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [showBulkEmailModal, setShowBulkEmailModal] = useState(false);
  const [bulkEmailConfig, setBulkEmailConfig] = useState({ subject: '', htmlBody: '' });
  const [sendingBulk, setSendingBulk] = useState(false);
  const [bulkProgress, setBulkProgress] = useState({ sent: 0, total: 0, failed: 0 });
  const [selectedTemplate, setSelectedTemplate] = useState('empty');
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

  const filteredLeads = leads.filter(lead => {
    const matchSearch = lead.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.phone?.includes(searchQuery);
    const matchFunnel = !funnelFilter || lead.course_id === funnelFilter;
    return matchSearch && matchFunnel;
  });

  const getLeadsByStage = (stage) => filteredLeads.filter(l => l.stage === stage);

  // --- Bulk Selection Logic ---
  const toggleSelectLead = (leadId) => {
    setSelectedLeads(prev => 
      prev.includes(leadId) ? prev.filter(id => id !== leadId) : [...prev, leadId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedLeads.length === filteredLeads.length && filteredLeads.length > 0) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(filteredLeads.map(l => l.id));
    }
  };

  const handleApplyTemplate = (e) => {
    const tKey = e.target.value;
    setSelectedTemplate(tKey);
    const tmpl = EMAIL_TEMPLATES[tKey];
    if (tmpl) {
      if (tKey === 'empty' && window.confirm("Bạn có chắc muốn xóa trắng nội dung để chuyển về Mẫu Trống?")) {
        setBulkEmailConfig({ subject: '', htmlBody: '' });
      } else if (tKey !== 'empty') {
        const confirmMsg = bulkEmailConfig.subject || bulkEmailConfig.htmlBody ? 
          "Bạn đang có nội dung trên form. Chuyển mẫu sẽ xóa đè nội dung cũ. Bạn tiếp tục chứ?" : null;
        
        if (!confirmMsg || window.confirm(confirmMsg)) {
          setBulkEmailConfig({ subject: tmpl.subject, htmlBody: tmpl.html });
        } else {
          // Revert selection if rejected
          setSelectedTemplate('empty'); 
        }
      }
    }
  };

  const handleSendBulkEmail = async () => {
    // Lấy những lead có email hợp lệ
    const targets = leads.filter(l => selectedLeads.includes(l.id) && l.email);
    const contacts = targets.map(t => ({ id: t.id, email: t.email, name: t.name }));
    
    if (contacts.length === 0) {
      addToast('Không có email hợp lệ nào trong số khách bạn chọn!', 'error');
      return;
    }
    if (!bulkEmailConfig.subject.trim() || !bulkEmailConfig.htmlBody.trim()) {
      addToast('Tiêu đề và nội dung email không được để trống.', 'error');
      return;
    }

    setSendingBulk(true);
    setBulkProgress({ sent: 0, total: contacts.length, failed: 0 });

    const CHUNK_SIZE = 15; // Mỗi lượt bắn 15 email để chống timeout Vercel
    let sentSuccessCount = 0;
    let sentFailedCount = 0;
    
    // Mảng gom các activity để log hàng loạt vào DB
    let activitiesToInsert = [];

    const baseUrl = import.meta.env.VITE_API_BASE || (import.meta.env.DEV ? 'http://localhost:3000' : '');

    for (let i = 0; i < contacts.length; i += CHUNK_SIZE) {
      const chunk = contacts.slice(i, i + CHUNK_SIZE);
      try {
        const res = await fetch(`${baseUrl}/api/email/bulk-send`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contacts: chunk,
            subject: bulkEmailConfig.subject,
            htmlBody: bulkEmailConfig.htmlBody
          })
        });
        
        const data = await res.json();
        
        if (!res.ok || !data.success) {
          sentFailedCount += chunk.length;
          console.error("Bulk email error response:", data);
        } else if (data.details) {
          data.details.forEach(item => {
            if (item && item.error) {
              sentFailedCount++;
            } else {
              sentSuccessCount++;
              // Tìm đúng lead dựa trên email để gắn log
              const targetContact = chunk.find(c => c.email === item.email);
              if (targetContact) {
                activitiesToInsert.push({
                  lead_id: targetContact.id,
                  type: 'email',
                  content: `Đã gửi thư loạt: "${bulkEmailConfig.subject}"`
                });
              }
            }
          });
        } else {
            // Fallback thành công (khi server trả về success nhưng ko có details)
            sentSuccessCount += chunk.length;
        }

      } catch (err) {
        console.error("Bulk chunk error:", err);
        sentFailedCount += chunk.length;
      }

      setBulkProgress({ sent: sentSuccessCount, total: contacts.length, failed: sentFailedCount });
    }

    // Sau khi gửi xong, ghi Log Activity vào Supabase 1 lượt
    if (activitiesToInsert.length > 0) {
      const { error: logError } = await supabase.from('lead_activities').insert(activitiesToInsert);
      if (logError) console.error("Lỗi khi lưu log email:", logError);
    }

    setSendingBulk(false);
    addToast(`Hoàn tất! Gửi thành công: ${sentSuccessCount}, Thất bại: ${sentFailedCount}`, 'success');
  };

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
          <select
            className="crm-funnel-filter"
            value={funnelFilter}
            onChange={(e) => setFunnelFilter(e.target.value)}
          >
            <option value="">Tất cả phễu</option>
            {Object.entries(FUNNEL_COURSES).map(([key, val]) => (
              <option key={key} value={key}>{val.name.split(':')[0].trim()}</option>
            ))}
          </select>
          <div className="crm-view-toggles">
            <button className={`view-toggle-btn ${viewMode === 'kanban' ? 'active' : ''}`} onClick={() => setViewMode('kanban')} title="Dạng Bảng Kanban">
              <LayoutGrid size={16} />
            </button>
            <button className={`view-toggle-btn ${viewMode === 'table' ? 'active' : ''}`} onClick={() => setViewMode('table')} title="Dạng Danh Sách">
              <List size={16} />
            </button>
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

      {/* Main View Content */}
      {viewMode === 'kanban' ? (
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
                      {lead.course_id && (
                        <span className={`lead-course-badge course-${lead.course_id}`}>
                          {FUNNEL_COURSES[lead.course_id]?.name?.split(':')[0]?.trim() || lead.course_id}
                        </span>
                      )}
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
      ) : (
        <div className="crm-table-view">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '40px', textAlign: 'center' }}>
                  <input 
                    type="checkbox" 
                    checked={filteredLeads.length > 0 && selectedLeads.length === filteredLeads.length}
                    onChange={toggleSelectAll} 
                  />
                </th>
                <th style={{ width: '23%' }}>KHÁCH HÀNG</th>
                <th style={{ width: '20%' }}>THÔNG TIN LH</th>
                <th style={{ width: '25%' }}>PHỄU & NGUỒN</th>
                <th style={{ width: '15%' }}>GIAI ĐOẠN</th>
                <th style={{ width: '12%' }}>NGÀY TẠO</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#64748B' }}>Chưa có khách hàng nào</td>
                </tr>
              ) : (
                filteredLeads.map(lead => (
                  <tr key={lead.id} onClick={() => openLeadDetail(lead)} style={{ cursor: 'pointer' }}>
                    <td onClick={(e) => e.stopPropagation()} style={{ textAlign: 'center' }}>
                      <input 
                        type="checkbox" 
                        checked={selectedLeads.includes(lead.id)}
                        onChange={() => toggleSelectLead(lead.id)}
                      />
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: '#111827', fontSize: '0.9rem' }}>{lead.name}</div>
                      {lead.profiles?.full_name && (
                        <div style={{ fontSize: '0.78rem', color: '#6B7280', marginTop: '4px' }}>
                          <User size={12} style={{ verticalAlign: 'text-bottom', marginRight: '4px' }} /> 
                          {lead.profiles.full_name}
                        </div>
                      )}
                    </td>
                    <td>
                      {lead.phone && <div style={{ fontSize: '0.85rem', color: '#374151', marginBottom: '4px' }}><Phone size={12} style={{ marginRight: '4px', verticalAlign: 'text-bottom' }} /> {lead.phone}</div>}
                      {lead.email && <div style={{ fontSize: '0.85rem', color: '#374151' }}><Mail size={12} style={{ marginRight: '4px', verticalAlign: 'text-bottom' }} /> {lead.email}</div>}
                      {!lead.phone && !lead.email && <span style={{ color: '#9CA3AF', fontSize: '0.85rem' }}>—</span>}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {lead.course_id && (
                          <span className={`lead-course-badge course-${lead.course_id}`}>
                            {FUNNEL_COURSES[lead.course_id]?.name?.split(':')[0]?.trim() || lead.course_id}
                          </span>
                        )}
                        <span className={`lead-source-badge source-${lead.source}`}>
                          {SOURCES.find(s => s.key === lead.source)?.label || lead.source}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className={`stage-btn s-${lead.stage} active`} style={{ cursor: 'default', display: 'inline-flex', alignItems: 'center', pointerEvents: 'none' }}>
                        {STAGES.find(s => s.key === lead.stage)?.emoji} {STAGES.find(s => s.key === lead.stage)?.label || lead.stage}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.85rem', color: '#6B7280' }}>
                      {formatDate(lead.created_at)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Floating Bulk Action Bar */}
      {selectedLeads.length > 0 && (
        <div className="crm-bulk-action-bar">
          <div className="bulk-info">
            Đã chọn <strong style={{color:'#3B82F6', fontSize:'16px'}}>{selectedLeads.length}</strong> khách hàng
          </div>
          <div className="bulk-actions">
            <button className="bulk-btn-cancel" onClick={() => setSelectedLeads([])}>Bỏ chọn</button>
            <button className="bulk-btn-send" onClick={() => setShowBulkEmailModal(true)}>
              <Mail size={16} /> Gửi Email Hàng Loạt
            </button>
          </div>
        </div>
      )}

      {/* Bulk Email Modal */}
      {showBulkEmailModal && (
        <div className="crm-modal-backdrop" onClick={() => !sendingBulk && setShowBulkEmailModal(false)}>
          <div className="crm-modal email-modal" onClick={(e) => e.stopPropagation()} style={{maxWidth: '1000px', height: '95vh', maxHeight: '95vh', display: 'flex', flexDirection: 'column'}}>
            <div className="crm-modal-header">
              <div>
                <h2>Gửi Email Hàng Loạt</h2>
                <p style={{margin:0, fontSize:'13px', color:'#6B7280'}}>Gửi tới <strong>{selectedLeads.length}</strong> khách hàng đã chọn (Áp dụng cho khách có email hợp lệ)</p>
              </div>
              <button className="crm-modal-close" onClick={() => !sendingBulk && setShowBulkEmailModal(false)} disabled={sendingBulk}>
                <X size={18} />
              </button>
            </div>

            <div className="crm-modal-body" style={{flex: 1, display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'hidden'}}>
              <div className="crm-form-group">
                <label>Sử Dụng Mẫu Email Có Sẵn (Xóa Đè)</label>
                <select 
                  value={selectedTemplate} 
                  onChange={handleApplyTemplate}
                  disabled={sendingBulk}
                  style={{ fontWeight: 600, color: selectedTemplate === 'empty' ? '#6B7280' : '#111827', background: selectedTemplate === 'empty' ? '#fff' : '#EFF6FF', border: selectedTemplate === 'empty' ? '1px solid #D1D5DB' : '1px solid #3B82F6' }}
                >
                  {Object.entries(EMAIL_TEMPLATES).map(([key, val]) => (
                    <option key={key} value={key}>{val.name}</option>
                  ))}
                </select>
              </div>

              <div className="crm-form-group">
                <label>Tiêu Đề Email (Subject)</label>
                <input 
                  type="text" 
                  value={bulkEmailConfig.subject}
                  onChange={(e) => setBulkEmailConfig({...bulkEmailConfig, subject: e.target.value})}
                  placeholder="Ví dụ: Lộ trình cá nhân hóa cho {{name}}..."
                  disabled={sendingBulk}
                />
              </div>
              
              <div style={{ display: 'flex', gap: '20px', flex: 1, minHeight: '300px' }}>
                <div className="crm-form-group" style={{flex: 1}}>
                  <label>Nội Dung (Mã HTML)</label>
                  <textarea 
                    value={bulkEmailConfig.htmlBody}
                    onChange={(e) => setBulkEmailConfig({...bulkEmailConfig, htmlBody: e.target.value})}
                    placeholder={`<p>Chào {{name}},</p>\n\n<p>Cảm ơn bạn đã quan tâm...</p>`}
                    style={{flex: 1, fontFamily: 'monospace', fontSize: '13px'}}
                    disabled={sendingBulk}
                  />
                </div>

                <div className="crm-form-group" style={{flex: 1, display: 'flex', flexDirection: 'column'}}>
                  <label style={{display: 'flex', justifyContent: 'space-between'}}>
                    <span>Xem Trước (Live Preview)</span>
                    <span style={{fontSize: '11px', fontWeight: 'normal', color: '#9CA3AF'}}>Hiển thị minh họa giả lập</span>
                  </label>
                  <div style={{
                    flex: 1, 
                    border: '1px solid #D1D5DB', 
                    borderRadius: '8px', 
                    background: '#fff', 
                    overflow: 'hidden',
                  }}>
                    <iframe 
                      title="Email Preview"
                      srcDoc={bulkEmailConfig.htmlBody ? bulkEmailConfig.htmlBody.replace(/{{name}}/g, '<b>Nguyễn Văn A</b>') : '<div style="color:#9CA3AF; padding:20px; font-family:sans-serif; font-size:13px">Bản xem trước sẽ hiển thị ở đây...</div>'}
                      style={{width: '100%', height: '100%', border: 'none', display: 'block'}}
                    />
                  </div>
                </div>
              </div>

              {/* Progress Bar Area */}
              {sendingBulk && (
                <div style={{background: '#F3F4F6', padding: '16px', borderRadius: '10px'}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 600, marginBottom: '8px', color: '#374151'}}>
                    <span>Tiến độ gửi...</span>
                    <span>{bulkProgress.sent + bulkProgress.failed} / {bulkProgress.total}</span>
                  </div>
                  <div style={{width: '100%', height: '8px', background: '#E5E7EB', borderRadius: '4px', overflow: 'hidden'}}>
                    <div style={{
                      width: `${((bulkProgress.sent + bulkProgress.failed) / (bulkProgress.total || 1)) * 100}%`,
                      height: '100%',
                      background: '#3B82F6',
                      transition: 'width 0.3s'
                    }}></div>
                  </div>
                  <div style={{fontSize: '12px', color: '#6B7280', marginTop: '8px'}}>
                    Thành công: <span style={{color: '#10B981', fontWeight: 700}}>{bulkProgress.sent}</span> | 
                    Lỗi: <span style={{color: '#EF4444', fontWeight: 700}}>{bulkProgress.failed}</span>
                  </div>
                  <div style={{fontSize: '11px', color: '#F59E0B', marginTop: '6px', fontStyle: 'italic'}}>
                    ⚠️ Vui lòng KHÔNG đóng / tải lại trình duyệt lúc này. Việc gửi chia nhỏ để tránh máy chủ bị sập & Gmail khóa acc.
                  </div>
                </div>
              )}
            </div>

            <div className="crm-modal-footer">
              <button className="crm-btn-cancel" onClick={() => setShowBulkEmailModal(false)} disabled={sendingBulk}>Hủy bỏ</button>
              <button 
                className="crm-btn-save" 
                onClick={handleSendBulkEmail} 
                disabled={sendingBulk || !bulkEmailConfig.subject || !bulkEmailConfig.htmlBody}
                style={{display: 'flex', gap: '8px', alignItems: 'center'}}
              >
                {sendingBulk ? '⏳ Đang Xử Lý...' : '🚀 Bắt Đầu Gửi Ngay'}
              </button>
            </div>
          </div>
        </div>
      )}

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
