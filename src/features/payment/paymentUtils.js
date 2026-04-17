// Sinh mã thanh toán duy nhất: PREFIX + 6 ký tự ngẫu nhiên
// Bỏ I,O,0,1 tránh nhầm lẫn khi đọc

const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const CODE_PREFIX = 'CF'; // Có thể đổi: DH, PAY, ORDER...
const CODE_LENGTH = 6;

export const generatePaymentCode = (prefix = CODE_PREFIX) => {
  let code = prefix;
  for (let i = 0; i < CODE_LENGTH; i++) {
    code += CHARS.charAt(Math.floor(Math.random() * CHARS.length));
  }
  return code;
};

// Kiểm tra trạng thái thanh toán qua RPC (bypass RLS)
export const checkPaymentStatus = async (supabase, paymentCode) => {
  const { data, error } = await supabase
    .rpc('check_payment_status', { p_payment_code: paymentCode });
  
  if (error) {
    console.warn('Payment check error:', error);
    return null;
  }
  return data; // 'pending' | 'approved' | 'rejected' | null
};

// Tạo đơn hàng trong DB
export const createPaymentOrder = async (supabase, {
  affiliateId,
  amount,
  customerName,
  productName,
  paymentCode,
  customerInfo
}) => {
  const { error } = await supabase
    .from('conversions')
    .insert([{
      affiliate_id: affiliateId,
      sale_amount: amount,
      commission_amount: 0,
      status: 'pending',
      customer_name: customerName,
      product_name: productName,
      payment_code: paymentCode,
      customer_info: customerInfo
    }]);
  
  return { error };
};

// Tạo URL QR VietQR
export const generateQRUrl = (bankConfig, amount, paymentCode) => {
  return `https://img.vietqr.io/image/${bankConfig.bankId}-${bankConfig.accountNo}-print.png?amount=${amount}&addInfo=${paymentCode}&accountName=${encodeURIComponent(bankConfig.accountName)}`;
};
