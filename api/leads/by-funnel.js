// Vercel Serverless Function — Query Leads by Funnel
// Route: GET /api/leads/by-funnel?course_id=free-3day
// Dùng cho n8n để lấy danh sách lead theo phễu → gửi Zalo nhắc lịch

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { course_id, stage, limit } = req.query;

    if (!course_id) {
      return res.status(400).json({ success: false, message: 'Missing required param: course_id' });
    }

    // API Key bảo vệ — n8n phải gửi header Authorization
    const authHeader = req.headers['authorization'];
    const API_SECRET = process.env.LEADS_API_SECRET || process.env.N8N_API_SECRET;

    if (API_SECRET && authHeader !== `Bearer ${API_SECRET}`) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    // Query Supabase
    const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

    if (!SUPABASE_URL || !SUPABASE_KEY) {
      return res.status(500).json({ success: false, message: 'Supabase not configured' });
    }

    // Build query — lọc theo course_id, optional stage
    let queryUrl = `${SUPABASE_URL}/rest/v1/leads?course_id=eq.${encodeURIComponent(course_id)}&select=id,name,phone,email,course_id,stage,source,created_at&order=created_at.desc`;

    if (stage) {
      queryUrl += `&stage=eq.${encodeURIComponent(stage)}`;
    }

    if (limit) {
      queryUrl += `&limit=${parseInt(limit, 10)}`;
    }

    const response = await fetch(queryUrl, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    });

    const leads = await response.json();

    return res.status(200).json({
      success: true,
      course_id,
      total: Array.isArray(leads) ? leads.length : 0,
      leads: Array.isArray(leads) ? leads : []
    });

  } catch (error) {
    console.error('Leads by funnel error:', error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
}
