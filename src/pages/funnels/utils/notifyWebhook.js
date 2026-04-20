// Shared Webhook Notification Utility
// Dùng chung cho tất cả form Lead trên Landing Pages
// Fire-and-forget: không block UI, không ảnh hưởng UX

const API_BASE = import.meta.env.VITE_API_BASE || (window.location.hostname === 'localhost' ? 'https://click-funnels.vercel.app' : '');
const WEBHOOK_API = '/api/webhook/notify-lead';

/**
 * Gửi thông báo webhook khi có lead mới
 * @param {Object} leadData - Thông tin lead
 * @param {string} leadData.name - Họ tên
 * @param {string} leadData.phone - Số điện thoại
 * @param {string} [leadData.email] - Email (optional)
 * @param {string} [leadData.courseName] - Tên khóa học
 * @param {string} [leadData.courseId] - ID khóa học
 * @param {string} [leadData.source] - Nguồn lead (referral/direct)
 * @param {string} [leadData.leadId] - ID lead trong DB
 */
export const notifyNewLead = async (leadData) => {
  try {
    const response = await fetch(`${API_BASE}${WEBHOOK_API}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(leadData)
    });
    const result = await response.json();
    
    if (result.webhookSent) {
      console.log('📢 Webhook notification sent successfully');
    } else {
      console.log('📢 Webhook not configured or failed (non-blocking)');
    }
    
    return result;
  } catch (err) {
    // Fire-and-forget: không throw lỗi, chỉ log
    console.warn('📢 Webhook notification failed (non-blocking):', err.message);
    return { success: false, webhookSent: false };
  }
};
