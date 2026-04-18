export const useFunnelTracking = () => {
  // Khi chạy hàm này, sẽ check URL lấy ?ref= và lưu vào LocalStorage
  const urlParams = new URLSearchParams(window.location.search);
  const refCode = urlParams.get('ref');
  const campId = urlParams.get('camp');
  const linkId = urlParams.get('link');
  
  if (refCode) localStorage.setItem('aff_ref_code', refCode);
  if (campId) localStorage.setItem('aff_campaign_id', campId);
  if (linkId) localStorage.setItem('aff_link_id', linkId);
};

export const getRefCode = () => {
  return localStorage.getItem('aff_ref_code') || null;
};
