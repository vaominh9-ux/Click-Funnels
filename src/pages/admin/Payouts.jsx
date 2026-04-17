import React, { useState, useEffect } from 'react';
import { DownloadCloud, CheckCircle, AlertCircle, X, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useToast } from '../../components/common/Toast';
import Skeleton from '../../components/common/Skeleton';

const overlayStyle = {
  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999,
  display: 'flex', alignItems: 'center', justifyContent: 'center'
};
const modalStyle = {
  background: 'white', borderRadius: '12px', width: '440px', padding: '24px',
  boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'
};

const AdminPayouts = () => {
  const addToast = useToast();
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmTarget, setConfirmTarget] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchPayouts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('payouts')
      .select('*, profiles:affiliate_id(full_name, email, ref_code)')
      .order('created_at', { ascending: false });

    if (error) {
      addToast('Không thể tải danh sách thanh toán', 'error');
    } else {
      setPayouts(data || []);
    }
    setLoading(false);
  };

  useEffect(() => { fetchPayouts(); }, []);

  const pendingPayouts = payouts.filter(p => p.status === 'pending' || p.status === 'processing');
  const completedPayouts = payouts.filter(p => p.status === 'completed');
  const totalUnpaid = pendingPayouts.reduce((s, p) => s + Number(p.amount || 0), 0);

  const handleConfirmPay = async () => {
    if (!confirmTarget) return;
    setSubmitting(true);

    const { error } = await supabase
      .from('payouts')
      .update({ status: 'completed', updated_at: new Date().toISOString() })
      .eq('id', confirmTarget.id);

    if (error) {
      addToast('Lỗi khi xác nhận: ' + error.message, 'error');
    } else {
      addToast(`Đã thanh toán ${Number(confirmTarget.amount).toLocaleString('vi-VN')} ₫ cho ${confirmTarget.profiles?.full_name}`, 'success');
    }

    setSubmitting(false);
    setConfirmTarget(null);
    fetchPayouts();
  };

  const handleExportCSV = () => {
    const headers = ['Mã ĐL', 'Họ Tên', 'Email', 'Số Tiền', 'Phương Thức', 'Trạng Thái'];
    const rows = payouts.map(p => [
      p.profiles?.ref_code || p.affiliate_id?.substring(0, 8),
      p.profiles?.full_name || 'N/A',
      p.profiles?.email || 'N/A',
      p.amount,
      p.method || 'Chuyển khoản',
      p.status === 'completed' ? 'Đã thanh toán' : 'Chờ duyệt'
    ]);
    const csvContent = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `thanh-toan-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="admin-page-wrapper">
      <div className="flex-between mb-6">
        <div>
          <h2>Quản Lý Thanh Toán</h2>
          <p className="text-muted mt-2">Duyệt các khoản hoa hồng đã qua thời gian phong tỏa 30 ngày và đạt mức tối thiểu.</p>
        </div>
        <button className="cf-btn-primary flex-align-center" style={{gap: '10px', padding: '10px 20px'}} onClick={handleExportCSV}>
          <DownloadCloud size={18} /> Xuất CSV Thanh Toán
        </button>
      </div>

      <div className="stats-grid mb-6">
        <div className="cf-card" style={{borderTop: '4px solid #10B981'}}>
          <h3 className="text-muted text-sm font-bold uppercase mb-2">Tổng Cần Thanh Toán</h3>
          <div className="font-bold text-3xl">
            {loading ? <Skeleton width="150px" height="36px" /> : `${totalUnpaid.toLocaleString('vi-VN')} ₫`}
          </div>
          <div className="text-sm mt-2 text-muted">
            {loading ? <Skeleton width="120px" height="16px" /> : `${pendingPayouts.length} Đại lý đủ điều kiện`}
          </div>
        </div>

        <div className="cf-card" style={{gridColumn: 'var(--span-2, span 2)', background: 'var(--cf-bg-canvas)'}}>
          <h4 className="font-bold flex-align-center mb-2" style={{display:'flex', gap:'8px'}}>
            <AlertCircle size={18} className="text-muted"/> Mức Sàn & Thời Gian Phong Tỏa (Cooling Period)
          </h4>
          <p className="text-sm text-muted">
            Hệ thống áp dụng luật chống hoàn tiền của Affiliate. Hoa hồng sẽ bị đóng băng (đang chờ xử lý) trong vòng <strong>30 ngày</strong> để dự phòng trường hợp khách hàng yêu cầu hoàn tiền. Hoa hồng chỉ xuất hiện ở đây sau khi đã rã đông và số dư của đại lý đã đạt <strong>mức tối thiểu 1.000.000 ₫</strong>.
          </p>
        </div>
      </div>

      <div className="cf-card p-0">
        <div className="p-4 flex-between" style={{borderBottom: '1px solid var(--cf-border)'}}>
          <h3 className="font-bold">Đại lý chờ thanh toán</h3>
        </div>
        <div className="table-responsive">
          <table className="cf-table">
            <thead>
              <tr>
                <th>Thông Tin Đại Lý</th>
                <th>Phương Thức</th>
                <th>Số Dư Rút</th>
                <th style={{textAlign: 'right'}}>Hành Động</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i}>
                    <td><Skeleton width="140px" height="20px" /><div style={{marginTop: 4}}><Skeleton width="180px" height="14px" /></div></td>
                    <td><Skeleton width="100px" height="24px" style={{borderRadius: 12}} /></td>
                    <td><Skeleton width="120px" height="20px" /></td>
                    <td style={{textAlign: 'right'}}><Skeleton width="140px" height="32px" style={{marginLeft: 'auto'}} /></td>
                  </tr>
                ))
              ) : pendingPayouts.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{textAlign: 'center', padding: '32px', color: '#9CA3AF'}}>
                    Chưa có yêu cầu thanh toán nào đang chờ duyệt.
                  </td>
                </tr>
              ) : pendingPayouts.map((pay) => (
                <tr key={pay.id}>
                  <td>
                    <div className="font-bold">{pay.profiles?.full_name || 'Chưa cập nhật'}</div>
                    <div className="text-sm text-muted">{pay.profiles?.email} ({pay.profiles?.ref_code || pay.affiliate_id?.substring(0, 8)})</div>
                  </td>
                  <td><span className="badge badge-cleared">{pay.method || 'Chuyển khoản'}</span></td>
                  <td className="font-bold text-success">{Number(pay.amount).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</td>
                  <td style={{textAlign: 'right'}}>
                    <button className="cf-btn-outline" style={{padding: '6px 12px', fontSize: '13px', display:'inline-flex', gap:'6px', alignItems:'center'}}
                      onClick={() => setConfirmTarget(pay)}>
                      <CheckCircle size={14}/> Xác Nhận Thanh Toán
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lịch sử đã thanh toán */}
      {completedPayouts.length > 0 && (
        <div className="cf-card p-0 mt-6">
          <div className="p-4" style={{borderBottom: '1px solid var(--cf-border)'}}>
            <h3 className="font-bold" style={{color: '#059669'}}>✅ Đã Thanh Toán ({completedPayouts.length})</h3>
          </div>
          <div className="table-responsive">
            <table className="cf-table">
              <thead>
                <tr>
                  <th>Đại Lý</th>
                  <th>Số Tiền</th>
                  <th>Ngày Thanh Toán</th>
                </tr>
              </thead>
              <tbody>
                {completedPayouts.map(pay => (
                  <tr key={pay.id}>
                    <td className="font-bold">{pay.profiles?.full_name || 'N/A'}</td>
                    <td className="font-bold" style={{color: '#059669'}}>{Number(pay.amount).toLocaleString('vi-VN')} ₫</td>
                    <td className="text-muted">{new Date(pay.updated_at).toLocaleDateString('vi-VN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CONFIRM MODAL */}
      {confirmTarget && (
        <div style={overlayStyle}>
          <div style={modalStyle}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px'}}>
              <h3 style={{margin: 0, fontSize: '18px', fontWeight: 700}}>Xác Nhận Thanh Toán</h3>
              <button onClick={() => setConfirmTarget(null)} style={{background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280', padding: '4px', display: 'flex', alignItems: 'center'}}>
                <X size={24} />
              </button>
            </div>

            <div style={{padding: '16px', background: '#F0FDF4', borderRadius: '8px', marginBottom: '20px'}}>
              <div style={{fontSize: '14px', color: '#065F46', marginBottom: '8px'}}><strong>Đại lý:</strong> {confirmTarget.profiles?.full_name || 'N/A'}</div>
              <div style={{fontSize: '14px', color: '#065F46', marginBottom: '8px'}}><strong>Email:</strong> {confirmTarget.profiles?.email || 'N/A'}</div>
              <div style={{fontSize: '14px', color: '#065F46', marginBottom: '8px'}}><strong>Phương thức:</strong> {confirmTarget.method || 'Chuyển khoản'}</div>
              <div style={{fontSize: '20px', fontWeight: 700, color: '#059669'}}>
                {Number(confirmTarget.amount).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
              </div>
            </div>
            <p style={{fontSize: '13px', color: '#6B7280', marginBottom: '20px'}}>
              Bạn có chắc chắn đã hoàn tất thanh toán cho đại lý này? Hành động này không thể hoàn tác.
            </p>

            <div style={{display: 'flex', justifyContent: 'flex-end', gap: '12px'}}>
              <button onClick={() => setConfirmTarget(null)} style={{padding: '10px 16px', background: '#F3F4F6', color: '#4B5563', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600}}>
                Hủy Bỏ
              </button>
              <button onClick={handleConfirmPay} className="cf-btn-primary" disabled={submitting}
                style={{padding: '10px 24px', border: 'none', borderRadius: '8px', cursor: 'pointer', background: '#10B981'}}>
                {submitting ? <Loader2 size={16} className="spin" /> : 'Xác Nhận Đã Thanh Toán'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPayouts;
