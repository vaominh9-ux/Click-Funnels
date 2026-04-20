import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  // Bật CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { contacts, subject, htmlBody } = req.body;

    if (!contacts || !Array.isArray(contacts) || contacts.length === 0) {
      return res.status(400).json({ success: false, message: 'Danh sách contacts không hợp lệ hoặc trống.' });
    }

    if (!subject || !htmlBody) {
      return res.status(400).json({ success: false, message: 'Tiêu đề và Nội dung email không được để trống.' });
    }

    // Bảo mật: Admin API Key
    // Thực tế nên check auth của token Bearer cho chặt chẽ nếu cần, 
    // hiện tại dùng pass-through cơ bản cho demo MVP.

    const EMAIL_USER = process.env.GMAIL_USER || process.env.SMTP_USER || process.env.VITE_SMTP_USER;
    const EMAIL_PASS = process.env.GMAIL_APP_PASSWORD || process.env.SMTP_PASS || process.env.VITE_SMTP_PASS;

    if (!EMAIL_USER || !EMAIL_PASS) {
      console.error('Missing SMTP Configuration');
      return res.status(500).json({ success: false, message: 'Hệ thống chưa cấu hình SMTP' });
    }

    // Tạo config vận chuyển
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
    });

    // Lọc bỏ danh bạ không có email hợp lệ
    const validContacts = contacts.filter(c => c.email && c.email.includes('@'));

    if (validContacts.length === 0) {
      return res.status(400).json({ success: false, message: 'Không có email hợp lệ nào trong tệp bạn gửi' });
    }

    const emailPromises = validContacts.map(contact => {
      // Thay thế các biến động trong tiêu đề & nội dung
      const personalSubject = subject.replace(/{{name}}/g, contact.name || 'bạn');
      const personalHtml = htmlBody.replace(/{{name}}/g, contact.name || 'bạn');

      return transporter.sendMail({
        from: `"ClickFunnels Admin" <${EMAIL_USER}>`,
        to: contact.email,
        subject: personalSubject,
        html: personalHtml,
      })
      .then(info => {
        return { error: false, email: contact.email, messageId: info.messageId };
      })
      .catch(err => {
        console.error(`Lỗi gửi mail tới ${contact.email}:`, err);
        return { error: true, email: contact.email, reason: err.message };
      });
    });

    // Gửi song song (số lượng contacts mảng nhỏ < 20 để tránh spam/timeout)
    const results = await Promise.all(emailPromises);
    
    // Đếm thành công/thất bại
    let successCount = 0;
    let failCount = 0;
    
    results.forEach(res => {
      if (res && res.error) failCount++;
      else successCount++;
    });

    return res.status(200).json({
      success: true,
      message: `Đã gửi thành công ${successCount}, thất bại ${failCount}`,
      details: results
    });

  } catch (error) {
    console.error('Bulk Email Error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
}
