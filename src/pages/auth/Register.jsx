import React, { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import './Auth.css';

const Register = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const refCode = searchParams.get('ref') || '';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Xử lý logic check ref_code ở đây nếu có (tìm ID người giới thiệu)
    let referredBy = null;
    if (refCode) {
      const { data: refUser } = await supabase
        .from('profiles')
        .select('id')
        .eq('ref_code', refCode)
        .single();
      if (refUser) {
        referredBy = refUser.id;
      }
    }

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: 'affiliate'
        }
      }
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    if (authData.user) {
      if (referredBy) {
        // Update referred_by explicitly because trigger might not know it
        await supabase.from('profiles').update({ referred_by: referredBy }).eq('id', authData.user.id);
      }
      setSuccess(true);
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="auth-container">
        <div className="auth-card" style={{textAlign: 'center'}}>
          <div className="auth-logo">
            <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13 18.5V26C13 27.1046 12.1046 28 11 28H6C4.89543 28 4 27.1046 4 26V8C4 6.89543 4.89543 6 6 6H11C12.1046 6 13 6.89543 13 8V18.5Z" fill="#3B82F6"/>
              <path d="M19 13.5V6C19 4.89543 19.8954 4 21 4H26C27.1046 4 28 4.89543 28 6V24C28 25.1046 27.1046 26 26 26H21C19.8954 26 19 25.1046 19 24V13.5Z" fill="#EF4444"/>
              <path d="M10 18.5L22 13.5V18C19 19.5 14 20 10 18.5Z" fill="#1E3A8A" opacity="0.6"/>
            </svg>
            <div className="auth-logo-text">Click<span>Funnels</span></div>
          </div>
          
          <div className="auth-alert success mb-4">
            Đăng ký thành công! Vui lòng kiểm tra email để xác thực.
          </div>
          <Link to="/auth/login" className="auth-btn" style={{display: 'inline-block', boxSizing: 'border-box'}}>
            Về trang Đăng nhập
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-logo">
          <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13 18.5V26C13 27.1046 12.1046 28 11 28H6C4.89543 28 4 27.1046 4 26V8C4 6.89543 4.89543 6 6 6H11C12.1046 6 13 6.89543 13 8V18.5Z" fill="#3B82F6"/>
            <path d="M19 13.5V6C19 4.89543 19.8954 4 21 4H26C27.1046 4 28 4.89543 28 6V24C28 25.1046 27.1046 26 26 26H21C19.8954 26 19 25.1046 19 24V13.5Z" fill="#EF4444"/>
            <path d="M10 18.5L22 13.5V18C19 19.5 14 20 10 18.5Z" fill="#1E3A8A" opacity="0.6"/>
          </svg>
          <div className="auth-logo-text">Click<span>Funnels</span></div>
        </div>

        <div className="auth-header box-mb">
          <h2>Tạo Tài Khoản Đối Tác</h2>
          <p>Gia nhập mạng lưới Affiliate chuyên nghiệp</p>
        </div>
        
        {error && <div className="auth-alert error">{error}</div>}
        
        <form onSubmit={handleRegister}>
          <div className="auth-form-group">
            <label className="auth-label">Họ và Tên</label>
            <input 
              type="text" 
              className="auth-input" 
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Nguyễn Văn A"
            />
          </div>
          <div className="auth-form-group">
            <label className="auth-label">Địa chỉ Email</label>
            <input 
              type="email" 
              className="auth-input" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
            />
          </div>
          <div className="auth-form-group">
            <label className="auth-label">Mật khẩu</label>
            <input 
              type="password" 
              className="auth-input" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              minLength={6}
            />
          </div>
          
          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Đang khởi tạo...' : 'Đăng Ký Ngay'}
          </button>
        </form>
        
        <div className="auth-footer">
          <span>Đã có tài khoản?</span>
          <Link to="/auth/login" className="auth-link">Đăng nhập</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
