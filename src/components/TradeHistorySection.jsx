// src/components/TradeHistorySection.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector } from 'react-redux';
import api from '../api';

// ── Close reason labels ───────────────────────────────────────────
const REASON_LABEL = {
    SL_HIT: { text: 'Stop loss hit', color: '#FF6B7A', icon: '🔴' },
    TP_HIT: { text: 'Take profit hit', color: '#a3e635', icon: '🟢' },
    MANUAL: { text: 'Closed manually', color: '#94a3b8', icon: '⚪' },
    EA_DAILY_LOSS_LIMIT: { text: 'EA — Daily loss limit', color: '#fb923c', icon: '⚠️' },
    EA_CONSECUTIVE_LOSS: { text: 'EA — Consecutive losses', color: '#fb923c', icon: '⚠️' },
    EA_MAX_TRADES: { text: 'EA — Max trades reached', color: '#fb923c', icon: '⚠️' },
    EA_RULE_CLOSE: { text: 'EA — Rule triggered', color: '#fb923c', icon: '⚠️' },
};

const RULES_LABEL = {
    DAILY_LOSS_LIMIT: 'Daily loss limit exceeded',
    CONSECUTIVE_LOSS: 'Consecutive loss limit hit',
    MAX_TRADES: 'Max trades per day reached',
};

function parseRules(rulesBroken) {
    if (!rulesBroken || rulesBroken === '[]') return [];
    try {
        const parsed = JSON.parse(rulesBroken);
        return Array.isArray(parsed) ? parsed : [];
    } catch { return []; }
}

// ── Live dot indicator ────────────────────────────────────────────
function LiveDot({ lastUpdated }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{
                width: 7, height: 7, borderRadius: '50%',
                background: '#a3e635',
                boxShadow: '0 0 6px #a3e635',
                animation: 'livePulse 2s ease-in-out infinite',
            }} />
            <span style={{ fontSize: 11, color: 'var(--dash-muted)' }}>
                Live · updated {lastUpdated ? lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '—'}
            </span>
            <style>{`
        @keyframes livePulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.35; }
        }
      `}</style>
        </div>
    );
}

// ── Streak badge ──────────────────────────────────────────────────
function StreakBadge({ streak }) {
    if (streak === 0) return null;
    return (
        <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '4px 12px', borderRadius: 20,
            background: 'rgba(251,146,60,0.1)',
            border: '1px solid rgba(251,146,60,0.25)',
            fontSize: 13, fontWeight: 700, color: '#fb923c',
        }}>
            🔥 {streak} day streak
        </div>
    );
}

// ── Mini calendar heatmap (last 28 days) ──────────────────────────
function DisciplineCalendar({ days }) {
    const byDate = {};
    days.forEach(d => { byDate[d.date] = d.disciplined; });

    const cells = [];
    for (let i = 27; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const key = d.toISOString().slice(0, 10);
        cells.push({ key, state: byDate[key] });
    }

    return (
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {cells.map(({ key, state }) => (
                <div key={key} title={key} style={{
                    width: 14, height: 14, borderRadius: 3,
                    background: state === true
                        ? 'rgba(163,230,53,0.7)'
                        : state === false
                            ? 'rgba(255,107,122,0.6)'
                            : 'rgba(255,255,255,0.06)',
                    cursor: 'default',
                }} />
            ))}
        </div>
    );
}

