import React from 'react';

export default function ContactPage() {
    return (
        <div style={{ maxWidth: '100%', padding: '32px 40px 80px' }}>

            <div style={{ marginBottom: 32 }}>
                <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--dash-text)', marginBottom: 6, letterSpacing: '-0.5px' }}>
                    Get in touch
                </h2>
                <p style={{ fontSize: 13, color: 'var(--dash-muted)', lineHeight: 1.7 }}>
                    Have questions about RiskGuard? We are here to help.<br />
                    Reach out via email or phone — we respond within 24 hours.
                </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
                <a href="mailto:vaibhavnanavare600@gmail.com" style={{
                    background: 'var(--dash-card)', border: '1px solid var(--dash-border)',
                    borderRadius: 14, padding: '18px 20px',
                    display: 'flex', alignItems: 'center', gap: 16,
                    textDecoration: 'none', transition: 'all 0.2s ease', cursor: 'pointer',
                }}
                onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--dash-active-txt)'; }}
                onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--dash-border)'; }}
                >
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--dash-active-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>✉️</div>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--dash-muted)', marginBottom: 3 }}>Email us</div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--dash-text)' }}>vaibhavnanavare600@gmail.com</div>
                        <div style={{ fontSize: 12, color: 'var(--dash-subtext)', marginTop: 2 }}>Typically replies within 24 hours</div>
                    </div>
                    <span style={{ color: 'var(--dash-muted)', fontSize: 16 }}>→</span>
                </a>

                <a href="tel:+919022653325" style={{
                    background: 'var(--dash-card)', border: '1px solid var(--dash-border)',
                    borderRadius: 14, padding: '18px 20px',
                    display: 'flex', alignItems: 'center', gap: 16,
                    textDecoration: 'none', transition: 'all 0.2s ease', cursor: 'pointer',
                }}
                onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--dash-active-txt)'; }}
                onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--dash-border)'; }}
                >
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--dash-active-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>📞</div>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--dash-muted)', marginBottom: 3 }}>Call us</div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--dash-text)' }}>+91 90226 53325</div>
                        <div style={{ fontSize: 12, color: 'var(--dash-subtext)', marginTop: 2 }}>Mon – Sat, 10 AM to 6 PM IST</div>
                    </div>
                    <span style={{ color: 'var(--dash-muted)', fontSize: 16 }}>→</span>
                </a>
            </div>

            <div style={{ height: 1, background: 'var(--dash-divider)', marginBottom: 24 }} />

            <div style={{ background: 'var(--dash-card)', border: '1px solid var(--dash-border)', borderRadius: 14, padding: '20px 22px' }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--dash-text)', marginBottom: 14 }}>Quick answers</div>
                {[
                    { key: 'Response time',  val: 'Within 24 hours' },
                    { key: 'Support hours',  val: 'Mon – Sat, 10 AM – 6 PM IST' },
                    { key: 'Payment issues', val: 'Priority support' },
                    { key: 'EA setup help',  val: 'Included with all plans' },
                ].map((row, i, arr) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: i < arr.length - 1 ? '1px solid var(--dash-divider)' : 'none', fontSize: 13 }}>
                        <span style={{ color: 'var(--dash-muted)' }}>{row.key}</span>
                        <span style={{ color: 'var(--dash-text)', fontWeight: 500 }}>{row.val}</span>
                    </div>
                ))}
            </div>

            <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--dash-muted)', marginTop: 28, lineHeight: 1.8 }}>
                🔒 RiskGuard · Built for individual traders<br />
                Your data is always private and secure
            </p>
        </div>
    );
}