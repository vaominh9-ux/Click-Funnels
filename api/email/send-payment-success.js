// Vercel Serverless Function — Gửi Email Xác Nhận Thanh Toán Thành Công
// Route: POST /api/email/send-payment-success
// Được gọi từ sepay-webhook.js sau khi đơn hàng được approve

import { Resend } from 'resend';

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

  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  if (!RESEND_API_KEY) {
    console.error('Missing RESEND_API_KEY');
    return res.status(500).json({ success: false, message: 'Email service not configured' });
  }

  try {
    const { name, email, courseName, coursePrice, paymentCode, paidAt } = req.body;

    // Nếu không có email → skip, không lỗi
    if (!email) {
      return res.status(200).json({ success: true, message: 'No email provided, skipped' });
    }

    const resend = new Resend(RESEND_API_KEY);

    const formattedPrice = Number(coursePrice).toLocaleString('vi-VN');
    
    // Format ngày giờ thanh toán
    let formattedDate = 'Vừa xong';
    try {
      const d = new Date(paidAt);
      formattedDate = d.toLocaleString('vi-VN', {
        timeZone: 'Asia/Ho_Chi_Minh',
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
      });
    } catch(e) { /* fallback */ }

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
    <div style="background:linear-gradient(135deg,#064E3B 0%,#065F46 100%);border-radius:16px 16px 0 0;padding:32px 24px;text-align:center;border-bottom:3px solid #34D399;">
      <div style="font-size:48px;margin-bottom:8px;">✅</div>
      <h1 style="color:#F8FAFC;font-size:22px;margin:0 0 4px;">Thanh Toán Thành Công!</h1>
      <p style="color:#6EE7B7;font-size:14px;margin:0;">Đơn hàng đã được xác nhận tự động</p>
    </div>

    <!-- Body -->
    <div style="background:#1E293B;padding:24px;border-radius:0 0 16px 16px;">
      
      <!-- Greeting -->
      <p style="color:#E2E8F0;font-size:16px;margin:0 0 8px;">
        Xin chào <strong style="color:#34D399;">${name}</strong>,
      </p>
      <p style="color:#CBD5E1;font-size:14px;margin:0 0 24px;line-height:1.6;">
        🎉 Chúc mừng! Chúng tôi đã nhận được thanh toán của bạn thành công!
      </p>

      <!-- Success Badge -->
      <div style="background:rgba(52,211,153,0.1);border:2px solid rgba(52,211,153,0.3);border-radius:12px;padding:20px;margin-bottom:20px;text-align:center;">
        <div style="color:#34D399;font-size:28px;font-weight:800;margin-bottom:4px;">${formattedPrice} đ</div>
        <div style="color:#6EE7B7;font-size:13px;">Đã thanh toán thành công</div>
      </div>

      <!-- Order Details -->
      <div style="background:rgba(99,102,241,0.08);border:1px solid rgba(99,102,241,0.2);border-radius:12px;padding:20px;margin-bottom:20px;">
        <h3 style="color:#818CF8;font-size:14px;text-transform:uppercase;letter-spacing:1px;margin:0 0 16px;">📦 Chi Tiết Giao Dịch</h3>
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="color:#94A3B8;font-size:13px;padding:8px 0;border-bottom:1px solid rgba(148,163,184,0.1);">Sản phẩm</td>
            <td style="color:#F8FAFC;font-size:13px;padding:8px 0;text-align:right;font-weight:600;border-bottom:1px solid rgba(148,163,184,0.1);">${courseName}</td>
          </tr>
          <tr>
            <td style="color:#94A3B8;font-size:13px;padding:8px 0;border-bottom:1px solid rgba(148,163,184,0.1);">Số tiền</td>
            <td style="color:#34D399;font-size:15px;padding:8px 0;text-align:right;font-weight:700;border-bottom:1px solid rgba(148,163,184,0.1);">${formattedPrice} đ</td>
          </tr>
          <tr>
            <td style="color:#94A3B8;font-size:13px;padding:8px 0;border-bottom:1px solid rgba(148,163,184,0.1);">Mã đơn hàng</td>
            <td style="color:#F59E0B;font-size:14px;padding:8px 0;text-align:right;font-weight:700;letter-spacing:2px;border-bottom:1px solid rgba(148,163,184,0.1);">${paymentCode}</td>
          </tr>
          <tr>
            <td style="color:#94A3B8;font-size:13px;padding:8px 0;">Thời gian</td>
            <td style="color:#F8FAFC;font-size:13px;padding:8px 0;text-align:right;font-weight:600;">${formattedDate}</td>
          </tr>
        </table>
      </div>

      <!-- Next Steps -->
      <div style="background:rgba(245,158,11,0.08);border:1px solid rgba(245,158,11,0.2);border-radius:12px;padding:20px;margin-bottom:24px;">
        <h3 style="color:#F59E0B;font-size:14px;text-transform:uppercase;letter-spacing:1px;margin:0 0 12px;">📞 Bước Tiếp Theo</h3>
        <ul style="color:#CBD5E1;font-size:13px;margin:0;padding-left:16px;line-height:2;">
          <li>Đội ngũ hỗ trợ sẽ liên hệ bạn trong <strong style="color:#F8FAFC;">24 giờ</strong> để hướng dẫn truy cập.</li>
          <li>Vui lòng giữ điện thoại để nhận cuộc gọi/tin nhắn từ chúng tôi.</li>
          <li>Nếu cần hỗ trợ gấp, hãy trả lời email này.</li>
        </ul>
      </div>

      <!-- Divider -->
      <hr style="border:none;border-top:1px solid rgba(148,163,184,0.15);margin:24px 0;">

      <!-- Footer -->
      <p style="color:#64748B;font-size:12px;text-align:center;margin:0;line-height:1.5;">
        Cảm ơn bạn đã tin tưởng và lựa chọn chúng tôi! 💚<br>
        Email này được gửi tự động. Nếu bạn cần hỗ trợ, vui lòng trả lời email này.<br>
        © ${new Date().getFullYear()} ClickFunnels. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>`;

    const { data, error } = await resend.emails.send({
      from: 'ClickFunnels <onboarding@resend.dev>',
      to: [email],
      subject: `✅ Thanh toán thành công — ${courseName}`,
      html: htmlContent,
    });

    if (error) {
      console.error('Resend error (payment success):', error);
      return res.status(500).json({ success: false, message: error.message });
    }

    console.log(`✅ Payment success email sent to ${email}, ID: ${data.id}`);
    return res.status(200).json({ success: true, emailId: data.id });

  } catch (error) {
    console.error('Send payment success email error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
}
