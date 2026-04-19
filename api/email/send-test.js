// Vercel Serverless Function — Gửi Email Test từ trang Cấu Hình Email
// Route: POST /api/email/send-test

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

const replaceTemplateVariables = (template, data) => {
  if (!template) return '';
  let result = template;
  for (const [key, value] of Object.entries(data)) {
    const regex = new RegExp(`{{${key}}}`, 'g');
    result = result.replace(regex, value);
  }
  return result;
};

export default async function handler(req, res) {
  // Bật CORS cho phép gọi từ localhost trong lúc dev
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Xử lý preflight request (OPTIONS)
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed', message: 'Chỉ hỗ trợ phương thức POST' });
  }

  try {
    const { toEmail, subject, htmlBody } = req.body;

    if (!toEmail || !subject || !htmlBody) {
      return res.status(400).json({ error: 'Bad Request', message: 'Thiếu toEmail, subject hoặc htmlBody' });
    }

    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      console.warn('Cảnh báo: Chưa cấu hình GMAIL_USER và GMAIL_APP_PASSWORD trong môi trường.');
      return res.status(500).json({ error: 'Server Error', message: 'Server chưa cấu hình gửi email SMTP' });
    }

    // Mock data dùng cho gửi test
    const testData = {
      firstName: 'Nhà',
      firstName_upper: 'NHÀ',
      name: 'Nhà Trắng',
      courseName: 'Khóa Học Mẫu (Demo)',
      formattedPrice: '1,990,000',
      paymentCode: 'TEST999',
      year: new Date().getFullYear().toString(),
      bankName: 'BIDV',
      accountNo: '123456789',
      accountName: 'NGUYEN VAN A',
      formattedDate: new Date().toLocaleString('vi-VN')
    };

    const finalSubject = replaceTemplateVariables(subject, testData);
    const finalHtml = replaceTemplateVariables(htmlBody, testData);

    const transporter = createTransporter();

    const mailOptions = {
      from: `"ClickFunnels Team" <${process.env.GMAIL_USER}>`,
      to: toEmail,
      subject: `[TEST] ${finalSubject}`,
      html: finalHtml,
    };

    console.log(`Đang gửi email test đến: ${toEmail}`);
    const info = await transporter.sendMail(mailOptions);
    console.log('Gửi email test thành công. MessageId:', info.messageId);

    return res.status(200).json({
      success: true,
      message: 'Email test đã được gửi thành công.',
      messageId: info.messageId
    });

  } catch (error) {
    console.error('Lỗi khi gửi email test:', error);
    return res.status(500).json({
      success: false,
      error: 'Lỗi server',
      message: error.message
    });
  }
}
