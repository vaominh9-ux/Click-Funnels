import React, { Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ToastProvider } from './components/common/Toast';
import './index.css';

// ============================================================
// STATIC IMPORTS — Landing Pages + Checkout (khách hàng vào nhiều)
// Giữ static để load TỨC THÌ, không chờ lazy chunk
// ============================================================
import Course1 from './pages/funnels/Course1';
import Course2 from './pages/funnels/Course2';
import Course3 from './pages/funnels/Course3';
import Course4 from './pages/funnels/Course4';
import Free3Day from './pages/funnels/Free3Day';
import ClickTracker from './pages/public/ClickTracker';
import Checkout from './pages/public/Checkout';

// ============================================================
// LAZY IMPORTS — Admin, Affiliate, Auth (chỉ load khi cần)
// Tách thành chunks riêng → giảm ~60% bundle cho Landing Pages
// ============================================================

// Layouts & Auth
const MainLayout = React.lazy(() => import('./layouts/AffiliateLayout'));
const ProtectedRoute = React.lazy(() => import('./components/common/ProtectedRoute'));
const Login = React.lazy(() => import('./pages/auth/Login'));
const Register = React.lazy(() => import('./pages/auth/Register'));

// Affiliate Pages
const AffiliateDashboard = React.lazy(() => import('./pages/affiliate/Dashboard'));
const AffiliateCampaigns = React.lazy(() => import('./pages/affiliate/Campaigns'));
const AffiliateLinks = React.lazy(() => import('./pages/affiliate/AffiliateLinks'));
const AffiliateNetwork = React.lazy(() => import('./pages/affiliate/Network'));
const AffiliateSettings = React.lazy(() => import('./pages/affiliate/Settings'));
const UpgradeStore = React.lazy(() => import('./pages/affiliate/UpgradeStore'));
const RollupLedger = React.lazy(() => import('./pages/affiliate/RollupLedger'));
const MyCustomers = React.lazy(() => import('./pages/affiliate/MyCustomers'));

// Admin Pages
const AdminDashboard = React.lazy(() => import('./pages/admin/Dashboard'));
const AdminAffiliatesList = React.lazy(() => import('./pages/admin/AffiliatesList'));
const AdminCommissionPlans = React.lazy(() => import('./pages/admin/CommissionPlans'));
const AdminPayouts = React.lazy(() => import('./pages/admin/Payouts'));
const AdminStaffManagement = React.lazy(() => import('./pages/admin/StaffManagement'));
const AdminCampaignManager = React.lazy(() => import('./pages/admin/CampaignManager'));
const AdminLeadsCRM = React.lazy(() => import('./pages/admin/LeadsCRM'));
const AdminConversions = React.lazy(() => import('./pages/admin/Conversions'));
const AdminPaymentSettings = React.lazy(() => import('./pages/admin/PaymentSettings'));
const AdminEmailSettings = React.lazy(() => import('./pages/admin/EmailSettings'));
const AdminWorkshopSettings = React.lazy(() => import('./pages/admin/WorkshopSettings'));
const AdminWebhookSettings = React.lazy(() => import('./pages/admin/WebhookSettings'));

// ============================================================
// Fallback Loading Component — hiện khi lazy chunk đang tải
// ============================================================
const LazyFallback = () => (
  <div style={{
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    height: '100vh', background: '#F9FAFB'
  }}>
    <div style={{ textAlign: 'center' }}>
      <div style={{
        width: '40px', height: '40px', border: '4px solid #E5E7EB',
        borderTopColor: '#3B82F6', borderRadius: '50%',
        animation: 'spin 0.8s linear infinite', margin: '0 auto 12px'
      }} />
      <p style={{ color: '#6B7280', fontSize: '14px', margin: 0 }}>Đang tải...</p>
    </div>
  </div>
);

