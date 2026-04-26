import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { usePolling } from '../hooks/usePolling';
import StatCard from '../components/StatCard';
import Spinner from '../components/Spinner';
import { getDaysRemaining, formatExpiry } from '../context/AppContext';

// ─── Helpers ──────────────────────────────────────────────────────
const fmt = v =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR', maximumFractionDigits: 0,
  }).format(Math.abs(v || 0));

const fmtTime = iso =>
  iso ? new Date(iso).toLocaleTimeString('en-IN', {
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  }) : '—';

function getTimeUntilMidnight() {
  const now = new Date();
  const midnight = new Date();
  midnight.setHours(24, 0, 0, 0);
  const diff = midnight - now;
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  return `${h}h ${m}m`;
}

function humanizeReason(reason) {
  if (!reason) return 'A risk rule was triggered.';
  const r = reason.toLowerCase();
  if (r.includes('consecutive') || r.includes('losing trades'))
    return 'You hit the consecutive losing trades limit.';
  if (r.includes('daily loss'))
    return 'You reached your daily loss limit.';
  if (r.includes('max trades') || r.includes('trades reached'))
    return 'You completed the maximum trades for today.';
  if (r.includes('license') || r.includes('inactive') || r.includes('expired'))
    return 'Your subscription is inactive or expired.';
  return reason;
}

function ExpiryBanner({ subscription }) {
  const days = getDaysRemaining(subscription?.expiryDate);
  if (days === null || days > 14) return null;
  const isExpired = days === 0;
  const color = isExpired ? '#ff6b6b' : days <= 7 ? '#ffd93d' : '#74c0fc';
  const bg = isExpired ? 'rgba(255,107,107,0.1)' : days <= 7 ? 'rgba(255,217,61,0.1)' : 'rgba(116,192,252,0.1)';
  const border = isExpired ? 'rgba(255,107,107,0.3)' : days <= 7 ? 'rgba(255,217,61,0.3)' : 'rgba(116,192,252,0.3)';
  return (
    <div style={{
      background: bg, border: `1px solid ${border}`, borderRadius: 12,
      padding: '12px 16px', fontSize: 14, color, marginBottom: 16,
      display: 'flex', alignItems: 'center', gap: 10, fontWeight: 500,
    }}>
      <span style={{ fontSize: 18 }}>{isExpired ? '❌' : '⚠️'}</span>
      <span>
        {isExpired
          ? 'Subscription expired — please renew to continue.'
          : `Expires in ${days} day${days !== 1 ? 's' : ''} — ${formatExpiry(subscription?.expiryDate)}`}
      </span>
    </div>
  );
}

function RuleBar({ label, value, max, valueLabel, colorLogic }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const color = colorLogic(value, max);
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
        <span style={{ fontSize: 13, color: '#cbd5e0', fontWeight: 500 }}>{label}</span>
        <span style={{ fontSize: 13, fontWeight: 700, color }}>{valueLabel}</span>
      </div>
      <div style={{
        height: 8, borderRadius: 4,
        background: 'rgba(255,255,255,0.08)', overflow: 'hidden',
      }}>
        <div style={{
          height: '100%', borderRadius: 4,
          width: `${pct}%`,
          background: color,
          transition: 'width 0.6s ease',
        }} />
      </div>
    </div>
  );
}

