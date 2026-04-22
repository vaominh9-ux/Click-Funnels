import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

/**
 * Click Tracker — Route: /go/:refCode
 * 
 * Luồng hoạt động:
 * 1. Affiliate chia sẻ link: yoursite.com/go/abc123?campaign=CMP_ID
 * 2. User click link → vào trang này
 * 3. Gọi RPC `record_affiliate_click` → ghi nhận click atomic
 * 4. Redirect user tới landing page gốc
 */
export default function ClickTracker() {
  const { refCode } = useParams();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('processing');
  const [message, setMessage] = useState('Đang chuyển hướng...');

  useEffect(() => {
    handleClick();
  }, []);

  const handleClick = async () => {
    try {
      if (!refCode) {
        setStatus('error');
        setMessage('Link không hợp lệ.');
        return;
      }

      const campaignId = searchParams.get('campaign') || null;
      const utmSource = searchParams.get('utm_source') || '';

      // Gọi RPC function — atomic, bypass RLS, ghi nhận click + trả về landing URL
      const { data, error } = await supabase.rpc('record_affiliate_click', {
        p_ref_code: refCode,
        p_campaign_id: campaignId,
        p_sub_id1: utmSource
      });

      if (error) {
        console.error('RPC error:', error);
        setStatus('error');
        setMessage('Đã xảy ra lỗi khi xử lý link.');
        return;
      }

      if (!data || !data.success) {
        setStatus('error');
        setMessage('Mã giới thiệu không tồn tại.');
        return;
      }

      // Lưu ref vào localStorage cho conversion attribution
      localStorage.setItem('aff_ref', refCode);
      localStorage.setItem('aff_id', data.affiliate_id);
      if (data.link_id) localStorage.setItem('aff_link_id', data.link_id);
      if (campaignId) localStorage.setItem('aff_campaign_id', campaignId);
      localStorage.setItem('aff_click_at', new Date().toISOString());

      // Redirect tới landing page
      const landingUrl = data.landing_url;

      if (landingUrl) {
        setStatus('redirecting');
        setMessage('Đang chuyển đến trang đích...');

        const url = new URL(landingUrl);

        // Tự động override nếu DB lỡ lưu URL gốc là localhost
        if (url.hostname === 'localhost') {
          url.hostname = 'ai.duhava.com';
          url.port = '';
          url.protocol = 'https:';
        }

        url.searchParams.set('ref', refCode);
        if (campaignId) url.searchParams.set('camp', campaignId);
        if (data.link_id) url.searchParams.set('link', data.link_id);

        // Giữ lại UTM params
        const utmSource = searchParams.get('utm_source');
        if (utmSource) url.searchParams.set('utm_source', utmSource);

        setTimeout(() => {
          window.location.href = url.toString();
        }, 500);
      } else {
        // Không có landing page → thông báo thành công
        setStatus('success');
        setMessage('Click đã được ghi nhận thành công!');
      }

    } catch (err) {
      console.error('Click tracking error:', err);
      setStatus('error');
      setMessage('Đã xảy ra lỗi. Vui lòng thử lại.');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
      fontFamily: "'Inter', sans-serif"
    }}>
      <div style={{
        background: 'rgba(255,255,255,0.05)',
        borderRadius: '16px',
        padding: '48px',
        textAlign: 'center',
        maxWidth: '400px',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.1)'
      }}>
        {status === 'processing' || status === 'redirecting' ? (
          <>
            <div style={{
              width: '48px', height: '48px', border: '3px solid rgba(99,102,241,0.3)',
              borderTopColor: '#6366F1', borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 24px'
            }} />
            <p style={{ color: '#CBD5E1', fontSize: '16px', margin: 0 }}>{message}</p>
          </>
        ) : status === 'success' ? (
          <>
            <div style={{
              width: '48px', height: '48px', borderRadius: '50%',
              background: 'rgba(52,211,153,0.2)', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 24px'
            }}>
              <svg width="24" height="24" fill="none" stroke="#34D399" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p style={{ color: '#34D399', fontSize: '16px', fontWeight: 600, margin: '0 0 8px' }}>{message}</p>
            <p style={{ color: '#9CA3AF', fontSize: '13px', margin: 0 }}>Lượt click đã được ghi nhận vào hệ thống.</p>
          </>
        ) : (
          <>
            <div style={{
              width: '48px', height: '48px', borderRadius: '50%',
              background: 'rgba(239,68,68,0.2)', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 24px'
            }}>
              <svg width="24" height="24" fill="none" stroke="#EF4444" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <p style={{ color: '#F87171', fontSize: '16px', margin: '0 0 16px' }}>{message}</p>
            <a href="/" style={{ color: '#6366F1', textDecoration: 'none', fontSize: '14px' }}>
              ← Quay về trang chủ
            </a>
          </>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