// ── Single trade row ──────────────────────────────────────────────
function TradeRow({ trade }) {
    const reason = REASON_LABEL[trade.closeReason] || { text: trade.closeReason, color: '#94a3b8', icon: '⚪' };
    const rules = parseRules(trade.rulesBroken);
    const profit = parseFloat(trade.profit || 0);
    const isWin = profit >= 0;

    return (
        <div style={{
            padding: '10px 14px', borderRadius: 10, marginBottom: 6,
            background: trade.disciplineBreached ? 'rgba(255,107,122,0.04)' : 'rgba(255,255,255,0.02)',
            border: `1px solid ${trade.disciplineBreached ? 'rgba(255,107,122,0.12)' : 'rgba(255,255,255,0.05)'}`,
        }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{
                        fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 6,
                        background: trade.type === 'BUY' ? 'rgba(163,230,53,0.1)' : 'rgba(255,107,122,0.1)',
                        color: trade.type === 'BUY' ? '#a3e635' : '#FF6B7A',
                    }}>{trade.type}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--dash-text)' }}>{trade.symbol}</span>
                    <span style={{ fontSize: 11, color: 'var(--dash-muted)' }}>#{trade.ticket}</span>
                </div>
                <span style={{ fontSize: 14, fontWeight: 700, color: isWin ? '#a3e635' : '#FF6B7A' }}>
                    {isWin ? '+' : ''}{profit.toFixed(2)}
                </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 11 }}>{reason.icon}</span>
                <span style={{ fontSize: 12, color: reason.color }}>{reason.text}</span>
                <span style={{ fontSize: 11, color: 'var(--dash-muted)', marginLeft: 'auto' }}>
                    {trade.closeTime ? new Date(trade.closeTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                </span>
            </div>

            {rules.length > 0 && (
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
                    {rules.map(r => (
                        <span key={r} style={{
                            fontSize: 11, fontWeight: 600, padding: '2px 10px', borderRadius: 20,
                            background: 'rgba(255,107,122,0.1)',
                            border: '1px solid rgba(255,107,122,0.2)',
                            color: '#FF6B7A',
                        }}>⚠ {RULES_LABEL[r] || r}</span>
                    ))}
                </div>
            )}
        </div>
    );
}

// ── Day group ─────────────────────────────────────────────────────
function DayGroup({ day }) {
    const [open, setOpen] = useState(true);
    const isToday = day.date === new Date().toISOString().slice(0, 10);
    const label = isToday
        ? 'Today'
        : new Date(day.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
    const profit = parseFloat(day.totalProfit || 0);

    return (
        <div style={{ marginBottom: 14 }}>
            <div onClick={() => setOpen(o => !o)} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '10px 14px', borderRadius: 10, cursor: 'pointer',
                background: day.disciplined ? 'rgba(163,230,53,0.06)' : 'rgba(255,107,122,0.06)',
                border: `1px solid ${day.disciplined ? 'rgba(163,230,53,0.2)' : 'rgba(255,107,122,0.2)'}`,
                marginBottom: open ? 8 : 0,
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 16 }}>{day.disciplined ? '✅' : '❌'}</span>
                    <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--dash-text)' }}>{label}</div>
                        <div style={{ fontSize: 11, color: 'var(--dash-muted)' }}>
                            {day.tradesCount} trade{day.tradesCount !== 1 ? 's' : ''} · {day.disciplined ? 'Disciplined' : 'Rules Broken'}
                        </div>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: profit >= 0 ? '#a3e635' : '#FF6B7A' }}>
                        {profit >= 0 ? '+' : ''}{profit.toFixed(2)}
                    </span>
                    <span style={{ fontSize: 12, color: 'var(--dash-muted)', display: 'inline-block', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▾</span>
                </div>
            </div>
            {open && day.trades.map(t => <TradeRow key={t.ticket} trade={t} />)}
        </div>
    );
}

