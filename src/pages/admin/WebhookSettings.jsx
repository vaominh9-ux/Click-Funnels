import React, { useState, useEffect } from 'react';
import { Save, Loader2, Webhook, Zap, Send, CheckCircle, AlertCircle, Copy, RefreshCw, Bell, Link, MessageSquare } from 'lucide-react';
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
  const [adminTemplate, setAdminTemplate] = useState('🔥 CÓ KHÁCH ĐĂNG KÝ MỚI 🔥\n🧑 Tên: {{name}}\n📞 SĐT: {{phone}}\n🛒 Phễu: {{courseName}}\n📧 Email: {{email}}');
  const [customerTemplate, setCustomerTemplate] = useState('Xin chào {{name}} 🎉\nChúc mừng bạn đã đăng ký thành công chương trình: {{courseName}}.\n\nTrợ lý AI của chúng tôi sẽ tự động kết nối và hỗ trợ bạn qua Zalo này nhé. Vui lòng chú ý tin nhắn!');
  
  const [paymentAdminTemplate, setPaymentAdminTemplate] = useState('💰 TING TING! KHÁCH CHỐT ĐƠN 💰\n🧑 Khách: {{name}}\n📞 SĐT: {{phone}}\n🛒 Mua: {{courseName}}\n💸 Số tiền: {{amount}}đ');
  const [paymentCustomerTemplate, setPaymentCustomerTemplate] = useState('Xin chào {{name}} 💖\nThanh toán của bạn cho khóa: {{courseName}} đã thành công.\n\nHệ thống đã ghi nhận số tiền {{amount}}đ. Đội ngũ AI sẽ sớm liên hệ xác nhận thủ tục vào lớp học với bạn nhé!');

  const [paidPendingAdminTemplate, setPaidPendingAdminTemplate] = useState('⏳ CÓ KHÁCH VÀO GIỎ HÀNG ⏳\n🧑 Tên: {{name}}\n📞 SĐT: {{phone}}\n🛒 Gói: {{courseName}}\nCần chú ý xem khách có thanh toán hay bị Rớt Lead không nhé!');
  const [paidPendingCustomerTemplate, setPaidPendingCustomerTemplate] = useState('Xin chào {{name}} 👋\nBạn vừa đăng ký gói: {{courseName}}. Tuy nhiên hệ thống chưa ghi nhận thanh toán.\n\nBạn vui lòng quét mã QR gửi kèm hoặc hoàn tất quá trình thanh toán để chúng tôi có thể đưa bạn vào nhóm nhé!');
  
  const [testLog, setTestLog] = useState([]);
  const [activeTab, setActiveTab] = useState('connection');
  const [messageType, setMessageType] = useState('new_lead');

  // Internal state
  const [notifyLeadUrl, setNotifyLeadUrl] = useState('');

  useEffect(() => {
    loadSettings();
    setNotifyLeadUrl(`${API_BASE}/api/webhook/notify-lead`);
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
        if (config.adminTemplate) setAdminTemplate(config.adminTemplate);
        if (config.customerTemplate) setCustomerTemplate(config.customerTemplate);
        if (config.paymentAdminTemplate) setPaymentAdminTemplate(config.paymentAdminTemplate);
        if (config.paymentCustomerTemplate) setPaymentCustomerTemplate(config.paymentCustomerTemplate);
        if (config.paidPendingAdminTemplate) setPaidPendingAdminTemplate(config.paidPendingAdminTemplate);
        if (config.paidPendingCustomerTemplate) setPaidPendingCustomerTemplate(config.paidPendingCustomerTemplate);
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
            adminTemplate,
            customerTemplate,
            paymentAdminTemplate,
            paymentCustomerTemplate,
            paidPendingAdminTemplate,
            paidPendingCustomerTemplate
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
          name: 'Nguyễn Test',
          phone: '0901234567',
          email: 'test@example.com',
          courseName: 'Khóa Học Mẫu',
          source: 'admin-test'
        })
      });

      const resData = await response.json();
      
      if (response.ok && resData.success !== false) {
        addLog('✅ n8n đã nhận thành công (Status 200)');
        addToast('Test Webhook thành công!', 'success');
      } else {
        addLog(`❌ Lỗi từ n8n: ${resData.message || 'Unknown error'}`);
        addToast('Test Webhook thất bại!', 'error');
      }
    } catch (err) {
      addLog(`❌ Lỗi kết nối: ${err.message}`);
      addToast('Không thể gửi test Webhook', 'error');
    } finally {
      setTesting(false);
    }
  };

  const handleCopyUrl = (text) => {
    navigator.clipboard.writeText(text);
    addToast('Đã copy: ' + text);
  };

  const status = n8nWebhookUrl ? 'connected' : 'disconnected';

  if (loading) {
    return (
      <div className="webhook-settings-container" style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
        <Loader2 className="spin text-blue-500" size={32} />
      </div>
    );
  }

  return (
    <div className="webhook-settings-container">
      <div className="ws-header">
        <h2>Webhook (n8n)</h2>
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

      <div className="ws-tabs">
        <button 
          className={`ws-tab ${activeTab === 'connection' ? 'active' : ''}`}
          onClick={() => setActiveTab('connection')}
        >
          <Link size={16} /> Kết Nối & Hướng Dẫn
        </button>
        <button 
          className={`ws-tab ${activeTab === 'messages' ? 'active' : ''}`}
          onClick={() => setActiveTab('messages')}
        >
          <MessageSquare size={16} /> Mẫu Giao Tiếp & Kích Hoạt
        </button>
      </div>

      {activeTab === 'connection' && (
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
            
            <div className="ws-actions" style={{ marginTop: '8px' }}>
              <button className="ws-save-btn" onClick={handleSave} disabled={saving} style={{width: '100%'}}>
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
    "source": "referral",
    "adminNotificationTemplate": "🔥 CÓ KHÁCH...\\n🧑 Tên: ...",
    "customerWelcomeTemplate": "Xin chào Nguyễn Văn A 🎉\\nChúc mừng..."
  }
}`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'messages' && (
        <div className="ws-grid">
          {/* Cột trái: Form cấu hình mẫu */}
          <div className="ws-col-left">
            <div className="ws-card">
              <div className="ws-card-header" style={{ justifyContent: 'space-between', display: 'flex', alignItems: 'center', width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <MessageSquare size={20} />
                  <h3>Cấu Hình Mẫu Giao Tiếp</h3>
                </div>
                <select 
                  value={messageType} 
                  onChange={(e) => setMessageType(e.target.value)}
                  style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '13px', fontWeight: 600, color: '#111827', outline: 'none', cursor: 'pointer', background: '#F9FAFB' }}
                >
                  <option value="new_lead">🔔 Sự kiện: Đăng Ký Mới (Khóa Miễn Phí)</option>
                  <option value="paid_pending">⏳ Sự kiện: Giỏ Hàng/Chưa TT (Gói Trả Phí)</option>
                  <option value="payment">💰 Sự kiện: Thanh Toán Thành Công</option>
                </select>
              </div>
              
              <div className="ws-form">
                {messageType === 'new_lead' && (
                  <div>
                    <div className="ws-field" style={{ marginBottom: '20px' }}>
                      <label style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Mẫu Gửi Khách Hàng (Zalo OA/SMS)</span>
                        <span style={{ fontSize: '11px', fontWeight: 'normal', color: '#6B7280' }}>
                          Biến: <code onClick={() => handleCopyUrl('{{name}}')} style={{cursor:'pointer', color:'#3B82F6'}}>{"{{name}}"}</code>{' '}
                          <code onClick={() => handleCopyUrl('{{phone}}')} style={{cursor:'pointer', color:'#3B82F6'}}>{"{{phone}}"}</code>{' '}
                          <code onClick={() => handleCopyUrl('{{courseName}}')} style={{cursor:'pointer', color:'#3B82F6'}}>{"{{courseName}}"}</code>
                        </span>
                      </label>
                      <textarea
                        value={customerTemplate}
                        onChange={(e) => setCustomerTemplate(e.target.value)}
                        placeholder="Xin chào {{name}}..."
                        style={{ minHeight: '180px', fontSize: '13px', fontFamily: 'inherit' }}
                      />
                    </div>

                    <div className="ws-field">
                      <label style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Mẫu Thông Báo Admin (Telegram/Zalo Nhóm)</span>
                      </label>
                      <textarea
                        value={adminTemplate}
                        onChange={(e) => setAdminTemplate(e.target.value)}
                        placeholder="🔥 CÓ KHÁCH ĐĂNG KÝ MỚI 🔥..."
                        style={{ minHeight: '180px', fontSize: '13px', fontFamily: 'inherit' }}
                      />
                    </div>
                  </div>
                )}

                {messageType === 'payment' && (
                  <div>
                    <div className="ws-field" style={{ marginBottom: '20px' }}>
                      <label style={{ display: 'flex', justifyContent: 'space-between', color: '#166534' }}>
                        <span>Mẫu Nhắn Khách Hàng (Ting Ting)</span>
                        <span style={{ fontSize: '11px', fontWeight: 'normal', color: '#6B7280' }}>
                          Biến: <code onClick={() => handleCopyUrl('{{amount}}')} style={{cursor:'pointer', color:'#3B82F6'}}>{"{{amount}}"}</code>{' '}
                          <code onClick={() => handleCopyUrl('{{name}}')} style={{cursor:'pointer', color:'#3B82F6'}}>{"{{name}}"}</code>{' '}
                          <code onClick={() => handleCopyUrl('{{courseName}}')} style={{cursor:'pointer', color:'#3B82F6'}}>{"{{courseName}}"}</code>
                        </span>
                      </label>
                      <textarea
                        value={paymentCustomerTemplate}
                        onChange={(e) => setPaymentCustomerTemplate(e.target.value)}
                        placeholder="Xin chào {{name}}, cám ơn bạn đã thanh toán..."
                        style={{ minHeight: '180px', fontSize: '13px', fontFamily: 'inherit', borderColor: '#BBF7D0', background: '#F0FDF4' }}
                      />
                    </div>

                    <div className="ws-field">
                      <label style={{ display: 'flex', justifyContent: 'space-between', color: '#166534' }}>
                        <span>Mẫu Báo Cáo Admin Doanh Thu</span>
                      </label>
                      <textarea
                        value={paymentAdminTemplate}
                        onChange={(e) => setPaymentAdminTemplate(e.target.value)}
                        placeholder="💰 TING TING! SẾP ƠI QUAY XE..."
                        style={{ minHeight: '180px', fontSize: '13px', fontFamily: 'inherit', borderColor: '#BBF7D0', background: '#F0FDF4' }}
                      />
                    </div>
                  </div>
                )}

                {messageType === 'paid_pending' && (
                  <div>
                    <div className="ws-field" style={{ marginBottom: '20px' }}>
                      <label style={{ display: 'flex', justifyContent: 'space-between', color: '#B45309' }}>
                        <span>Mẫu Nhắc Thanh Toán Khách Hàng (Zalo OA/SMS)</span>
                        <span style={{ fontSize: '11px', fontWeight: 'normal', color: '#6B7280' }}>
                          Biến: <code onClick={() => handleCopyUrl('{{name}}')} style={{cursor:'pointer', color:'#3B82F6'}}>{"{{name}}"}</code>{' '}
                          <code onClick={() => handleCopyUrl('{{phone}}')} style={{cursor:'pointer', color:'#3B82F6'}}>{"{{phone}}"}</code>{' '}
                          <code onClick={() => handleCopyUrl('{{courseName}}')} style={{cursor:'pointer', color:'#3B82F6'}}>{"{{courseName}}"}</code>
                        </span>
                      </label>
                      <textarea
                        value={paidPendingCustomerTemplate}
                        onChange={(e) => setPaidPendingCustomerTemplate(e.target.value)}
                        placeholder="Chúng tôi thấy bạn đang ở bước thanh toán..."
                        style={{ minHeight: '180px', fontSize: '13px', fontFamily: 'inherit', borderColor: '#FEF3C7', background: '#FFFBEB' }}
                      />
                    </div>

                    <div className="ws-field">
                      <label style={{ display: 'flex', justifyContent: 'space-between', color: '#B45309' }}>
                        <span>Mẫu Cảnh Báo Abandon Checkout (Cho Admin)</span>
                      </label>
                      <textarea
                        value={paidPendingAdminTemplate}
                        onChange={(e) => setPaidPendingAdminTemplate(e.target.value)}
                        placeholder="⏳ CÓ KHÁCH VÀO GIỎ HÀNG..."
                        style={{ minHeight: '180px', fontSize: '13px', fontFamily: 'inherit', borderColor: '#FEF3C7', background: '#FFFBEB' }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Cột phải: Sự Kiện Trigger và Node Lưu */}
          <div className="ws-col-right">
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
                  <input
                    type="checkbox"
                    checked={enableNewLead}
                    onChange={(e) => setEnableNewLead(e.target.checked)}
                  />
                  <span className="ws-toggle-slider"></span>
                </label>
              </div>

              <div className="ws-toggle-row">
                <div className="ws-toggle-label">
                  <strong>💰 Thanh Toán Thành Công</strong>
                  <span>Gửi tin xác nhận khi khách thanh toán khóa học qua SePay</span>
                </div>
                <label className="ws-toggle">
                  <input
                    type="checkbox"
                    checked={enablePayment}
                    onChange={(e) => setEnablePayment(e.target.checked)}
                  />
                  <span className="ws-toggle-slider"></span>
                </label>
              </div>

              <div className="ws-actions" style={{ marginTop: '32px' }}>
                <button className="ws-save-btn" onClick={handleSave} disabled={saving} style={{width: '100%'}}>
                  {saving ? (
                    <><Loader2 size={16} className="spin" /> Đang lưu...</>
                  ) : (
                    <><Save size={16} /> Lưu Cấu Hình Khóa & Sự Kiện</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
};

export default WebhookSettings;
