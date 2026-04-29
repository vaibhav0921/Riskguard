import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useApp, PLANS } from '../context/AppContext';
import { setSubscription } from '../store/authSlice';
import { registerUser } from '../api';
import Spinner from '../components/Spinner';

// ── RAZORPAY CONFIG ──────────────────────────────────────────────
// Replace with your actual Key ID. Key Secret NEVER goes in frontend.
const RAZORPAY_KEY_ID = 'rzp_live_SiQSexGhGz9XjH';
// ────────────────────────────────────────────────────────────────

const LockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0110 0v4" />
  </svg>
);

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (document.getElementById('razorpay-script')) { resolve(true); return; }
    const script = document.createElement('script');
    script.id = 'razorpay-script';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function PaymentPage({ onBack, onSuccess }) {
  const dispatch = useDispatch();
  const user = useSelector(s => s.auth.user);

  const { selectedPlan, showToast } = useApp();
  const plan = PLANS[selectedPlan];

  const [loading, setLoading] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [scriptError, setScriptError] = useState(false);

  useEffect(() => {
    loadRazorpayScript().then(ok => {
      if (ok) setScriptLoaded(true);
      else setScriptError(true);
    });
  }, []);

  const handlePay = async () => {
    if (!scriptLoaded) {
      showToast('Payment gateway not loaded. Check your connection.', 'error');
      return;
    }
    setLoading(true);

    try {
      const expiry = new Date();
      expiry.setMonth(expiry.getMonth() + plan.months);
      const expiryISO = expiry.toISOString();

      const options = {
        key: RAZORPAY_KEY_ID,
        amount: plan.price * 100,     // paise
        currency: 'INR',
        name: 'RiskGuard',
        description: `${plan.name} Plan — ${plan.duration}`,
        prefill: {
          email: user?.email || '',
          name: user?.email || '',
        },
        notes: {
          accountNumber: user?.account,
          planId: selectedPlan,
        },
        theme: { color: '#a3e635' },

        handler: async function (razorpayResponse) {
          // Payment confirmed by Razorpay — now register in backend.
          // CRITICAL: do NOT call onSuccess() until backend confirms.
          // If we skip this, user lands on dashboard with no DB record
          // and sees "Waiting for EA connection" with a 404 from /api/status.
          try {
            await registerUser(
              user.email,
              user.account,
              plan.name.toUpperCase(),
              expiryISO
            );
          } catch (err) {
            // Backend registration failed — payment was taken but account
            // not created. Show error and stay on PaymentPage so user can
            // contact support with their Razorpay payment ID.
            setLoading(false);
            showToast(
              `Payment received (ID: ${razorpayResponse.razorpay_payment_id}) but account activation failed. Please contact support.`,
              'error'
            );
            console.error('registerUser failed after payment:', err);
            return; // DO NOT proceed to dashboard
          }

          // Backend confirmed — now safe to activate locally
          dispatch(setSubscription({
            planId: selectedPlan,
            planName: plan.name,
            expiryDate: expiryISO,
            activatedAt: new Date().toISOString(),
          }));

          // Mark session active so dashboard refresh keeps user logged in
          localStorage.setItem('rg_session', 'active');
          showToast('Payment successful! Welcome to RiskGuard 🎉', 'success');
          setLoading(false);
          onSuccess();
        },

        modal: {
          ondismiss: function () {
            setLoading(false);
            showToast('Payment cancelled.', 'info');
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        setLoading(false);
        showToast(`Payment failed: ${response.error?.description || 'Unknown error'}`, 'error');
      });
      rzp.open();

    } catch (err) {
      setLoading(false);
      showToast('Could not start payment. Please try again.', 'error');
      console.error(err);
    }
  };

  if (!plan) return null;

  return (
    <div className="page-wrap" style={{ padding: '40px 16px 60px' }}>
      <div className="max-w-md">

        <button
          onClick={onBack}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--muted)', fontSize: 13, fontFamily: 'var(--font-body)',
            display: 'flex', alignItems: 'center', gap: 6,
            marginBottom: 28, padding: 0, transition: 'color 0.2s',
          }}
          onMouseOver={e => e.currentTarget.style.color = 'var(--lime)'}
          onMouseOut={e => e.currentTarget.style.color = 'var(--muted)'}
        >
          ← Back to plans
        </button>

        {/* Order Summary */}
        <div className="glass anim-fade-up d0" style={{ borderRadius: 18, padding: 20, marginBottom: 24 }}>
          <div style={{
            fontSize: 11, fontWeight: 600, letterSpacing: '1.5px',
            textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 12,
          }}>
            Order Summary
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12, fontSize: 20,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(163,230,53,0.1)',
              }}>
                {plan.icon}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text)' }}>
                  {plan.name} Plan
                </div>
                <div style={{ fontSize: 12, color: 'var(--muted)' }}>{plan.duration}</div>
              </div>
            </div>
            <div style={{
              fontFamily: 'var(--font-display)', fontWeight: 800,
              fontSize: 22, color: 'var(--text)',
            }}>
              {plan.currency}{plan.price}
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="glass anim-fade-up d1" style={{ borderRadius: 18, padding: 20, marginBottom: 24 }}>
          <div style={{
            fontSize: 11, fontWeight: 600, letterSpacing: '1.5px',
            textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 12,
          }}>
            What's included
          </div>
          {plan.features.map((f, i) => (
            <div key={i} style={{
              fontSize: 13, color: 'var(--muted2)',
              padding: '5px 0', display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <span style={{ color: 'var(--lime)', fontSize: 12 }}>✓</span>
              {f}
            </div>
          ))}
        </div>

        {/* Razorpay badge */}
        <div className="glass anim-fade-up d1" style={{
          borderRadius: 18, padding: 16, marginBottom: 24,
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{ fontSize: 24 }}>💳</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 2 }}>
              Razorpay Secure Checkout
            </div>
            <div style={{ fontSize: 12, color: 'var(--muted)' }}>
              UPI · Cards · Net Banking · Wallets
            </div>
          </div>
        </div>

        {scriptError && (
          <div className="error-box anim-fade-up" style={{ marginBottom: 16 }}>
            Payment gateway failed to load. Check your connection and reload.
          </div>
        )}

        <div className="anim-fade-up d2">
          <button
            className="btn btn-lime btn-lg btn-full"
            onClick={handlePay}
            disabled={loading || scriptError}
          >
            {loading
              ? <><Spinner /> Opening payment...</>
              : <><LockIcon /> Pay {plan.currency}{plan.price} with Razorpay</>
            }
          </button>
          <p style={{
            textAlign: 'center', fontSize: 11,
            color: 'var(--muted2)', marginTop: 12,
          }}>
            🔒 Secured by Razorpay · 256-bit SSL · PCI DSS Compliant
          </p>
        </div>

      </div>
    </div>
  );
}