// ── Main component ────────────────────────────────────────────────
export default function TradeHistorySection() {
    const user = useSelector(s => s.auth.user);

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);   // true only on very first load
    const [error, setError] = useState('');
    const [range, setRange] = useState(30);
    const [lastUpdated, setLastUpdated] = useState(null);

    const intervalRef = useRef(null);

    // ── Fetch function — silent refresh after first load ─────────────
    const fetchHistory = useCallback((isInitial = false) => {
        if (!user?.account) return;
        if (isInitial) setLoading(true);

        api.get('/api/trades/history', { params: { account: user.account, days: range } })
            .then(res => {
                setData(res.data);
                setError('');
                setLastUpdated(new Date());
            })
            .catch(() => {
                // On background poll failure, keep stale data — don't wipe the screen
                if (isInitial) setError('Could not load trade history.');
            })
            .finally(() => {
                if (isInitial) setLoading(false);
            });
    }, [user?.account, range]);

    // ── SSE connection + polling fallback ────────────────────────────
    useEffect(() => {
        if (!user?.account) return;

        fetchHistory(true); // immediate fetch on mount

        // ── Primary: SSE push from backend ───────────────────────────
        const es = new EventSource(
            `/api/trades/stream?account=${encodeURIComponent(user.account)}`
        );

        es.addEventListener('trade', () => {
            // Backend pushed a new trade event — refetch silently
            fetchHistory(false);
        });

        es.addEventListener('connected', () => {
            console.log('[SSE] Stream connected');
        });

        es.onerror = () => {
            // EventSource auto-reconnects — no action needed
            // Fallback polling below keeps data fresh during reconnect gap
        };

        // ── Fallback: poll every 60s in case SSE is reconnecting ─────
        // Much less frequent than before because SSE handles real-time updates
        intervalRef.current = setInterval(() => fetchHistory(false), 60_000);

        return () => {
            es.close();
            clearInterval(intervalRef.current);
        };
    }, [fetchHistory]);

    const card = {
        background: 'var(--dash-card)',
        border: '1px solid var(--dash-border)',
        borderRadius: 14,
        padding: '20px 22px',
        marginBottom: 16,
    };

    return (
        <div>
            {/* ── Discipline Stats ── */}
            <div style={card}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
                    <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--dash-text)', marginBottom: 2 }}>
                            Discipline Tracker
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--dash-muted)' }}>
                            {data ? `${data.disciplinedDays} / ${data.totalDays} days disciplined` : '—'}
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                        {data && <StreakBadge streak={data.currentStreak} />}
                        <LiveDot lastUpdated={lastUpdated} />
                    </div>
                </div>

                {data && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 16 }}>
                        {[
                            { label: 'Total Days', value: data.totalDays },
                            { label: 'Disciplined', value: data.disciplinedDays, color: '#a3e635' },
                            { label: 'Rules Broken', value: data.totalDays - data.disciplinedDays, color: '#FF6B7A' },
                        ].map(s => (
                            <div key={s.label} style={{
                                background: 'var(--dash-bg)', border: '1px solid var(--dash-border)',
                                borderRadius: 10, padding: '12px 14px', textAlign: 'center',
                            }}>
                                <div style={{ fontSize: 20, fontWeight: 800, color: s.color || 'var(--dash-text)' }}>{s.value}</div>
                                <div style={{ fontSize: 11, color: 'var(--dash-muted)', marginTop: 2 }}>{s.label}</div>
                            </div>
                        ))}
                    </div>
                )}

                {data?.days && (
                    <>
                        <div style={{ fontSize: 11, color: 'var(--dash-muted)', marginBottom: 8 }}>Last 28 days</div>
                        <DisciplineCalendar days={data.days} />
                        <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                            {[['rgba(163,230,53,0.7)', 'Disciplined'], ['rgba(255,107,122,0.6)', 'Rules broken'], ['rgba(255,255,255,0.06)', 'No trades']].map(([color, label]) => (
                                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--dash-muted)' }}>
                                    <div style={{ width: 10, height: 10, borderRadius: 2, background: color }} />
                                    {label}
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* ── Trade History ── */}
            <div style={card}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--dash-text)' }}>Trade History</div>
                    <div style={{ display: 'flex', gap: 6 }}>
                        {[7, 30, 90].map(d => (
                            <button key={d} onClick={() => setRange(d)} style={{
                                padding: '4px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                                cursor: 'pointer', border: '1px solid var(--dash-border)',
                                background: range === d ? 'var(--dash-text)' : 'transparent',
                                color: range === d ? 'var(--dash-sidebar)' : 'var(--dash-muted)',
                            }}>{d}d</button>
                        ))}
                    </div>
                </div>

                {loading && (
                    <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--dash-muted)', fontSize: 13 }}>
                        Loading…
                    </div>
                )}

                {error && (
                    <div style={{ padding: '10px 14px', background: 'rgba(255,71,87,0.1)', border: '1px solid rgba(255,71,87,0.2)', borderRadius: 10, fontSize: 13, color: '#FF6B7A' }}>
                        {error}
                    </div>
                )}

                {!loading && !error && data?.days?.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--dash-muted)', fontSize: 13 }}>
                        No trades in the last {range} days.
                    </div>
                )}

                {!loading && !error && data?.days?.map(day => (
                    <DayGroup key={day.date} day={day} />
                ))}
            </div>
        </div>
    );
}