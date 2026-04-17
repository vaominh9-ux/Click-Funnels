// Vercel Serverless Function — SePay Webhook Receiver
// Route: POST /api/sepay-webhook
// SePay sẽ gọi URL này khi có giao dịch mới vào tài khoản ngân hàng

export default async function handler(req, res) {
  // Chỉ chấp nhận POST
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('Missing Supabase credentials');
    return res.status(500).json({ success: false, message: 'Server config error' });
  }

  try {
    // 1. Lấy API Key động từ DB (nếu Admin có cấu hình trên UI)
    let expectedKey = process.env.SEPAY_API_KEY;
    const settingsRes = await fetch(
      `${SUPABASE_URL}/rest/v1/system_settings?key=eq.sepay_config&select=value`,
      { headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` } }
    );
    const settingsData = await settingsRes.json();
    if (Array.isArray(settingsData) && settingsData.length > 0 && settingsData[0].value?.apiKey) {
      expectedKey = settingsData[0].value.apiKey;
    }

    // 2. Xác thực API Key từ SePay (Header: Authorization: Apikey xxx)
    const authHeader = req.headers['authorization'] || '';
    if (expectedKey && authHeader !== `Apikey ${expectedKey}`) {
      console.warn('SePay webhook: Invalid API Key');
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const data = req.body;
    
    // Log giao dịch nhận được
    console.log('SePay webhook received:', JSON.stringify(data));

    // Chỉ xử lý tiền VÀO
    if (data.transferType !== 'in') {
      return res.status(200).json({ success: true, message: 'Ignored: not incoming transfer' });
    }

    const paymentCode = data.code; // Mã thanh toán SePay tự nhận diện
    const transferAmount = Number(data.transferAmount) || 0;
    const referenceCode = data.referenceCode || '';
    const sepayId = data.id;
    const transactionDate = data.transactionDate;
    const content = data.content || '';

    // Nếu SePay không nhận diện được code, thử tìm trong nội dung chuyển khoản
    let matchCode = paymentCode;
    if (!matchCode) {
      // Tìm pattern CF-XXXXXX trong nội dung
      const codeMatch = content.match(/CF[- ]?([A-Z0-9]{6,8})/i);
      if (codeMatch) {
        matchCode = 'CF' + codeMatch[1].replace('-', '');
      }
    }

    if (!matchCode) {
      console.log('SePay webhook: No payment code found in transaction');
      return res.status(200).json({ success: true, message: 'No payment code found' });
    }

    // Chuẩn hóa code: loại bỏ dấu gạch, uppercase
    matchCode = matchCode.replace(/-/g, '').toUpperCase();

    // --- CHỐNG TRÙNG LẶP ---
    // Kiểm tra xem referenceCode đã xử lý chưa
    const checkDupRes = await fetch(
      `${SUPABASE_URL}/rest/v1/conversions?sepay_ref=eq.${referenceCode}&select=id`,
      {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`
        }
      }
    );
    const dupData = await checkDupRes.json();
    if (Array.isArray(dupData) && dupData.length > 0) {
      console.log('SePay webhook: Duplicate transaction, skipping');
      return res.status(200).json({ success: true, message: 'Duplicate, already processed' });
    }

    // --- TÌM ĐƠN HÀNG THEO PAYMENT CODE ---
    const findRes = await fetch(
      `${SUPABASE_URL}/rest/v1/conversions?payment_code=eq.${matchCode}&status=eq.pending&select=id,sale_amount`,
      {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`
        }
      }
    );
    const orders = await findRes.json();

    if (!Array.isArray(orders) || orders.length === 0) {
      console.log(`SePay webhook: No pending order found for code ${matchCode}`);
      return res.status(200).json({ success: true, message: 'No matching order' });
    }

    const order = orders[0];

    // --- XÁC NHẬN SỐ TIỀN ---
    if (transferAmount < Number(order.sale_amount)) {
      console.warn(`SePay webhook: Amount mismatch. Expected ${order.sale_amount}, got ${transferAmount}`);
      // Vẫn cập nhật nhưng đánh dấu underpaid
    }

    // --- CẬP NHẬT ĐƠN HÀNG → APPROVED ---
    const updateRes = await fetch(
      `${SUPABASE_URL}/rest/v1/conversions?id=eq.${order.id}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          status: 'approved',
          sepay_ref: referenceCode,
          sepay_transaction_id: sepayId,
          paid_at: transactionDate || new Date().toISOString()
        })
      }
    );

    if (!updateRes.ok) {
      const errText = await updateRes.text();
      console.error('SePay webhook: Failed to update order:', errText);
      return res.status(500).json({ success: false, message: 'Failed to update order' });
    }

    console.log(`SePay webhook: Order ${order.id} (code: ${matchCode}) → APPROVED ✅`);
    
    return res.status(200).json({ success: true, message: 'Payment verified' });

  } catch (error) {
    console.error('SePay webhook error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
}
