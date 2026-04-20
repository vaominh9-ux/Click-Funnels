// Vercel Serverless Function — Gửi Email Đăng Ký Workshop 3 Ngày + File .ICS (3 buổi 1 lần)
// Route: POST /api/email/send-workshop

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

// ═══════════════════════════════════════════════════
// CẤU HÌNH WORKSHOP — ADMIN THAY ĐỔI TẠI ĐÂY
// ═══════════════════════════════════════════════════
const WORKSHOP_CONFIG = {
  sessions: [
    {
      title: 'Workshop AI Buổi 1 — Kích hoạt AI & Build Chatbot',
      date: '2026-05-01', // YYYY-MM-DD
      startTime: '19:30',  // Giờ VN (HH:mm)
      endTime: '21:00',
      description: 'Kích hoạt Google AI Pro + Prompting nâng cao + Build Chatbot AI đầu tiên bằng Vibe Coding',
    },
    {
      title: 'Workshop AI Buổi 2 — Công Cụ Bán Hàng AI',
      date: '2026-05-02',
      startTime: '19:30',
      endTime: '21:00',
      description: 'Build Chatbot chuyên sâu + AI Landing Page Builder + Email AI Automation',
    },
    {
      title: 'Workshop AI Buổi 3 — Biến AI Thành Thu Nhập',
      date: '2026-05-03',
      startTime: '19:30',
      endTime: '21:00',
      description: 'Case Study AI Freelancer kiếm 5-20 triệu/tháng + Lộ trình đi tiếp',
    }
  ],
  zoomLink: 'https://zoom.us/j/xxxxxx', // Thay link Zoom thật
  zaloGroupLink: 'https://zalo.me/g/xxxxxx', // Thay link Zalo thật
  organizerName: 'Hưng NPV',
  organizerEmail: 'hungnpv@duhava.com',
};

// ═══════════════════════════════════════════════════
// TẠO FILE .ICS (iCalendar) — CHỨA CẢ 3 BUỔI
// ═══════════════════════════════════════════════════
function generateICS(config) {
  // Chuyển đổi giờ VN (UTC+7) sang UTC
  const toUTC = (dateStr, timeStr) => {
    const [year, month, day] = dateStr.split('-').map(Number);
    const [hour, minute] = timeStr.split(':').map(Number);
    // Trừ 7 giờ để chuyển từ VN sang UTC
    const utcDate = new Date(Date.UTC(year, month - 1, day, hour - 7, minute, 0));
    const pad = (n) => String(n).padStart(2, '0');
    return `${utcDate.getUTCFullYear()}${pad(utcDate.getUTCMonth() + 1)}${pad(utcDate.getUTCDate())}T${pad(utcDate.getUTCHours())}${pad(utcDate.getUTCMinutes())}00Z`;
  };

  const now = new Date();
  const timestamp = `${now.getUTCFullYear()}${String(now.getUTCMonth() + 1).padStart(2, '0')}${String(now.getUTCDate()).padStart(2, '0')}T${String(now.getUTCHours()).padStart(2, '0')}${String(now.getUTCMinutes()).padStart(2, '0')}${String(now.getUTCSeconds()).padStart(2, '0')}Z`;

  let icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//HungNPV Workshop//AI Workshop//VI',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:Workshop 3 Buổi Tối AI',
    'X-WR-TIMEZONE:Asia/Ho_Chi_Minh',
  ];

  config.sessions.forEach((session, index) => {
    const uid = `workshop-ai-buoi-${index + 1}-${Date.now()}@hungnpv.com`;
    const dtStart = toUTC(session.date, session.startTime);
    const dtEnd = toUTC(session.date, session.endTime);
    
    const description = `${session.description}\\n\\n🔗 Link Zoom: ${config.zoomLink}\\n💬 Nhóm Zalo: ${config.zaloGroupLink}\\n\\nHướng dẫn: ${config.organizerName}`;

    icsContent.push(
      'BEGIN:VEVENT',
      `UID:${uid}`,
      `DTSTAMP:${timestamp}`,
      `DTSTART:${dtStart}`,
      `DTEND:${dtEnd}`,
      `SUMMARY:${session.title}`,
      `DESCRIPTION:${description}`,
      `LOCATION:Online - Zoom`,
      `ORGANIZER;CN=${config.organizerName}:mailto:${config.organizerEmail}`,
      // Nhắc nhở 30 phút trước
      'BEGIN:VALARM',
      'TRIGGER:-PT30M',
      'ACTION:DISPLAY',
      `DESCRIPTION:Còn 30 phút nữa: ${session.title}`,
      'END:VALARM',
      // Nhắc nhở 5 phút trước
      'BEGIN:VALARM',
      'TRIGGER:-PT5M',
      'ACTION:DISPLAY',
      `DESCRIPTION:SẮP BẮT ĐẦU: ${session.title}`,
      'END:VALARM',
      `STATUS:CONFIRMED`,
      'END:VEVENT'
    );
  });

  icsContent.push('END:VCALENDAR');
  return icsContent.join('\r\n');
}

