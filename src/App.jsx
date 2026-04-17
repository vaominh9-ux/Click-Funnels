import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './components/common/Toast';
import './index.css';

// Layouts & Auth
import MainLayout from './layouts/AffiliateLayout';
import ProtectedRoute from './components/common/ProtectedRoute';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Affiliate Pages
import AffiliateDashboard from './pages/affiliate/Dashboard';
import AffiliateCampaigns from './pages/affiliate/Campaigns';
import AffiliateLinks from './pages/affiliate/AffiliateLinks';
import AffiliateNetwork from './pages/affiliate/Network';
import AffiliateSettings from './pages/affiliate/Settings';
import UpgradeStore from './pages/affiliate/UpgradeStore';
import RollupLedger from './pages/affiliate/RollupLedger';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminAffiliatesList from './pages/admin/AffiliatesList';
import AdminCommissionPlans from './pages/admin/CommissionPlans';
import AdminPayouts from './pages/admin/Payouts';
import AdminStaffManagement from './pages/admin/StaffManagement';
import AdminCampaignManager from './pages/admin/CampaignManager';
import AdminLeadsCRM from './pages/admin/LeadsCRM';
import AdminConversions from './pages/admin/Conversions';

// Public Pages
import ClickTracker from './pages/public/ClickTracker';

const App = () => {
  return (
    <ToastProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/go/:refCode" element={<ClickTracker />} />

          {/* Auth Routes */}
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<Register />} />

          {/* Affiliate Portal Routes */}
          <Route path="/portal" element={
            <ProtectedRoute>
              <MainLayout title="Thống Kê Thu Nhập">
                <AffiliateDashboard />
              </MainLayout>
            </ProtectedRoute>
          } />

          <Route path="/portal/campaigns/*" element={
            <ProtectedRoute>
              <MainLayout title="Chiến Dịch (Campaigns)">
                <AffiliateCampaigns />
              </MainLayout>
            </ProtectedRoute>
          } />

          <Route path="/portal/network/*" element={
            <ProtectedRoute>
              <MainLayout title="Mạng Lưới Bán Hàng">
                <AffiliateNetwork />
              </MainLayout>
            </ProtectedRoute>
          } />

          <Route path="/portal/settings" element={
            <ProtectedRoute>
              <MainLayout title="Cài Đặt Cá Nhân">
                <AffiliateSettings />
              </MainLayout>
            </ProtectedRoute>
          } />

          <Route path="/affiliate/store" element={
            <ProtectedRoute>
              <MainLayout title="Nâng Cấp Cửa Hàng">
                <UpgradeStore />
              </MainLayout>
            </ProtectedRoute>
          } />

          <Route path="/affiliate/ledger" element={
            <ProtectedRoute>
              <MainLayout title="Lịch Sử Dòng Tiền Tràn">
                <RollupLedger />
              </MainLayout>
            </ProtectedRoute>
          } />

          <Route path="/affiliate/links" element={
            <ProtectedRoute>
              <MainLayout title="Links & UTM Tracking">
                <AffiliateLinks />
              </MainLayout>
            </ProtectedRoute>
          } />
          
          {/* Admin Portal Routes */}
          <Route path="/admin" element={
            <ProtectedRoute requiredRole="admin">
              <MainLayout title="Bảng Điều Khiển Quản Trị">
                <AdminDashboard />
              </MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/affiliates" element={
            <ProtectedRoute requiredRole="admin">
              <MainLayout title="Quản Lý CTV (Affiliates)">
                <AdminAffiliatesList />
              </MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/staff" element={
            <ProtectedRoute requiredRole="admin">
              <MainLayout title="Nhân Sự & Phân Quyền">
                <AdminStaffManagement />
              </MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/commissions" element={
            <ProtectedRoute requiredRole="admin">
              <MainLayout title="Cấu Hình Hoa Hồng">
                <AdminCommissionPlans />
              </MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/campaign-links" element={
            <ProtectedRoute requiredRole="admin">
              <MainLayout title="Nguồn Link Landing Page">
                <AdminCampaignManager />
              </MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/payouts" element={
            <ProtectedRoute requiredRole="admin">
              <MainLayout title="Duyệt Rút Tiền">
                <AdminPayouts />
              </MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/leads" element={
            <ProtectedRoute requiredRole="admin">
              <MainLayout title="Quản Lý Khách Hàng (CRM)">
                <AdminLeadsCRM />
              </MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/conversions" element={
            <ProtectedRoute requiredRole="admin">
              <MainLayout title="Quản Lý Đơn Hàng & Hoa Hồng">
                <AdminConversions />
              </MainLayout>
            </ProtectedRoute>
          } />
          
          {/* Default Route */}
          <Route path="*" element={<Navigate to="/portal" replace />} />
        </Routes>
      </Router>
    </ToastProvider>
  );
};

export default App;
