import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import Skeleton from './Skeleton'; // Used for loading page

const ProtectedRoute = ({ children, requiredRole }) => {
  const [session, setSession] = useState(undefined);
  const [role, setRole] = useState(null);
  const [approvalStatus, setApprovalStatus] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        // Fetch role and approval_status from profile table
        supabase
          .from('profiles')
          .select('role, approval_status')
          .eq('id', session.user.id)
          .single()
          .then(({ data }) => {
            if (data) {
              setRole(data.role);
              setApprovalStatus(data.approval_status || 'pending');
            } else {
              setRole('affiliate'); // fallback
              setApprovalStatus('pending');
            }
          });
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        supabase
          .from('profiles')
          .select('role, approval_status')
          .eq('id', session.user.id)
          .single()
          .then(({ data }) => {
            if (data) {
              setRole(data.role);
              setApprovalStatus(data.approval_status || 'pending');
            }
          });
      } else {
        setRole(null);
        setApprovalStatus(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (session === undefined || (session && role === null)) {
    // Still loading
    return (
      <div style={{ padding: '40px', display: 'flex', justifyContent: 'center' }}>
        <Skeleton width="100px" height="100px" />
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/auth/login" />;
  }

  // Handle Role-based routing
  if (requiredRole && requiredRole === 'admin') {
    if (role !== 'admin' && role !== 'staff') {
      return <Navigate to="/portal" />; // Affiliate trying to access admin
    }
  } else {
    // Affiliate Portal Routes: Check affiliate approval status
    if (role === 'affiliate' && approvalStatus !== 'active') {
      return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: '#F9FAFB' }}>
          <div style={{ background: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', textAlign: 'center', maxWidth: '440px', border: '1px solid #E5E7EB' }}>
            {approvalStatus === 'pending' ? (
              <>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
                <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: '#111827', marginBottom: '12px' }}>Đang chờ duyệt</h2>
                <p style={{ color: '#6B7280', lineHeight: '1.5', fontSize: '15px' }}>
                  Đơn đăng ký Đại lý của bạn đã được ghi nhận. Hệ thống đang tiến hành xét duyệt để đảm bảo chất lượng. Vui lòng kiểm tra hộp thư email thường xuyên.
                </p>
              </>
            ) : (
              <>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🚫</div>
                <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: '#EF4444', marginBottom: '12px' }}>Chưa đủ điều kiện</h2>
                <p style={{ color: '#6B7280', lineHeight: '1.5', fontSize: '15px' }}>
                  Rất tiếc, đơn đăng ký đối tác (Affiliate) của bạn đã bị từ chối. Vui lòng liên hệ bộ phận hỗ trợ hoặc đội ngũ quản lý nếu bạn có bất kỳ thắc mắc nào.
                </p>
              </>
            )}
            <button 
              style={{ marginTop: '24px', width: '100%', padding: '12px', background: '#F3F4F6', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, color: '#374151' }}
              onClick={() => supabase.auth.signOut()}
            >
              Đăng xuất
            </button>
          </div>
        </div>
      );
    }
  }

  return children;
};

export default ProtectedRoute;
