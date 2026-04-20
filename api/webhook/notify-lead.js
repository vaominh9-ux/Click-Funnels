// Vercel Serverless Function — Lead Webhook Forwarder
// Route: POST /api/webhook/notify-lead
// Nhận thông tin Lead từ Frontend → Forward sang n8n Webhook
// n8n sẽ xử lý gửi thông báo qua Zalo, Telegram, etc.

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

  try {
    const { name, phone, email, courseName, courseId, source, leadId } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ success: false, message: 'Missing required fields: name, phone' });
    }

    // 1. Lấy cấu hình Webhook từ Supabase system_settings (Admin UI)
    let n8nWebhookUrl = null;
    let enableNewLead = true;

    const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

    if (SUPABASE_URL && SUPABASE_KEY) {
      try {
        const settingsRes = await fetch(
          `${SUPABASE_URL}/rest/v1/system_settings?key=eq.webhook_config&select=value`,
          { headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` } }
        );
        const settingsData = await settingsRes.json();
        if (Array.isArray(settingsData) && settingsData.length > 0 && settingsData[0].value) {
          const config = settingsData[0].value;
          n8nWebhookUrl = config.n8nWebhookUrl || null;
          enableNewLead = config.enableNewLead !== false; // mặc định true
        }
      } catch (dbErr) {
        console.warn('Could not fetch webhook config from DB:', dbErr);
      }
    }

    // 2. Fallback: dùng Environment Variable nếu DB chưa cấu hình
    if (!n8nWebhookUrl) {
      n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;
    }

    // 3. Kiểm tra toggle bật/tắt
    if (!enableNewLead && source !== 'admin-test') {
      return res.status(200).json({
        success: true,
        message: 'New lead webhook is disabled by admin',
        webhookSent: false
      });
    }

    if (!n8nWebhookUrl) {
      console.warn('N8N_WEBHOOK_URL not configured. Skipping webhook notification.');
      return res.status(200).json({ 
        success: true, 
        message: 'Lead received but webhook not configured',
        webhookSent: false 
      });
    }

    // 3. Chuẩn bị payload gửi sang n8n
    const webhookPayload = {
      event: 'new_lead',
      timestamp: new Date().toISOString(),
      lead: {
        id: leadId || null,
        name,
        phone,
        email: email || null,
        courseName: courseName || 'Không xác định',
        courseId: courseId || null,
        source: source || 'direct'
      },
      // Metadata hữu ích cho n8n
      meta: {
        platform: 'ClickFunnels',
        environment: process.env.VERCEL_ENV || 'development'
      }
    };

    // 4. Forward sang n8n
    const n8nResponse = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(webhookPayload)
    });

    const n8nStatus = n8nResponse.status;
    console.log(`✅ Webhook sent to n8n: ${n8nStatus} | Lead: ${name} | Course: ${courseName}`);

    return res.status(200).json({ 
      success: true, 
      message: 'Webhook sent successfully',
      webhookSent: true,
      n8nStatus 
    });

  } catch (error) {
    // Webhook lỗi KHÔNG được block user flow
    console.error('Webhook error (non-blocking):', error.message);
    return res.status(200).json({ 
      success: true, 
      message: 'Lead saved, webhook failed',
      webhookSent: false,
      error: error.message 
    });
  }
}
