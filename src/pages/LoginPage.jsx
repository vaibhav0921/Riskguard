import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginAction } from '../store/authSlice';
import { validateUser } from '../api';
import Spinner from '../components/Spinner';

export default function LoginPage({ onSuccess, onNeedPlans }) {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [account, setAccount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !account.trim()) {
      setError('Please enter both your email and MT5 account number.');
      return;
    }

    setLoading(true);
    try {
      const res = await validateUser(email.trim(), account.trim());
      const data = res.data;

      if (data.active) {
        // Valid user with active subscription
        dispatch(loginAction({ email: email.trim(), account: account.trim() }));
        localStorage.setItem('rg_session', 'active'); // ← ADDED: keep session on refresh
        onSuccess();

      } else if (data.message?.includes('different email')) {
        // MT5 account belongs to someone else — hard block
        setError(data.message);

      } else {
        // New account, expired, or not registered → go to plans
        dispatch(loginAction({ email: email.trim(), account: account.trim() }));
        localStorage.removeItem('rg_session'); // ← ADDED: no session until payment done
        onNeedPlans();
      }

    } catch (err) {
      if (err.code === 'ERR_NETWORK') {
        setError('Cannot reach server. Please try again.');
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrap" style={{
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      minHeight: '100vh', padding: '40px 16px',
    }}>

      {/* Logo */}
      <div className="anim-fade-up d0" style={{ textAlign: 'center', marginBottom: 40 }}>
        <div className="anim-float" style={{
          width: 64, height: 64, borderRadius: 18,
          background: 'var(--lime)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 16px',
          boxShadow: '0 8px 32px rgba(163,230,53,0.4)',
        }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
            stroke="#0d0f14" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        </div>
        <h1 style={{ fontSize: 30, fontWeight: 800, color: '#f1f5f9', marginBottom: 6 }}>
          RiskGuard
        </h1>
        <p style={{ fontSize: 14, color: '#94a3b8' }}>
          Intelligent MT5 Risk Management
        </p>
      </div>

      {/* Card */}
      <div className="glass-strong anim-fade-up d1" style={{
        width: '100%', maxWidth: 420,
        borderRadius: 28, padding: 32,
      }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#f1f5f9', marginBottom: 4 }}>
          Sign in to your account
        </h2>
        <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 28 }}>
          Enter your email and MT5 account number
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            <div>
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="input-field"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>

            <div>
              <label className="form-label">MT5 Account Number</label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g. 87654321"
                value={account}
                onChange={e => setAccount(e.target.value)}
              />
              <p style={{ fontSize: 11, color: '#64748b', marginTop: 6 }}>
                Find this in your MetaTrader 5 terminal — top left corner
              </p>
            </div>

            {error && (
              <div className="error-box">{error}</div>
            )}

            <button
              type="submit"
              className="btn btn-lime btn-lg btn-full"
              style={{ marginTop: 4 }}
              disabled={loading}
            >
              {loading ? <><Spinner /> Checking...</> : 'Continue →'}
            </button>

          </div>
        </form>
      </div>

      <p className="anim-fade-up d2" style={{
        fontSize: 11, color: '#475569', marginTop: 24, textAlign: 'center',
      }}>
        🔒 Protected by 256-bit encryption · SOC 2 Compliant
      </p>

    </div>
  );
}