import React from 'react';
import { NavLink } from 'react-router-dom';
import './RollupLedger.css';

const MOCK_LEDGER = [
  {
    id: '#TRX-98231',
    date: '16/04/2026',
    buyer: 'Nguyễn Tiến Đạt',
    courseName: 'AI COACH (30 Tr)',
    expectedComm: 9000000, 
    earnedComm: 6000000,
    lostComm: 3000000,
    rolledUpTo: 'Hệ thống Gốc',
    reason: 'Gói hiện tại của bạn là MASTER. Hạn mức hoa hồng tối đa: 6.000.000 ₫.'
  },
  {
    id: '#TRX-98205',
    date: '14/04/2026',
    buyer: 'Trần Minh Quân',
    courseName: 'AI PARTNER (100 Tr)',
    expectedComm: 20000000, 
    earnedComm: 6000000,
    lostComm: 14000000,
    rolledUpTo: 'Hữu Nguyễn (Upline)',
    reason: 'Gói hiện tại của bạn là MASTER. Hạn mức hoa hồng tối đa: 6.000.000 ₫.'
  },
  {
    id: '#TRX-98188',
    date: '10/04/2026',
    buyer: 'Lê Hoàng Yến',
    courseName: 'STARTER (6 Tr)',
    expectedComm: 3000000, 
    earnedComm: 3000000,
    lostComm: 0,
    rolledUpTo: 'N/A',
    reason: 'Hoa hồng chi trả 100% trong hạn mức.'
  }
];

export default function RollupLedger() {
  const totalLost = MOCK_LEDGER.reduce((acc, trx) => acc + trx.lostComm, 0);

  return (
    <div className="ledger-container">
      <div className="ledger-header">
        <div className="ledger-header-text">
          <h1>Sao Kê Tổn Thất & Dòng Tiền Tràn (Roll-up Ledger)</h1>
          <p>Thuật toán Xuyên Thấu sẽ tự động đẩy toàn bộ số tiền vượt hạn mức khóa học của bạn lên cho Upline hoặc Công ty.</p>
        </div>
        <div className="ledger-total-lost">
          <div className="ledger-lost-label">TỔNG LỢI NHUẬN BỎ LỠ (30 NGÀY)</div>
          <div className="ledger-lost-amount">{totalLost.toLocaleString()} ₫</div>
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
            {MOCK_LEDGER.map(trx => (
              <tr key={trx.id} className={trx.lostComm > 0 ? 'row-danger' : 'row-safe'}>
                <td>
                  <div className="trx-id">{trx.id}</div>
                  <div className="trx-date bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded inline-block mt-1">{trx.date}</div>
                </td>
                <td>
                  <div className="trx-buyer">{trx.buyer}</div>
                  <div className="trx-course">{trx.courseName}</div>
                  <div className="trx-expected text-xs mt-1 text-gray-500">
                    Hoa hồng lẽ ra nhận: <strong>{trx.expectedComm.toLocaleString()} ₫</strong>
                  </div>
                </td>
                <td className="text-right">
                  <div className="trx-earned">{trx.earnedComm > 0 ? '+' + trx.earnedComm.toLocaleString() + ' ₫' : '0 ₫'}</div>
                </td>
                <td className="text-right">
                  {trx.lostComm > 0 ? (
                    <>
                      <div className="trx-lost">-{trx.lostComm.toLocaleString()} ₫</div>
                      <div className="trx-rolled text-xs text-red-500 font-medium">Tràn lên: {trx.rolledUpTo}</div>
                    </>
                  ) : (
                    <div className="trx-no-loss">0 ₫</div>
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
          <p>Hệ thống tự động phát hiện bạn đang kinh doanh các gói cao cấp (AI Partner, AI Coach) nhưng tài khoản của bạn chỉ đang chịu mức giới hạn của gói <strong>MASTER</strong>. Những đại lý tuyến trên của bạn đang <strong>Hưởng Lợi Miễn Phí {totalLost.toLocaleString()} ₫</strong> từ công sức mồ hôi nước mắt của bạn!</p>
          <NavLink to="/affiliate/store" className="upgrade-now-btn mt-3 inline-block">BẢO VỆ DÒNG TIỀN - NÂNG CẤP NGAY</NavLink>
        </div>
      </div>
    </div>
  );
}
