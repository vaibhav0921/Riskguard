// src/pages/PlansPage.jsx
import React, { useState, useEffect } from 'react';
import { PLANS } from '../context/AppContext';
import { useApp } from '../context/AppContext';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { loginAction } from '../store/authSlice';
import { checkTrialEligibility, activateTrial } from '../api';
import Spinner from '../components/Spinner';

const CheckIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

function PlanCard({ plan, selected, onSelect }) {
  const isAdvanced = plan.id === 'advanced';
  const selectedStyle = selected ? 'plan-card plan-selected' : (plan.featured ? 'plan-card plan-featured' : 'plan-card');

  return (
    <div className={selectedStyle} onClick={() => onSelect(plan.id)} style={{ position: 'relative' }}>
      {plan.featured && (
        <div style={{ position: 'absolute', top: 16, right: 16 }}>
          <span className="badge badge-lime">Most Popular</span>
        </div>
      )}
      {isAdvanced && (
        <div style={{ position: 'absolute', top: 16, right: 16 }}>
          <span className="badge badge-gold">Best Deal</span>
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14, fontSize: 22,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            background: selected
              ? `${plan.color.replace('var(--', 'rgba(').replace(')', ',0.15)')}`
              : 'rgba(255,255,255,0.06)',
          }}>
            {plan.icon}
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, color: 'var(--text)', marginBottom: 2 }}>
              {plan.name}
            </div>
            <div style={{ fontSize: 12, color: 'var(--muted)' }}>{plan.duration}</div>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 26, color: selected ? plan.color : 'var(--text)' }}>
            {plan.currency}{plan.price}
          </div>
          <div style={{ fontSize: 11, color: 'var(--muted)' }}>one-time</div>
        </div>
      </div>

      <div style={{ height: 1, background: selected ? `${plan.color}22` : 'var(--border)', marginBottom: 14 }} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '6px 12px' }}>
        {plan.features.map((f, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--muted)' }}>
            <span style={{ color: selected ? plan.color : 'var(--lime)', flexShrink: 0 }}><CheckIcon /></span>
            {f}
          </div>
        ))}
      </div>

      {selected && (
        <div style={{ position: 'absolute', bottom: 16, right: 16, width: 24, height: 24, borderRadius: '50%', background: plan.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0d0f14' }}>
          <CheckIcon />
        </div>
      )}
    </div>
  );
}

function TrialCard({ onActivate, loading, ineligible }) {
  return (
    <div style={{
      borderRadius: 18, padding: '24px 24px 20px',
      background: ineligible
        ? 'rgba(255,255,255,0.02)'
        : 'linear-gradient(135deg, rgba(163,230,53,0.08), rgba(163,230,53,0.03))',
      border: ineligible
        ? '1px solid rgba(255,255,255,0.08)'
        : '1.5px solid rgba(163,230,53,0.3)',
      position: 'relative', opacity: ineligible ? 0.5 : 1,
    }}>
      {!ineligible && (
        <div style={{
          position: 'absolute', top: -12, left: 20,
          background: 'var(--lime)', color: '#0d0f14',
          fontSize: 11, fontWeight: 700, padding: '3px 14px',
          borderRadius: 20, letterSpacing: '0.5px',
        }}>FREE TRIAL</div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, fontSize: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(163,230,53,0.12)', flexShrink: 0 }}>
            🎁
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, color: 'var(--text)', marginBottom: 2 }}>
              Free Trial
            </div>
            <div style={{ fontSize: 12, color: 'var(--muted)' }}>7 days · one per MT5 account</div>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 26, color: ineligible ? 'var(--muted)' : 'var(--lime)' }}>
            ₹0
          </div>
          <div style={{ fontSize: 11, color: 'var(--muted)' }}>no card needed</div>
        </div>
      </div>

      <div style={{ height: 1, background: ineligible ? 'var(--border)' : 'rgba(163,230,53,0.15)', marginBottom: 14 }} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '6px 12px', marginBottom: 18 }}>
        {['All 3 risk rules', 'Dashboard access', 'EA monitoring', 'Real-time sync', 'Daily auto-reset', '7-day access'].map((f, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--muted)' }}>
            <span style={{ color: ineligible ? 'var(--muted)' : 'var(--lime)', flexShrink: 0 }}><CheckIcon /></span>
            {f}
          </div>
        ))}
      </div>

      {ineligible ? (
        <div style={{ textAlign: 'center', fontSize: 13, color: 'var(--muted)', padding: '10px 0' }}>
          ✗ Free trial already used for this MT5 account
        </div>
      ) : (
        <button
          onClick={onActivate}
          disabled={loading}
          style={{
            width: '100%', padding: '13px', borderRadius: 10,
            fontSize: 14, fontWeight: 700, cursor: loading ? 'default' : 'pointer',
            background: 'var(--lime)', color: '#0d0f14', border: 'none',
            opacity: loading ? 0.7 : 1,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}
        >
          {loading ? <><Spinner /> Activating...</> : '🎁 Start Free Trial →'}
        </button>
      )}
    </div>
  );
}

