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
import MyCustomers from './pages/affiliate/MyCustomers';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminAffiliatesList from './pages/admin/AffiliatesList';
import AdminCommissionPlans from './pages/admin/CommissionPlans';
import AdminPayouts from './pages/admin/Payouts';
import AdminStaffManagement from './pages/admin/StaffManagement';
import AdminCampaignManager from './pages/admin/CampaignManager';
import AdminLeadsCRM from './pages/admin/LeadsCRM';
import AdminConversions from './pages/admin/Conversions';
import AdminPaymentSettings from './pages/admin/PaymentSettings';

import ClickTracker from './pages/public/ClickTracker';
import Checkout from './pages/public/Checkout';

// Landing Pages (Funnels)
import Course1 from './pages/funnels/Course1';
import Course2 from './pages/funnels/Course2';
import Course3 from './pages/funnels/Course3';
import Course4 from './pages/funnels/Course4';

const App = () => {
  return (
    <ToastProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/khoa-hoc/khoa-hoc-1" element={<Course1 />} />
          <Route path="/khoa-hoc/khoa-hoc-2" element={<Course2 />} />
          <Route path="/khoa-hoc/khoa-hoc-3" element={<Course3 />} />
          <Route path="/khoa-hoc/khoa-hoc-4" element={<Course4 />} />
          <Route path="/checkout/:courseId" element={<Checkout />} />
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

          <Route path="/portal/customers" element={
            <ProtectedRoute>
              <MainLayout title="Khách Hàng Của Tôi">
                <MyCustomers />
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
              <MainLayout title="CRM">
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
          <Route path="/admin/payment-settings" element={
            <ProtectedRoute requiredRole="admin">
              <MainLayout title="Cấu Hình Thanh Toán">
                <AdminPaymentSettings />
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
