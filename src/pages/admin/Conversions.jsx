import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { logAudit } from '../../lib/auditLog';
import { useToast } from '../../components/common/Toast';
import { Plus, Search, CheckCircle, XCircle, Clock, Loader2, X } from 'lucide-react';
import Skeleton from '../../components/common/Skeleton';

const TIER_CAPS = { 'starter': 3000000, 'master': 6000000, 'ai-coach': 9000000, 'ai-partner': 20000000 };

export default function AdminConversions() {
  const [conversions, setConversions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const addToast = useToast();

  // Form state
  const [affiliateEmail, setAffiliateEmail] = useState('');
  const [saleAmount, setSaleAmount] = useState('');
  const [productName, setProductName] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [commissionRate, setCommissionRate] = useState(50);
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadConversions(); }, []);

  const loadConversions = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('conversions')
      .select('*, profiles:affiliate_id(full_name, email, tier)')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Error loading conversions:', error);
    } else {
      setConversions(data || []);
    }
    setLoading(false);
  };

  const handleCreateConversion = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // 1. Tìm affiliate bằng email
      const { data: affiliate, error: affErr } = await supabase
        .from('profiles')
        .select('id, tier, full_name')
        .eq('email', affiliateEmail.trim())
        .single();

      if (affErr || !affiliate) {
        addToast('Không tìm thấy Affiliate với email này!', 'error');
        setSaving(false);
        return;
      }

      // 2. Tính hoa hồng
      const sale = Number(saleAmount);
      const rawCommission = Math.round(sale * commissionRate / 100);
      const tierCap = TIER_CAPS[affiliate.tier] || 3000000;
      const finalCommission = Math.min(rawCommission, tierCap);
      const rolledUp = rawCommission - finalCommission;

      // 3. Insert conversion
      const { error: insertErr } = await supabase
        .from('conversions')
        .insert({
          affiliate_id: affiliate.id,
          sale_amount: sale,
          commission_amount: finalCommission,
          customer_name: customerName || 'Khách hàng',
          product_name: productName || 'Sản phẩm',
          customer_info: {
            name: customerName,
            raw_commission: rawCommission,
            rolled_up: rolledUp,
            commission_rate: commissionRate,
            tier_cap: tierCap
          },
          status: 'pending',
          type: 'sale'
        });

      if (insertErr) {
        console.error('Insert error:', insertErr);
        addToast('Tạo conversion thất bại!', 'error');
      } else {
        await logAudit('conversion.create', 'conversion', 'new', {
          affiliate_name: affiliate.full_name,
          affiliate_id: affiliate.id,
          sale_amount: sale,
          commission: finalCommission,
          rolled_up: rolledUp,
          product: productName,
          customer: customerName
        });
        addToast(`Đã tạo conversion cho ${affiliate.full_name}. Hoa hồng: ${finalCommission.toLocaleString()}${rolledUp > 0 ? ` (Roll-up: ${rolledUp.toLocaleString()})` : ''}`, 'success');
        setShowAddModal(false);
        resetForm();
        loadConversions();
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      addToast('Lỗi hệ thống!', 'error');
    }
    setSaving(false);
  };

  const updateStatus = async (id, newStatus) => {
    // Lấy thông tin conversion trước khi cập nhật để log chi tiết
    const target = conversions.find(c => c.id === id);
    const { error } = await supabase
      .from('conversions')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      addToast('Cập nhật thất bại!', 'error');
    } else {
      await logAudit(
        newStatus === 'approved' ? 'conversion.approve' : 'conversion.reject',
        'conversion',
        id,
        {
          affiliate_name: target?.profiles?.full_name,
          sale_amount: target?.sale_amount,
          commission_amount: target?.commission_amount,
          product: target?.product_name,
          previous_status: target?.status,
          new_status: newStatus
        }
      );
      addToast(`Đã ${newStatus === 'approved' ? 'DUYỆT' : 'TỪ CHỐI'} conversion`, newStatus === 'approved' ? 'success' : 'warning');
      loadConversions();
    }
  };

  const resetForm = () => {
    setAffiliateEmail('');
    setSaleAmount('');
    setProductName('');
    setCustomerName('');
    setCommissionRate(50);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved': return <span className="badge badge-paid"><CheckCircle size={12} style={{marginRight:4}} />Đã duyệt</span>;
      case 'rejected': return <span className="badge" style={{background:'#EF4444',color:'white'}}><XCircle size={12} style={{marginRight:4}} />Từ chối</span>;
      default: return <span className="badge badge-pending"><Clock size={12} style={{marginRight:4}} />Chờ duyệt</span>;
    }
  };

  return (
    <div className="admin-page-wrapper">
      <div className="flex-between mb-6">
        <div>
          <h2>Quản Lý Đơn Hàng & Hoa Hồng</h2>
          <p className="text-muted mt-2">Ghi nhận conversions, tính toán hoa hồng tự động theo tier cap, duyệt/từ chối đơn.</p>
        </div>
        <button className="cf-btn-primary flex-align-center" style={{gap:'10px',padding:'10px 20px'}} onClick={() => setShowAddModal(true)}>
          <Plus size={18} /> Tạo Conversion Mới
        </button>
      </div>

      {/* Stats */}
      <div className="stats-grid mb-6">
        <div className="cf-card" style={{borderTop: '4px solid #F59E0B'}}>
          <h3 className="text-muted text-sm font-bold uppercase mb-2">Chờ Duyệt</h3>
          <div className="font-bold text-3xl">{loading ? <Skeleton width="60px" height="36px" /> : conversions.filter(c => c.status === 'pending').length}</div>
        </div>
        <div className="cf-card" style={{borderTop: '4px solid #10B981'}}>
          <h3 className="text-muted text-sm font-bold uppercase mb-2">Đã Duyệt</h3>
          <div className="font-bold text-3xl">{loading ? <Skeleton width="60px" height="36px" /> : conversions.filter(c => c.status === 'approved').length}</div>
        </div>
        <div className="cf-card" style={{borderTop: '4px solid #3B82F6'}}>
          <h3 className="text-muted text-sm font-bold uppercase mb-2">Tổng Hoa Hồng Đã Chi</h3>
          <div className="font-bold text-3xl" style={{color:'#059669'}}>{loading ? <Skeleton width="140px" height="36px" /> : conversions.filter(c => c.status === 'approved').reduce((acc, c) => acc + Number(c.commission_amount), 0).toLocaleString()}</div>
        </div>
      </div>

      {/* Table */}
      <div className="cf-card p-0">
        <div className="p-4" style={{borderBottom:'1px solid var(--cf-border)'}}>
          <h3 className="font-bold">Danh Sách Conversions</h3>
        </div>
        <div className="table-responsive">
          <table className="cf-table">
            <thead>
              <tr>
                <th>Affiliate</th>
                <th>Khách / Sản Phẩm</th>
                <th style={{textAlign:'right'}}>Doanh Số</th>
                <th style={{textAlign:'right'}}>Hoa Hồng</th>
                <th>Trạng Thái</th>
                <th style={{textAlign:'right'}}>Hành Động</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td><Skeleton width="130px" height="20px" /><div style={{marginTop:4}}><Skeleton width="160px" height="14px" /></div></td>
                    <td><Skeleton width="120px" height="20px" /></td>
                    <td style={{textAlign:'right'}}><Skeleton width="100px" height="20px" style={{marginLeft:'auto'}} /></td>
                    <td style={{textAlign:'right'}}><Skeleton width="100px" height="20px" style={{marginLeft:'auto'}} /></td>
                    <td><Skeleton width="80px" height="24px" style={{borderRadius:12}} /></td>
                    <td style={{textAlign:'right'}}><Skeleton width="60px" height="28px" style={{marginLeft:'auto'}} /></td>
                  </tr>
                ))
              ) : conversions.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{textAlign:'center',padding:'40px',color:'#6B7280'}}>
                    Chưa có conversion nào. Nhấn "Tạo Conversion Mới" để bắt đầu.
                  </td>
                </tr>
              ) : conversions.map((conv) => (
                <tr key={conv.id}>
                  <td>
                    <div className="font-bold">{conv.profiles?.full_name || 'N/A'}</div>
                    <div className="text-sm text-muted">{conv.profiles?.email || ''}</div>
                    <div className="text-sm" style={{color:'#8B5CF6',marginTop:2}}>Tier: {(conv.profiles?.tier || 'starter').toUpperCase()}</div>
                  </td>
                  <td>
                    <div className="font-bold">{conv.customer_name || conv.customer_info?.name || 'N/A'}</div>
                    {conv.customer_info?.phone && <div className="text-sm font-bold" style={{color: '#10B981', marginTop: '2px'}}>{conv.customer_info.phone}</div>}
                    <div className="text-sm text-muted">{conv.product_name || 'N/A'}</div>
                    <div className="text-sm text-muted">{new Date(conv.created_at).toLocaleDateString('vi-VN')}</div>
                  </td>
                  <td style={{textAlign:'right'}} className="font-bold">{Number(conv.sale_amount).toLocaleString()}</td>
                  <td style={{textAlign:'right'}}>
                    <div className="font-bold" style={{color:'#059669'}}>+{Number(conv.commission_amount).toLocaleString()}</div>
                    {conv.customer_info?.rolled_up > 0 && (
                      <div className="text-sm" style={{color:'#EF4444'}}>Roll-up: -{Number(conv.customer_info.rolled_up).toLocaleString()}</div>
                    )}
                  </td>
                  <td>{getStatusBadge(conv.status)}</td>
                  <td style={{textAlign:'right'}}>
                    {conv.status === 'pending' && (
                      <div style={{display:'flex',gap:'6px',justifyContent:'flex-end'}}>
                        <button 
                          className="cf-btn-outline" 
                          style={{padding:'4px 10px',fontSize:'12px',color:'#10B981',borderColor:'#10B981'}}
                          onClick={() => updateStatus(conv.id, 'approved')}
                          title="Duyệt"
                        >
                          <CheckCircle size={14} />
                        </button>
                        <button 
                          className="cf-btn-outline" 
                          style={{padding:'4px 10px',fontSize:'12px',color:'#EF4444',borderColor:'#EF4444'}}
                          onClick={() => updateStatus(conv.id, 'rejected')}
                          title="Từ chối"
                        >
                          <XCircle size={14} />
                        </button>
                      </div>
                    )}
                    {conv.status !== 'pending' && (
                      <span className="text-sm text-muted">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL TẠO CONVERSION */}
      {showAddModal && (
        <div style={{position:'fixed',top:0,left:0,right:0,bottom:0,backgroundColor:'rgba(0,0,0,0.6)',zIndex:9999,display:'flex',alignItems:'center',justifyContent:'center'}} onClick={() => setShowAddModal(false)}>
          <div className="cf-card" onClick={e => e.stopPropagation()} style={{width:'520px',maxWidth:'90%',padding:'32px'}}>
            <div className="flex-between mb-6">
              <h2>Tạo Conversion Mới</h2>
              <button onClick={() => setShowAddModal(false)} style={{background:'none',border:'none',cursor:'pointer',color:'#6B7280'}}><X size={24} /></button>
            </div>

            <form onSubmit={handleCreateConversion} style={{display:'flex',flexDirection:'column',gap:'16px'}}>
              <div>
                <label style={{display:'block',fontSize:'14px',fontWeight:600,marginBottom:'6px'}}>Email Affiliate *</label>
                <input type="email" required className="cf-input w-100" placeholder="affiliate@email.com" value={affiliateEmail} onChange={e => setAffiliateEmail(e.target.value)} />
              </div>

              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px'}}>
                <div>
                  <label style={{display:'block',fontSize:'14px',fontWeight:600,marginBottom:'6px'}}>Tên Khách Hàng</label>
                  <input type="text" className="cf-input w-100" placeholder="Nguyễn Văn A" value={customerName} onChange={e => setCustomerName(e.target.value)} />
                </div>
                <div>
                  <label style={{display:'block',fontSize:'14px',fontWeight:600,marginBottom:'6px'}}>Sản Phẩm / Gói Mua</label>
                  <input type="text" className="cf-input w-100" placeholder="MASTER 12Tr" value={productName} onChange={e => setProductName(e.target.value)} />
                </div>
              </div>

              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px'}}>
                <div>
                  <label style={{display:'block',fontSize:'14px',fontWeight:600,marginBottom:'6px'}}>Doanh Số (VNĐ) *</label>
                  <input type="number" required className="cf-input w-100" placeholder="12000000" value={saleAmount} onChange={e => setSaleAmount(e.target.value)} />
                </div>
                <div>
                  <label style={{display:'block',fontSize:'14px',fontWeight:600,marginBottom:'6px'}}>% Hoa Hồng</label>
                  <input type="number" className="cf-input w-100" min="1" max="100" value={commissionRate} onChange={e => setCommissionRate(Number(e.target.value))} />
                </div>
              </div>

              {saleAmount && (
                <div className="cf-card" style={{background:'rgba(52,211,153,0.1)',border:'1px solid rgba(52,211,153,0.3)',padding:'12px 16px'}}>
                  <div className="text-sm" style={{color:'#059669'}}>
                    <strong>Preview:</strong> Doanh số {Number(saleAmount).toLocaleString()} × {commissionRate}% = <strong>{Math.round(Number(saleAmount) * commissionRate / 100).toLocaleString()}</strong> hoa hồng
                  </div>
                  <div className="text-sm text-muted mt-1">
                    (Sẽ bị cap theo tier của affiliate. Admin duyệt → tự động cộng balance.)
                  </div>
                </div>
              )}

              <div style={{display:'flex',justifyContent:'flex-end',gap:'12px',marginTop:'8px'}}>
                <button type="button" onClick={() => setShowAddModal(false)} style={{padding:'10px 16px',background:'#F3F4F6',color:'#4B5563',border:'none',borderRadius:'8px',cursor:'pointer',fontWeight:600}}>Hủy</button>
                <button type="submit" className="cf-btn-primary" disabled={saving} style={{padding:'10px 24px',display:'flex',alignItems:'center',gap:'8px'}}>
                  {saving ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                  Tạo Conversion
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
