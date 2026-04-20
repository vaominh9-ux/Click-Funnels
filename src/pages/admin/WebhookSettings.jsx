import React, { useState, useEffect } from 'react';
import { Save, Loader2, Webhook, Zap, Send, CheckCircle, XCircle, AlertCircle, Copy, RefreshCw, Bell } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useToast } from '../../components/common/Toast';
import './WebhookSettings.css';

const API_BASE = import.meta.env.VITE_API_BASE || (window.location.hostname === 'localhost' ? 'https://click-funnels.vercel.app' : '');

const WebhookSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const addToast = useToast();

  // Config form
  const [n8nWebhookUrl, setN8nWebhookUrl] = useState('');
  const [enableNewLead, setEnableNewLead] = useState(true);
  const [enablePayment, setEnablePayment] = useState(true);
  const [testLog, setTestLog] = useState([]);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .select('*')
        .eq('key', 'webhook_config')
        .single();

      if (data?.value) {
        const config = data.value;
        setN8nWebhookUrl(config.n8nWebhookUrl || '');
        setEnableNewLead(config.enableNewLead !== false);
        setEnablePayment(config.enablePayment !== false);
      }
    } catch (err) {
      console.error('Load webhook settings error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();

      const { error } = await supabase
        .from('system_settings')
        .upsert({
          key: 'webhook_config',
          value: {
            n8nWebhookUrl: n8nWebhookUrl.trim(),
            enableNewLead,
            enablePayment,
          },
          updated_at: new Date().toISOString(),
          updated_by: user?.id
        }, { onConflict: 'key' });

      if (error) throw error;
      addToast('Đã lưu cấu hình Webhook thành công!', 'success');
    } catch (err) {
      console.error('Save webhook error:', err);
      addToast('Lỗi khi lưu: ' + err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const addLog = (msg, type = 'info') => {
    const time = new Date().toLocaleTimeString('vi-VN');
    setTestLog(prev => [`[${time}] ${msg}`, ...prev].slice(0, 20));
  };

  const handleTest = async () => {
    if (!n8nWebhookUrl.trim()) {
      addToast('Vui lòng nhập n8n Webhook URL trước khi test!', 'error');
      return;
    }

    setTesting(true);
    setTestLog([]);
    addLog('🚀 Bắt đầu gửi test webhook...');

    try {
      // Lưu config trước
      addLog('💾 Đang lưu cấu hình...');
      await handleSave();
      addLog('✅ Đã lưu cấu hình');

      // Gọi API test
      addLog('📡 Đang gửi tín hiệu tới n8n...');
      const response = await fetch(`${API_BASE}/api/webhook/notify-lead`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: '[TEST] Admin Test',
          phone: '0900000000',
          email: 'test@clickfunnels.vn',
          courseName: '[TEST] Kiểm tra Webhook',
          courseId: 'test',
          source: 'admin-test',
          leadId: 'test-' + Date.now()
        })
      });

      const result = await response.json();

      if (result.webhookSent) {
        addLog(`✅ Webhook đã gửi thành công! n8n status: ${result.n8nStatus}`, 'success');
        addToast('Test webhook thành công! Kiểm tra n8n & Zalo.', 'success');
      } else {
        addLog(`⚠️ Webhook chưa gửi được: ${result.message}`, 'error');
        addToast('Webhook chưa gửi được. Kiểm tra URL.', 'error');
      }
    } catch (err) {
      addLog(`❌ Lỗi: ${err.message}`, 'error');
      addToast('Lỗi kết nối: ' + err.message, 'error');
    } finally {
      setTesting(false);
    }
  };

  const handleCopyUrl = (url) => {
    navigator.clipboard.writeText(url);
    addToast('Đã sao chép!', 'success');
  };

  const notifyLeadUrl = `${window.location.hostname === 'localhost' ? 'https://click-funnels.vercel.app' : window.location.origin}/api/webhook/notify-lead`;

  // Determine connection status
  const getStatus = () => {
    if (!n8nWebhookUrl.trim()) return 'disconnected';
    return 'connected';
  };
  const status = getStatus();

  if (loading) {
    return (
      <div className="webhook-settings-container">
        <div className="ws-loading">
          <Loader2 size={32} className="spin" />
          <p>Đang tải cấu hình...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="webhook-settings-container">
      <div className="ws-header">
        <p className="ws-subtitle">Cấu hình Webhook để nhận thông báo Lead mới qua n8n → Zalo / Telegram / Email.</p>
      </div>

      {/* Status Bar */}
      <div className={`ws-status ${status}`} style={{ marginBottom: '24px' }}>
        {status === 'connected' ? (
          <><CheckCircle size={16} /> Webhook đã cấu hình — Sẵn sàng gửi thông báo</>
        ) : (
          <><AlertCircle size={16} /> Chưa cấu hình — Lead mới sẽ KHÔNG gửi thông báo</>
        )}
      </div>

      <div className="ws-grid">
        {/* Cột trái: Cấu hình */}
        <div className="ws-col-left">
          <div className="ws-card">
            <div className="ws-card-header">
              <Webhook size={20} />
              <h3>Kết Nối n8n Webhook</h3>
            </div>

            <div className="ws-form">
              <div className="ws-field">
                <label>n8n Webhook URL *</label>
                <input
                  type="url"
                  value={n8nWebhookUrl}
                  onChange={(e) => setN8nWebhookUrl(e.target.value)}
                  placeholder="https://your-n8n.com/webhook/xxxx-xxxx"
                />
                <span className="ws-hint">
                  Lấy URL này từ node "Webhook" trong n8n workflow. Chọn method POST.
                </span>
              </div>

              <div className="ws-field">
                <label>API Endpoint (Hệ thống tự động gọi)</label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="text"
                    value={notifyLeadUrl}
                    readOnly
                    style={{ flex: 1, backgroundColor: '#F3F4F6', color: '#6B7280' }}
                  />
                  <button type="button" onClick={() => handleCopyUrl(notifyLeadUrl)} style={{ padding: '10px 14px', background: '#E5E7EB', border: '1px solid #D1D5DB', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Copy size={16} color="#4B5563" />
                  </button>
                </div>
                <span className="ws-hint">
                  Endpoint nội bộ — Frontend tự gọi khi có Lead. Bạn không cần cấu hình gì thêm.
                </span>
              </div>

              <hr style={{ borderTop: '1px solid #E5E7EB', borderBottom: 'none', margin: '8px 0 0 0' }} />

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#111827', fontWeight: 600, fontSize: '14px' }}>
                  <Zap size={16} color="#F59E0B" /> Kiểm Tra Kết Nối
                </div>
                <p style={{ fontSize: '13px', color: '#6B7280', margin: '0 0 8px', lineHeight: 1.5 }}>
                  Gửi một Lead giả lập tới Webhook để kiểm tra liên kết.
                </p>
                <button className="ws-test-btn" onClick={handleTest} disabled={testing || !n8nWebhookUrl.trim()} style={{ width: '100%' }}>
                  {testing ? (
                    <><Loader2 size={16} className="spin" /> Đang gửi test...</>
                  ) : (
                    <><Send size={16} /> Gửi Test Webhook</>
                  )}
                </button>
                {testLog.length > 0 && (
                  <div className="ws-event-log" style={{ marginTop: '8px' }}>
                    {testLog.map((log, i) => (
                      <div key={i} className={log.includes('✅') ? 'log-success' : log.includes('❌') || log.includes('⚠️') ? 'log-error' : 'log-info'}>
                        {log}
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* Sự kiện Trigger */}
          <div className="ws-card">
            <div className="ws-card-header">
              <Bell size={20} />
              <h3>Sự Kiện Kích Hoạt (Events)</h3>
            </div>

            <div className="ws-toggle-row">
              <div className="ws-toggle-label">
                <strong>🔔 Lead Mới Đăng Ký</strong>
                <span>Gửi thông báo khi khách hàng để lại thông tin trên Landing Page</span>
              </div>
              <label className="ws-toggle">
                <input type="checkbox" checked={enableNewLead} onChange={(e) => setEnableNewLead(e.target.checked)} />
                <span className="ws-toggle-slider"></span>
              </label>
            </div>

            <div className="ws-toggle-row">
              <div className="ws-toggle-label">
                <strong>💰 Thanh Toán Thành Công</strong>
                <span>Gửi thông báo khi SePay xác nhận thanh toán</span>
              </div>
              <label className="ws-toggle">
                <input type="checkbox" checked={enablePayment} onChange={(e) => setEnablePayment(e.target.checked)} />
                <span className="ws-toggle-slider"></span>
              </label>
            </div>
            
            <button className="ws-save-btn" onClick={handleSave} disabled={saving} style={{ marginTop: '32px' }}>
              {saving ? (
                <><Loader2 size={16} className="spin" /> Đang lưu...</>
              ) : (
                <><Save size={16} /> Lưu Cấu Hình Webhook</>
              )}
            </button>
          </div>
        </div>

        {/* Cột phải: Hướng dẫn */}
        <div className="ws-col-right">
          {/* Hướng dẫn */}
          <div className="ws-card">
            <div className="ws-card-header">
              <RefreshCw size={20} />
              <h3>Hướng Dẫn Setup n8n</h3>
            </div>

            <div style={{ fontSize: '13px', color: '#4B5563', lineHeight: 1.8 }}>
              <ol style={{ paddingLeft: '20px', margin: 0 }}>
                <li><strong>Tạo Workflow mới</strong> trên n8n</li>
                <li>Thêm node <strong>"Webhook"</strong> → Method: POST → Copy URL</li>
                <li>Dán URL webhook vào ô bên trái</li>
                <li>Thêm node <strong>"HTTP Request"</strong> gọi Zalo OA API hoặc dùng node <strong>"Zalo"</strong> (community)</li>
                <li>Bấm <strong>"Gửi Test"</strong> để kiểm tra</li>
                <li><strong>Activate</strong> workflow trên n8n</li>
              </ol>

              <div style={{ marginTop: '16px', padding: '12px', background: '#F3F4F6', borderRadius: '8px', fontSize: '12px' }}>
                <strong>📦 Payload gửi tới n8n:</strong>
                <pre style={{ margin: '8px 0 0', whiteSpace: 'pre-wrap', color: '#374151' }}>
{`{
  "event": "new_lead",
  "timestamp": "2026-04-20T...",
  "lead": {
    "name": "Nguyễn Văn A",
    "phone": "0901234567",
    "email": "email@example.com",
    "courseName": "AI COACH",
    "source": "referral"
  }
}`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebhookSettings;
