import React, { useMemo, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { usePolling } from '../hooks/usePolling';
import Spinner from '../components/Spinner';
import { getDaysRemaining, formatExpiry } from '../context/AppContext';
import { useApp } from '../context/AppContext';
import SettingsPage from './SettingsPage';
import EAGuidePage from './EAGuidePage';
import ContactPage from './ContactPage';
import TermsPage from './TermsPage';

// ─── Helpers ──────────────────────────────────────────────────────
const fmt = v =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR', maximumFractionDigits: 0,
  }).format(Math.abs(v || 0));

const fmtTime = iso =>
  iso ? new Date(iso).toLocaleTimeString('en-IN', {
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  }) : '—';

const fmtSyncAgo = iso => {
  if (!iso) return '—';
  const diff = Math.floor((Date.now() - new Date(iso)) / 1000);
  if (diff < 60) return `${diff}s ago`;
  return `${Math.floor(diff / 60)}m ago`;
};

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
    return 'Max consecutive losses reached · All rules reset at midnight IST';
  if (r.includes('daily loss'))
    return 'Daily loss limit reached · All rules reset at midnight IST';
  if (r.includes('max trades') || r.includes('trades reached'))
    return 'Max trades reached · All rules reset at midnight IST';
  if (r.includes('license') || r.includes('inactive') || r.includes('expired'))
    return 'Subscription inactive or expired';
  return reason;
}

// ─── Mobile hook ──────────────────────────────────────────────────
function useMobile() {
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );
  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);
  return isMobile;
}

// ─── Mini progress bar ────────────────────────────────────────────
function MiniBar({ value, max, color }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div style={{ height: 4, borderRadius: 2, background: 'var(--dash-border)', overflow: 'hidden', marginTop: 10 }}>
      <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 2, transition: 'width 0.6s ease' }} />
    </div>
  );
}

