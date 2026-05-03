import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useApp } from '../context/AppContext';
import { getDaysRemaining } from '../context/AppContext';

const ShieldIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="#0d0f14" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

function ThemeToggle({ theme, toggleTheme }) {
  const isDark = theme === 'dark';
  return (
    <button
      onClick={toggleTheme}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      style={{
        width: 34, height: 34, borderRadius: 8, border: '1.5px solid var(--border2)',
        background: 'var(--surface2)', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'var(--muted)', transition: 'all 0.2s', flexShrink: 0,
      }}
      onMouseEnter={e => { e.currentTarget.style.color = 'var(--text)'; e.currentTarget.style.borderColor = 'var(--border2)'; }}
      onMouseLeave={e => { e.currentTarget.style.color = 'var(--muted)'; }}
    >
      {isDark ? (
        // Sun icon
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="12" cy="12" r="5"/>
          <line x1="12" y1="1" x2="12" y2="3"/>
          <line x1="12" y1="21" x2="12" y2="23"/>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
          <line x1="1" y1="12" x2="3" y2="12"/>
          <line x1="21" y1="12" x2="23" y2="12"/>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        </svg>
      ) : (
        // Moon icon
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      )}
    </button>
  );
}

export default function Navbar({ activeTab, setActiveTab, theme, toggleTheme }) {
  const { logout } = useApp();
  const subscription = useSelector(s => s.auth.subscription);
  const navRef = useRef(null);
  const [showHint, setShowHint] = useState(false);

  const daysLeft = getDaysRemaining(subscription?.expiryDate);
  const expiryColor =
    daysLeft === null ? 'var(--lime)' :
      daysLeft <= 7 ? 'var(--rose)' :
        daysLeft <= 14 ? 'var(--gold)' : 'var(--lime)';

  const tabs = [
    { id: 'home',    label: '🏠 Home' },
    { id: 'rules',   label: '⚙ My Rules' },
    { id: 'guide',   label: '📡 EA Setup' },
    { id: 'contact', label: '📬 Contact' },
    { id: 'terms',   label: '📄 Legal' },
  ];

  useEffect(() => {
    const el = navRef.current;
    if (!el) return;
    const check = () => setShowHint(el.scrollWidth > el.clientWidth + 4);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const handleScroll = () => setShowHint(false);

  const handleLogout = (e) => {
    e.preventDefault();
    e.stopPropagation();
    logout();
  };

  return (
    <header className="navbar" style={{ height: 'auto' }}>
      <style>{`
        @keyframes swipeHint {
          0%   { transform: translateX(0);   opacity: 1; }
          50%  { transform: translateX(6px); opacity: 0.4; }
          100% { transform: translateX(0);   opacity: 1; }
        }
        .swipe-hint { animation: swipeHint 1.2s ease-in-out infinite; }
        .tab-scroll::-webkit-scrollbar { display: none; }
      `}</style>

      {/* Row 1: Logo + theme toggle + subscription info + sign out */}
      <div style={{
        maxWidth: 600, margin: '0 auto', padding: '0 16px',
        height: 48, display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', gap: 8,
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8, background: 'var(--lime)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 12px rgba(163,230,53,0.35)',
          }}>
            <ShieldIcon />
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, color: 'var(--text)' }}>
            RiskGuard
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
          {daysLeft !== null && (
            <span style={{ fontSize: 11, color: expiryColor, fontWeight: 600, whiteSpace: 'nowrap' }}>
              {daysLeft}d left
            </span>
          )}
          {subscription && (
            <span className={`badge ${subscription.planId === 'advanced' ? 'badge-gold' :
              subscription.planId === 'pro' ? 'badge-lime' : 'badge-sky'}`}>
              {subscription.planName?.toUpperCase() || 'ACTIVE'}
            </span>
          )}
          <button
            onClick={handleLogout}
            style={{
              background: 'var(--rose-dim)', border: '1.5px solid var(--rose-border)',
              borderRadius: 8, cursor: 'pointer', color: 'var(--rose)',
              fontSize: 11, fontFamily: 'var(--font-display)', fontWeight: 600,
              padding: '5px 10px', transition: 'all 0.2s', whiteSpace: 'nowrap',
            }}
            onMouseOver={e => { e.currentTarget.style.background = 'rgba(244,63,94,0.22)'; }}
            onMouseOut={e => { e.currentTarget.style.background = 'var(--rose-dim)'; }}
          >Sign out</button>
        </div>
      </div>

      {/* Row 2: Scrollable tabs + swipe hint */}
      <div style={{ position: 'relative', maxWidth: 600, margin: '0 auto' }}>
        <div
          ref={navRef}
          className="tab-scroll"
          onScroll={handleScroll}
          style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none' }}
        >
          <nav style={{ display: 'flex', gap: 2, padding: '6px 12px', minWidth: 'max-content' }}>
            {tabs.map(t => (
              <button
                key={t.id}
                className={`nav-btn ${activeTab === t.id ? 'active' : ''}`}
                onClick={() => setActiveTab(t.id)}
              >{t.label}</button>
            ))}
          </nav>
        </div>
        {showHint && (
          <div style={{
            position: 'absolute', right: 0, top: 0, bottom: 0, width: 48,
            background: 'linear-gradient(to right, transparent, var(--bg) 80%)',
            display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
            paddingRight: 8, pointerEvents: 'none',
          }}>
            <span className="swipe-hint" style={{ fontSize: 16, color: 'var(--muted)', lineHeight: 1 }}>›</span>
          </div>
        )}
      </div>
    </header>
  );
}