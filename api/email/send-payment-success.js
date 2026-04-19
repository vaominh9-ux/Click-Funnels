// Vercel Serverless Function — Gửi Email Xác Nhận Thanh Toán Thành Công
// Route: POST /api/email/send-payment-success

import nodemailer from 'nodemailer';

const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
};

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

function replaceVariables(text, data) {
  if (!text) return '';
  let result = text;
  Object.keys(data).forEach(key => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    result = result.replace(regex, data[key]);
  });
  return result;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ success: false, message: 'Method not allowed' });

  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.error('Missing Gmail SMTP credentials');
    return res.status(500).json({ success: false, message: 'Email service not configured' });
  }

  const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

  try {
    const { name, email, courseName, coursePrice, paymentCode, paidAt } = req.body;

    if (!email) {
      return res.status(200).json({ success: true, message: 'No email provided, skipped' });
    }

    // 1. Fetch template từ database
    let subjectTemplate = DEFAULT_PAY_SUBJECT;
    let htmlTemplate = DEFAULT_PAY_HTML;

    if (SUPABASE_URL && SUPABASE_KEY) {
      try {
        const settingsRes = await fetch(
          `${SUPABASE_URL}/rest/v1/system_settings?key=eq.email_template_payment&select=value`,
          { headers: { 'apikey': SUPABASE_KEY, 'Authorization': \`Bearer \${SUPABASE_KEY}\` } }
        );
        const settingsData = await settingsRes.json();
        if (Array.isArray(settingsData) && settingsData.length > 0 && settingsData[0].value) {
          if (settingsData[0].value.subject) subjectTemplate = settingsData[0].value.subject;
          if (settingsData[0].value.htmlBody) htmlTemplate = settingsData[0].value.htmlBody;
        }
      } catch (e) {
        console.error('Fetch template error: fallback to default', e);
      }
    }

    const transporter = createTransporter();
    const formattedPrice = Number(coursePrice).toLocaleString('vi-VN');
    const firstName = name.split(' ').pop();

    let formattedDate = 'Vừa xong';
    try {
      const d = new Date(paidAt);
      formattedDate = d.toLocaleString('vi-VN', {
        timeZone: 'Asia/Ho_Chi_Minh',
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
      });
    } catch(e) { /* fallback */ }

    const variables = {
      firstName,
      firstName_upper: firstName.toUpperCase(),
      name,
      courseName,
      formattedPrice,
      paymentCode,
      formattedDate,
      year: new Date().getFullYear()
    };

    const finalSubject = replaceVariables(subjectTemplate, variables);
    const finalHtml = replaceVariables(htmlTemplate, variables);

    const info = await transporter.sendMail({
      from: \`"ClickFunnels" <\${process.env.GMAIL_USER}>\`,
      to: email,
      subject: finalSubject,
      html: finalHtml,
    });

    console.log(\`✅ Payment success email sent to \${email}, ID: \${info.messageId}\`);
    return res.status(200).json({ success: true, messageId: info.messageId });

  } catch (error) {
    console.error('Send payment success email error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
}
