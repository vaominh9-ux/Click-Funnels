import React, { useState, useEffect, useRef } from 'react';
import { Save, Loader2, CalendarRange, Link, Users, Mail, Eye, Code, RefreshCcw } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useToast } from '../../components/common/Toast';
import './WorkshopSettings.css';

// Default HTML Template cho email workshop
const DEFAULT_WORKSHOP_SUBJECT = '✅ {{firstName}} ơi, đã đăng ký thành công — Lịch 3 buổi AI Workshop đính kèm!';
const DEFAULT_WORKSHOP_HTML = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#0a0a0f;font-family:Arial,Helvetica,sans-serif;">
  <div style="max-width:600px;margin:0 auto;">
    <!-- Header -->
    <div style="background:linear-gradient(135deg,#7c3aed,#2563eb);padding:12px 24px;text-align:center;">
      <span style="color:#fff;font-size:13px;font-weight:800;text-transform:uppercase;letter-spacing:2px;">✅ ĐĂNG KÝ THÀNH CÔNG — WORKSHOP AI MIỄN PHÍ</span>
    </div>
    
    <!-- Body -->
    <div style="background:#0a0a0f;padding:40px 32px;">
      <h1 style="color:#FFFFFF;font-size:26px;line-height:1.3;margin:0 0 8px;font-weight:900;">
        Chào {{firstName}}! 🎉
      </h1>
      <div style="width:60px;height:4px;background:linear-gradient(135deg,#7c3aed,#2563eb);margin:0 0 24px;border-radius:2px;"></div>
      
      <p style="color:#D1D5DB;font-size:16px;line-height:1.7;margin:0 0 8px;">
        Bạn đã đăng ký thành công <strong style="color:#A78BFA;">Workshop 3 Buổi Tối Thực Hành AI</strong>.
      </p>
      <p style="color:#9CA3AF;font-size:14px;line-height:1.6;margin:0 0 32px;">
        Dưới đây là lịch 3 buổi học. Bấm nút bên dưới để thêm tất cả vào lịch — hệ thống sẽ tự nhắc bạn trước 30 phút.
      </p>

      <!-- Lịch 3 buổi -->
      <div style="border:1px solid #2a2a3a;border-radius:12px;overflow:hidden;margin-bottom:28px;">
        <div style="background:#1a1a25;padding:14px 16px;">
          <h2 style="color:#FFFFFF;font-size:15px;margin:0;font-weight:800;">📅 LỊCH HỌC 3 BUỔI</h2>
        </div>
        <table style="width:100%;border-collapse:collapse;background:#13131a;">
          {{sessionsHTML}}
        </table>
      </div>

      <!-- NÚT THÊM VÀO LỊCH -->
      <div style="text-align:center;margin-bottom:28px;">
        <div style="background:#13131a;border:2px solid #7c3aed;border-radius:12px;padding:24px;display:inline-block;width:100%;box-sizing:border-box;">
          <p style="color:#A78BFA;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin:0 0 12px;">👇 BẤM MỞ FILE (.ICS) ĐÍNH KÈM GÓC DƯỚI EMAIL</p>
          <div style="background:linear-gradient(135deg,#7c3aed,#2563eb);border-radius:8px;padding:14px 24px;display:inline-block;">
            <span style="color:#fff;font-size:16px;font-weight:800;">📅 MỞ FILE "workshop-ai.ics" ĐỂ LÊN LỊCH</span>
          </div>
        </div>
      </div>

      <!-- Link Zalo -->
      <div style="border:1px solid #10b981;border-radius:12px;padding:20px;text-align:center;margin-bottom:28px;background:rgba(16,185,129,0.08);">
        <p style="color:#10b981;font-size:14px;font-weight:700;margin:0 0 12px;">💬 THAM GIA NHÓM ZALO ĐỂ NHẬN LINK ZOOM</p>
        <a href="{{zaloGroupLink}}" style="background:#10b981;color:#fff;padding:12px 32px;border-radius:8px;text-decoration:none;font-weight:700;font-size:15px;display:inline-block;">VÀO NHÓM ZALO NGAY</a>
      </div>
    </div>
    
    <!-- Footer -->
    <div style="background:#050508;padding:20px 32px;text-align:center;">
      <p style="color:#4B5563;font-size:11px;margin:0;line-height:1.6;">
        Email gửi tự động. © {{year}} HungNPV AI Workshop.
      </p>
    </div>
  </div>
