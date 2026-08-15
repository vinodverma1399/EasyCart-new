import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/auth.css';
import API_BASE from '../config';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // step 1: email, step 2: otp + new password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch(`${API_BASE}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (res.ok) {
        setStep(2);
        setMessage('OTP sent! Check your email inbox.');
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match!');
      return;
    }
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch(`${API_BASE}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, password: newPassword })
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        navigate('/login');
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form
        onSubmit={step === 1 ? handleSendOtp : handleResetPassword}
        className="auth-form"
      >
        <h2>Forgot Password</h2>

        {step === 1 && (
          <>
            <p style={{ color: '#888', marginBottom: '1rem', fontSize: '0.9rem' }}>
              Enter your registered email to receive a 6-digit OTP.
            </p>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="btn" disabled={loading}>
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <p style={{ color: '#4caf50', marginBottom: '1rem', fontSize: '0.9rem' }}>
              ✅ OTP sent to <strong>{email}</strong>
            </p>
            <input
              type="text"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              required
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              minLength={6}
              required
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              minLength={6}
              required
            />
            <button type="submit" className="btn" disabled={loading}>
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
            <p
              style={{ fontSize: '0.85rem', color: '#888', cursor: 'pointer' }}
              onClick={() => { setStep(1); setMessage(''); }}
            >
              ← Resend OTP
            </p>
          </>
        )}

        {message && (
          <p style={{
            marginTop: '0.75rem',
            color: message.includes('sent') ? '#4caf50' : '#e53935',
            fontWeight: '500',
            fontSize: '0.9rem'
          }}>
            {message}
          </p>
        )}

        <p><Link to="/login">← Back to Login</Link></p>
      </form>
    </div>
  );
};

export default ForgotPassword;
