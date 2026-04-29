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

export default function Navbar({ activeTab, setActiveTab }) {
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
    { id: 'home', label: '🏠 Home' },
    { id: 'rules', label: '⚙ My Rules' },
    { id: 'guide', label: '📡 EA Setup' },
    { id: 'contact', label: '📬 Contact' },
    { id: 'terms', label: '📄 Legal' },
  ];

  // Show hint arrow only if tabs overflow (i.e. scrollWidth > clientWidth)
  useEffect(() => {
    const el = navRef.current;
    if (!el) return;
    const check = () => setShowHint(el.scrollWidth > el.clientWidth + 4);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Hide hint once user has scrolled
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
        .swipe-hint {
          animation: swipeHint 1.2s ease-in-out infinite;
        }
        .tab-scroll::-webkit-scrollbar { display: none; }
      `}</style>

      {/* Row 1: Logo + subscription info + sign out */}
      <div style={{
        maxWidth: 600, margin: '0 auto', padding: '0 16px',
        height: 48, display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', gap: 8,
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8, background: 'var(--lime)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 12px rgba(163,230,53,0.35)',
          }}>
            <ShieldIcon />
          </div>
          <span style={{
            fontFamily: 'var(--font-display)', fontWeight: 700,
            fontSize: 15, color: 'var(--text)',
          }}>RiskGuard</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
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
              background: 'rgba(244,63,94,0.1)',
              border: '1.5px solid rgba(244,63,94,0.25)',
              borderRadius: 8, cursor: 'pointer',
              color: 'var(--rose)', fontSize: 11,
              fontFamily: 'var(--font-display)', fontWeight: 600,
              padding: '5px 10px', transition: 'all 0.2s', whiteSpace: 'nowrap',
            }}
            onMouseOver={e => { e.currentTarget.style.background = 'rgba(244,63,94,0.22)'; }}
            onMouseOut={e => { e.currentTarget.style.background = 'rgba(244,63,94,0.1)'; }}
          >Sign out</button>
        </div>
      </div>

      {/* Row 2: Scrollable tabs + swipe hint */}
      <div style={{ position: 'relative', maxWidth: 600, margin: '0 auto' }}>
        <div
          ref={navRef}
          className="tab-scroll"
          onScroll={handleScroll}
          style={{
            overflowX: 'auto',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
          }}
        >
          <nav style={{
            display: 'flex', gap: 2, padding: '6px 12px',
            minWidth: 'max-content',
          }}>
            {tabs.map(t => (
              <button
                key={t.id}
                className={`nav-btn ${activeTab === t.id ? 'active' : ''}`}
                onClick={() => setActiveTab(t.id)}
              >{t.label}</button>
            ))}
          </nav>
        </div>

        {/* Fade + animated arrow on right edge when overflowing */}
        {showHint && (
          <div style={{
            position: 'absolute', right: 0, top: 0, bottom: 0,
            width: 48,
            background: 'linear-gradient(to right, transparent, var(--bg, #0d1117) 80%)',
            display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
            paddingRight: 8,
            pointerEvents: 'none',
          }}>
            <span className="swipe-hint" style={{
              fontSize: 16, color: 'rgba(255,255,255,0.5)',
              lineHeight: 1,
            }}>›</span>
          </div>
        )}
      </div>
    </header>
  );
}