// ─── Theme toggle ─────────────────────────────────────────────────
function ThemeToggle({ theme, toggleTheme }) {
  const isDark = theme === 'dark';
  return (
    <button onClick={toggleTheme}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      style={{
        width: '100%', padding: '9px 10px', borderRadius: 8,
        border: '1px solid var(--dash-border)', background: 'transparent',
        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10,
        color: 'var(--dash-muted)', fontSize: 14, transition: 'all 0.15s', marginBottom: 8,
      }}
      onMouseEnter={e => { e.currentTarget.style.background = 'var(--dash-hover)'; }}
      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
    >
      {isDark ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
      ) : (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
      {isDark ? 'Light mode' : 'Dark mode'}
    </button>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────
function Sidebar({ activeTab, setActiveTab, user, subscription, onLogout, theme, toggleTheme, open, onClose }) {
  const daysLeft = getDaysRemaining(subscription?.expiryDate);
  const isMobile = useMobile();

  const navItems = [
    { id: 'home', label: 'Dashboard', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg> },
    { id: 'rules', label: 'My Rules', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3" /><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" /></svg> },
    { id: 'guide', label: 'EA Setup', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12.55a11 11 0 0 1 14.08 0" /><path d="M1.42 9a16 16 0 0 1 21.16 0" /><path d="M8.53 16.11a6 6 0 0 1 6.95 0" /><circle cx="12" cy="20" r="1" /></svg> },
  ];
  const supportItems = [
    { id: 'contact', label: 'Help & Contact', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg> },
    { id: 'terms', label: 'Legal', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></svg> },
  ];

  const handleNav = (id) => {
    setActiveTab(id);
    if (isMobile && onClose) onClose();
  };

  // On mobile — slide-in drawer with overlay
  // On desktop — fixed sidebar
  if (isMobile && !open) return null;

  return (
    <>
      {/* Overlay for mobile */}
      {isMobile && (
        <div onClick={onClose} style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          zIndex: 99, backdropFilter: 'blur(2px)',
        }} />
      )}

      <div style={{
        width: 240, flexShrink: 0,
        background: 'var(--dash-sidebar)',
        borderRight: '1px solid var(--dash-border)',
        display: 'flex', flexDirection: 'column',
        height: '100vh',
        position: isMobile ? 'fixed' : 'sticky',
        top: 0, left: 0,
        zIndex: isMobile ? 100 : 10,
        transform: isMobile ? (open ? 'translateX(0)' : 'translateX(-100%)') : 'none',
        transition: 'transform 0.25s ease, background 0.25s ease',
      }}>
        {/* Logo */}
        <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid var(--dash-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, background: 'var(--dash-text)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--dash-sidebar)" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
            </div>
            <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--dash-text)', letterSpacing: '-0.3px' }}>RiskGuard</span>
          </div>
          {isMobile && (
            <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--dash-muted)', fontSize: 20, padding: '2px 6px' }}>✕</button>
          )}
        </div>

        {/* Nav */}
        <div style={{ flex: 1, padding: '16px 12px', overflowY: 'auto' }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--dash-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '0 8px', marginBottom: 8 }}>Navigation</div>
          {navItems.map(item => (
            <button key={item.id} onClick={() => handleNav(item.id)} style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 10px', borderRadius: 8, border: 'none', cursor: 'pointer',
              background: activeTab === item.id ? 'var(--dash-active-bg)' : 'transparent',
              color: activeTab === item.id ? 'var(--dash-active-txt)' : 'var(--dash-text)',
              fontSize: 14, fontWeight: activeTab === item.id ? 600 : 400,
              marginBottom: 2, textAlign: 'left', transition: 'all 0.15s',
            }}
              onMouseEnter={e => { if (activeTab !== item.id) e.currentTarget.style.background = 'var(--dash-hover)'; }}
              onMouseLeave={e => { if (activeTab !== item.id) e.currentTarget.style.background = 'transparent'; }}
            >
              <span style={{ color: activeTab === item.id ? 'var(--dash-active-txt)' : 'var(--dash-muted)', flexShrink: 0 }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--dash-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '16px 8px 8px' }}>Support</div>
          {supportItems.map(item => (
            <button key={item.id} onClick={() => handleNav(item.id)} style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 10px', borderRadius: 8, border: 'none', cursor: 'pointer',
              background: activeTab === item.id ? 'var(--dash-active-bg)' : 'transparent',
              color: activeTab === item.id ? 'var(--dash-active-txt)' : 'var(--dash-text)',
              fontSize: 14, fontWeight: activeTab === item.id ? 600 : 400,
              marginBottom: 2, textAlign: 'left', transition: 'all 0.15s',
            }}
              onMouseEnter={e => { if (activeTab !== item.id) e.currentTarget.style.background = 'var(--dash-hover)'; }}
              onMouseLeave={e => { if (activeTab !== item.id) e.currentTarget.style.background = 'transparent'; }}
            >
              <span style={{ color: activeTab === item.id ? 'var(--dash-active-txt)' : 'var(--dash-muted)', flexShrink: 0 }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>

        {/* User info */}
        <div style={{ padding: '16px', borderTop: '1px solid var(--dash-border)' }}>
          <div style={{ fontSize: 12, color: 'var(--dash-text)', fontWeight: 500, marginBottom: 8, wordBreak: 'break-all' }}>{user?.email || '—'}</div>
          <div style={{ marginBottom: 12 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'var(--dash-active-bg)', color: 'var(--dash-active-txt)', fontSize: 12, fontWeight: 600, padding: '3px 10px', borderRadius: 20, border: '1px solid var(--dash-border)' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--dash-active-txt)', flexShrink: 0 }} />
              {subscription?.planName?.toUpperCase() || 'ACTIVE'} · {daysLeft !== null ? `${daysLeft}d left` : '—'}
            </span>
          </div>
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
          <button onClick={onLogout} style={{
            width: '100%', padding: '9px', borderRadius: 8, cursor: 'pointer',
            background: 'transparent', border: '1px solid var(--dash-blocked-br)',
            color: 'var(--rose)', fontSize: 13, fontWeight: 600, transition: 'all 0.15s',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--dash-blocked-bg)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
          >Sign out</button>
        </div>
      </div>
    </>
  );
}

// ─── Mobile top bar ───────────────────────────────────────────────
function MobileTopBar({ onMenuOpen, user, blocked }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '12px 16px',
      background: 'var(--dash-sidebar)',
      borderBottom: '1px solid var(--dash-border)',
      position: 'sticky', top: 0, zIndex: 50,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <button onClick={onMenuOpen} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--dash-text)', fontSize: 20, padding: '2px 4px', display: 'flex' }}>☰</button>
        <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--dash-text)' }}>RiskGuard</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 20, background: blocked ? 'var(--dash-blocked-bg)' : 'var(--dash-active-status-bg)', border: `1px solid ${blocked ? 'var(--dash-blocked-br)' : 'var(--dash-active-status-br)'}` }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: blocked ? '#ef4444' : '#22c55e' }} />
        <span style={{ fontSize: 11, fontWeight: 600, color: blocked ? 'var(--rose)' : '#16a34a' }}>{blocked ? 'Blocked' : 'Active'}</span>
      </div>
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────
function StatCard({ label, value, sub, barValue, barMax, barColor }) {
  return (
    <div style={{ background: 'var(--dash-card)', border: '1px solid var(--dash-border)', borderRadius: 14, padding: '16px 18px', transition: 'background 0.25s ease' }}>
      <div style={{ fontSize: 12, color: 'var(--dash-muted)', marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--dash-text)', letterSpacing: '-0.5px', lineHeight: 1.2 }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: 'var(--dash-subtext)', marginTop: 4 }}>{sub}</div>}
      {barMax !== undefined && <MiniBar value={barValue} max={barMax} color={barColor} />}
    </div>
  );
}

// ─── Dashboard header ─────────────────────────────────────────────
function DashboardHeader({ user, lastSync, blocked }) {
  const isMobile = useMobile();
  return (
    <div style={{ display: 'flex', alignItems: isMobile ? 'flex-start' : 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
      <div>
        <h1 style={{ fontSize: isMobile ? 22 : 28, fontWeight: 700, color: 'var(--dash-text)', letterSpacing: '-0.5px', marginBottom: 4 }}>Dashboard</h1>
        <p style={{ fontSize: 13, color: 'var(--dash-muted)' }}>Account #{user?.account || '—'} · Last sync {fmtSyncAgo(lastSync)}</p>
      </div>
      {!isMobile && (
        blocked ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--dash-blocked-bg)', border: '1px solid var(--dash-blocked-br)', borderRadius: 20, padding: '8px 16px' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444', flexShrink: 0 }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--rose)' }}>Trading blocked</span>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--dash-active-status-bg)', border: '1px solid var(--dash-active-status-br)', borderRadius: 20, padding: '8px 16px' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', flexShrink: 0 }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: '#16a34a' }}>Trading active</span>
          </div>
        )
      )}
    </div>
  );
}

// ─── Blocked banner ───────────────────────────────────────────────
function BlockedBanner({ reason }) {
  const timeLeft = useMemo(() => getTimeUntilMidnight(), []);
  const isMobile = useMobile();
  return (
    <div style={{
      background: 'var(--dash-blocked-bg)', border: '1px solid var(--dash-blocked-br)',
      borderRadius: 14, padding: isMobile ? '16px' : '20px 24px', marginBottom: 24,
      display: 'flex', flexDirection: isMobile ? 'column' : 'row',
      alignItems: isMobile ? 'flex-start' : 'center',
      justifyContent: 'space-between', gap: 12,
    }}>
      <div>
        <div style={{ fontSize: isMobile ? 15 : 17, fontWeight: 700, color: 'var(--rose)', marginBottom: 4 }}>Trading is blocked for today</div>
        <div style={{ fontSize: 13, color: 'var(--rose)', opacity: 0.8 }}>{humanizeReason(reason)}</div>
      </div>
      <div style={{ textAlign: isMobile ? 'left' : 'right', flexShrink: 0 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--rose)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 2, opacity: 0.7 }}>Resumes in</div>
        <div style={{ fontSize: isMobile ? 24 : 32, fontWeight: 800, color: 'var(--rose)', letterSpacing: '-1px', lineHeight: 1 }}>{timeLeft}</div>
      </div>
    </div>
  );
}

// ─── Active rules ─────────────────────────────────────────────────
function ActiveRules({ rules, eaData }) {
  const maxTrades = rules?.maxTrades || 5;
  const maxLoss = rules?.maxDailyLoss || 3.0;
  const maxStreak = rules?.maxLossStreak || 2;
  const todayTrades = eaData?.tradesToday ?? 0;
  const lossPct = Math.max(0, eaData?.dailyLossPercent ?? 0);
  const streak = eaData?.consecutiveLosses ?? 0;

  const tradeColor = todayTrades >= maxTrades ? '#ef4444' : todayTrades >= maxTrades * 0.8 ? '#f59e0b' : '#6366f1';
  const lossColor = lossPct >= maxLoss ? '#ef4444' : lossPct >= maxLoss * 0.6 ? '#f59e0b' : '#10b981';
  const streakColor = streak >= maxStreak ? '#ef4444' : '#3b82f6';

  const rows = [
    { label: 'Max trades / day', barValue: todayTrades, barMax: maxTrades, barColor: tradeColor, displayVal: maxTrades },
    { label: 'Daily loss limit', barValue: lossPct, barMax: maxLoss, barColor: lossColor, displayVal: `${maxLoss}%` },
    { label: 'Consecutive losses', barValue: streak, barMax: maxStreak, barColor: streakColor, displayVal: maxStreak },
    { label: 'Reset time', barValue: null, displayVal: '12:00 AM IST' },
  ];

  return (
    <div style={{ background: 'var(--dash-card)', border: '1px solid var(--dash-border)', borderRadius: 14, padding: '20px', transition: 'background 0.25s ease' }}>
      <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--dash-text)', marginBottom: 14 }}>Active rules</h3>
      <div style={{ height: 1, background: 'var(--dash-divider)', marginBottom: 14 }} />
      {rows.map((row, i) => (
        <div key={row.label} style={{ marginBottom: i < rows.length - 1 ? 14 : 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 13, color: 'var(--dash-text)' }}>{row.label}</span>
            {row.barMax !== undefined ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 56, height: 4, borderRadius: 2, background: 'var(--dash-border)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${Math.min(100, (row.barValue / row.barMax) * 100)}%`, background: row.barColor, borderRadius: 2 }} />
                </div>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--dash-text)', minWidth: 24, textAlign: 'right' }}>{row.displayVal}</span>
              </div>
            ) : (
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--dash-text)' }}>{row.displayVal}</span>
            )}
          </div>
          {i < rows.length - 1 && <div style={{ height: 1, background: 'var(--dash-divider)', marginTop: 14 }} />}
        </div>
      ))}
    </div>
  );
}