const ZoomController = () => {
  const location = useLocation();
  useEffect(() => {
    const isPublicPage = location.pathname.startsWith('/khoa-hoc') || location.pathname.startsWith('/checkout') || location.pathname.startsWith('/go') || location.pathname.startsWith('/auth');
    if (isPublicPage) {
      document.body.style.zoom = "100%";
      document.documentElement.style.setProperty('--ui-zoom', 1);
    } else {
      const currentZoom = localStorage.getItem('cf_ui_zoom') || '80%';
      document.body.style.zoom = currentZoom;
      document.documentElement.style.setProperty('--ui-zoom', parseFloat(currentZoom) / 100);
    }
  }, [location.pathname]);
  return null;
};

const App = () => {
  return (
    <ToastProvider>
      <Router>
        <ZoomController />
        <Routes>
          {/* ====== PUBLIC ROUTES — STATIC, TỐC ĐỘ TỐI ĐA ====== */}
          <Route path="/khoa-hoc/3-ngay-mien-phi" element={<Free3Day />} />
          <Route path="/khoa-hoc/khoa-hoc-1" element={<Course1 />} />
          <Route path="/khoa-hoc/khoa-hoc-2" element={<Course2 />} />
          <Route path="/khoa-hoc/khoa-hoc-3" element={<Course3 />} />
          <Route path="/khoa-hoc/khoa-hoc-4" element={<Course4 />} />
          <Route path="/checkout/:courseId" element={<Checkout />} />
          <Route path="/go/:refCode" element={<ClickTracker />} />

          {/* ====== AUTH ROUTES — LAZY ====== */}
          <Route path="/auth/login" element={<Suspense fallback={<LazyFallback />}><Login /></Suspense>} />
          <Route path="/auth/register" element={<Suspense fallback={<LazyFallback />}><Register /></Suspense>} />

          {/* ====== AFFILIATE PORTAL — LAZY ====== */}
          <Route path="/portal" element={
            <Suspense fallback={<LazyFallback />}>
              <ProtectedRoute>
                <MainLayout title="Thống Kê Thu Nhập">
                  <AffiliateDashboard />
                </MainLayout>
              </ProtectedRoute>
            </Suspense>
          } />

          <Route path="/portal/campaigns/*" element={
            <Suspense fallback={<LazyFallback />}>
              <ProtectedRoute>
                <MainLayout title="Chiến Dịch (Campaigns)">
                  <AffiliateCampaigns />
                </MainLayout>
              </ProtectedRoute>
            </Suspense>
          } />

          <Route path="/portal/network/*" element={
            <Suspense fallback={<LazyFallback />}>
              <ProtectedRoute>
                <MainLayout title="Mạng Lưới Bán Hàng">
                  <AffiliateNetwork />
                </MainLayout>
              </ProtectedRoute>
            </Suspense>
          } />

          <Route path="/portal/settings" element={
            <Suspense fallback={<LazyFallback />}>
              <ProtectedRoute>
                <MainLayout title="Cài Đặt Cá Nhân">
                  <AffiliateSettings />
                </MainLayout>
              </ProtectedRoute>
            </Suspense>
          } />

          <Route path="/affiliate/store" element={
            <Suspense fallback={<LazyFallback />}>
              <ProtectedRoute>
                <MainLayout title="Nâng Cấp Cửa Hàng">
                  <UpgradeStore />
                </MainLayout>
              </ProtectedRoute>
            </Suspense>
          } />

          <Route path="/affiliate/ledger" element={
            <Suspense fallback={<LazyFallback />}>
              <ProtectedRoute>
                <MainLayout title="Lịch Sử Dòng Tiền Tràn">
                  <RollupLedger />
                </MainLayout>
              </ProtectedRoute>
            </Suspense>
          } />

          <Route path="/affiliate/links" element={
            <Suspense fallback={<LazyFallback />}>
              <ProtectedRoute>
                <MainLayout title="Links & UTM Tracking">
                  <AffiliateLinks />
                </MainLayout>
              </ProtectedRoute>
            </Suspense>
          } />

          <Route path="/portal/customers" element={
            <Suspense fallback={<LazyFallback />}>
              <ProtectedRoute>
                <MainLayout title="Khách Hàng Của Tôi">
                  <MyCustomers />
                </MainLayout>
              </ProtectedRoute>
            </Suspense>
          } />
          
          {/* ====== ADMIN PORTAL — LAZY ====== */}
          <Route path="/admin" element={
            <Suspense fallback={<LazyFallback />}>
              <ProtectedRoute requiredRole="admin">
                <MainLayout title="Bảng Điều Khiển Quản Trị">
                  <AdminDashboard />
                </MainLayout>
              </ProtectedRoute>
            </Suspense>
          } />
          <Route path="/admin/affiliates" element={
            <Suspense fallback={<LazyFallback />}>
              <ProtectedRoute requiredRole="admin">
                <MainLayout title="Quản Lý CTV (Affiliates)">
                  <AdminAffiliatesList />
                </MainLayout>
              </ProtectedRoute>
            </Suspense>
          } />
          <Route path="/admin/staff" element={
            <Suspense fallback={<LazyFallback />}>
              <ProtectedRoute requiredRole="admin">
                <MainLayout title="Nhân Sự & Phân Quyền">
                  <AdminStaffManagement />
                </MainLayout>
              </ProtectedRoute>
            </Suspense>
          } />
          <Route path="/admin/commissions" element={
            <Suspense fallback={<LazyFallback />}>
              <ProtectedRoute requiredRole="admin">
                <MainLayout title="Cấu Hình Hoa Hồng">
                  <AdminCommissionPlans />
                </MainLayout>
              </ProtectedRoute>
            </Suspense>
          } />
          <Route path="/admin/campaign-links" element={
            <Suspense fallback={<LazyFallback />}>
              <ProtectedRoute requiredRole="admin">
                <MainLayout title="Nguồn Link Landing Page">
                  <AdminCampaignManager />
                </MainLayout>
              </ProtectedRoute>
            </Suspense>
          } />
          <Route path="/admin/payouts" element={
            <Suspense fallback={<LazyFallback />}>
              <ProtectedRoute requiredRole="admin">
                <MainLayout title="Duyệt Rút Tiền">
                  <AdminPayouts />
                </MainLayout>
              </ProtectedRoute>
            </Suspense>
          } />
          <Route path="/admin/leads" element={
            <Suspense fallback={<LazyFallback />}>
              <ProtectedRoute requiredRole="admin">
                <MainLayout title="CRM Khách Hàng">
                  <AdminLeadsCRM />
                </MainLayout>
              </ProtectedRoute>
            </Suspense>
          } />
          <Route path="/admin/conversions" element={
            <Suspense fallback={<LazyFallback />}>
              <ProtectedRoute requiredRole="admin">
                <MainLayout title="Quản Lý Đơn Hàng & Hoa Hồng">
                  <AdminConversions />
                </MainLayout>
              </ProtectedRoute>
            </Suspense>
          } />
          <Route path="/admin/payment-settings" element={
            <Suspense fallback={<LazyFallback />}>
              <ProtectedRoute requiredRole="admin">
                <MainLayout title="Cấu Hình Thanh Toán">
                  <AdminPaymentSettings />
                </MainLayout>
              </ProtectedRoute>
            </Suspense>
          } />
          <Route path="/admin/email-settings" element={
            <Suspense fallback={<LazyFallback />}>
              <ProtectedRoute requiredRole="admin">
                <MainLayout title="Mẫu Email (Templates)">
                  <AdminEmailSettings />
                </MainLayout>
              </ProtectedRoute>
            </Suspense>
          } />
          <Route path="/admin/workshop-config" element={
            <Suspense fallback={<LazyFallback />}>
              <ProtectedRoute requiredRole="admin">
                <MainLayout title="Phễu Hội Thảo (Free)">
                  <AdminWorkshopSettings />
                </MainLayout>
              </ProtectedRoute>
            </Suspense>
          } />
          <Route path="/admin/webhook-settings" element={
            <Suspense fallback={<LazyFallback />}>
              <ProtectedRoute requiredRole="admin">
                <MainLayout title="Cấu Hình Webhook (n8n)">
                  <AdminWebhookSettings />
                </MainLayout>
              </ProtectedRoute>
            </Suspense>
          } />
          
          {/* Default Route */}
          <Route path="*" element={<Navigate to="/portal" replace />} />
        </Routes>
      </Router>
    </ToastProvider>
  );
};

export default App;

