import React from 'react';
import { Users, GitBranch, ArrowUpRight } from 'lucide-react';
import '../affiliate/Dashboard.css';

const AffiliateNetwork = () => {
  const mockupDownlines = [
    { name: 'Khách Hàng A', level: 'F1 (Trực tiếp)', joined: '10 Tháng 4, 2026', active: true, revenue: '12,000,000 ₫' },
    { name: 'Đại Lý B', level: 'F1 (Trực tiếp)', joined: '12 Tháng 4, 2026', active: true, revenue: '6,000,000 ₫' },
    { name: 'Người Dùng C', level: 'F2 (Nhánh)', joined: '14 Tháng 4, 2026', active: false, revenue: '0 ₫' },
    { name: 'Đối Tác D', level: 'F2 (Nhánh)', joined: '15 Tháng 4, 2026', active: true, revenue: '30,000,000 ₫' },
  ];

  return (
    <div className="dashboard-wrapper">
      <div className="flex-between mb-6">
        <div>
          <h2>Mạng Lưới Bán Hàng</h2>
          <p className="text-muted mt-2">Theo dõi hiệu suất của các đối tác tuyến dưới và thu nhập nhánh.</p>
        </div>
      </div>

      <div className="stats-grid mb-6">
        <div className="cf-card" style={{borderTop: '4px solid #3B82F6'}}>
          <h3 className="text-muted text-sm font-bold uppercase mb-2 flex-align-center" style={{gap: '8px'}}>
            <Users size={16}/> Đối Tác Trực Tiếp (F1)
          </h3>
          <div className="font-bold text-3xl">12</div>
        </div>
        <div className="cf-card" style={{borderTop: '4px solid #8B5CF6'}}>
          <h3 className="text-muted text-sm font-bold uppercase mb-2 flex-align-center" style={{gap: '8px'}}>
            <GitBranch size={16}/> Tuyến Dưới (F2/F3)
          </h3>
          <div className="font-bold text-3xl">45</div>
        </div>
        <div className="cf-card" style={{borderTop: '4px solid #10B981'}}>
          <h3 className="text-muted text-sm font-bold uppercase mb-2 flex-align-center" style={{gap: '8px'}}>
            <ArrowUpRight size={16}/> Thu Nhập Nhánh
          </h3>
          <div className="font-bold text-3xl text-success">+ 22,450,000 ₫</div>
        </div>
      </div>

      <div className="cf-card p-0">
        <div className="p-4" style={{borderBottom: '1px solid var(--cf-border)'}}>
          <h3 className="font-bold">Hoạt Động Tuyến Dưới (Downline)</h3>
        </div>
        <table className="cf-table">
          <thead>
            <tr>
              <th>Tên Đối Tác</th>
              <th>Cấp Bậc (Level)</th>
              <th>Ngày Tham Gia</th>
              <th>Trạng Thái</th>
              <th style={{textAlign: 'right'}}>Doanh Số Mang Lại</th>
            </tr>
          </thead>
          <tbody>
            {mockupDownlines.map((user, i) => (
              <tr key={i}>
                <td className="font-bold">{user.name}</td>
                <td className="text-muted">{user.level}</td>
                <td>{user.joined}</td>
                <td>
                  <span className={`badge ${user.active ? 'badge-paid' : 'badge-pending'}`}>
                    {user.active ? 'Đang hoạt động' : 'Bị Khóa (Quá hạn)'}
                  </span>
                </td>
                <td style={{textAlign: 'right'}} className="font-bold">{user.revenue}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AffiliateNetwork;
