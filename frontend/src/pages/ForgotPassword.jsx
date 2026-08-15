import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/auth.css';
import API_BASE from '../config';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      setMessage(data.message);
    } catch (error) {
      setMessage('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Forgot Password</h2>
        <p style={{ color: '#888', marginBottom: '1rem', fontSize: '0.9rem' }}>
          Enter your registered email and we'll send you a reset link.
        </p>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" className="btn" disabled={loading}>
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>
        {message && (
          <p style={{ marginTop: '1rem', color: '#4caf50', fontWeight: '500' }}>
            {message}
          </p>
        )}
        <p><Link to="/login">← Back to Login</Link></p>
      </form>
    </div>
  );
};

export default ForgotPassword;
