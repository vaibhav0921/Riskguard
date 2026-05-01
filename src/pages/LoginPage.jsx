import React, { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { loginAction } from '../store/authSlice';
import { validateUser, sendOtp, verifyOtp } from '../api';
import Spinner from '../components/Spinner';

// ── Logo moved OUTSIDE LoginPage so it never remounts on re-render ──
function Logo() {
  return (
    <div className="anim-fade-up d0" style={{ textAlign: 'center', marginBottom: 40 }}>
      <div className="anim-float" style={{
        width: 64, height: 64, borderRadius: 18, background: 'var(--lime)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 16px', boxShadow: '0 8px 32px rgba(163,230,53,0.4)',
      }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
          stroke="#0d0f14" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      </div>
      <h1 style={{ fontSize: 30, fontWeight: 800, color: '#f1f5f9', marginBottom: 6 }}>RiskGuard</h1>
      <p style={{ fontSize: 14, color: '#94a3b8' }}>Intelligent MT5 Risk Management</p>
    </div>
  );
}

export default function LoginPage({ onSuccess, onNeedPlans }) {
  const dispatch = useDispatch();

  const [step, setStep] = useState('form');
  const [email, setEmail] = useState('');
  const [account, setAccount] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(0);

  const inputRefs = useRef([]);

  useEffect(() => {
    if (step === 'otp') {
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    }
  }, [step]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !account.trim()) {
      setError('Please enter both your email and MT5 account number.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!/^\d{6,10}$/.test(account.trim())) {
      setError('MT5 account number must be 6 to 10 digits.');
      return;
    }

    setLoading(true);
    try {
      await sendOtp(email.trim().toLowerCase());
      setStep('otp');
      startResendTimer();
    } catch (err) {
      if (err.code === 'ERR_NETWORK') {
        setError('Cannot reach server. Please try again.');
      } else {
        setError('Failed to send OTP. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setError('');
    const otpString = otp.join('');
    if (otpString.length < 6) {
      setError('Please enter the full 6-digit OTP.');
      return;
    }

    setLoading(true);
    try {
      const otpRes = await verifyOtp(email.trim().toLowerCase(), otpString);
      if (!otpRes.data.verified) {
        setError('Invalid or expired OTP. Please try again.');
        setLoading(false);
        return;
      }

      const res = await validateUser(email.trim(), account.trim());
      const data = res.data;

      if (data.active) {
        dispatch(loginAction({ email: email.trim(), account: account.trim() }));
        localStorage.setItem('rg_session', 'active');
        onSuccess();
      } else if (data.message?.includes('different email')) {
        setError(data.message);
      } else {
        dispatch(loginAction({ email: email.trim(), account: account.trim() }));
        localStorage.removeItem('rg_session');
        onNeedPlans();
      }
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Invalid or expired OTP. Please try again.');
      } else if (err.code === 'ERR_NETWORK') {
        setError('Cannot reach server. Please try again.');
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError('');
    setResending(true);
    try {
      await sendOtp(email.trim().toLowerCase());
      setOtp(['', '', '', '', '', '']);
      startResendTimer();
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    } catch {
      setError('Failed to resend OTP. Please try again.');
    } finally {
      setResending(false);
    }
  };

  const startResendTimer = () => {
    setResendTimer(30);
    const interval = setInterval(() => {
      setResendTimer(t => {
        if (t <= 1) { clearInterval(interval); return 0; }
        return t - 1;
      });
    }, 1000);
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const next = [...otp];
    next[index] = value.slice(-1);
    setOtp(next);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0)
      inputRefs.current[index - 1]?.focus();
    if (e.key === 'Enter') handleVerifyOtp();
  };

  const handleOtpPaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(''));
      inputRefs.current[5]?.focus();
    }
  };

  return (
    <div className="page-wrap" style={{
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      minHeight: '100vh', padding: '40px 16px',
    }}>
      <Logo />

      {/* ── STEP 1: Email + Account ── */}
      {step === 'form' && (
        <div className="glass-strong anim-fade-up d1" style={{ width: '100%', maxWidth: 420, borderRadius: 28, padding: 32 }}>
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
                  onChange={e => setAccount(e.target.value.replace(/\D/g, ''))}
                />
                <p style={{ fontSize: 11, color: '#64748b', marginTop: 6 }}>
                  Find this in your MetaTrader 5 terminal — top left corner
                </p>
              </div>
              {error && <div className="error-box">{error}</div>}
              <button
                type="submit"
                className="btn btn-lime btn-lg btn-full"
                style={{ marginTop: 4 }}
                disabled={loading}
              >
                {loading ? <><Spinner /> Sending OTP...</> : 'Send OTP →'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── STEP 2: OTP Verification ── */}
      {step === 'otp' && (
        <div className="glass-strong anim-fade-up d1" style={{ width: '100%', maxWidth: 420, borderRadius: 28, padding: 32 }}>
          <button
            onClick={() => { setStep('form'); setError(''); setOtp(['', '', '', '', '', '']); }}
            style={{ background: 'none', border: 'none', color: '#64748b', fontSize: 13, cursor: 'pointer', marginBottom: 24, padding: 0, display: 'flex', alignItems: 'center', gap: 6 }}
          >
            ← Back
          </button>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{ fontSize: 44, marginBottom: 14 }}>📧</div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#f1f5f9', marginBottom: 10 }}>
              Check your email
            </h2>
            <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.7 }}>
              We sent a 6-digit code to<br />
              <span style={{ color: '#f1f5f9', fontWeight: 600 }}>{email}</span>
            </p>
          </div>
          <div
            style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 24 }}
            onPaste={handleOtpPaste}
          >
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={el => inputRefs.current[i] = el}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={e => handleOtpChange(i, e.target.value)}
                onKeyDown={e => handleOtpKeyDown(i, e)}
                style={{
                  width: 46, height: 54, textAlign: 'center',
                  fontSize: 22, fontWeight: 700,
                  background: 'rgba(255,255,255,0.06)',
                  border: `1.5px solid ${digit ? 'var(--lime)' : 'rgba(255,255,255,0.12)'}`,
                  borderRadius: 12, color: '#f1f5f9',
                  outline: 'none', caretColor: 'var(--lime)',
                  transition: 'border-color 0.2s',
                  fontFamily: 'inherit',
                }}
              />
            ))}
          </div>
          {error && <div className="error-box" style={{ marginBottom: 16 }}>{error}</div>}
          <button
            className="btn btn-lime btn-lg btn-full"
            onClick={handleVerifyOtp}
            disabled={loading}
            style={{ marginBottom: 16 }}
          >
            {loading ? <><Spinner /> Verifying...</> : 'Verify & Continue →'}
          </button>
          <div style={{ textAlign: 'center', fontSize: 13, color: '#64748b' }}>
            Didn't receive it?{' '}
            {resendTimer > 0 ? (
              <span style={{ color: '#475569' }}>Resend in {resendTimer}s</span>
            ) : (
              <button
                onClick={handleResend}
                disabled={resending}
                style={{
                  background: 'none', border: 'none',
                  color: 'var(--lime)', cursor: 'pointer',
                  fontSize: 13, fontWeight: 600, padding: 0,
                }}
              >
                {resending ? 'Sending...' : 'Resend OTP'}
              </button>
            )}
          </div>
        </div>
      )}

      <p className="anim-fade-up d2" style={{ fontSize: 11, color: '#475569', marginTop: 24, textAlign: 'center' }}>
        🔒 Protected by 256-bit encryption · SOC 2 Compliant
      </p>
    </div>
  );
}