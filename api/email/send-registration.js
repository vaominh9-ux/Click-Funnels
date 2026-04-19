// Vercel Serverless Function — Gửi Email Xác Nhận Đăng Ký
// Route: POST /api/email/send-registration
// Dùng Nodemailer + Gmail SMTP (miễn phí, không cần domain riêng)

import nodemailer from 'nodemailer';

// Tạo transporter Gmail SMTP (reuse across invocations)
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
};

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.error('Missing Gmail SMTP credentials');
    return res.status(500).json({ success: false, message: 'Email service not configured' });
  }

  try {
    const { name, email, phone, courseName, coursePrice, paymentCode, bankConfig } = req.body;

    // Nếu không có email → skip, không lỗi
    if (!email) {
      return res.status(200).json({ success: true, message: 'No email provided, skipped' });
    }

    const transporter = createTransporter();

    const formattedPrice = Number(coursePrice).toLocaleString('vi-VN');
    const bankName = bankConfig?.bankName || 'BIDV';
    const accountNo = bankConfig?.accountNo || '96247NTH195';
    const accountName = bankConfig?.accountName || 'NGUYEN TRONG HUU';

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#0F172A;font-family:'Segoe UI',Roboto,Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:24px;">
    
    <!-- Header -->
    <div style="background:linear-gradient(135deg,#1E293B 0%,#334155 100%);border-radius:16px 16px 0 0;padding:32px 24px;text-align:center;border-bottom:3px solid #F59E0B;">
      <div style="font-size:32px;margin-bottom:8px;">📋</div>
      <h1 style="color:#F8FAFC;font-size:22px;margin:0 0 4px;">Xác Nhận Đăng Ký</h1>
      <p style="color:#94A3B8;font-size:14px;margin:0;">Đơn hàng của bạn đã được tạo thành công</p>
    </div>

    <!-- Body -->
    <div style="background:#1E293B;padding:24px;border-radius:0 0 16px 16px;">
      
      <!-- Greeting -->
      <p style="color:#E2E8F0;font-size:16px;margin:0 0 20px;">
        Xin chào <strong style="color:#F59E0B;">${name}</strong>,
      </p>
      <p style="color:#CBD5E1;font-size:14px;margin:0 0 24px;line-height:1.6;">
        Cảm ơn bạn đã đăng ký! Dưới đây là thông tin đơn hàng và hướng dẫn thanh toán.
      </p>

      <!-- Order Info -->
      <div style="background:rgba(245,158,11,0.08);border:1px solid rgba(245,158,11,0.2);border-radius:12px;padding:20px;margin-bottom:20px;">
        <h3 style="color:#F59E0B;font-size:14px;text-transform:uppercase;letter-spacing:1px;margin:0 0 16px;">📦 Thông Tin Đơn Hàng</h3>
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="color:#94A3B8;font-size:13px;padding:6px 0;">Sản phẩm</td>
            <td style="color:#F8FAFC;font-size:13px;padding:6px 0;text-align:right;font-weight:600;">${courseName}</td>
          </tr>
          <tr>
            <td style="color:#94A3B8;font-size:13px;padding:6px 0;">Số tiền</td>
            <td style="color:#34D399;font-size:15px;padding:6px 0;text-align:right;font-weight:700;">${formattedPrice} đ</td>
          </tr>
          <tr>
            <td style="color:#94A3B8;font-size:13px;padding:6px 0;">Mã đơn hàng</td>
            <td style="color:#F59E0B;font-size:16px;padding:6px 0;text-align:right;font-weight:700;letter-spacing:2px;">${paymentCode}</td>
          </tr>
        </table>
      </div>

      <!-- Payment Instructions -->
      <div style="background:rgba(56,189,248,0.08);border:1px solid rgba(56,189,248,0.2);border-radius:12px;padding:20px;margin-bottom:20px;">
        <h3 style="color:#38BDF8;font-size:14px;text-transform:uppercase;letter-spacing:1px;margin:0 0 16px;">💳 Hướng Dẫn Thanh Toán</h3>
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="color:#94A3B8;font-size:13px;padding:6px 0;">Ngân hàng</td>
            <td style="color:#F8FAFC;font-size:13px;padding:6px 0;text-align:right;font-weight:600;">${bankName}</td>
          </tr>
          <tr>
            <td style="color:#94A3B8;font-size:13px;padding:6px 0;">Chủ tài khoản</td>
            <td style="color:#F8FAFC;font-size:13px;padding:6px 0;text-align:right;font-weight:600;">${accountName}</td>
          </tr>
          <tr>
            <td style="color:#94A3B8;font-size:13px;padding:6px 0;">Số tài khoản</td>
            <td style="color:#F8FAFC;font-size:13px;padding:6px 0;text-align:right;font-weight:600;">${accountNo}</td>
          </tr>
          <tr style="background:rgba(245,158,11,0.1);border-radius:8px;">
            <td style="color:#F59E0B;font-size:13px;padding:10px 6px;font-weight:600;">⚠️ Nội dung CK</td>
            <td style="color:#F59E0B;font-size:18px;padding:10px 6px;text-align:right;font-weight:800;letter-spacing:3px;">${paymentCode}</td>
          </tr>
        </table>
      </div>

      <!-- Important Note -->
      <div style="background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.15);border-radius:12px;padding:16px;margin-bottom:24px;">
        <p style="color:#FCA5A5;font-size:13px;margin:0;line-height:1.5;">
          ⏳ <strong>Lưu ý quan trọng:</strong> Vui lòng ghi đúng nội dung chuyển khoản là <strong style="color:#F59E0B;">${paymentCode}</strong> để hệ thống tự động xác nhận thanh toán. Đơn hàng sẽ hết hạn sau 24 giờ.
        </p>
      </div>

      <!-- Divider -->
      <hr style="border:none;border-top:1px solid rgba(148,163,184,0.15);margin:24px 0;">

      <!-- Footer -->
      <p style="color:#64748B;font-size:12px;text-align:center;margin:0;line-height:1.5;">
        Email này được gửi tự động. Nếu bạn cần hỗ trợ, vui lòng trả lời email này.<br>
        © ${new Date().getFullYear()} ClickFunnels. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>`;

    const info = await transporter.sendMail({
      from: `"ClickFunnels" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: `📋 Xác nhận đăng ký — ${courseName}`,
      html: htmlContent,
    });

    console.log(`✅ Registration email sent to ${email}, ID: ${info.messageId}`);
    return res.status(200).json({ success: true, messageId: info.messageId });

  } catch (error) {
    console.error('Send registration email error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
}
