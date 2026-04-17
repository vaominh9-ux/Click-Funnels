import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useToast } from '../../components/common/Toast';
import Skeleton from '../../components/common/Skeleton';
import './RollupLedger.css';

const TIER_CAPS = {
  'starter': 3000000,
  'master': 6000000,
  'ai-coach': 9000000,
  'ai-partner': 20000000,
};

export default function RollupLedger() {
  const [loading, setLoading] = useState(true);
  const [ledgerData, setLedgerData] = useState([]);
  const [totalLost, setTotalLost] = useState(0);
  const [userTier, setUserTier] = useState('starter');
  const addToast = useToast();

  useEffect(() => {
    let subscription = null;
    let currentUserId = null;

    const initLedger = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      currentUserId = user.id;

      await loadLedger(user.id);

      // === REALTIME SUBSCRIPTION ===
      subscription = supabase
        .channel('realtime_rollup_ledger')
        .on('postgres_changes', { 
          event: '*', 
          schema: 'public', 
          table: 'conversions',
          filter: `affiliate_id=eq.${user.id}`
        }, () => {
          console.log('Realtime update on conversions (RollupLedger)');
          loadLedger(user.id);
        })
        .subscribe();
    };

    initLedger();

    return () => {
      if (subscription) {
        supabase.removeChannel(subscription);
      }
    };
  }, []);

  const loadLedger = async (userId) => {
    setLoading(true);
    try {
      // 1. Lắng nghe tier hiện tại
      const { data: profile } = await supabase
        .from('profiles')
        .select('tier')
        .eq('id', userId)
        .single();

      const tier = profile?.tier || 'starter';
      setUserTier(tier);
      const cap = TIER_CAPS[tier] || 3000000;

      // 2. Lấy conversions đã approved cho user này
      const { data: conversions, error } = await supabase
        .from('conversions')
        .select('id, created_at, commission_amount, status, customer_name, product_name, customer_info')
        .eq('affiliate_id', userId)
        .eq('status', 'approved')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) {
        console.error('Lỗi lấy conversions:', error);
        addToast('Không thể tải dữ liệu sao kê', 'error');
        setLoading(false);
        return;
      }

      // 3. Tính toán rollup cho mỗi conversion
      let totalLostCalc = 0;
      const ledger = (conversions || []).map((conv, index) => {
        const expectedComm = Number(conv.commission_amount) || 0;
        const earnedComm = Math.min(expectedComm, cap);
        const lostComm = Math.max(0, expectedComm - cap);

        totalLostCalc += lostComm;

        return {
          id: `#TRX-${String(index + 1).padStart(5, '0')}`,
          date: new Date(conv.created_at).toLocaleDateString('vi-VN'),
          buyer: conv.customer_name || 'Khách hàng',
          courseName: conv.product_name || 'Sản phẩm',
          expectedComm,
          earnedComm,
          lostComm,
          rolledUpTo: lostComm > 0 ? 'Upline / Hệ thống Gốc' : 'N/A',
          reason: lostComm > 0 
            ? `Gói hiện tại: ${tier.toUpperCase()}. Hạn mức tối đa: ${cap.toLocaleString()}.`
            : 'Hoa hồng chi trả 100% trong hạn mức.'
        };
      });

      setLedgerData(ledger);
      setTotalLost(totalLostCalc);

    } catch (err) {
      console.error('Unexpected error:', err);
    }
    setLoading(false);
  };

  return (
    <div className="ledger-container">
      <div className="ledger-header">
        <div className="ledger-header-text">
          <h1>Sao Kê Tổn Thất & Dòng Tiền Tràn (Roll-up Ledger)</h1>
          <p>Thuật toán Xuyên Thấu sẽ tự động đẩy toàn bộ số tiền vượt hạn mức khóa học của bạn lên cho Upline hoặc Công ty.</p>
        </div>
        <div className="ledger-total-lost">
          <div className="ledger-lost-label">TỔNG LỢI NHUẬN BỎ LỠ (30 NGÀY)</div>
          <div className="ledger-lost-amount">
            {loading ? <Skeleton width="150px" height="32px" /> : `${totalLost.toLocaleString()}`}
          </div>
        </div>
      </div>

      <div className="ledger-table-container">
        <table className="ledger-table">
          <thead>
            <tr>
              <th>GIAO DỊCH</th>
              <th>KHÁCH HÀNG & GÓI MUA</th>
              <th className="text-right">AN TOÀN (THỰC NHẬN)</th>
              <th className="text-right">MẤT TRẮNG (TRÀN LÊN AI)</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <tr key={i}>
                  <td><Skeleton width="100px" height="20px" /><div style={{marginTop: 6}}><Skeleton width="80px" height="14px" /></div></td>
                  <td><Skeleton width="140px" height="20px" /><div style={{marginTop: 6}}><Skeleton width="120px" height="16px" /></div></td>
                  <td className="text-right"><Skeleton width="120px" height="20px" style={{marginLeft: 'auto'}} /></td>
                  <td className="text-right"><Skeleton width="130px" height="24px" style={{marginLeft: 'auto'}} /></td>
                </tr>
              ))
            ) : ledgerData.length === 0 ? (
              <tr>
                <td colSpan={4} style={{textAlign: 'center', padding: '40px', color: '#6B7280'}}>
                  Chưa có giao dịch nào. Khi có conversions được duyệt, dữ liệu sẽ hiển thị ở đây.
                </td>
              </tr>
            ) : ledgerData.map(trx => (
              <tr key={trx.id} className={trx.lostComm > 0 ? 'row-danger' : 'row-safe'}>
                <td>
                  <div className="trx-id">{trx.id}</div>
                  <div style={{fontSize:'12px',color:'#9CA3AF',marginTop:'4px'}}>{trx.date}</div>
                </td>
                <td>
                  <div className="trx-buyer">{trx.buyer}</div>
                  <div className="trx-course">{trx.courseName}</div>
                  <div style={{fontSize:'12px',color:'#9CA3AF',marginTop:'4px'}}>
                    Hoa hồng lẽ ra nhận: <strong>{trx.expectedComm.toLocaleString()}</strong>
                  </div>
                </td>
                <td className="text-right">
                  <div className="trx-earned">{trx.earnedComm > 0 ? '+' + trx.earnedComm.toLocaleString() : '0'}</div>
                </td>
                <td className="text-right">
                  {trx.lostComm > 0 ? (
                    <>
                      <div className="trx-lost">-{trx.lostComm.toLocaleString()}</div>
                      <div style={{fontSize:'12px',color:'#EF4444',fontWeight:500,marginTop:'4px'}}>Tràn lên: {trx.rolledUpTo}</div>
                    </>
                  ) : (
                    <div className="trx-no-loss">0</div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="ledger-explanation mt-6">
        <div className="explanation-icon">
          <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        </div>
        <div className="explanation-content">
          <h4>BẠN ĐANG BỊ RỚT TIỀN?</h4>
          <p>
            Hạng hiện tại của bạn là <strong>{userTier.toUpperCase()}</strong> — hạn mức tối đa mỗi sale: <strong>{(TIER_CAPS[userTier] || 0).toLocaleString()}</strong>.
            {totalLost > 0 && <> Bạn đã mất <strong style={{color:'#DC2626'}}>{totalLost.toLocaleString()}</strong> do vượt hạn mức!</>}
          </p>
          <NavLink to="/affiliate/store" className="upgrade-now-btn mt-3 inline-block">BẢO VỆ DÒNG TIỀN - NÂNG CẤP NGAY</NavLink>
        </div>
      </div>
    </div>
  );
}