// ═══════════════════════════════════════════════════
// TEMPLATE EMAIL WORKSHOP
// ═══════════════════════════════════════════════════
function buildWorkshopEmailHTML(name, config) {
  const firstName = name ? name.split(' ').pop() : 'bạn';
  
  // Format ngày giờ đẹp
  const formatDate = (dateStr) => {
    const [y, m, d] = dateStr.split('-');
    const date = new Date(y, m - 1, d);
    const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    return `${days[date.getDay()]}, ${d}/${m}/${y}`;
  };

  const toGoogleDate = (dateStr, timeStr) => {
    const [year, month, day] = dateStr.split('-');
    const [hour, minute] = timeStr.split(':');
    const utcDate = new Date(Date.UTC(year, month - 1, day, hour - 7, minute, 0));
    const pad = (n) => String(n).padStart(2, '0');
    return `${utcDate.getUTCFullYear()}${pad(utcDate.getUTCMonth() + 1)}${pad(utcDate.getUTCDate())}T${pad(utcDate.getUTCHours())}${pad(utcDate.getUTCMinutes())}00Z`;
  };

  const sessionsHTML = config.sessions.map((s, i) => {
    const start = toGoogleDate(s.date, s.startTime);
    const end = toGoogleDate(s.date, s.endTime);
    const text = encodeURIComponent(s.title);
    const details = encodeURIComponent(s.description + '\\n\\nLink Zoom: ' + config.zoomLink + '\\nNhóm Zalo: ' + config.zaloGroupLink);
    const location = encodeURIComponent('Online Zoom');
    const gCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${start}/${end}&details=${details}&location=${location}`;

    return `
    <tr>
      <td style="padding:12px 16px;border-bottom:1px solid #2a2a3a;color:#A78BFA;font-weight:800;font-size:14px;width:70px;vertical-align:top;">
        Buổi ${i + 1}
      </td>
      <td style="padding:12px 16px;border-bottom:1px solid #2a2a3a;">
        <div style="color:#FFFFFF;font-weight:700;font-size:14px;margin-bottom:4px;">${s.title.split('—').pop()?.trim() || s.title}</div>
        <div style="color:#9CA3AF;font-size:13px;margin-bottom:8px;">📅 ${formatDate(s.date)} &nbsp;|&nbsp; ⏰ ${s.startTime} - ${s.endTime}</div>
        <a href="${gCalUrl}" target="_blank" style="display:inline-block;background:#374151;color:#E5E7EB;padding:4px 12px;border-radius:6px;text-decoration:none;font-size:12px;font-weight:600;">+ Thêm vào Google Calendar</a>
      </td>
    </tr>
  `}).join('');

  // Nếu DB có lưu htmlBody thì dùng, nếu không thì trả về rỗng (fallback ở Frontend đã lo)
  let htmlResult = config.htmlBody || '';
  
  const currentYear = new Date().getFullYear();

  // Replace các biến nội dung
  htmlResult = htmlResult.replace(/{{firstName}}/g, firstName);
  htmlResult = htmlResult.replace(/{{sessionsHTML}}/g, sessionsHTML);
  htmlResult = htmlResult.replace(/{{zaloGroupLink}}/g, config.zaloGroupLink || '#');
  htmlResult = htmlResult.replace(/{{year}}/g, currentYear);

  return htmlResult;
}

// ═══════════════════════════════════════════════════
// HANDLER
// ═══════════════════════════════════════════════════
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
    const { name, email, phone } = req.body;

    if (!email) {
      return res.status(200).json({ success: true, message: 'No email provided, skipped' });
    }

    // 0. Fetch config từ database
    let config = { ...WORKSHOP_CONFIG }; // Fallback default
    if (SUPABASE_URL && SUPABASE_KEY && SUPABASE_URL !== 'undefined') {
      try {
        const settingsRes = await fetch(
          `${SUPABASE_URL}/rest/v1/system_settings?key=eq.workshop_config&select=value`,
          { headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` } }
        );
        const settingsData = await settingsRes.json();
        if (Array.isArray(settingsData) && settingsData.length > 0 && settingsData[0].value) {
          config = { ...config, ...settingsData[0].value };
        }
      } catch (e) {
        console.error('Fetch workshop config error: fallback to default', e);
      }
    }

    // 1. (Đã bỏ file .ICS theo yêu cầu)

    // 2. Build email HTML
    const htmlContent = buildWorkshopEmailHTML(name, config);

    // 3. Gửi email
    const transporter = createTransporter();
    
    // Ghi đè subject nếu Admin có cấu hình
    let finalSubject = config.subject || `✅ ${name || 'Bạn'} ơi, đã đăng ký thành công — Lịch 3 buổi AI Workshop đính kèm!`;
    const firstNameForSubject = name ? name.split(' ').pop() : 'Bạn';
    finalSubject = finalSubject.replace(/{{firstName}}/g, firstNameForSubject);

    const info = await transporter.sendMail({
      from: `"${config.organizerName || 'HungNPV Workshop'}" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: finalSubject,
      html: htmlContent,
    });

    console.log(`✅ Workshop email sent to ${email}, ID: ${info.messageId}`);
    return res.status(200).json({ 
      success: true, 
      messageId: info.messageId,
      zaloGroupLink: config.zaloGroupLink 
    });

  } catch (error) {
    console.error('Send workshop email error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
}
