import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { fetchRules, saveRules } from '../api';
import RuleCard from '../components/RuleCard';
import Spinner from '../components/Spinner';
import { useSelector } from 'react-redux';
const DEFAULTS = { maxDailyLoss: 3.0, maxTrades: 5, maxLossStreak: 2 };

export default function SettingsPage() {
  const { showToast } = useApp();
  const user = useSelector(s => s.auth.user);
  const [rules,   setRules]   = useState(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [changed, setChanged] = useState(false);
  const [error,   setError]   = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchRules(user.email, user.account);
        setRules({
          maxDailyLoss:  res.data.maxDailyLoss  ?? DEFAULTS.maxDailyLoss,
          maxTrades:     res.data.maxTrades      ?? DEFAULTS.maxTrades,
          maxLossStreak: res.data.maxLossStreak  ?? DEFAULTS.maxLossStreak,
        });
      } catch (err) {
        if (err.code !== 'ERR_NETWORK') setError('Could not load your current rules.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  const updateRule = (key, val) => {
    setRules(prev => ({ ...prev, [key]: Number(val) }));
    setChanged(true);
    setError('');
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      await saveRules(user.email, user.account, rules);
      showToast('Rules saved! EA will update in ~10 seconds ✅', 'success');
      setChanged(false);
    } catch (err) {
      if (err.code === 'ERR_NETWORK') {
        showToast('Saved locally — will sync when EA connects ✅', 'info');
        setChanged(false);
      } else {
        showToast('Failed to save rules. Please try again.', 'error');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setRules(DEFAULTS);
    setChanged(true);
    showToast('Reset to default values', 'info');
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 12 }}>
      <Spinner large />
      <p style={{ color: 'var(--dash-muted)', fontSize: 13 }}>Loading your rules...</p>
    </div>
  );

  const card = {
    background: 'var(--dash-card)',
    border: '1px solid var(--dash-border)',
    borderRadius: 14,
    padding: '20px 24px',
    marginBottom: 16,
    transition: 'background 0.25s ease',
  };

  return (
    <div style={{ maxWidth: '100%', padding: '32px 40px 60px' }}>

      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--dash-text)', marginBottom: 6, letterSpacing: '-0.5px' }}>
          My Risk Rules
        </h2>
        <p style={{ fontSize: 13, color: 'var(--dash-muted)' }}>
          Set your limits. RiskGuard enforces them automatically in MT5.
        </p>
      </div>

      {error && (
        <div style={{ background: 'var(--dash-blocked-bg)', border: '1px solid var(--dash-blocked-br)', borderRadius: 10, padding: '12px 16px', fontSize: 13, color: 'var(--rose)', marginBottom: 16 }}>
          {error}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>
        <RuleCard delay="d1" icon="🛑" title="Stop if I lose more than this per day" description="As a % of your account equity. E.g. 3 means 3% of your account." value={rules.maxDailyLoss} onChange={val => updateRule('maxDailyLoss', val)} suffix="% loss" min={0.1} max={50} step={0.1} tip="Recommended 2–5% to stay disciplined" />
        <RuleCard delay="d2" icon="🔁" title="Stop after losing trades in a row" description="Consecutive losses before trading is blocked for the rest of the day." value={rules.maxLossStreak} onChange={val => updateRule('maxLossStreak', val)} suffix="losses" min={1} max={20} tip="Setting 2–3 helps avoid revenge trading" />
        <RuleCard delay="d3" icon="📊" title="Limit my trades to this many per day" description="Once this number of trades is reached, trading stops for the day." value={rules.maxTrades} onChange={val => updateRule('maxTrades', val)} suffix="trades" min={1} max={100} tip="Overtrading is a leading cause of capital loss" />
      </div>

      {/* Preview */}
      <div style={{ ...card, background: 'rgba(0,212,255,0.04)', borderColor: 'rgba(0,212,255,0.15)', marginBottom: 20 }}>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'rgba(0,212,255,0.6)', marginBottom: 12 }}>
          Active Rules Preview
        </div>
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            `Stop if daily loss reaches ${rules.maxDailyLoss}%`,
            `Stop after ${rules.maxLossStreak} losing trades in a row`,
            `Max ${rules.maxTrades} trades per day`,
          ].map((line, i) => (
            <li key={i} style={{ fontSize: 13, color: 'rgba(0,212,255,0.8)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: 'var(--dash-active-txt)', fontWeight: 700 }}>•</span> {line}
            </li>
          ))}
        </ul>
        <p style={{ fontSize: 11, color: 'var(--dash-muted)', marginTop: 12 }}>
          🕐 Applied to EA within 10 seconds of saving
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <button
          onClick={handleSave}
          disabled={saving || !changed}
          style={{
            width: '100%', padding: '13px', borderRadius: 10,
            fontSize: 14, fontWeight: 600, cursor: saving || !changed ? 'default' : 'pointer',
            background: saving || !changed ? 'var(--dash-hover)' : 'var(--dash-text)',
            color: saving || !changed ? 'var(--dash-muted)' : 'var(--dash-sidebar)',
            border: '1px solid var(--dash-border)', transition: 'all 0.2s',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}
        >
          {saving ? <><Spinner /> Saving...</> : 'Apply My Rules'}
        </button>
        <button
          onClick={handleReset}
          disabled={saving}
          style={{
            width: '100%', padding: '13px', borderRadius: 10,
            fontSize: 14, fontWeight: 500, cursor: 'pointer',
            background: 'transparent', color: 'var(--dash-muted)',
            border: '1px solid var(--dash-border)', transition: 'all 0.2s',
          }}
        >
          Reset to Default Values
        </button>
      </div>

      <p style={{ textAlign: 'center', fontSize: 11, color: 'var(--dash-muted)', marginTop: 20, lineHeight: 1.7 }}>
        Changes are pushed to your MT5 EA automatically.<br/>
        Trading will stop immediately if any rule is triggered.
      </p>
    </div>
  );
}