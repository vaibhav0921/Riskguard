// src/pages/AffiliatePage.jsx
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import api from '../api';
import Spinner from '../components/Spinner';

export default function AffiliatePage() {
  const user = useSelector(s => s.auth.user);
  const [isAffiliate, setIsAffiliate] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [copied, setCopied] = useState(false);
  const [upiInput, setUpiInput] = useState('');
  const [payoutAmount, setPayoutAmount] = useState('');
  const [payoutMsg, setPayoutMsg] = useState('');
  const [savingUpi, setSavingUpi] = useState(false);
  const [requestingPayout, setRequestingPayout] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const statusRes = await api.get(`/api/affiliate/status?email=${encodeURIComponent(user.email)}`);
      setIsAffiliate(statusRes.data.isAffiliate);
      if (statusRes.data.isAffiliate) {
        const dash = await api.get(`/api/affiliate/me?email=${encodeURIComponent(user.email)}`);
        setDashboard(dash.data);
        setUpiInput(dash.data.upiId || '');
      }
    } catch (e) {
      setIsAffiliate(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (user?.email) load(); }, [user?.email]);

  const handleJoin = async () => {
    setJoining(true);
    try {
      await api.post('/api/affiliate/join', { email: user.email, name: user.email.split('@')[0] });
      await load();
    } catch (e) {
      alert('Failed to join. Please try again.');
    } finally {
      setJoining(false);
    }
  };

  const handleCopy = () => {
    if (dashboard?.referralLink) {
      navigator.clipboard.writeText(dashboard.referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSaveUpi = async () => {
    setSavingUpi(true);
    try {
      await api.post('/api/affiliate/save-upi', { email: user.email, upiId: upiInput });
      setPayoutMsg('UPI ID saved!');
      setTimeout(() => setPayoutMsg(''), 3000);
    } catch (e) {
      setPayoutMsg('Failed to save.');
    } finally {
      setSavingUpi(false);
    }
  };

  const handleRequestPayout = async () => {
    if (!upiInput.trim()) { setPayoutMsg('Please save your UPI ID first.'); return; }
    const amt = parseFloat(payoutAmount);
    if (!amt || amt < 500) { setPayoutMsg('Minimum payout is ₹500.'); return; }
    setRequestingPayout(true);
    try {
      await api.post('/api/affiliate/request-payout', {
        email: user.email, upiId: upiInput, amount: amt,
      });
      setPayoutMsg('Payout requested! We\'ll transfer within 3–5 business days.');
      setPayoutAmount('');
      await load();
    } catch (e) {
      setPayoutMsg(e.response?.data?.message || 'Failed to request payout.');
    } finally {
      setRequestingPayout(false);
    }
  };

  const pad = 'clamp(16px, 4vw, 40px)';
  const card = {
    background: 'var(--dash-card)', border: '1px solid var(--dash-border)',
    borderRadius: 14, padding: '20px 22px', marginBottom: 16,
    transition: 'background 0.25s ease',
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 12 }}>
      <Spinner large />
    </div>
  );

  if (!isAffiliate) return (
    <div style={{ padding: pad, paddingTop: 32, paddingBottom: 60 }}>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--dash-text)', marginBottom: 6 }}>
          Affiliate Program
        </h2>
        <p style={{ fontSize: 13, color: 'var(--dash-muted)' }}>
          Earn 20% commission on every referral you convert.
        </p>
      </div>

      <div style={{ ...card, background: 'rgba(163,230,53,0.04)', borderColor: 'rgba(163,230,53,0.2)', marginBottom: 24 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--dash-text)', marginBottom: 14 }}>
          💰 How it works
        </h3>
        {[
          { icon: '🔗', text: 'Get your unique referral link' },
          { icon: '📢', text: 'Share it with other traders' },
          { icon: '💵', text: 'Earn 20% on every sale they make' },
          { icon: '📲', text: 'Withdraw via UPI when you hit ₹500' },
        ].map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '10px 0', borderBottom: i < 3 ? '1px solid var(--dash-divider)' : 'none' }}>
            <span style={{ fontSize: 20, flexShrink: 0 }}>{item.icon}</span>
            <span style={{ fontSize: 14, color: 'var(--dash-text)' }}>{item.text}</span>
          </div>
        ))}
      </div>

      <div style={{ ...card, marginBottom: 24 }}>
        <div style={{ fontSize: 13, color: 'var(--dash-muted)', marginBottom: 14 }}>Commission structure</div>
        {[
          { plan: 'Basic (₹799)', commission: '₹159.80' },
          { plan: 'Pro (₹1,399)', commission: '₹279.80' },
          { plan: 'Advanced (₹1,999)', commission: '₹399.80' },
        ].map((row, i, arr) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderBottom: i < arr.length - 1 ? '1px solid var(--dash-divider)' : 'none', fontSize: 13 }}>
            <span style={{ color: 'var(--dash-text)' }}>{row.plan}</span>
            <span style={{ color: 'var(--lime)', fontWeight: 700 }}>{row.commission}</span>
          </div>
        ))}
      </div>

      <button
        onClick={handleJoin}
        disabled={joining}
        style={{ width: '100%', padding: '14px', borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: joining ? 'default' : 'pointer', background: 'var(--dash-text)', color: 'var(--dash-sidebar)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
      >
        {joining ? <><Spinner /> Joining...</> : '🚀 Become an Affiliate'}
      </button>
    </div>
  );

  const pending = parseFloat(dashboard?.pendingEarnings || 0);

  return (
    <div style={{ padding: pad, paddingTop: 32, paddingBottom: 60 }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--dash-text)', marginBottom: 4 }}>
          Affiliate Dashboard
        </h2>
        <p style={{ fontSize: 13, color: 'var(--dash-muted)' }}>
          Your referral code: <strong style={{ color: 'var(--dash-text)' }}>{dashboard?.referralCode}</strong>
        </p>
      </div>

      {/* Referral link */}
      <div style={{ ...card, background: 'rgba(0,212,255,0.04)', borderColor: 'rgba(0,212,255,0.2)' }}>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '1.2px', textTransform: 'uppercase', color: 'rgba(0,212,255,0.7)', marginBottom: 10 }}>Your Referral Link</div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 0, background: 'var(--dash-bg)', border: '1px solid var(--dash-border)', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: 'var(--dash-text)', wordBreak: 'break-all' }}>
            {dashboard?.referralLink}
          </div>
          <button
            onClick={handleCopy}
            style={{ padding: '10px 18px', borderRadius: 8, border: 'none', cursor: 'pointer', background: copied ? 'var(--lime)' : 'var(--dash-text)', color: copied ? '#0d0f14' : 'var(--dash-sidebar)', fontSize: 13, fontWeight: 600, flexShrink: 0, transition: 'all 0.2s' }}
          >
            {copied ? '✓ Copied!' : 'Copy'}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 16 }}>
        {[
          { label: 'Total Clicks', value: dashboard?.totalReferrals ?? 0 },
          { label: 'Conversions', value: dashboard?.totalConversions ?? 0 },
          { label: 'Total Earned', value: `₹${parseFloat(dashboard?.totalEarnings || 0).toFixed(2)}` },
          { label: 'Paid Out', value: `₹${parseFloat(dashboard?.paidEarnings || 0).toFixed(2)}` },
        ].map((s, i) => (
          <div key={i} style={{ background: 'var(--dash-card)', border: '1px solid var(--dash-border)', borderRadius: 12, padding: '16px' }}>
            <div style={{ fontSize: 11, color: 'var(--dash-muted)', marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--dash-text)' }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Pending earnings */}
      <div style={{ ...card, background: pending >= 500 ? 'rgba(163,230,53,0.06)' : undefined, borderColor: pending >= 500 ? 'rgba(163,230,53,0.25)' : undefined }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <div style={{ fontSize: 13, color: 'var(--dash-muted)' }}>Pending Earnings</div>
          {pending < 500 && <div style={{ fontSize: 11, color: 'var(--dash-muted)' }}>₹{(500 - pending).toFixed(0)} more to unlock payout</div>}
        </div>
        <div style={{ fontSize: 32, fontWeight: 800, color: pending >= 500 ? 'var(--lime)' : 'var(--dash-text)', marginBottom: 4 }}>
          ₹{pending.toFixed(2)}
        </div>
        <div style={{ height: 4, borderRadius: 2, background: 'var(--dash-border)', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${Math.min(100, (pending / 500) * 100)}%`, background: 'var(--lime)', borderRadius: 2 }} />
        </div>
      </div>

      {/* UPI */}
      <div style={{ ...card }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--dash-text)', marginBottom: 12 }}>UPI ID for Payouts</div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <input
            type="text"
            className="input-field"
            placeholder="yourname@upi"
            value={upiInput}
            onChange={e => setUpiInput(e.target.value)}
            style={{ flex: 1, minWidth: 0 }}
          />
          <button
            onClick={handleSaveUpi}
            disabled={savingUpi}
            style={{ padding: '10px 18px', borderRadius: 8, border: '1px solid var(--dash-border)', cursor: 'pointer', background: 'var(--dash-text)', color: 'var(--dash-sidebar)', fontSize: 13, fontWeight: 600, flexShrink: 0 }}
          >
            {savingUpi ? <Spinner /> : 'Save'}
          </button>
        </div>
      </div>

      {/* Request payout */}
      <div style={{ ...card }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--dash-text)', marginBottom: 12 }}>Request Payout</div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 12 }}>
          <input
            type="number"
            className="input-field"
            placeholder="Amount (min ₹500)"
            value={payoutAmount}
            onChange={e => setPayoutAmount(e.target.value)}
            min={500}
            max={pending}
            style={{ flex: 1, minWidth: 0 }}
          />
          <button
            onClick={handleRequestPayout}
            disabled={requestingPayout || pending < 500}
            style={{ padding: '10px 18px', borderRadius: 8, border: 'none', cursor: pending >= 500 ? 'pointer' : 'not-allowed', background: pending >= 500 ? 'var(--lime)' : 'var(--dash-border)', color: pending >= 500 ? '#0d0f14' : 'var(--dash-muted)', fontSize: 13, fontWeight: 600, flexShrink: 0, opacity: requestingPayout ? 0.7 : 1 }}
          >
            {requestingPayout ? <Spinner /> : 'Request'}
          </button>
        </div>
        {payoutMsg && (
          <div style={{ fontSize: 13, color: payoutMsg.includes('Failed') || payoutMsg.includes('Minimum') ? 'var(--rose)' : 'var(--lime)', padding: '8px 12px', background: 'var(--dash-bg)', borderRadius: 8 }}>
            {payoutMsg}
          </div>
        )}
      </div>

      {/* Payout history */}
      {dashboard?.payoutHistory?.length > 0 && (
        <div style={{ ...card }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--dash-text)', marginBottom: 12 }}>Payout History</div>
          {dashboard.payoutHistory.map((p, i, arr) => (
            <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: i < arr.length - 1 ? '1px solid var(--dash-divider)' : 'none', fontSize: 13, gap: 8, flexWrap: 'wrap' }}>
              <div>
                <div style={{ color: 'var(--dash-text)', fontWeight: 600 }}>₹{parseFloat(p.amount).toFixed(2)}</div>
                <div style={{ color: 'var(--dash-muted)', fontSize: 11 }}>{p.requestedAt?.slice(0, 10)}</div>
              </div>
              <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: p.status === 'PAID' ? 'rgba(163,230,53,0.1)' : 'rgba(251,191,36,0.1)', color: p.status === 'PAID' ? 'var(--lime)' : 'var(--gold)', border: `1px solid ${p.status === 'PAID' ? 'rgba(163,230,53,0.2)' : 'rgba(251,191,36,0.2)'}` }}>
                {p.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}