</body>
</html>`;

const DEFAULT_CONFIG = {
  zoomLink: 'https://zoom.us/j/xxxxx',
  zaloGroupLink: 'https://zalo.me/g/xxxxx',
  organizerName: 'Hưng NPV',
  organizerEmail: 'hungnpv@duhava.com',
  subject: DEFAULT_WORKSHOP_SUBJECT,
  htmlBody: DEFAULT_WORKSHOP_HTML,
  sessions: [
    {
      title: 'Workshop AI Buổi 1 — Kích hoạt AI & Build Chatbot',
      date: '2026-05-01',
      startTime: '19:30',
      endTime: '21:00',
      description: 'Kích hoạt Google AI Pro + Prompting nâng cao + Build Chatbot AI đầu tiên',
    },
    {
      title: 'Workshop AI Buổi 2 — Công Cụ Bán Hàng AI',
      date: '2026-05-02',
      startTime: '19:30',
      endTime: '21:00',
      description: 'Sinh Landing Page bằng AI + Email AI Automation',
    },
    {
      title: 'Workshop AI Buổi 3 — Biến AI Thành Thu Nhập',
      date: '2026-05-03',
      startTime: '19:30',
      endTime: '21:00',
      description: 'Case Study AI Freelancer kiếm 5-20 triệu/tháng + Lộ trình đi tiếp',
    }
  ]
};

const WorkshopSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const addToast = useToast();

  const [activeTab, setActiveTab] = useState('general'); // 'general', 'sessions', 'email'
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  
  // View mode for email
  const [viewMode, setViewMode] = useState('visual'); 
  const iframeRef = useRef(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .select('*')
        .eq('key', 'workshop_config')
        .single();
      
      if (data && data.value) {
        // Merge with default to ensure we have all fields
        const mergedConfig = {
          ...DEFAULT_CONFIG,
          ...data.value,
          sessions: data.value.sessions?.length === 3 ? data.value.sessions : DEFAULT_CONFIG.sessions
        };
        setConfig(mergedConfig);
      }
    } catch (err) {
      console.error('Lỗi khi tải cấu hình workshop:', err);
      // Nếu lỗi (ví dụ chưa có row), cứ dùng DEFAULT_CONFIG
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();

      const { error } = await supabase.from('system_settings').upsert({
        key: 'workshop_config',
        value: config,
        updated_at: new Date().toISOString(),
        updated_by: user?.id
      }, { onConflict: 'key' });

      if (error) throw error;
      addToast('Đã lưu cấu hình Workshop thành công!', 'success');
    } catch (err) {
      console.error('Lỗi lưu workshop:', err);
      addToast('Lỗi: ' + err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const updateSession = (index, field, value) => {
    const updatedSessions = [...config.sessions];
    updatedSessions[index] = { ...updatedSessions[index], [field]: value };
    setConfig({ ...config, sessions: updatedSessions });
  };

  // Sync iframe for Email Visual Editor
  useEffect(() => {
    if (activeTab === 'email' && viewMode === 'visual' && iframeRef.current && !loading) {
      const doc = iframeRef.current.contentDocument;
      if (doc) {
        doc.open();
        // Replace {{zaloGroupLink}} just for visual reference (don't save replaced back)
        let visualHtml = config.htmlBody.replace(/{{zaloGroupLink}}/g, config.zaloGroupLink);
        visualHtml = visualHtml.replace(/{{firstName}}/g, 'Hưng');
        doc.write(visualHtml);
        doc.close();
        doc.designMode = 'on';

        const style = doc.createElement('style');
        style.textContent = `
          body { cursor: text; }
          ::-webkit-scrollbar { width: 8px; }
          ::-webkit-scrollbar-track { background: #111; }
          ::-webkit-scrollbar-thumb { background: #333; border-radius: 4px; }
        `;
        doc.head.appendChild(style);

        const handleInput = () => {
          const docHTML = doc.body.innerHTML;
          const cssText = doc.body.style.cssText;
          const headHTML = doc.head.innerHTML;
          const html = '<!DOCTYPE html><html><head>' + headHTML + '</head><body style="' + cssText + '">' + docHTML + '</body></html>';
          let cleanHtml = html.replace(new RegExp('<style>[^<]*cursor: text[^<]*</style>', 'g'), '');
          // Note: When saving from Visual mode, we overwrite variables if user typed over them. 
          // Best practice is only code view for complex variables, but we support visual edits.
          setConfig(prev => ({ ...prev, htmlBody: cleanHtml }));
        };

        doc.body.addEventListener('input', handleInput);
        doc.body.addEventListener('keyup', handleInput);
      }
    }
  }, [activeTab, viewMode, loading]);

  if (loading) {
    return (
      <div className="ws-container">
        <div className="ws-loading">
          <Loader2 size={32} className="spin text-blue-500" />
          <p>Đang tải cấu hình...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="ws-container">
      <div className="ws-header">
        <h2 className="ws-title">Phễu Hội Thảo (Free)</h2>
        <p className="ws-subtitle">Cấu hình thông tin Zoom, Zalo Group, lịch các buổi học và Email tự động đính kèm sự kiện Google Calendar cho khách.</p>
      </div>

      <div className="ws-tabs">
        <button 
          className={`ws-tab ${activeTab === 'general' ? 'active' : ''}`}
          onClick={() => setActiveTab('general')}
        >
          <Link size={16} /> Liên Kết & Diễn giả
        </button>
        <button 
          className={`ws-tab ${activeTab === 'sessions' ? 'active' : ''}`}
          onClick={() => setActiveTab('sessions')}
        >
          <CalendarRange size={16} /> Lịch Học (3 Buổi)
        </button>
        <button 
          className={`ws-tab ${activeTab === 'email' ? 'active' : ''}`}
          onClick={() => setActiveTab('email')}
        >
          <Mail size={16} /> Email Giao Tiếp
        </button>
      </div>

      <div className="ws-content">
        
        {/* TAB 1: LIÊN KẾT */}
        {activeTab === 'general' && (
          <div className="ws-card">
            <h3 className="card-title"><Link size={18} /> Cấu Hình Liên Kết Cơ Bản</h3>
            <div className="ws-form-grid">
              <div className="ws-field">
                <label>Link Nhóm Zalo (Khách tham gia sau đăng ký)</label>
                <input 
                  type="text" 
                  value={config.zaloGroupLink}
                  onChange={(e) => setConfig({...config, zaloGroupLink: e.target.value})}
                  placeholder="https://zalo.me/g/..."
                />
              </div>
              <div className="ws-field">
                <label>Link Phòng Zoom Học LIVE</label>
                <input 
                  type="text" 
                  value={config.zoomLink}
                  onChange={(e) => setConfig({...config, zoomLink: e.target.value})}
                  placeholder="https://zoom.us/j/..."
                />
              </div>
              <div className="ws-field">
                <label>Tên Người Hướng Dẫn</label>
                <input 
                  type="text" 
                  value={config.organizerName}
                  onChange={(e) => setConfig({...config, organizerName: e.target.value})}
                  placeholder="VD: Hưng NPV"
                />
              </div>
              <div className="ws-field">
                <label>Email Diễn Giả (Dùng để gửi thư)</label>
                <input 
                  type="email" 
                  value={config.organizerEmail}
                  onChange={(e) => setConfig({...config, organizerEmail: e.target.value})}
                  placeholder="VD: hungnpv@duhava.com"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: LỊCH HỌC */}
        {activeTab === 'sessions' && (
          <div className="ws-card">
            <h3 className="card-title"><CalendarRange size={18} /> Cấu Hình Thời Gian (Dùng để tạo file Google Calendar .ICS)</h3>
            <div className="sessions-list">
              {config.sessions.map((session, index) => (
                <div key={index} className="session-item">
                  <div className="session-header">
                    <h4>Buổi {index + 1}</h4>
                  </div>
                  <div className="ws-form-grid">
                    <div className="ws-field fw-full">
                      <label>Tiêu đề buổi học *</label>
                      <input 
                        type="text" 
                        value={session.title}
                        onChange={(e) => updateSession(index, 'title', e.target.value)}
                      />
                    </div>
                    <div className="ws-field">
                      <label>Ngày (YYYY-MM-DD) *</label>
                      <input 
                        type="date" 
                        value={session.date}
                        onChange={(e) => updateSession(index, 'date', e.target.value)}
                      />
                    </div>
                    <div className="ws-field">
                      <label>Giờ Bắt Đầu (VN) *</label>
                      <input 
                        type="time" 
                        value={session.startTime}
                        onChange={(e) => updateSession(index, 'startTime', e.target.value)}
                      />
                    </div>
                    <div className="ws-field">
                      <label>Giờ Kết Thúc (VN) *</label>
                      <input 
                        type="time" 
                        value={session.endTime}
                        onChange={(e) => updateSession(index, 'endTime', e.target.value)}
                      />
                    </div>
                    <div className="ws-field fw-full">
                      <label>Mô tả ngắn gọn (Sẽ hiển thị trong Google Calendar)</label>
                      <input 
                        type="text" 
                        value={session.description}
                        onChange={(e) => updateSession(index, 'description', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: EMAIL */}
        {activeTab === 'email' && (
           <div className="ws-card ws-email-card">
              <div className="ws-field fw-full mb-4">
                <label style={{ fontSize: '15px' }}>Tiêu đề Email (Subject)</label>
                <input 
                  type="text" 
                  value={config.subject}
                  onChange={(e) => setConfig({...config, subject: e.target.value})}
                  placeholder="Tiêu đề email gửi đi..."
                  style={{ padding: '12px', fontSize: '16px' }}
                />
              </div>

              <div className="ws-field fw-full" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label style={{ margin: 0 }}>Nội dung Email (HTML)</label>
                  <div className="mode-toggle">
                    <button className={viewMode === 'visual' ? 'active' : ''} onClick={() => setViewMode('visual')}><Eye size={14}/> Trực quan</button>
                    <button className={viewMode === 'code' ? 'active' : ''} onClick={() => setViewMode('code')}><Code size={14}/> Mã Code (Khuyên dùng)</button>
                  </div>
                </div>
                
                <div className="html-editor-wrapper">
                  {viewMode === 'visual' ? (
                    <iframe ref={iframeRef} className="visual-frame" title="Email Editor" />
                  ) : (
                    <textarea 
                      value={config.htmlBody}
                      onChange={(e) => setConfig({...config, htmlBody: e.target.value})}
                      className="html-textarea"
                      spellCheck="false"
                    />
                  )}
                </div>
                <p className="helper-text mt-2">
                  <strong className="text-yellow-500">Variables hỗ trợ:</strong> <code>{`{{firstName}}`}</code>, <code>{`{{zaloGroupLink}}`}</code>, <code>{`{{sessionsHTML}}`}</code>, <code>{`{{year}}`}</code>.
                </p>
              </div>
           </div>
        )}

        <div className="ws-actions">
          <button 
            className="ws-save-btn" 
            onClick={async () => {
              const email = window.prompt("Nhập email nhận thư Test:");
              if (!email) return;
              
              addToast("Đang gửi email test...", "info");
              try {
                // Tạm lưu thông số trước khi test để truyền đúng biến
                // Hoặc call API Workshop với body: name=Test, email
                const baseUrl = import.meta.env.VITE_API_BASE || (import.meta.env.DEV ? 'http://localhost:3000' : '');
                const res = await fetch(`${baseUrl}/api/email/send-workshop`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ name: 'Admin Test', email, phone: '099999999' })
                });
                
                const result = await res.json();
                if (result.success) {
                  addToast("Gửi Test thành công, vui lòng kiểm tra Hộp thư!", "success");
                } else {
                  throw new Error(result.message || "Lỗi server");
                }
              } catch (e) {
                console.error("Test email lỗi:", e);
                addToast("Lỗi gửi Test. Bạn đã mở Vercel Dev (port 3000) hay Deploy code lên Vercel chưa?", "error");
              }
            }}
            disabled={saving}
            style={{ background: '#F59E0B', marginRight: '10px' }}
          >
            <Mail size={18} /> Gửi Test Mẫu Này
          </button>
          
          <button className="ws-save-btn" onClick={handleSave} disabled={saving}>
            {saving ? <><Loader2 size={18} className="spin" /> Đang lưu...</> : <><Save size={18} /> Lưu Cấu Hình Workshop</>}
          </button>
        </div>
      </div>
    </div>
  );
}

export default WorkshopSettings;