function StatsGrid({ eaData, rules }) {
  const maxTrades = rules?.maxTrades || 5;
  const maxLoss = rules?.maxDailyLoss || 3.0;
  const maxStreak = rules?.maxLossStreak || 2;

  // FIX: Use startOfDayEquity sent by EA for accurate dollar P&L.
  // dailyLossPercent = (startOfDay - current) / startOfDay * 100
  // So absolute P&L = startOfDay - current  (not pct * current)
  const startEquity = eaData?.startOfDayEquity || eaData?.currentEquity || 0;
  const currentEquity = eaData?.currentEquity || 0;
  const rawPnlAmount = currentEquity - startEquity;          // negative = loss, positive = profit
  const isProfit = rawPnlAmount > 0;
  const isBreakEven = rawPnlAmount === 0;
  const pnlAmt = Math.abs(rawPnlAmount);               // always positive for display
  // Keep percent for the rule health bar (EA sends it directly)
  const rawLossPct = eaData?.dailyLossPercent ?? 0;
  const lossPct = Math.max(0, rawLossPct);              // clamp, 0 when in profit
  const profitPct = lossPct === 0 && isProfit
    ? ((rawPnlAmount / startEquity) * 100)
    : 0;

  const trades = eaData?.consecutiveLosses ?? 0;
  const todayTrades = eaData?.tradesToday ?? 0;

  return (
    <>
      <p style={{
        fontSize: 12, fontWeight: 700, letterSpacing: '1.5px',
        textTransform: 'uppercase', color: '#a0aec0', marginBottom: 12,
      }}>
        Today's Summary
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
        <StatCard icon="💰" label="Current Equity" value={fmt(eaData?.currentEquity)} sub="Live from MT5" valueColor="var(--lime)" delay="d1" />
        <StatCard icon="📊" label="Trades Today" value={`${todayTrades} / ${maxTrades}`} sub={`${Math.max(0, maxTrades - todayTrades)} remaining`} valueColor="var(--sky)" delay="d2" />
        <StatCard
          icon={isProfit ? '📈' : isBreakEven ? '➖' : '📉'}
          label="Today's P&L"
          value={isProfit ? `+${fmt(pnlAmt)}` : isBreakEven ? '₹0' : `-${fmt(pnlAmt)}`}
          sub={isProfit ? `+${profitPct.toFixed(2)}% — great session!` : isBreakEven ? 'No P&L yet today' : `${lossPct.toFixed(2)}% of equity at risk`}
          valueColor={isProfit ? 'var(--lime)' : isBreakEven ? '#94a3b8' : 'var(--rose)'}
          delay="d3"
        />
        <StatCard icon="🔁" label="Losing Streak" value={`${trades} / ${maxStreak}`} sub="Resets on next win" valueColor={trades >= maxStreak ? 'var(--rose)' : trades >= maxStreak - 1 ? 'var(--gold)' : '#e2e8f0'} delay="d4" />
      </div>

      <p style={{
        fontSize: 12, fontWeight: 700, letterSpacing: '1.5px',
        textTransform: 'uppercase', color: '#a0aec0', marginBottom: 12,
      }}>
        Rule Health
      </p>
      <div className="glass" style={{ borderRadius: 18, padding: 18, marginBottom: 20 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <RuleBar label="Daily Loss Limit" value={lossPct} max={maxLoss}
            valueLabel={isProfit ? `+${profitPct.toFixed(2)}% profit` : isBreakEven ? `0% / ${maxLoss}%` : `${lossPct.toFixed(2)}% / ${maxLoss}%`}
            colorLogic={(v) => isProfit ? 'var(--lime)' : v >= maxLoss * 0.85 ? '#f87171' : v >= maxLoss * 0.6 ? '#fbbf24' : 'var(--lime)'}
          />
          <RuleBar label="Trades Used" value={todayTrades} max={maxTrades}
            valueLabel={`${todayTrades} / ${maxTrades}`}
            colorLogic={(v, m) => v >= m ? '#f87171' : v >= m * 0.8 ? '#fbbf24' : 'var(--sky)'}
          />
          <RuleBar label="Loss Streak" value={trades} max={maxStreak}
            valueLabel={`${trades} / ${maxStreak}`}
            colorLogic={(v, m) => v >= m ? '#f87171' : v >= m - 1 ? '#fbbf24' : '#a78bfa'}
          />
        </div>
      </div>
    </>
  );
}

function AccountDetails({ user, subscription, eaData, lastSync }) {
  const days = getDaysRemaining(subscription?.expiryDate);
  const expiryColor = days === null ? '#e2e8f0' : days <= 7 ? 'var(--rose)' : days <= 14 ? 'var(--gold)' : 'var(--lime)';
  const rows = [
    { label: 'Email', value: user?.email || '—' },
    { label: 'MT5 Account', value: user?.account ? `#${user.account}` : '—' },
    { label: 'Plan', value: subscription?.planName || '—' },
    { label: 'Expires', value: subscription?.expiryDate ? `${formatExpiry(subscription.expiryDate)} (${days}d left)` : '—', color: expiryColor },
    { label: 'EA Status', value: eaData ? '🟢 Connected' : '🔴 Not connected', color: eaData ? 'var(--lime)' : 'var(--rose)' },
    { label: 'Last Sync', value: fmtTime(lastSync) },
  ];
  return (
    <div className="glass" style={{ borderRadius: 18, padding: 18, marginBottom: 16 }}>
      <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#a0aec0', marginBottom: 12 }}>
        Account Details
      </p>
      {rows.map(row => (
        <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <span style={{ fontSize: 13, color: '#94a3b8', fontWeight: 500 }}>{row.label}</span>
          <span style={{ fontSize: 13, color: row.color || '#e2e8f0', fontWeight: 600, textAlign: 'right', maxWidth: '60%', wordBreak: 'break-all' }}>{row.value}</span>
        </div>
      ))}
    </div>
  );
}

function WaitingForEA({ onGoGuide, lastSync, user, subscription }) {
  return (
    <div style={{ maxWidth: 560, margin: '0 auto', padding: '20px 16px 60px' }}>
      <ExpiryBanner subscription={subscription} />
      <div className="anim-fade-up d0" style={{ borderRadius: 20, padding: 28, textAlign: 'center', marginBottom: 20, background: 'rgba(56,189,248,0.06)', border: '1.5px solid rgba(56,189,248,0.2)' }}>
        <div style={{ fontSize: 52, marginBottom: 16 }}>📡</div>
        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, color: '#f1f5f9', marginBottom: 10 }}>Waiting for EA Connection</h3>
        <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.8, marginBottom: 16 }}>Your MetaTrader 5 EA hasn't connected yet.<br />Once running, your live account stats appear here.</p>
        <div style={{ fontSize: 13, color: '#64748b', marginBottom: 20 }}>
          Checking every 15 seconds{lastSync && <span> · Last checked: {fmtTime(lastSync)}</span>}
        </div>
        <div style={{ textAlign: 'left', marginBottom: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#64748b', marginBottom: 10 }}>Quick Checklist</div>
          {['EA file installed in MetaTrader 5', 'EA attached to a chart and running', 'Backend URL whitelisted in MT5 → Tools → Options', 'Your email matches what you used to register'].map((s, i) => (
            <div key={i} style={{ fontSize: 14, color: '#94a3b8', padding: '7px 0', display: 'flex', gap: 10, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ color: 'var(--lime)', flexShrink: 0, fontWeight: 700 }}>□</span>{s}
            </div>
          ))}
        </div>
        <button className="btn btn-lime btn-lg btn-full" onClick={onGoGuide}>📖 View EA Setup Guide →</button>
      </div>
      <AccountDetails user={user} subscription={subscription} eaData={null} lastSync={lastSync} />
    </div>
  );
}

