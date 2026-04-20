import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
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
import AdminEmailSettings from './pages/admin/EmailSettings';
import AdminWorkshopSettings from './pages/admin/WorkshopSettings';
import AdminWebhookSettings from './pages/admin/WebhookSettings';

import ClickTracker from './pages/public/ClickTracker';
import Checkout from './pages/public/Checkout';

// Landing Pages (Funnels)
import Course1 from './pages/funnels/Course1';
import Course2 from './pages/funnels/Course2';
import Course3 from './pages/funnels/Course3';
import Course4 from './pages/funnels/Course4';
import Free3Day from './pages/funnels/Free3Day';

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
          {/* Public Routes */}
          <Route path="/khoa-hoc/3-ngay-mien-phi" element={<Free3Day />} />
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
              <MainLayout title="Thß╗æng K├¬ Thu Nhß║¡p">
                <AffiliateDashboard />
              </MainLayout>
            </ProtectedRoute>
          } />

          <Route path="/portal/campaigns/*" element={
            <ProtectedRoute>
              <MainLayout title="Chiß║┐n Dß╗ïch (Campaigns)">
                <AffiliateCampaigns />
              </MainLayout>
            </ProtectedRoute>
          } />

          <Route path="/portal/network/*" element={
            <ProtectedRoute>
              <MainLayout title="Mß║íng L╞░ß╗¢i B├ín H├áng">
                <AffiliateNetwork />
              </MainLayout>
            </ProtectedRoute>
          } />

          <Route path="/portal/settings" element={
            <ProtectedRoute>
              <MainLayout title="C├ái ─Éß║╖t C├í Nh├ón">
                <AffiliateSettings />
              </MainLayout>
            </ProtectedRoute>
          } />

          <Route path="/affiliate/store" element={
            <ProtectedRoute>
              <MainLayout title="N├óng Cß║Ñp Cß╗¡a H├áng">
                <UpgradeStore />
              </MainLayout>
            </ProtectedRoute>
          } />

          <Route path="/affiliate/ledger" element={
            <ProtectedRoute>
              <MainLayout title="Lß╗ïch Sß╗¡ D├▓ng Tiß╗ün Tr├án">
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
              <MainLayout title="Kh├ích H├áng Cß╗ºa T├┤i">
                <MyCustomers />
              </MainLayout>
            </ProtectedRoute>
          } />
          
          {/* Admin Portal Routes */}
          <Route path="/admin" element={
            <ProtectedRoute requiredRole="admin">
              <MainLayout title="Bß║úng ─Éiß╗üu Khiß╗ân Quß║ún Trß╗ï">
                <AdminDashboard />
              </MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/affiliates" element={
            <ProtectedRoute requiredRole="admin">
              <MainLayout title="Quß║ún L├╜ CTV (Affiliates)">
                <AdminAffiliatesList />
              </MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/staff" element={
            <ProtectedRoute requiredRole="admin">
              <MainLayout title="Nh├ón Sß╗▒ & Ph├ón Quyß╗ün">
                <AdminStaffManagement />
              </MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/commissions" element={
            <ProtectedRoute requiredRole="admin">
              <MainLayout title="Cß║Ñu H├¼nh Hoa Hß╗ông">
                <AdminCommissionPlans />
              </MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/campaign-links" element={
            <ProtectedRoute requiredRole="admin">
              <MainLayout title="Nguß╗ôn Link Landing Page">
                <AdminCampaignManager />
              </MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/payouts" element={
            <ProtectedRoute requiredRole="admin">
              <MainLayout title="Duyß╗çt R├║t Tiß╗ün">
                <AdminPayouts />
              </MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/leads" element={
            <ProtectedRoute requiredRole="admin">
              <MainLayout title="CRM Kh├ích H├áng">
                <AdminLeadsCRM />
              </MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/conversions" element={
            <ProtectedRoute requiredRole="admin">
              <MainLayout title="Quß║ún L├╜ ─É╞ín H├áng & Hoa Hß╗ông">
                <AdminConversions />
              </MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/payment-settings" element={
            <ProtectedRoute requiredRole="admin">
              <MainLayout title="Cß║Ñu H├¼nh Thanh To├ín">
                <AdminPaymentSettings />
              </MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/email-settings" element={
            <ProtectedRoute requiredRole="admin">
              <MainLayout title="Mß║½u Email (Templates)">
                <AdminEmailSettings />
              </MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/workshop-config" element={
            <ProtectedRoute requiredRole="admin">
              <MainLayout title="Phß╗àu Hß╗Öi Thß║úo (Free)">
                <AdminWorkshopSettings />
              </MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/webhook-settings" element={
            <ProtectedRoute requiredRole="admin">
              <MainLayout title="Cß║Ñu H├¼nh Webhook (n8n)">
                <AdminWebhookSettings />
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
