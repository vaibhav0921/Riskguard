import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useSelector } from 'react-redux';
const BACKEND_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

// ── Step component ─────────────────────────────────────────────────
function Step({ number, title, children, done = false }) {
  return (
    <div className={`anim-fade-up d${number}`} style={{
      display: 'flex', gap: 16, padding: '20px 0',
      borderBottom: '1px solid var(--border)',
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
        background: done ? 'var(--lime)' : 'rgba(163,230,53,0.1)',
        border: `2px solid ${done ? 'var(--lime)' : 'rgba(163,230,53,0.25)'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14,
        color: done ? '#0d0f14' : 'var(--lime)',
      }}>
        {done ? '✓' : number}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{
          fontFamily: 'var(--font-display)', fontWeight: 700,
          fontSize: 15, color: 'var(--text)', marginBottom: 8,
        }}>
          {title}
        </div>
        <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.8 }}>
          {children}
        </div>
      </div>
    </div>
  );
}

// ── Code block ────────────────────────────────────────────────────
function Code({ children }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div style={{ position: 'relative', marginTop: 10, marginBottom: 4 }}>
      <pre style={{
        background: 'rgba(0,0,0,0.4)', border: '1px solid var(--border)',
        borderRadius: 10, padding: '12px 16px', fontSize: 12,
        color: 'var(--lime)', overflowX: 'auto', lineHeight: 1.6,
        fontFamily: 'monospace', whiteSpace: 'pre-wrap', wordBreak: 'break-all',
      }}>
        {children}
      </pre>
      <button
        onClick={copy}
        style={{
          position: 'absolute', top: 8, right: 8,
          background: copied ? 'rgba(163,230,53,0.2)' : 'rgba(255,255,255,0.07)',
          border: '1px solid var(--border)', borderRadius: 6,
          color: copied ? 'var(--lime)' : 'var(--muted)',
          fontSize: 10, fontFamily: 'var(--font-display)', fontWeight: 600,
          padding: '3px 8px', cursor: 'pointer', transition: 'all 0.2s',
        }}
      >
        {copied ? 'Copied ✓' : 'Copy'}
      </button>
    </div>
  );
}

// ── Info box ─────────────────────────────────────────────────────
function InfoBox({ icon, color, bg, border, children }) {
  return (
    <div style={{
      background: bg, border: `1px solid ${border}`,
      borderRadius: 12, padding: '12px 14px',
      fontSize: 13, color, marginTop: 10, lineHeight: 1.7,
      display: 'flex', gap: 10, alignItems: 'flex-start',
    }}>
      <span style={{ flexShrink: 0 }}>{icon}</span>
      <span>{children}</span>
    </div>
  );
}

export default function EAGuidePage() {
  const user = useSelector(s => s.auth.user);
  const [downloading, setDownloading] = useState(false);
  const [checklist, setChecklist] = useState({
    downloaded: false,
    installed: false,
    whitelisted: false,
    attached: false,
  });

  const allDone = Object.values(checklist).every(Boolean);

  const toggleCheck = (key) => {
    setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleDownload = () => {
    setDownloading(true);
    // The .ex5 file should be served from your backend or a static URL
    // For now we trigger download of a placeholder
    const link = document.createElement('a');
    link.href = `${BACKEND_URL}/api/download/RiskGuard.ex5`;
    link.download = 'RiskGuard.ex5';
    link.click();
    setTimeout(() => {
      setDownloading(false);
      setChecklist(prev => ({ ...prev, downloaded: true }));
    }, 1500);
  };

  return (
    <div style={{ maxWidth: 620, margin: '0 auto', padding: '24px 16px 80px' }}>

      {/* Header */}
      <div className="anim-fade-up d0" style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12, fontSize: 22,
            background: 'rgba(56,189,248,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            📡
          </div>
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22, color: 'var(--text)' }}>
              EA Setup Guide
            </h2>
            <p style={{ fontSize: 13, color: 'var(--muted)' }}>
              Connect your MetaTrader 5 to RiskGuard in 4 steps
            </p>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="glass anim-fade-up d0" style={{ borderRadius: 14, padding: '14px 16px', marginBottom: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 12 }}>
          <span style={{ color: 'var(--muted)' }}>Setup Progress</span>
          <span style={{ color: 'var(--lime)', fontWeight: 600 }}>
            {Object.values(checklist).filter(Boolean).length} / 4 steps complete
          </span>
        </div>
        <div style={{ height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.07)', overflow: 'hidden' }}>
          <div style={{
            height: '100%', borderRadius: 3, transition: 'width 0.5s ease',
            width: `${(Object.values(checklist).filter(Boolean).length / 4) * 100}%`,
            background: allDone
              ? 'linear-gradient(90deg, var(--lime), #84cc16)'
              : 'linear-gradient(90deg, var(--sky), #0ea5e9)',
          }} />
        </div>
        {allDone && (
          <div style={{ fontSize: 12, color: 'var(--lime)', marginTop: 8, textAlign: 'center' }}>
            🎉 Setup complete! Your EA should be connecting now.
          </div>
        )}
      </div>

      {/* Steps */}
      <div style={{ marginBottom: 32 }}>

        {/* Step 1 — Download */}
        <Step number={1} title="Download the RiskGuard EA file" done={checklist.downloaded}>
          <p style={{ marginBottom: 12 }}>
            Download the <strong style={{ color: 'var(--text)' }}>RiskGuard.ex5</strong> file — this is the Expert Advisor that monitors your trades in MetaTrader 5.
          </p>
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="btn btn-lime btn-md"
            style={{ marginBottom: 10 }}
          >
            {downloading ? '⏳ Downloading...' : '⬇️  Download RiskGuard.ex5'}
          </button>
          <InfoBox icon="ℹ️" color="var(--sky)" bg="rgba(56,189,248,0.06)" border="rgba(56,189,248,0.15)">
            The .ex5 file is a compiled MetaTrader 5 Expert Advisor. It is read-only and cannot modify your source code.
          </InfoBox>
          <div style={{ marginTop: 12 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: 'var(--muted)' }}>
              <input type="checkbox" checked={checklist.downloaded} onChange={() => toggleCheck('downloaded')} style={{ accentColor: 'var(--lime)', width: 15, height: 15 }} />
              I have downloaded the file
            </label>
          </div>
        </Step>

        {/* Step 2 — Install */}
        <Step number={2} title="Install the EA in MetaTrader 5" done={checklist.installed}>
          <ol style={{ paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <li>Open <strong style={{ color: 'var(--text)' }}>MetaTrader 5</strong></li>
            <li>Press <strong style={{ color: 'var(--text)' }}>Ctrl + Shift + D</strong> to open the Data Folder</li>
            <li>Navigate to <code style={{ color: 'var(--lime)', fontSize: 12 }}>MQL5 → Experts</code></li>
            <li>Copy <strong style={{ color: 'var(--text)' }}>RiskGuard.ex5</strong> into that folder</li>
            <li>Press <strong style={{ color: 'var(--text)' }}>F5</strong> in MT5 to refresh the Navigator panel</li>
            <li>You should see <strong style={{ color: 'var(--text)' }}>RiskGuard</strong> appear under <em>Expert Advisors</em></li>
          </ol>
          <InfoBox icon="💡" color="var(--lime)" bg="rgba(163,230,53,0.06)" border="rgba(163,230,53,0.15)">
            If you don't see it after pressing F5, try restarting MetaTrader 5.
          </InfoBox>
          <div style={{ marginTop: 12 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: 'var(--muted)' }}>
              <input type="checkbox" checked={checklist.installed} onChange={() => toggleCheck('installed')} style={{ accentColor: 'var(--lime)', width: 15, height: 15 }} />
              RiskGuard appears in my Navigator panel
            </label>
          </div>
        </Step>

        {/* Step 3 — Whitelist URL */}
        <Step number={3} title="Allow the EA to connect to the internet" done={checklist.whitelisted}>
          <p style={{ marginBottom: 10 }}>
            MetaTrader 5 blocks all internet connections by default. You must whitelist the RiskGuard server URL.
          </p>
          <ol style={{ paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <li>In MT5, go to <strong style={{ color: 'var(--text)' }}>Tools → Options</strong></li>
            <li>Click the <strong style={{ color: 'var(--text)' }}>Expert Advisors</strong> tab</li>
            <li>Check <strong style={{ color: 'var(--text)' }}>"Allow WebRequest for listed URL"</strong></li>
            <li>Click the <strong style={{ color: 'var(--text)' }}>+</strong> button and add this URL exactly:</li>
          </ol>
          <Code>{BACKEND_URL}</Code>
          <ol start={5} style={{ paddingLeft: 18, marginTop: 8 }}>
            <li>Click <strong style={{ color: 'var(--text)' }}>OK</strong> to save</li>
          </ol>
          <InfoBox icon="⚠️" color="var(--gold)" bg="rgba(251,191,36,0.06)" border="rgba(251,191,36,0.15)">
            The URL must match exactly — no trailing slash. If your backend uses HTTPS, use https:// not http://.
          </InfoBox>
          <div style={{ marginTop: 12 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: 'var(--muted)' }}>
              <input type="checkbox" checked={checklist.whitelisted} onChange={() => toggleCheck('whitelisted')} style={{ accentColor: 'var(--lime)', width: 15, height: 15 }} />
              I have added the URL to the whitelist
            </label>
          </div>
        </Step>

        {/* Step 4 — Attach EA */}
        <Step number={4} title="Attach the EA to a chart" done={checklist.attached}>
          <ol style={{ paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <li>Open any chart in MT5 (e.g. <strong style={{ color: 'var(--text)' }}>EURUSD M1</strong>)</li>
            <li>In the <strong style={{ color: 'var(--text)' }}>Navigator</strong> panel, find <strong style={{ color: 'var(--text)' }}>RiskGuard</strong> under Expert Advisors</li>
            <li>Drag and drop it onto the chart</li>
            <li>In the settings dialog, fill in your details:</li>
          </ol>

          <div className="glass" style={{ borderRadius: 10, padding: 14, marginTop: 10, marginBottom: 10 }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 10 }}>
              EA Input Parameters
            </div>
            {[
              { label: 'USER_EMAIL', value: user?.email || 'your@email.com', desc: 'Your RiskGuard login email' },
              { label: 'BACKEND_URL', value: BACKEND_URL, desc: 'The server address (pre-filled)' },
              { label: 'MAX_CONSECUTIVE_LOSSES', value: '2', desc: 'Or leave — backend overrides this' },
              { label: 'MAX_DAILY_LOSS_PERCENT', value: '3.0', desc: 'Or leave — backend overrides this' },
              { label: 'MAX_TRADES_PER_DAY', value: '5', desc: 'Or leave — backend overrides this' },
            ].map(row => (
              <div key={row.label} style={{
                display: 'grid', gridTemplateColumns: '180px 1fr',
                gap: 8, padding: '5px 0', borderBottom: '1px solid var(--border)',
                fontSize: 12, alignItems: 'center',
              }}>
                <span style={{ color: 'var(--lime)', fontFamily: 'monospace' }}>{row.label}</span>
                <span>
                  <span style={{ color: 'var(--text)', fontWeight: 600 }}>{row.value}</span>
                  <span style={{ color: 'var(--muted)', marginLeft: 8 }}>{row.desc}</span>
                </span>
              </div>
            ))}
          </div>

          <ol start={5} style={{ paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <li>Make sure <strong style={{ color: 'var(--text)' }}>"Allow Algo Trading"</strong> is checked</li>
            <li>Click <strong style={{ color: 'var(--text)' }}>OK</strong></li>
            <li>The EA icon (smiley face) in the top-right of the chart should be <strong style={{ color: 'var(--lime)' }}>green/smiling</strong></li>
          </ol>

          <InfoBox icon="✅" color="var(--lime)" bg="rgba(163,230,53,0.06)" border="rgba(163,230,53,0.15)">
            Within 10 seconds, your Dashboard will switch from "Waiting for EA Connection" to showing your live account stats.
          </InfoBox>

          <div style={{ marginTop: 12 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: 'var(--muted)' }}>
              <input type="checkbox" checked={checklist.attached} onChange={() => toggleCheck('attached')} style={{ accentColor: 'var(--lime)', width: 15, height: 15 }} />
              EA is attached and running (green smiley in MT5)
            </label>
          </div>
        </Step>

      </div>

      {/* Troubleshooting */}
      <div className="glass anim-fade-up" style={{ borderRadius: 18, padding: 20, marginBottom: 20 }}>
        <h3 style={{
          fontFamily: 'var(--font-display)', fontWeight: 700,
          fontSize: 15, color: 'var(--text)', marginBottom: 14,
        }}>
          🔧 Troubleshooting
        </h3>
        {[
          {
            q: 'Dashboard still shows "Waiting for EA Connection"',
            a: 'Check that the EA is running (green smiley in MT5). Check the MT5 Journal/Experts tab for error messages. Make sure the backend URL is correctly whitelisted.',
          },
          {
            q: 'EA shows error 4014 in MT5 Experts tab',
            a: `URL not whitelisted. Go to Tools → Options → Expert Advisors and add: ${BACKEND_URL}`,
          },
          {
            q: 'EA shows "License inactive" or "active: false"',
            a: 'Your email or account number in the EA inputs does not match what you registered with. Double-check both fields match exactly.',
          },
          {
            q: 'Positions are not being closed when rule is triggered',
            a: 'Make sure "Allow Algo Trading" is enabled in MT5 (green button in the top toolbar). Also check Tools → Options → Expert Advisors → "Allow automated trading".',
          },
          {
            q: 'Rules are not updating from the app',
            a: 'The EA polls the backend every 10 seconds. Wait a few seconds after saving rules and check the MT5 Journal tab to see if the new rules were fetched.',
          },
        ].map((item, i) => (
          <details key={i} style={{ borderBottom: '1px solid var(--border)', padding: '10px 0' }}>
            <summary style={{
              cursor: 'pointer', fontSize: 13, color: 'var(--text)',
              fontWeight: 600, listStyle: 'none', display: 'flex',
              alignItems: 'center', gap: 8,
            }}>
              <span style={{ color: 'var(--gold)' }}>▶</span> {item.q}
            </summary>
            <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 8, lineHeight: 1.7, paddingLeft: 18 }}>
              {item.a}
            </p>
          </details>
        ))}
      </div>

      {/* Support */}
      <div style={{
        borderRadius: 16, padding: 16,
        background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)',
        textAlign: 'center', fontSize: 13, color: 'var(--muted)',
      }}>
        Need help? Contact support at{' '}
        <a href="mailto:support@riskguard.app" style={{ color: 'var(--lime)', textDecoration: 'none' }}>
          support@riskguard.app
        </a>
      </div>

    </div>
  );
}