function TradingBlocked({ reason, eaData, rules, user, subscription, lastSync }) {
  const timeLeft = useMemo(() => getTimeUntilMidnight(), []);
  return (
    <div style={{ maxWidth: 560, margin: '0 auto', padding: '20px 16px 60px' }}>
      <ExpiryBanner subscription={subscription} />
      <div className="anim-fade-up d0" style={{ borderRadius: 20, padding: 24, marginBottom: 20, background: 'linear-gradient(135deg,rgba(244,63,94,0.12),rgba(244,63,94,0.04))', border: '1.5px solid rgba(244,63,94,0.3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
          <div style={{ fontSize: 40, flexShrink: 0 }}>🛑</div>
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22, color: '#f1f5f9', marginBottom: 4 }}>Trading Blocked</h2>
            <div style={{ fontSize: 14, color: '#fc8181', fontWeight: 500 }}>{humanizeReason(reason)}</div>
          </div>
        </div>
        <div style={{ background: 'rgba(0,0,0,0.25)', borderRadius: 12, padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 4 }}>Trading resumes in</div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 30, color: 'var(--lime)' }}>{timeLeft}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 13, color: '#94a3b8' }}>Midnight reset</div>
            <div style={{ fontSize: 13, color: '#cbd5e0', fontWeight: 500, marginTop: 2 }}>All rules clear at 12:00 AM</div>
          </div>
        </div>
        <div style={{ background: 'rgba(163,230,53,0.07)', border: '1px solid rgba(163,230,53,0.2)', borderRadius: 12, padding: '14px 16px' }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--lime)', marginBottom: 10 }}>💚 Use this time wisely</div>
          {['🧘  Take a break — step away from the screen', '📓  Journal your trades — review what happened', '📚  Study your strategy and refine your edge', '🚶  Go for a walk — clear your mind', '😴  Rest well — a fresh mind trades better tomorrow'].map((tip, i) => (
            <div key={i} style={{ fontSize: 13, color: '#94a3b8', padding: '5px 0', lineHeight: 1.6 }}>{tip}</div>
          ))}
        </div>
      </div>
      <StatsGrid eaData={eaData} rules={rules} />
      <AccountDetails user={user} subscription={subscription} eaData={eaData} lastSync={lastSync} />
    </div>
  );
}

