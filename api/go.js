// Vercel Serverless Function — Xử lý click tracking + redirect phía server
// Route: /api/go?ref=abc123&campaign=UUID
// Không cần load React, redirect 302 ngay lập tức (~100ms)

export default async function handler(req, res) {
  const { ref, campaign, utm_source } = req.query;

  if (!ref) {
    return res.redirect(302, '/');
  }

  const utmSource = utm_source || '';

  const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://iykdzwuqwlemszawpove.supabase.co';
  const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || 'sb_publishable_WJs51tDt1uXWUy3uNkXiNw_THqLSbA1';

  let landingUrl = null;

  try {
    // Gọi RPC ghi nhận click (fire-and-forget style, nhưng chờ kết quả để lấy landing URL)
    const rpcRes = await fetch(`${SUPABASE_URL}/rest/v1/rpc/record_affiliate_click`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        p_ref_code: ref,
        p_campaign_id: campaign || null,
        p_sub_id1: utmSource
      })
    });

    const data = await rpcRes.json();
    
    if (data && data.landing_url) {
      landingUrl = data.landing_url;
      // Trích xuất thêm link_id từ database trả về
      if (data.link_id) {
        req.generated_link_id = data.link_id;
      }
    }
  } catch (err) {
    console.error('Click tracking error:', err);
    // Tracking lỗi nhưng vẫn redirect nếu có thể
  }

  // Xây dựng URL đích
  if (landingUrl) {
    const url = new URL(landingUrl);
    url.searchParams.set('ref', ref);
    if (campaign) url.searchParams.set('camp', campaign);
    if (req.generated_link_id) url.searchParams.set('link', req.generated_link_id);
    if (utmSource) url.searchParams.set('utm_source', utmSource);
    
    return res.redirect(302, url.toString());
  }

  // Fallback: nếu không tìm được landing URL, redirect về trang chủ
  return res.redirect(302, '/');
}