// ─── EA Connection ────────────────────────────────────────────────
function EAConnection({ user, subscription, eaData, lastSync }) {
  const days = getDaysRemaining(subscription?.expiryDate);
  const rows = [
    { label: 'Status', value: eaData ? 'Connected' : 'Not connected', color: eaData ? 'var(--dash-active-txt)' : 'var(--rose)', dot: eaData ? 'var(--dash-active-txt)' : 'var(--dash-muted)' },
    { label: 'Account', value: user?.account ? `#${user.account}` : '—', dot: 'var(--dash-muted)' },
    { label: 'Last ping', value: fmtSyncAgo(lastSync), dot: 'var(--dash-muted)' },
    { label: 'License', value: days !== null ? `Active · ${days}d left` : '—', color: 'var(--dash-active-txt)', dot: 'var(--dash-muted)' },
    { label: 'Plan', value: subscription?.planName || '—', dot: 'var(--dash-muted)' },
    { label: 'Email', value: user?.email || '—', dot: 'var(--dash-muted)' },
  ];
  return (
    <div style={{ background: 'var(--dash-card)', border: '1px solid var(--dash-border)', borderRadius: 14, padding: '20px', transition: 'background 0.25s ease' }}>
      <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--dash-text)', marginBottom: 14 }}>EA connection</h3>
      <div style={{ height: 1, background: 'var(--dash-divider)', marginBottom: 14 }} />
      {rows.map((row, i) => (
        <div key={row.label}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: row.dot, flexShrink: 0 }} />
              <span style={{ fontSize: 13, color: 'var(--dash-text)' }}>{row.label}</span>
            </div>
            <span style={{ fontSize: 13, fontWeight: 500, color: row.color || 'var(--dash-text)', textAlign: 'right', maxWidth: '55%', wordBreak: 'break-all' }}>{row.value}</span>
          </div>
          {i < rows.length - 1 && <div style={{ height: 1, background: 'var(--dash-divider)' }} />}
        </div>
      ))}
    </div>
  );
}

