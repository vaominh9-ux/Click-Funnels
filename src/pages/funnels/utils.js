export const useFunnelTracking = () => {
  // Khi chạy hàm này, sẽ check URL lấy ?ref= và lưu vào LocalStorage
  const urlParams = new URLSearchParams(window.location.search);
  const refCode = urlParams.get('ref');
  
  if (refCode) {
    localStorage.setItem('aff_ref_code', refCode);
  }
};

export const getRefCode = () => {
  return localStorage.getItem('aff_ref_code') || null;
};
