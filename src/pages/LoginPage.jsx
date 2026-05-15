// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { loginAction, setSubscription } from '../store/authSlice';
import { validateUser } from '../api';
import api from '../api';

const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || '';

function LoginInner({ onSuccess, onNeedPlans }) {
  const dispatch = useDispatch();
  const [step, setStep] = useState('google'); // 'google' | 'account'
  const [googleUser, setGoogleUser] = useState(null);
  const [account, setAccount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleSuccess = async (credentialResponse) => {
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/api/auth/google', { idToken: credentialResponse.credential });
      const data = res.data;

      setGoogleUser(data);

      if (data.isActive && data.savedAccount) {
        dispatch(loginAction({ email: data.email, account: data.savedAccount }));
        localStorage.setItem('rg_session', 'active');
        onSuccess();
        return;
      }

      if (data.savedAccount) {
        dispatch(loginAction({ email: data.email, account: data.savedAccount }));
        setAccount(data.savedAccount);
        await doValidate(data.email, data.savedAccount, data);
        return;
      }

      // No saved account yet — don't dispatch an empty account, just show the form
      setStep('account');
    } catch (e) {
      setError('Google sign-in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const doValidate = async (email, acc, gUser) => {
    setLoading(true);
    try {
      const res = await validateUser(email.trim(), acc.trim());
      const data = res.data;

      // ✅ Dispatch with the correct account FIRST before any navigation
      dispatch(loginAction({ email: email.trim(), account: acc.trim() }));

      if (data.active) {
        dispatch(setSubscription({
          planId: data.plan?.toLowerCase() || 'basic',
          planName: data.plan,
          expiryDate: data.expiryDate,
          activatedAt: new Date().toISOString(),
        }));
        localStorage.setItem('rg_session', 'active');
        onSuccess();
      } else {
        localStorage.removeItem('rg_session');
        // ✅ setTimeout(0) lets Redux flush the account into the store
        // before PlansPage mounts and reads user.account
        setTimeout(() => onNeedPlans(), 0);
      }
    } catch (e) {
      setError('Could not verify account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAccountSubmit = async (e) => {
    e.preventDefault();
    if (!account.trim() || !/^\d{5,12}$/.test(account.trim())) {
      setError('MT5 account number must be 5–12 digits.');
      return;
    }
    setError('');
    await doValidate(googleUser.email, account.trim(), googleUser);
  };

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
    @keyframes rg-pulse  { 0%,100%{opacity:1} 50%{opacity:0.4} }
    @keyframes rg-float  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
    @keyframes rg-fadeUp { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
    @keyframes rg-spin   { to{transform:rotate(360deg)} }

    .rg-wrap {
      min-height: 100vh; overflow-y: auto;
      background:
        radial-gradient(ellipse 80% 70% at 50% -10%, rgba(0,180,255,0.14) 0%, transparent 55%),
        #040814;
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      padding: 60px 24px; position: relative;
      font-family: 'Plus Jakarta Sans', sans-serif;
    }
    .rg-grid {
      position: fixed; inset: 0; pointer-events: none;
      background-image:
        linear-gradient(rgba(0,180,255,0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0,180,255,0.03) 1px, transparent 1px);
      background-size: 60px 60px;
    }
    .rg-orb-1 {
      position: fixed; top: 15%; left: 8%;
      width: 280px; height: 280px; border-radius: 50%; pointer-events: none;
      background: radial-gradient(circle, rgba(0,180,255,0.07) 0%, transparent 70%);
    }
    .rg-orb-2 {
      position: fixed; bottom: 15%; right: 8%;
      width: 220px; height: 220px; border-radius: 50%; pointer-events: none;
      background: radial-gradient(circle, rgba(163,230,53,0.05) 0%, transparent 70%);
    }
    .rg-logo-icon {
      width: 60px; height: 60px; border-radius: 16px;
      background: linear-gradient(135deg, #00D4FF, #0077AA);
      display: flex; align-items: center; justify-content: center;
      margin: 0 auto 14px;
      box-shadow: 0 0 40px rgba(0,212,255,0.3);
      animation: rg-float 3s ease-in-out infinite;
    }
    .rg-card {
      width: 100%; max-width: 440px;
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 24px; padding: 36px 40px;
      box-shadow: 0 24px 80px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06);
      position: relative; animation: rg-fadeUp 0.5s ease 0.1s both;
    }
    .rg-accent-line {
      position: absolute; top: 0; left: 20%; right: 20%; height: 1px;
      background: linear-gradient(90deg, transparent, rgba(0,212,255,0.5), transparent);
    }
    .rg-pill {
      font-size: 11px; font-weight: 600; color: rgba(0,212,255,0.8);
      background: rgba(0,212,255,0.08); border: 1px solid rgba(0,212,255,0.15);
      border-radius: 20px; padding: 4px 12px;
    }
    .rg-divider { height: 1px; background: rgba(255,255,255,0.05); margin: 0 0 24px; }
    .rg-google-wrapper {
      width: 100%; border-radius: 12px; overflow: hidden;
      border: 1px solid rgba(255,255,255,0.12);
    }
    .rg-google-wrapper > div,
    .rg-google-wrapper iframe,
    .rg-google-wrapper > div > div { width: 100% !important; border-radius: 12px !important; }
    .rg-spinner-wrap {
      display: flex; flex-direction: column; align-items: center;
      padding: 20px 0; gap: 12px;
    }
    .rg-ring {
      width: 30px; height: 30px; border-radius: 50%;
      border: 2.5px solid rgba(0,212,255,0.15);
      border-top-color: #00D4FF; animation: rg-spin 0.8s linear infinite;
    }
    .rg-error {
      padding: 10px 14px; background: rgba(255,71,87,0.1);
      border: 1px solid rgba(255,71,87,0.2); border-radius: 10px;
      font-size: 13px; color: #FF6B7A;
    }
    .rg-user-strip {
      display: flex; align-items: center; gap: 12px;
      padding: 12px 16px; margin-bottom: 24px;
      background: rgba(0,212,255,0.05); border: 1px solid rgba(0,212,255,0.12);
      border-radius: 12px;
    }
    .rg-avatar {
      width: 36px; height: 36px; border-radius: 50%; flex-shrink: 0;
      background: linear-gradient(135deg, #00D4FF, #0077AA);
      display: flex; align-items: center; justify-content: center;
      font-size: 13px; font-weight: 700; color: #fff;
    }
    .rg-label {
      display: block; font-size: 11px; font-weight: 700;
      color: rgba(255,255,255,0.35); letter-spacing: 1px; margin-bottom: 8px;
    }
    .rg-input {
      width: 100%; background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 12px; padding: 13px 16px;
      font-size: 15px; color: #fff; outline: none;
      font-family: 'Plus Jakarta Sans', sans-serif;
      transition: border-color 0.2s; box-sizing: border-box;
    }
    .rg-input:focus        { border-color: rgba(0,212,255,0.4); }
    .rg-input::placeholder { color: rgba(255,255,255,0.2); }
    .rg-btn-primary {
      width: 100%; padding: 14px; border-radius: 12px;
      font-size: 15px; font-weight: 700; cursor: pointer;
      background: linear-gradient(135deg, #00D4FF, #0077AA);
      color: white; border: none;
      font-family: 'Plus Jakarta Sans', sans-serif;
      display: flex; align-items: center; justify-content: center; gap: 8px;
    }
    .rg-btn-primary:disabled { opacity: 0.8; cursor: default; }
    .rg-btn-ghost {
      width: 100%; margin-top: 10px; background: none; border: none;
      color: rgba(255,255,255,0.35); font-size: 13px; cursor: pointer;
      padding: 8px; font-family: 'Plus Jakarta Sans', sans-serif; transition: color 0.2s;
    }
    .rg-btn-ghost:hover { color: rgba(255,255,255,0.6); }
    .rg-security {
      font-size: 11px; color: rgba(255,255,255,0.2);
      margin-top: 24px; text-align: center;
      display: flex; align-items: center; justify-content: center; gap: 6px;
      animation: rg-fadeUp 0.5s ease 0.2s both;
    }
    @media (max-width: 480px) {
      .rg-card { padding: 28px 24px; }
      .rg-wrap { padding: 40px 16px; }
    }
  `;

  return (
    <div className="rg-wrap">
      <style>{styles}</style>

      <div className="rg-grid" />
      <div className="rg-orb-1" />
      <div className="rg-orb-2" />

      <div style={{ textAlign: 'center', marginBottom: 32, position: 'relative', zIndex: 1, animation: 'rg-fadeUp 0.5s ease 0.05s both' }}>
        <div className="rg-logo-icon">
          <svg width="26" height="26" viewBox="0 0 14 14" fill="none">
            <path d="M7 1L13 4V10L7 13L1 10V4L7 1Z" stroke="white" strokeWidth="1.5" fill="none" />
            <circle cx="7" cy="7" r="2.5" fill="white" />
          </svg>
        </div>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: '#fff', letterSpacing: '-0.5px', marginBottom: 4 }}>
          RiskGuard
        </h1>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>
          Intelligent MT5 Risk Management
        </p>
      </div>

      <div className="rg-card" style={{ position: 'relative', zIndex: 1 }}>
        <div className="rg-accent-line" />

        {/* ── STEP: GOOGLE ── */}
        {step === 'google' && (
          <>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 6 }}>
              Sign in to continue
            </h2>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 28, lineHeight: 1.6 }}>
              Use your Google account to access your RiskGuard dashboard
            </p>

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 28 }}>
              {['🛡️ Auto risk control', '⚡ 10s sync', '📊 Live dashboard'].map(f => (
                <span key={f} className="rg-pill">{f}</span>
              ))}
            </div>

            <div className="rg-divider" />

            {loading ? (
              <div className="rg-spinner-wrap">
                <div className="rg-ring" />
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>Signing you in…</span>
              </div>
            ) : (
              <div className="rg-google-wrapper">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => setError('Google sign-in failed. Please try again.')}
                  theme="filled_black"
                  size="large"
                  text="continue_with"
                  shape="rectangular"
                  width="360"
                />
              </div>
            )}

            {error && <div className="rg-error" style={{ marginTop: 16 }}>{error}</div>}
          </>
        )}

        {/* ── STEP: ACCOUNT ── */}
        {step === 'account' && (
          <>
            {googleUser && (
              <div className="rg-user-strip">
                <div className="rg-avatar">
                  {googleUser.name?.[0] || googleUser.email?.[0]}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{googleUser.name}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', wordBreak: 'break-all' }}>{googleUser.email}</div>
                </div>
                <div style={{ marginLeft: 'auto', width: 8, height: 8, borderRadius: '50%', background: '#00D4FF', animation: 'rg-pulse 2s infinite', flexShrink: 0 }} />
              </div>
            )}

            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 6 }}>
              Enter your MT5 account
            </h2>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 24, lineHeight: 1.6 }}>
              Link your MetaTrader 5 account number to activate risk management
            </p>

            <form onSubmit={handleAccountSubmit}>
              <div style={{ marginBottom: 16 }}>
                <label className="rg-label">MT5 ACCOUNT NUMBER</label>
                <input
                  type="text"
                  className="rg-input"
                  placeholder="e.g. 87654321"
                  value={account}
                  onChange={e => setAccount(e.target.value.replace(/\D/g, ''))}
                  maxLength={12}
                  autoFocus
                />
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', marginTop: 8 }}>
                  Find this in MetaTrader 5 — top left of the terminal
                </p>
              </div>

              {error && <div className="rg-error" style={{ marginBottom: 12 }}>{error}</div>}

              <button type="submit" className="rg-btn-primary" disabled={loading}>
                {loading ? (
                  <>
                    <div style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', animation: 'rg-spin 0.8s linear infinite' }} />
                    Verifying…
                  </>
                ) : 'Continue →'}
              </button>

              <button
                type="button"
                className="rg-btn-ghost"
                onClick={() => { setStep('google'); setGoogleUser(null); setError(''); }}
              >
                ← Use a different Google account
              </button>
            </form>
          </>
        )}
      </div>

      <p className="rg-security">
        <span style={{ color: 'rgba(0,212,255,0.5)' }}>🔒</span>
        Protected by Google OAuth · 256-bit SSL
      </p>
    </div>
  );
}

export default function LoginPage({ onSuccess, onNeedPlans }) {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <LoginInner onSuccess={onSuccess} onNeedPlans={onNeedPlans} />
    </GoogleOAuthProvider>
  );
}