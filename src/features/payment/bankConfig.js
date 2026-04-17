// Cấu hình ngân hàng cho thanh toán tự động
// Dùng BIN code + số tài khoản VA từ SePay

export const BANK_CONFIG = {
  bankId: '970418',           // BIN Code BIDV
  accountNo: '96247NTH195',   // Số tài khoản VA BIDV (lấy từ SePay)
  accountName: 'NGUYEN TRONG HUU',  // Tên chủ TK (viết HOA, không dấu)
  bankName: 'BIDV',           // Tên ngân hàng hiển thị
};

// Bảng BIN Code phổ biến (dùng khi đổi ngân hàng)
export const BANK_BIN_CODES = {
  'BIDV': '970418',
  'Vietcombank': '970436',
  'MB Bank': '970422',
  'Techcombank': '970407',
  'VPBank': '970432',
  'ACB': '970416',
  'TPBank': '970423',
  'Sacombank': '970403',
};