// ─── Use this time wisely ─────────────────────────────────────────
function WiselyCard() {
  return (
    <div style={{ background: 'var(--dash-bg)', border: '1px solid var(--dash-border)', borderRadius: 14, padding: '20px', marginTop: 16 }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--dash-muted)', marginBottom: 12 }}>Use this time wisely</div>
      {['Take a break — step away from the screen', 'Journal your trades — review what happened', 'Study your strategy and refine your edge', 'Go for a walk — clear your mind', 'Rest well — a fresh mind trades better tomorrow'].map((tip, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '6px 0', fontSize: 13, color: 'var(--dash-text)', borderBottom: i < 4 ? '1px solid var(--dash-divider)' : 'none' }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--dash-muted)', flexShrink: 0, marginTop: 7 }} />
          {tip}
        </div>
      ))}
    </div>
  );
}

// ─── Main content ─────────────────────────────────────────────────
function MainContent({ eaData, rules, user, subscription, lastSync }) {
  const isMobile = useMobile();
  const maxTrades = rules?.maxTrades || 5;
  const maxLoss = rules?.maxDailyLoss || 3.0;
  const maxStreak = rules?.maxLossStreak || 2;
  const startEquity = eaData?.startOfDayEquity || eaData?.currentEquity || 0;
  const currentEquity = eaData?.currentEquity || 0;
  const rawPnl = currentEquity - startEquity;
  const isProfit = rawPnl > 0;
  const isBreakEven = rawPnl === 0;
  const pnlAmt = Math.abs(rawPnl);
  const rawLossPct = eaData?.dailyLossPercent ?? 0;
  const lossPct = Math.max(0, rawLossPct);
  const profitPct = lossPct === 0 && isProfit ? ((rawPnl / startEquity) * 100) : 0;
  const trades = eaData?.consecutiveLosses ?? 0;
  const todayTrades = eaData?.tradesToday ?? 0;
  const isBlocked = !eaData?.tradingAllowed;

  const tradeBarColor = todayTrades >= maxTrades ? '#ef4444' : '#6366f1';
  const lossBarColor = lossPct >= maxLoss ? '#ef4444' : lossPct >= maxLoss * 0.6 ? '#f59e0b' : '#10b981';
  const streakBarColor = trades >= maxStreak ? '#ef4444' : trades >= maxStreak - 1 ? '#f59e0b' : '#3b82f6';

  const pad = isMobile ? '16px 16px 60px' : '32px 32px 60px';

  return (
    <div style={{ flex: 1, padding: pad, overflowY: 'auto', background: 'var(--dash-bg)', minHeight: '100vh', transition: 'background 0.25s ease' }}>
      <DashboardHeader user={user} lastSync={lastSync} blocked={isBlocked} />
      {isBlocked && <BlockedBanner reason={eaData?.disabledReason} />}

      {/* Stat cards — 2 cols on mobile, 4 on desktop */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, minmax(0,1fr))' : 'repeat(4, minmax(0,1fr))', gap: isMobile ? 12 : 16, marginBottom: 20 }}>
        <StatCard label="Current equity" value={fmt(currentEquity)} sub="Live from MT5" barValue={currentEquity} barMax={currentEquity} barColor="#10b981" />
        <StatCard label="Trades today" value={`${todayTrades} / ${maxTrades}`} sub={todayTrades >= maxTrades ? 'Limit exceeded' : `${maxTrades - todayTrades} remaining`} barValue={todayTrades} barMax={maxTrades} barColor={tradeBarColor} />
        <StatCard label="Daily loss" value={isProfit ? `+${profitPct.toFixed(1)}%` : isBreakEven ? '0%' : `${lossPct.toFixed(1)}%`} sub={`Limit: ${maxLoss}%`} barValue={lossPct} barMax={maxLoss} barColor={lossBarColor} />
        <StatCard label="Loss streak" value={`${trades} / ${maxStreak}`} sub={trades >= maxStreak ? 'Limit reached' : 'Within limit'} barValue={trades} barMax={maxStreak} barColor={streakBarColor} />
      </div>

      {/* Bottom cards — stack on mobile, 2 cols on desktop */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 12 : 20 }}>
        <div>
          <ActiveRules rules={rules} eaData={eaData} />
          {isBlocked && <WiselyCard />}
        </div>
        <EAConnection user={user} subscription={subscription} eaData={eaData} lastSync={lastSync} />
      </div>
    </div>
  );
}

