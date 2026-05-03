import React, { useState } from 'react';

const LAST_UPDATED = 'April 2025';
const COMPANY = 'RiskGuard';
const EMAIL = 'vaibhavnanavare600@gmail.com';
const PHONE = '+91 90226 53325';

function Section({ title, children }) {
    return (
        <div style={{ marginBottom: 28 }}>
            <h2 style={{ fontSize: 15, fontWeight: 600, color: 'var(--dash-text)', marginBottom: 10, paddingBottom: 8, borderBottom: '1px solid var(--dash-divider)' }}>
                {title}
            </h2>
            <div style={{ fontSize: 13, color: 'var(--dash-muted)', lineHeight: 1.9 }}>
                {children}
            </div>
        </div>
    );
}

function Li({ children }) {
    return (
        <div style={{ display: 'flex', gap: 10, marginBottom: 6 }}>
            <span style={{ color: 'var(--dash-active-txt)', flexShrink: 0, marginTop: 2 }}>•</span>
            <span>{children}</span>
        </div>
    );
}

export default function TermsPage() {
    const [tab, setTab] = useState('terms');

    return (
        <div style={{ maxWidth: '100%', padding: '32px 40px 80px' }}>

            <div style={{ marginBottom: 24 }}>
                <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--dash-text)', marginBottom: 4, letterSpacing: '-0.5px' }}>Legal Documents</h2>
                <p style={{ fontSize: 13, color: 'var(--dash-muted)' }}>Last updated: {LAST_UPDATED}</p>
            </div>

            {/* Tab switcher */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 28, background: 'var(--dash-card)', border: '1px solid var(--dash-border)', borderRadius: 12, padding: 5 }}>
                {[{ id: 'terms', label: 'Terms of Service' }, { id: 'privacy', label: 'Privacy Policy' }].map(t => (
                    <button key={t.id} onClick={() => setTab(t.id)} style={{
                        flex: 1, padding: '9px 12px', borderRadius: 8, border: 'none', cursor: 'pointer',
                        fontSize: 13, fontWeight: 600, transition: 'all 0.2s',
                        background: tab === t.id ? 'var(--dash-active-bg)' : 'transparent',
                        color: tab === t.id ? 'var(--dash-active-txt)' : 'var(--dash-muted)',
                    }}>
                        {t.label}
                    </button>
                ))}
            </div>

            {tab === 'terms' && (
                <div>
                    <Section title="1. Acceptance of Terms">
                        By accessing or using {COMPANY}, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service.
                    </Section>
                    <Section title="2. Description of Service">
                        {COMPANY} is a SaaS platform providing automated risk management tools for MetaTrader 5 traders:
                        <div style={{ marginTop: 8 }}>
                            <Li>A web dashboard to monitor live trading account status</Li>
                            <Li>An Expert Advisor (EA) file for MetaTrader 5</Li>
                            <Li>Automated enforcement of daily risk rules</Li>
                            <Li>Rule configuration via the web dashboard</Li>
                        </div>
                    </Section>
                    <Section title="3. Not Financial Advice">
                        <div style={{ background: 'var(--dash-blocked-bg)', border: '1px solid var(--dash-blocked-br)', borderRadius: 10, padding: '12px 14px', marginBottom: 10, color: 'var(--rose)', fontSize: 13 }}>
                            ⚠️ {COMPANY} is a technical tool only. We do not provide financial advice or investment recommendations.
                        </div>
                        Trading involves significant risk of loss. {COMPANY} helps enforce rules you define — it does not guarantee profits.
                    </Section>
                    <Section title="4. Subscription and Payments">
                        <Li>Subscriptions are billed in advance on a per-plan basis</Li>
                        <Li>All payments are processed securely through Razorpay</Li>
                        <Li>Prices are listed in INR and are inclusive of applicable taxes</Li>
                        <Li>Subscriptions activate immediately upon successful payment</Li>
                    </Section>
                    <Section title="5. Refund Policy">
                        Due to the digital nature of our product, all sales are final. If you experience technical issues, contact us at {EMAIL}.
                    </Section>
                    <Section title="6. Acceptable Use">
                        You agree not to:
                        <div style={{ marginTop: 8 }}>
                            <Li>Share your account credentials with others</Li>
                            <Li>Attempt to reverse-engineer or modify the EA file</Li>
                            <Li>Use the service for any unlawful purpose</Li>
                        </div>
                    </Section>
                    <Section title="7. Limitation of Liability">
                        To the maximum extent permitted by law, {COMPANY} shall not be liable for any indirect, incidental, or consequential damages including trading losses.
                    </Section>
                    <Section title="8. Contact">
                        <Li>Email: {EMAIL}</Li>
                        <Li>Phone: {PHONE}</Li>
                    </Section>
                </div>
            )}

            {tab === 'privacy' && (
                <div>
                    <Section title="1. Information We Collect">
                        <Li>Email address (used for account identification)</Li>
                        <Li>MetaTrader 5 account number</Li>
                        <Li>Trading status data from your MT5 EA (equity, trades, P&L)</Li>
                        <Li>Subscription and payment status</Li>
                    </Section>
                    <Section title="2. How We Use Your Information">
                        <Li>To provide and maintain the {COMPANY} service</Li>
                        <Li>To validate your subscription and enforce risk rules</Li>
                        <Li>To display your live trading dashboard</Li>
                    </Section>
                    <Section title="3. Payment Information">
                        <div style={{ background: 'var(--dash-active-bg)', border: '1px solid var(--dash-border)', borderRadius: 10, padding: '12px 14px', marginBottom: 10, fontSize: 13 }}>
                            🔒 We never store your card, UPI, or banking details. All payment processing is handled by Razorpay.
                        </div>
                    </Section>
                    <Section title="4. Data Storage">
                        Your data is stored on Supabase (PostgreSQL). We retain account data for the subscription duration and up to 90 days after cancellation.
                    </Section>
                    <Section title="5. Data Sharing">
                        We do not sell your information. We share only with:
                        <div style={{ marginTop: 8 }}>
                            <Li>Razorpay — for payment processing</Li>
                            <Li>Supabase — for data storage</Li>
                            <Li>As required by Indian law</Li>
                        </div>
                    </Section>
                    <Section title="6. Your Rights">
                        <Li>Request a copy of your stored data</Li>
                        <Li>Request deletion of your account</Li>
                        <Li>Correct inaccurate information</Li>
                        To exercise these rights contact: {EMAIL}
                    </Section>
                    <Section title="7. Contact">
                        <Li>Email: {EMAIL}</Li>
                        <Li>Phone: {PHONE}</Li>
                    </Section>
                </div>
            )}
        </div>
    );
}