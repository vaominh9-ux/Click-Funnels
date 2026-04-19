// Vercel Serverless Function — Gửi Email Xác Nhận Đăng Ký
// Route: POST /api/email/send-registration
// Style: Alex Hormozi — Bold, Direct, High-Conversion

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

  try {
    const { name, email, phone, courseName, coursePrice, paymentCode, bankConfig } = req.body;

    if (!email) {
      return res.status(200).json({ success: true, message: 'No email provided, skipped' });
    }

    const transporter = createTransporter();
    const formattedPrice = Number(coursePrice).toLocaleString('vi-VN');
    const bankName = bankConfig?.bankName || 'BIDV';
    const accountNo = bankConfig?.accountNo || '96247NTH195';
    const accountName = bankConfig?.accountName || 'NGUYEN TRONG HUU';
    const firstName = name.split(' ').pop();

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#000000;font-family:Arial,Helvetica,sans-serif;">
  <div style="max-width:600px;margin:0 auto;">
    
    <!-- TOP BAR -->
    <div style="background:#F59E0B;padding:10px 24px;text-align:center;">
      <span style="color:#000;font-size:13px;font-weight:800;text-transform:uppercase;letter-spacing:2px;">⚡ ĐĂNG KÝ THÀNH CÔNG — HÀNH ĐỘNG NGAY ⚡</span>
    </div>

    <!-- MAIN CONTENT -->
    <div style="background:#000000;padding:40px 32px;">
      
      <!-- HEADLINE -->
      <h1 style="color:#FFFFFF;font-size:28px;line-height:1.3;margin:0 0 8px;font-weight:900;">
        ${firstName}, BẠN ĐÃ VÀO ĐÚNG CHỖ.
      </h1>
      <div style="width:60px;height:4px;background:#F59E0B;margin:0 0 24px;border-radius:2px;"></div>

      <p style="color:#D1D5DB;font-size:16px;line-height:1.7;margin:0 0 24px;">
        Chúng tôi đã nhận được đăng ký của bạn cho <strong style="color:#FFFFFF;">${courseName}</strong>.
      </p>

      <p style="color:#D1D5DB;font-size:16px;line-height:1.7;margin:0 0 32px;">
        Bây giờ, bạn chỉ cần làm <strong style="color:#F59E0B;font-size:18px;">MỘT BƯỚC DUY NHẤT</strong> để nhận toàn bộ hệ thống:
      </p>

      <!-- PAYMENT BOX -->
      <div style="border:3px solid #F59E0B;border-radius:12px;overflow:hidden;margin-bottom:32px;">
        
        <!-- Box Header -->
        <div style="background:#F59E0B;padding:14px 20px;">
          <h2 style="color:#000000;font-size:16px;margin:0;font-weight:900;text-transform:uppercase;letter-spacing:1px;">💳 THANH TOÁN ĐỂ KÍCH HOẠT</h2>
        </div>

        <!-- Box Content -->
        <div style="background:#111827;padding:24px 20px;">
          <table style="width:100%;border-collapse:collapse;">
            <tr>
              <td style="color:#9CA3AF;font-size:14px;padding:10px 0;border-bottom:1px solid #1F2937;">Ngân hàng</td>
              <td style="color:#FFFFFF;font-size:14px;padding:10px 0;text-align:right;font-weight:700;border-bottom:1px solid #1F2937;">${bankName}</td>
            </tr>
            <tr>
              <td style="color:#9CA3AF;font-size:14px;padding:10px 0;border-bottom:1px solid #1F2937;">Chủ tài khoản</td>
              <td style="color:#FFFFFF;font-size:14px;padding:10px 0;text-align:right;font-weight:700;border-bottom:1px solid #1F2937;">${accountName}</td>
            </tr>
            <tr>
              <td style="color:#9CA3AF;font-size:14px;padding:10px 0;border-bottom:1px solid #1F2937;">Số tài khoản</td>
              <td style="color:#FFFFFF;font-size:14px;padding:10px 0;text-align:right;font-weight:700;border-bottom:1px solid #1F2937;">${accountNo}</td>
            </tr>
            <tr>
              <td style="color:#9CA3AF;font-size:14px;padding:10px 0;border-bottom:1px solid #1F2937;">Số tiền</td>
              <td style="color:#34D399;font-size:20px;padding:10px 0;text-align:right;font-weight:900;border-bottom:1px solid #1F2937;">${formattedPrice} đ</td>
            </tr>
          </table>
          
          <!-- Payment Code - HIGHLIGHT -->
          <div style="background:#F59E0B;border-radius:8px;padding:16px;margin-top:16px;text-align:center;">
            <div style="color:#000;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">NỘI DUNG CHUYỂN KHOẢN (BẮT BUỘC)</div>
            <div style="color:#000;font-size:28px;font-weight:900;letter-spacing:4px;">${paymentCode}</div>
          </div>
        </div>
      </div>

      <!-- WARNING -->
      <div style="background:#7F1D1D;border-left:4px solid #EF4444;padding:16px 20px;border-radius:0 8px 8px 0;margin-bottom:32px;">
        <p style="color:#FCA5A5;font-size:14px;margin:0;line-height:1.6;font-weight:600;">
          ⚠️ GHI ĐÚNG NỘI DUNG CK: <span style="color:#FFFFFF;font-size:16px;">${paymentCode}</span><br>
          Sai nội dung = hệ thống KHÔNG thể xác nhận tự động.
        </p>
      </div>

      <!-- URGENCY -->
      <div style="text-align:center;margin-bottom:32px;">
        <div style="display:inline-block;background:rgba(239,68,68,0.15);border:1px solid rgba(239,68,68,0.3);border-radius:8px;padding:12px 24px;">
          <span style="color:#EF4444;font-size:14px;font-weight:800;">⏰ ĐƠN HÀNG HẾT HẠN SAU 24 GIỜ</span>
        </div>
      </div>

      <!-- DIVIDER -->
      <div style="border-top:1px solid #1F2937;margin:32px 0;"></div>

      <!-- WHAT'S NEXT -->
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

    <!-- FOOTER -->
    <div style="background:#111827;padding:20px 32px;text-align:center;">
      <p style="color:#4B5563;font-size:11px;margin:0;line-height:1.6;">
        Email này được gửi tự động. Nếu bạn cần hỗ trợ, trả lời trực tiếp email này.<br>
        © ${new Date().getFullYear()} ClickFunnels. All rights reserved.
      </p>
    </div>

  </div>
</body>
</html>`;

    const info = await transporter.sendMail({
      from: `"ClickFunnels" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: `⚡ ${firstName}, hoàn tất bước cuối để kích hoạt hệ thống`,
      html: htmlContent,
    });

    console.log(`✅ Registration email sent to ${email}, ID: ${info.messageId}`);
    return res.status(200).json({ success: true, messageId: info.messageId });

  } catch (error) {
    console.error('Send registration email error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
}