export default function DashboardPage({ onGoGuide, onSubscriptionExpired }) {
  usePolling(onSubscriptionExpired);
  const eaData = useSelector(s => s.status.eaData);
  const rules = useSelector(s => s.status.rules);
  const eaConnected = useSelector(s => s.status.eaConnected);
  const lastSync = useSelector(s => s.status.lastSync);
  const loading = useSelector(s => s.status.loading);
  const error = useSelector(s => s.status.error);
  const user = useSelector(s => s.auth.user);
  const subscription = useSelector(s => s.auth.subscription);

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 14 }}>
        <Spinner large />
        <p style={{ color: '#94a3b8', fontSize: 14 }}>Connecting to your account...</p>
      </div>
    );
  }

  if (!eaConnected || !eaData) {
    return (
      <>
        {error && <div style={{ maxWidth: 560, margin: '16px auto 0', padding: '0 16px' }}><div className="error-box">{error}</div></div>}
        <WaitingForEA onGoGuide={onGoGuide} lastSync={lastSync} user={user} subscription={subscription} />
      </>
    );
  }

  if (!eaData.tradingAllowed) {
    return <TradingBlocked reason={eaData.disabledReason} eaData={eaData} rules={rules} user={user} subscription={subscription} lastSync={lastSync} />;
  }

  return (
    <div style={{ maxWidth: 560, margin: '0 auto', padding: '24px 16px 60px' }}>
      {error && <div className="error-box" style={{ marginBottom: 16 }}>{error}</div>}
      <ExpiryBanner subscription={subscription} />
      <div className="anim-fade-up d0 status-active" style={{ borderRadius: 24, padding: 20, marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'rgba(163,230,53,0.7)', marginBottom: 6 }}>Trading Status</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div className="anim-pulse-ring" style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--lime)', flexShrink: 0 }} />
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 24, color: '#f1f5f9' }}>Active ✅</h2>
            </div>
          </div>
          <div style={{ width: 56, height: 56, borderRadius: 16, fontSize: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(163,230,53,0.12)' }}>🟢</div>
        </div>
        <div className="status-msg-active" style={{ borderRadius: 12, padding: '10px 14px', fontSize: 14, fontWeight: 500 }}>
          ✓ All risk rules are active. Your account is protected.
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>Last sync: {fmtTime(lastSync)}</span>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>#{user?.account}</span>
        </div>
      </div>
      <StatsGrid eaData={eaData} rules={rules} />
      <AccountDetails user={user} subscription={subscription} eaData={eaData} lastSync={lastSync} />
      <div style={{ borderRadius: 14, padding: 16, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', fontSize: 13, color: '#94a3b8', lineHeight: 2.2 }}>
        <div>🔗 EA syncs every 10 seconds — rules enforced instantly</div>
        <div>🌅 All counters reset automatically at midnight</div>
        <div>⚙️ Change your rules anytime from the My Rules tab</div>
      </div>
    </div>
  );
}