export default function PlansPage({ onContinue, onTrialSuccess }) {
  const { setSelectedPlan } = useApp();
  const user = useSelector(s => s.auth.user);
  const dispatch = useDispatch();

  const [selected, setSelected] = useState(null);
  const [trialEligible, setTrialEligible] = useState(null);
  const [trialLoading, setTrialLoading] = useState(false);
  const [trialError, setTrialError] = useState('');

  useEffect(() => {
    localStorage.removeItem('rg_session');

    // ✅ Wait until account is actually in Redux before checking eligibility.
    // If account is missing, don't default to ineligible — just wait for the
    // next render when Redux has flushed the value from LoginPage's dispatch.
    if (!user?.account || user.account.trim() === '') return;

    checkTrialEligibility(user.email, user.account)
      .then(res => {
        console.log('Trial check response:', res.data, 'for account:', user.account);
        setTrialEligible(res.data.eligible);
      })
      .catch(err => {
        console.log('Trial check error:', err.response?.status, err.response?.data);
        setTrialEligible(false);
      });

  }, [user?.account]); // ✅ only re-run when account changes, not whole user object

  const handleSelect = (planId) => {
    setSelected(planId);
    setSelectedPlan(planId);
  };

  const handleTrialActivate = async () => {
    setTrialError('');
    setTrialLoading(true);
    try {
      await activateTrial(user.email, user.account);
      dispatch(loginAction({ email: user.email, account: user.account }));
      localStorage.setItem('rg_session', 'active');
      if (onTrialSuccess) onTrialSuccess();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to activate trial. Please try again.';
      setTrialError(msg);
    } finally {
      setTrialLoading(false);
    }
  };

  return (
    <div className="page-wrap" style={{ padding: 'clamp(24px, 5vw, 40px) clamp(12px, 4vw, 16px) 60px' }}>
      <div className="max-w-2xl">

        {/* Header */}
        <div className="anim-fade-up d0" style={{ textAlign: 'center', marginBottom: 36 }}>
          <span className="badge badge-lime" style={{ marginBottom: 12 }}>Choose Your Plan</span>
          <h2 style={{ fontSize: 'clamp(22px, 5vw, 28px)', fontWeight: 800, color: 'var(--text)', marginBottom: 8, lineHeight: 1.2 }}>
            Start protecting your capital
          </h2>
          <p style={{ fontSize: 14, color: 'var(--muted)' }}>
            All plans include automatic risk enforcement, live sync &amp; daily resets
          </p>
        </div>

        {/* Trial card — show spinner while eligibility is loading */}
        <div className="anim-fade-up d1" style={{ marginBottom: 20 }}>
          {trialEligible === null ? (
            // ✅ Show a neutral loading state instead of wrongly showing "ineligible"
            <div style={{ display: 'flex', justifyContent: 'center', padding: '32px 0' }}>
              <Spinner />
            </div>
          ) : (
            <TrialCard
              onActivate={handleTrialActivate}
              loading={trialLoading}
              ineligible={!trialEligible}
            />
          )}
          {trialError && (
            <div className="error-box" style={{ marginTop: 10 }}>{trialError}</div>
          )}
        </div>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          <span style={{ fontSize: 12, color: 'var(--muted2)', whiteSpace: 'nowrap' }}>or choose a paid plan</span>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
        </div>

        {/* Paid plan cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 28 }}>
          {Object.values(PLANS).map((plan, i) => (
            <div key={plan.id} className={`anim-fade-up d${i + 2}`}>
              <PlanCard
                plan={plan}
                selected={selected === plan.id}
                onSelect={handleSelect}
              />
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="anim-fade-up d5">
          <button
            className="btn btn-lime btn-lg btn-full"
            disabled={!selected}
            onClick={onContinue}
          >
            {selected
              ? `Continue with ${PLANS[selected].name} (${PLANS[selected].currency}${PLANS[selected].price}) →`
              : 'Select a plan to continue'}
          </button>
          <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--muted2)', marginTop: 12 }}>
            🔒 Secure payment · Instant activation
          </p>
        </div>

      </div>
    </div>
  );
}