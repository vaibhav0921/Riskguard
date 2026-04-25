import React from 'react';
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
  // logout() from AppContext clears Redux + resets the route in App.js
  // Dispatching logoutAction() directly only clears Redux but leaves
  // the route as 'app' so the user stays on the dashboard.
  const { logout } = useApp();
  const subscription = useSelector(s => s.auth.subscription);

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
    { id: 'terms', label: '📬 Terms' },  // ADD THIS
  ];

  const handleLogout = (e) => {
    e.preventDefault();
    e.stopPropagation();
    logout();   // clears Redux state AND resets route to 'login' via App.js callback
  };

  return (
    <header className="navbar">
      <div style={{
        maxWidth: 600, margin: '0 auto', padding: '0 16px',
        height: 56, display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', gap: 8,
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
          }}>
            RiskGuard
          </span>
        </div>

        <nav style={{ display: 'flex', gap: 2 }}>
          {tabs.map(t => (
            <button
              key={t.id}
              className={`nav-btn ${activeTab === t.id ? 'active' : ''}`}
              onClick={() => setActiveTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          {daysLeft !== null && (
            <span style={{ fontSize: 11, color: expiryColor, fontWeight: 600, whiteSpace: 'nowrap' }}>
              {daysLeft}d left
            </span>
          )}
          {subscription && (
            <span className={`badge ${subscription.planId === 'advanced' ? 'badge-gold' :
              subscription.planId === 'pro' ? 'badge-lime' : 'badge-sky'
              }`}>
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
          >
            Sign out
          </button>
        </div>

      </div>
    </header>
  );
}