// ─── Waiting content ──────────────────────────────────────────────
function WaitingContent({ onGoGuide, lastSync, user, subscription }) {
  const isMobile = useMobile();
  const pad = isMobile ? '16px 16px 60px' : '32px 32px 60px';
  return (
    <div style={{ flex: 1, padding: pad, background: 'var(--dash-bg)', minHeight: '100vh', transition: 'background 0.25s ease' }}>
      <DashboardHeader user={user} lastSync={lastSync} blocked={false} />
      <div style={{ background: 'var(--dash-card)', border: '1px solid var(--dash-border)', borderRadius: 14, padding: isMobile ? '24px 16px' : '40px', textAlign: 'center', marginBottom: 20 }}>
        <div style={{ fontSize: 44, marginBottom: 14 }}>📡</div>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--dash-text)', marginBottom: 10 }}>Waiting for EA Connection</h3>
        <p style={{ fontSize: 14, color: 'var(--dash-muted)', lineHeight: 1.8, marginBottom: 16 }}>
          Your MetaTrader 5 EA hasn't connected yet.<br />Once running, your live stats appear here.
        </p>
        <div style={{ fontSize: 13, color: 'var(--dash-subtext)', marginBottom: 20 }}>
          Checking every 15 seconds{lastSync && <span> · Last checked: {fmtTime(lastSync)}</span>}
        </div>
        <div style={{ textAlign: 'left', maxWidth: 400, margin: '0 auto 24px' }}>
          {['EA file installed in MetaTrader 5', 'EA attached to a chart and running', 'Backend URL whitelisted in MT5 → Tools → Options', 'Your email matches what you used to register'].map((s, i) => (
            <div key={i} style={{ fontSize: 13, color: 'var(--dash-text)', padding: '8px 0', display: 'flex', gap: 10, borderBottom: '1px solid var(--dash-divider)' }}>
              <span style={{ color: '#10b981', flexShrink: 0, fontWeight: 700 }}>✓</span>{s}
            </div>
          ))}
        </div>
        <button onClick={onGoGuide} style={{ background: 'var(--dash-text)', color: 'var(--dash-sidebar)', border: 'none', padding: '12px 28px', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
          View EA Setup Guide →
        </button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 12 : 20 }}>
        <ActiveRules rules={null} eaData={null} />
        <EAConnection user={user} subscription={subscription} eaData={null} lastSync={lastSync} />
      </div>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────
export default function DashboardPage({ onGoGuide, onSubscriptionExpired, activeTab, setActiveTab, theme, toggleTheme }) {
  usePolling(onSubscriptionExpired);
  const { logout } = useApp();
  const isMobile = useMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const eaData = useSelector(s => s.status.eaData);
  const rules = useSelector(s => s.status.rules);
  const eaConnected = useSelector(s => s.status.eaConnected);
  const lastSync = useSelector(s => s.status.lastSync);
  const loading = useSelector(s => s.status.loading);
  const error = useSelector(s => s.status.error);
  const user = useSelector(s => s.auth.user);
  const subscription = useSelector(s => s.auth.subscription);
  const isBlocked = eaData && !eaData.tradingAllowed;

 useEffect(() => {
    document.body.style.overflowX = 'hidden';
    document.body.style.overflowY = 'auto';          // ← add this
    document.documentElement.style.overflowX = 'hidden';
    document.documentElement.style.overflowY = 'auto'; // ← add this
    document.body.style.background = '';
    document.documentElement.style.background = '';
}, []);

  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', gap: 14, background: 'var(--dash-bg)' }}>
      <Spinner large />
      <p style={{ color: 'var(--dash-muted)', fontSize: 14 }}>Connecting to your account...</p>
    </div>
  );

  const renderTabContent = () => {
    // Non-dashboard tabs — wrapped in themed container
    if (activeTab === 'rules') return <div style={{ flex: 1, background: 'var(--dash-bg)', minHeight: '100vh', transition: 'background 0.25s ease' }}><SettingsPage /></div>;
    if (activeTab === 'guide') return <div style={{ flex: 1, background: 'var(--dash-bg)', minHeight: '100vh', transition: 'background 0.25s ease' }}><EAGuidePage /></div>;
    if (activeTab === 'contact') return <div style={{ flex: 1, background: 'var(--dash-bg)', minHeight: '100vh', transition: 'background 0.25s ease' }}><ContactPage /></div>;
    if (activeTab === 'terms') return <div style={{ flex: 1, background: 'var(--dash-bg)', minHeight: '100vh', transition: 'background 0.25s ease' }}><TermsPage /></div>;

    // Home tab — EA status content
    return (!eaConnected || !eaData) ? (
      <WaitingContent onGoGuide={() => { setActiveTab('guide'); setSidebarOpen(false); }} lastSync={lastSync} user={user} subscription={subscription} />
    ) : (
      <MainContent eaData={eaData} rules={rules} user={user} subscription={subscription} lastSync={lastSync} />
    );
  };

  const content = renderTabContent();

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--dash-bg)', transition: 'background 0.25s ease' }}>
      {/* Sidebar — hidden on mobile unless open */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        subscription={subscription}
        onLogout={logout}
        theme={theme}
        toggleTheme={toggleTheme}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div style={{ flex: 1, overflow: 'hidden' }}>
        {/* Mobile top bar */}
        {isMobile && <MobileTopBar onMenuOpen={() => setSidebarOpen(true)} user={user} blocked={!!isBlocked} />}

        {error && (
          <div style={{ margin: '16px 16px 0', padding: '12px 16px', background: 'var(--dash-blocked-bg)', border: '1px solid var(--dash-blocked-br)', borderRadius: 10, color: 'var(--rose)', fontSize: 14 }}>
            {error}
          </div>
        )}
        {content}
      </div>
    </div>
  );
}