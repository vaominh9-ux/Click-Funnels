import React, { useState, useEffect, useRef } from 'react';
import { Save, Loader2, Mail, LayoutTemplate, PenTool, CheckCircle, RefreshCcw, Code, Eye } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useToast } from '../../components/common/Toast';
import './EmailSettings.css';

const DEFAULT_REG_SUBJECT = '⚡ {{firstName}}, hoàn tất bước cuối để kích hoạt hệ thống';
const DEFAULT_REG_HTML = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#000000;font-family:Arial,Helvetica,sans-serif;">
  <div style="max-width:600px;margin:0 auto;">
    <div style="background:#F59E0B;padding:10px 24px;text-align:center;">
      <span style="color:#000;font-size:13px;font-weight:800;text-transform:uppercase;letter-spacing:2px;">⚡ ĐĂNG KÝ THÀNH CÔNG — HÀNH ĐỘNG NGAY ⚡</span>
    </div>
    <div style="background:#000000;padding:40px 32px;">
      <h1 style="color:#FFFFFF;font-size:28px;line-height:1.3;margin:0 0 8px;font-weight:900;">
        {{firstName}}, BẠN ĐÃ VÀO ĐÚNG CHỖ.
      </h1>
      <div style="width:60px;height:4px;background:#F59E0B;margin:0 0 24px;border-radius:2px;"></div>
      <p style="color:#D1D5DB;font-size:16px;line-height:1.7;margin:0 0 24px;">
        Chúng tôi đã nhận được đăng ký của bạn cho <strong style="color:#FFFFFF;">{{courseName}}</strong>.
      </p>
      <p style="color:#D1D5DB;font-size:16px;line-height:1.7;margin:0 0 32px;">
        Bây giờ, bạn chỉ cần làm <strong style="color:#F59E0B;font-size:18px;">MỘT BƯỚC DUY NHẤT</strong> để nhận toàn bộ hệ thống:
      </p>
      <div style="border:3px solid #F59E0B;border-radius:12px;overflow:hidden;margin-bottom:32px;">
        <div style="background:#F59E0B;padding:14px 20px;">
          <h2 style="color:#000000;font-size:16px;margin:0;font-weight:900;text-transform:uppercase;letter-spacing:1px;">💳 THANH TOÁN ĐỂ KÍCH HOẠT</h2>
        </div>
        <div style="background:#111827;padding:24px 20px;">
          <table style="width:100%;border-collapse:collapse;">
            <tr>
              <td style="color:#9CA3AF;font-size:14px;padding:10px 0;border-bottom:1px solid #1F2937;">Ngân hàng</td>
              <td style="color:#FFFFFF;font-size:14px;padding:10px 0;text-align:right;font-weight:700;border-bottom:1px solid #1F2937;">{{bankName}}</td>
            </tr>
            <tr>
              <td style="color:#9CA3AF;font-size:14px;padding:10px 0;border-bottom:1px solid #1F2937;">Chủ tài khoản</td>
              <td style="color:#FFFFFF;font-size:14px;padding:10px 0;text-align:right;font-weight:700;border-bottom:1px solid #1F2937;">{{accountName}}</td>
            </tr>
            <tr>
              <td style="color:#9CA3AF;font-size:14px;padding:10px 0;border-bottom:1px solid #1F2937;">Số tài khoản</td>
              <td style="color:#FFFFFF;font-size:14px;padding:10px 0;text-align:right;font-weight:700;border-bottom:1px solid #1F2937;">{{accountNo}}</td>
            </tr>
            <tr>
              <td style="color:#9CA3AF;font-size:14px;padding:10px 0;border-bottom:1px solid #1F2937;">Số tiền</td>
              <td style="color:#34D399;font-size:20px;padding:10px 0;text-align:right;font-weight:900;border-bottom:1px solid #1F2937;">{{formattedPrice}} đ</td>
            </tr>
          </table>
          <div style="background:#F59E0B;border-radius:8px;padding:16px;margin-top:16px;text-align:center;">
            <div style="color:#000;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">NỘI DUNG CHUYỂN KHOẢN (BẮT BUỘC)</div>
            <div style="color:#000;font-size:28px;font-weight:900;letter-spacing:4px;">{{paymentCode}}</div>
          </div>
        </div>
      </div>
      <div style="background:#7F1D1D;border-left:4px solid #EF4444;padding:16px 20px;border-radius:0 8px 8px 0;margin-bottom:32px;">
        <p style="color:#FCA5A5;font-size:14px;margin:0;line-height:1.6;font-weight:600;">
          ⚠️ GHI ĐÚNG NỘI DUNG CK: <span style="color:#FFFFFF;font-size:16px;">{{paymentCode}}</span><br>
          Sai nội dung = hệ thống KHÔNG thể xác nhận tự động.
        </p>
      </div>
      <div style="text-align:center;margin-bottom:32px;">
        <div style="display:inline-block;background:rgba(239,68,68,0.15);border:1px solid rgba(239,68,68,0.3);border-radius:8px;padding:12px 24px;">
          <span style="color:#EF4444;font-size:14px;font-weight:800;">⏰ ĐƠN HÀNG HẾT HẠN SAU 24 GIỜ</span>
        </div>
      </div>
      <div style="border-top:1px solid #1F2937;margin:32px 0;"></div>
      <h3 style="color:#FFFFFF;font-size:16px;margin:0 0 12px;font-weight:800;">SAU KHI THANH TOÁN, BẠN SẼ:</h3>
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="color:#34D399;font-size:20px;padding:8px 12px 8px 0;vertical-align:top;width:30px;">✓</td>
          <td style="color:#D1D5DB;font-size:14px;padding:8px 0;line-height:1.5;">Nhận email xác nhận thanh toán <strong style="color:#FFF;">tự động trong vài giây</strong></td>
        </tr>
        <tr>
          <td style="color:#34D399;font-size:20px;padding:8px 12px 8px 0;vertical-align:top;">✓</td>
          <td style="color:#D1D5DB;font-size:14px;padding:8px 0;line-height:1.5;">Được liên hệ trong <strong style="color:#FFF;">24 giờ</strong> để hướng dẫn truy cập hệ thống</td>
        </tr>
        <tr>
          <td style="color:#34D399;font-size:20px;padding:8px 12px 8px 0;vertical-align:top;">✓</td>
          <td style="color:#D1D5DB;font-size:14px;padding:8px 0;line-height:1.5;">Bắt đầu triển khai và <strong style="color:#FFF;">thấy kết quả ngay tuần đầu tiên</strong></td>
        </tr>
      </table>
    </div>
    <div style="background:#111827;padding:20px 32px;text-align:center;">
      <p style="color:#4B5563;font-size:11px;margin:0;line-height:1.6;">
        Email này được gửi tự động. Nếu bạn cần hỗ trợ, trả lời trực tiếp email này.<br>
        © {{year}} ClickFunnels. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>`;

const DEFAULT_PAY_SUBJECT = '🎉 {{firstName}}, BẠN ĐÃ VÀO — Thanh toán xác nhận thành công';
const DEFAULT_PAY_HTML = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#000000;font-family:Arial,Helvetica,sans-serif;">
  <div style="max-width:600px;margin:0 auto;">
    <div style="background:#059669;padding:10px 24px;text-align:center;">
      <span style="color:#FFF;font-size:13px;font-weight:800;text-transform:uppercase;letter-spacing:2px;">✅ THANH TOÁN ĐÃ XÁC NHẬN — BẠN ĐÃ VÀO TRONG</span>
    </div>
    <div style="background:#000000;padding:40px 32px;">
      <div style="text-align:center;margin-bottom:32px;">
        <div style="font-size:64px;margin-bottom:12px;">🎉</div>
        <h1 style="color:#FFFFFF;font-size:32px;line-height:1.2;margin:0 0 8px;font-weight:900;">
          CHÚC MỪNG, {{firstName_upper}}!
        </h1>
        <p style="color:#34D399;font-size:18px;margin:0;font-weight:700;">
          Bạn vừa đưa ra quyết định thay đổi cuộc chơi.
        </p>
      </div>
      <div style="width:100%;height:3px;background:linear-gradient(90deg,transparent,#34D399,transparent);margin:0 0 32px;"></div>
      <div style="border:2px solid #1F2937;border-radius:12px;overflow:hidden;margin-bottom:32px;">
        <div style="background:#065F46;padding:14px 20px;">
          <h2 style="color:#FFFFFF;font-size:14px;margin:0;font-weight:800;text-transform:uppercase;letter-spacing:1px;">📦 BIÊN NHẬN GIAO DỊCH</h2>
        </div>
        <div style="background:#0A0A0A;padding:20px;">
          <table style="width:100%;border-collapse:collapse;">
            <tr>
              <td style="color:#6B7280;font-size:13px;padding:10px 0;border-bottom:1px solid #1F2937;">Sản phẩm</td>
              <td style="color:#FFFFFF;font-size:13px;padding:10px 0;text-align:right;font-weight:700;border-bottom:1px solid #1F2937;">{{courseName}}</td>
            </tr>
            <tr>
              <td style="color:#6B7280;font-size:13px;padding:10px 0;border-bottom:1px solid #1F2937;">Mã đơn hàng</td>
              <td style="color:#F59E0B;font-size:14px;padding:10px 0;text-align:right;font-weight:800;letter-spacing:2px;border-bottom:1px solid #1F2937;">{{paymentCode}}</td>
            </tr>
            <tr>
              <td style="color:#6B7280;font-size:13px;padding:10px 0;border-bottom:1px solid #1F2937;">Thời gian</td>
              <td style="color:#FFFFFF;font-size:13px;padding:10px 0;text-align:right;font-weight:600;border-bottom:1px solid #1F2937;">{{formattedDate}}</td>
            </tr>
            <tr>
              <td style="color:#6B7280;font-size:13px;padding:10px 0;">Trạng thái</td>
              <td style="padding:10px 0;text-align:right;">
                <span style="background:#059669;color:#FFF;font-size:12px;font-weight:800;padding:4px 12px;border-radius:20px;text-transform:uppercase;">ĐÃ THANH TOÁN</span>
              </td>
            </tr>
          </table>
          <div style="background:#111827;border-radius:8px;padding:16px;margin-top:16px;text-align:center;">
            <div style="color:#6B7280;font-size:12px;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">TỔNG THANH TOÁN</div>
            <div style="color:#34D399;font-size:32px;font-weight:900;">{{formattedPrice}} đ</div>
          </div>
        </div>
      </div>
      <div style="background:#111827;border-radius:12px;padding:24px;margin-bottom:32px;">
        <h3 style="color:#F59E0B;font-size:16px;margin:0 0 16px;font-weight:900;text-transform:uppercase;">⚡ ĐIỀU GÌ SẼ XẢY RA TIẾP THEO?</h3>
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="color:#F59E0B;font-size:22px;padding:8px 16px 8px 0;vertical-align:top;width:40px;font-weight:900;">01</td>
            <td style="padding:8px 0;border-bottom:1px solid #1F2937;">
              <div style="color:#FFFFFF;font-size:14px;font-weight:700;margin-bottom:2px;">NHẬN LIÊN HỆ TỪ ĐỘI NGŨ</div>
              <div style="color:#9CA3AF;font-size:13px;">Trong vòng 24 giờ, chúng tôi sẽ gọi/nhắn tin hướng dẫn bạn truy cập.</div>
            </td>
          </tr>
          <tr>
            <td style="color:#F59E0B;font-size:22px;padding:12px 16px 8px 0;vertical-align:top;font-weight:900;">02</td>
            <td style="padding:12px 0 8px;border-bottom:1px solid #1F2937;">
              <div style="color:#FFFFFF;font-size:14px;font-weight:700;margin-bottom:2px;">SETUP HỆ THỐNG</div>
              <div style="color:#9CA3AF;font-size:13px;">Được kèm cặp 1-1 để triển khai vào doanh nghiệp của bạn.</div>
            </td>
          </tr>
          <tr>
            <td style="color:#F59E0B;font-size:22px;padding:12px 16px 8px 0;vertical-align:top;font-weight:900;">03</td>
            <td style="padding:12px 0 8px;">
              <div style="color:#FFFFFF;font-size:14px;font-weight:700;margin-bottom:2px;">THẤY KẾT QUẢ</div>
              <div style="color:#9CA3AF;font-size:13px;">Bắt đầu nhận được lead + doanh thu từ hệ thống automation.</div>
            </td>
          </tr>
        </table>
      </div>
      <div style="border-left:4px solid #F59E0B;padding:16px 24px;margin-bottom:32px;">
        <p style="color:#F8FAFC;font-size:16px;font-style:italic;margin:0 0 8px;line-height:1.6;">
          "Người thành công ra quyết định nhanh và đổi ý chậm. Bạn vừa chứng minh mình là một trong số đó."
        </p>
        <p style="color:#F59E0B;font-size:13px;margin:0;font-weight:700;">— CHÚNG TÔI TIN TƯỞNG BẠN 100%.</p>
      </div>
      <div style="background:#1E1B4B;border:1px solid #4338CA;border-radius:12px;padding:20px;text-align:center;margin-bottom:32px;">
        <div style="font-size:28px;margin-bottom:8px;">🛡️</div>
        <p style="color:#A5B4FC;font-size:14px;margin:0;line-height:1.6;">
          Nhắc lại: Bạn được <strong style="color:#FFFFFF;">BẢO HÀNH 100% HOÀN TIỀN</strong> nếu không hài lòng trong 14 ngày. Không hỏi lằng nhằng. Bạn giữ luôn tài liệu bonus.
        </p>
      </div>
    </div>
    <div style="background:#0A0A0A;padding:20px 32px;text-align:center;">
      <p style="color:#374151;font-size:11px;margin:0;line-height:1.6;">
        Email này được gửi tự động. Nếu bạn cần hỗ trợ, trả lời trực tiếp email này.<br>
        © {{year}} ClickFunnels. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>`;

const EmailSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const addToast = useToast();

  const [activeTab, setActiveTab] = useState('registration');

  // Reg state
  const [regSubject, setRegSubject] = useState(DEFAULT_REG_SUBJECT);
  const [regHtml, setRegHtml] = useState(DEFAULT_REG_HTML);

  // Pay state
  const [paySubject, setPaySubject] = useState(DEFAULT_PAY_SUBJECT);
  const [payHtml, setPayHtml] = useState(DEFAULT_PAY_HTML);

  // View mode
  const [viewMode, setViewMode] = useState('visual'); // 'visual' or 'code'
  const iframeRef = useRef(null);

  useEffect(() => {
    loadSettings();
  }, []);

  // Sync iframe content to state when typing
  useEffect(() => {
    if (viewMode === 'visual' && iframeRef.current && !loading) {
      const doc = iframeRef.current.contentDocument;
      if (doc) {
        doc.open();
        doc.write(activeTab === 'registration' ? regHtml : payHtml);
        doc.close();
        doc.designMode = 'on';

        // Custom styling for the editor environment
        const style = doc.createElement('style');
        style.textContent = `
          body { cursor: text; }
          a { cursor: pointer; }
          ::-webkit-scrollbar { width: 8px; }
          ::-webkit-scrollbar-track { background: #111; }
          ::-webkit-scrollbar-thumb { background: #333; border-radius: 4px; }
          ::-webkit-scrollbar-thumb:hover { background: #555; }
        `;
        doc.head.appendChild(style);

        const handleInput = () => {
          const docHTML = doc.body.innerHTML;
          const cssText = doc.body.style.cssText;
          const headHTML = doc.head.innerHTML;
          const html = '<!DOCTYPE html>\\n<html>\\n<head>\\n' + headHTML + '\\n</head>\\n<body style="' + cssText + '">\\n' + docHTML + '\\n</body>\\n</html>';
          // Remove the injected style
          let cleanHtml = html.replace(new RegExp('<style>[^<]*cursor: text[^<]*</style>', 'g'), '');
          if (activeTab === 'registration') {
            setRegHtml(cleanHtml);
          } else {
            setPayHtml(cleanHtml);
          }
        };

        doc.body.addEventListener('input', handleInput);
        doc.body.addEventListener('keyup', handleInput);
      }
    }
  }, [viewMode, activeTab, loading]);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const { data: regData } = await supabase
        .from('system_settings')
        .select('*')
        .eq('key', 'email_template_registration')
        .single();
      
      if (regData?.value) {
        setRegSubject(regData.value.subject || DEFAULT_REG_SUBJECT);
        setRegHtml(regData.value.htmlBody || DEFAULT_REG_HTML);
      }

      const { data: payData } = await supabase
        .from('system_settings')
        .select('*')
        .eq('key', 'email_template_payment')
        .single();

      if (payData?.value) {
        setPaySubject(payData.value.subject || DEFAULT_PAY_SUBJECT);
        setPayHtml(payData.value.htmlBody || DEFAULT_PAY_HTML);
      }
    } catch (err) {
      console.error('Lỗi khi tải mẫu email:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();

      await supabase.from('system_settings').upsert({
        key: 'email_template_registration',
        value: { subject: regSubject, htmlBody: regHtml },
        updated_at: new Date().toISOString(),
        updated_by: user?.id
      }, { onConflict: 'key' });

      await supabase.from('system_settings').upsert({
        key: 'email_template_payment',
        value: { subject: paySubject, htmlBody: payHtml },
        updated_at: new Date().toISOString(),
        updated_by: user?.id
      }, { onConflict: 'key' });

      addToast('Đã lưu mẫu email thành công!', 'success');
    } catch (err) {
      console.error('Lỗi khi lưu:', err);
      addToast('Lỗi: ' + err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const restoreDefault = () => {
    if (window.confirm('Bạn có chắc chắn muốn khôi phục về mẫu mặc định (Alex Hormozi style) không? Mọi thay đổi chưa lưu sẽ bị mất.')) {
      if (activeTab === 'registration') {
        setRegSubject(DEFAULT_REG_SUBJECT);
        setRegHtml(DEFAULT_REG_HTML);
      } else {
        setPaySubject(DEFAULT_PAY_SUBJECT);
        setPayHtml(DEFAULT_PAY_HTML);
      }
      addToast('Đã khôi phục mẫu mặc định. Hãy bấm Lưu để áp dụng.', 'info');
    }
  };

  if (loading) {
    return (
      <div className="email-settings-container">
        <div className="es-loading">
          <Loader2 size={32} className="spin" />
          <p>Đang tải mẫu email...</p>
        </div>
      </div>
    );
  }

  const currentSubject = activeTab === 'registration' ? regSubject : paySubject;
  const currentHtml = activeTab === 'registration' ? regHtml : payHtml;

  const handleSubjectChange = (val) => activeTab === 'registration' ? setRegSubject(val) : setPaySubject(val);
  const handleHtmlChange = (val) => activeTab === 'registration' ? setRegHtml(val) : setPayHtml(val);

  return (
    <div className="email-settings-container">
      <div className="es-header">
        <p className="es-subtitle">Cấu hình tiêu đề và mã nguồn HTML cho các Email tự động gửi cho khách hàng.</p>
      </div>

      <div className="es-tabs">
        <button 
          className={`es-tab ${activeTab === 'registration' ? 'active' : ''}`}
          onClick={() => setActiveTab('registration')}
        >
          <Mail size={16} />
          <span>Email Xác Nhận Đăng Ký</span>
        </button>
        <button 
          className={`es-tab ${activeTab === 'payment' ? 'active' : ''}`}
          onClick={() => setActiveTab('payment')}
        >
          <CheckCircle size={16} />
          <span>Email Thanh Toán Thành Công</span>
        </button>
      </div>

      <div className="es-content">
        <div className="es-col-left">
          <div className="es-card">
            <div className="es-form">
              <div className="es-field">
                <label>Tiêu đề Email (Subject)</label>
                <input 
                  type="text" 
                  value={currentSubject}
                  onChange={(e) => handleSubjectChange(e.target.value)}
                  placeholder="Tiêu đề email gửi đi..."
                />
              </div>

              <div className="es-field" style={{ flex: 1 }}>
                <label>Nội dung Email</label>
                <div className="es-editor-wrapper">
                  <div className="es-editor-toolbar">
                    <span className="es-editor-info">
                      {viewMode === 'visual' ? '✏️ Click trực tiếp vào nội dung để chỉnh sửa' : '💻 Chỉnh sửa mã nguồn HTML'}
                    </span>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <div className="es-mode-toggle">
                        <button type="button" className={`es-mode-btn ${viewMode === 'visual' ? 'active' : ''}`} onClick={() => setViewMode('visual')}>
                          <Eye size={14} /> Trực Quan
                        </button>
                        <button type="button" className={`es-mode-btn ${viewMode === 'code' ? 'active' : ''}`} onClick={() => setViewMode('code')}>
                          <Code size={14} /> Mã Code
                        </button>
                      </div>
                      <button type="button" className="es-restore-btn" onClick={restoreDefault}>
                        <RefreshCcw size={14} /> Mặc định
                      </button>
                    </div>
                  </div>
                  
                  {viewMode === 'visual' ? (
                    <iframe 
                      ref={iframeRef}
                      className="es-visual-frame"
                      title="Live Email Editor"
                    />
                  ) : (
                    <textarea 
                      value={currentHtml}
                      onChange={(e) => handleHtmlChange(e.target.value)}
                      className="es-html-editor"
                      spellCheck="false"
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="es-actions">
              <button className="es-save-btn" onClick={handleSave} disabled={saving}>
                {saving ? <><Loader2 size={16} className="spin" /> Đang lưu...</> : <><Save size={16} /> Lưu Thay Đổi</>}
              </button>
            </div>
          </div>
        </div>

        <div className="es-col-right">
          <div className="es-card">
            <div className="es-card-header">
              <LayoutTemplate size={18} />
              <h3>Biến Khả Dụng</h3>
            </div>
            <div className="es-guide">
              <p>Chèn các biến sau vào Tiêu đề hoặc HTML. Hệ thống sẽ tự điền dữ liệu thực tế khi gửi:</p>
              <ul>
                <li><code>{`{{firstName}}`}</code> — Tên gọi</li>
                <li><code>{`{{firstName_upper}}`}</code> — Tên HOA</li>
                <li><code>{`{{name}}`}</code> — Họ Tên</li>
                <li><code>{`{{courseName}}`}</code> — Khóa học</li>
                <li><code>{`{{formattedPrice}}`}</code> — Số tiền</li>
                <li><code>{`{{paymentCode}}`}</code> — Mã CK</li>
                <li><code>{`{{year}}`}</code> — Năm</li>
              </ul>

              {activeTab === 'registration' && (
                <>
                  <h4>Chỉ Email Đăng Ký:</h4>
                  <ul>
                    <li><code>{`{{bankName}}`}</code> — Ngân hàng</li>
                    <li><code>{`{{accountNo}}`}</code> — STK</li>
                    <li><code>{`{{accountName}}`}</code> — Chủ TK</li>
                  </ul>
                </>
              )}

              {activeTab === 'payment' && (
                <>
                  <h4>Chỉ Email Thanh Toán:</h4>
                  <ul>
                    <li><code>{`{{formattedDate}}`}</code> — Thời gian TT</li>
                  </ul>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailSettings;
