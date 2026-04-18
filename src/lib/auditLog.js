import { supabase } from './supabase';

/**
 * Ghi nhận hành động của Admin vào bảng audit_logs.
 * Sử dụng: import { logAudit } from '../../lib/auditLog';
 *          await logAudit('conversion.approve', 'conversion', convId, { amount, affiliate });
 *
 * @param {string} action - Tên hành động (VD: 'conversion.approve', 'payout.complete')
 * @param {string} entityType - Loại đối tượng ('conversion', 'payout', 'profile', 'campaign')
 * @param {string} entityId - ID của đối tượng bị tác động
 * @param {object} details - Chi tiết bổ sung (tuỳ chọn)
 */
export async function logAudit(action, entityType, entityId, details = {}) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from('audit_logs').insert({
      actor_id: user.id,
      actor_email: user.email,
      action,
      entity_type: entityType,
      entity_id: String(entityId),
      details,
    });
  } catch (err) {
    // Audit log failure should never block business logic
    console.warn('Audit log failed:', err);
  }
}
