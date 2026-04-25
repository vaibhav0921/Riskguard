import React, { useState } from 'react';

const LAST_UPDATED = 'April 2025';
const COMPANY = 'RiskGuard';
const EMAIL = 'vaibhavnanavare600@gmail.com';
const PHONE = '+91 90226 53325';

function Section({ title, children }) {
    return (
        <div style={{ marginBottom: 32 }}>
            <h2 style={{
                fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700,
                color: 'var(--text)', marginBottom: 12,
                paddingBottom: 8, borderBottom: '1px solid rgba(255,255,255,0.07)',
            }}>
                {title}
            </h2>
            <div style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.9 }}>
                {children}
            </div>
        </div>
    );
}

function Li({ children }) {
    return (
        <div style={{ display: 'flex', gap: 10, marginBottom: 6 }}>
            <span style={{ color: '#a3e635', flexShrink: 0, marginTop: 2 }}>•</span>
            <span>{children}</span>
        </div>
    );
}

export default function TermsPage() {
    const [tab, setTab] = useState('terms');

    return (
        <div style={{ maxWidth: 620, margin: '0 auto', padding: '32px 20px 80px' }}>

            {/* Header */}
            <div className="anim-fade-up d0" style={{ marginBottom: 28 }}>
                <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    background: 'rgba(163,230,53,0.1)', border: '1px solid rgba(163,230,53,0.2)',
                    borderRadius: 20, padding: '4px 12px', fontSize: 11, fontWeight: 600,
                    color: '#a3e635', letterSpacing: '1.5px', textTransform: 'uppercase',
                    marginBottom: 14,
                }}>
                    📄 Legal
                </div>
                <h1 style={{
                    fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800,
                    color: '#f1f5f9', marginBottom: 6,
                }}>
                    Legal Documents
                </h1>
                <p style={{ fontSize: 13, color: '#64748b' }}>
                    Last updated: {LAST_UPDATED}
                </p>
            </div>

            {/* Tab switcher */}
            <div className="anim-fade-up d1" style={{
                display: 'flex', gap: 8, marginBottom: 28,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 14, padding: 5,
            }}>
                {[
                    { id: 'terms', label: '📋 Terms of Service' },
                    { id: 'privacy', label: '🔒 Privacy Policy' },
                ].map(t => (
                    <button
                        key={t.id}
                        onClick={() => setTab(t.id)}
                        style={{
                            flex: 1, padding: '9px 12px', borderRadius: 10,
                            border: 'none', cursor: 'pointer', fontSize: 13,
                            fontFamily: 'var(--font-body)', fontWeight: 600,
                            transition: 'all 0.2s',
                            background: tab === t.id
                                ? 'rgba(163,230,53,0.12)'
                                : 'transparent',
                            color: tab === t.id ? '#a3e635' : '#64748b',
                        }}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            {/* ── TERMS OF SERVICE ── */}
            {tab === 'terms' && (
                <div className="anim-fade-up">

                    <Section title="1. Acceptance of Terms">
                        By accessing or using {COMPANY}, you agree to be bound by these Terms
                        of Service. If you do not agree to these terms, please do not use our service.
                        These terms apply to all users of the platform.
                    </Section>

                    <Section title="2. Description of Service">
                        {COMPANY} is a software-as-a-service (SaaS) platform that provides automated
                        risk management tools for individual MetaTrader 5 traders. The service includes:
                        <div style={{ marginTop: 10 }}>
                            <Li>A web dashboard to monitor live trading account status</Li>
                            <Li>An Expert Advisor (EA) file for MetaTrader 5</Li>
                            <Li>Automated enforcement of daily risk rules (loss limits, trade limits, streak limits)</Li>
                            <Li>Rule configuration via the web dashboard</Li>
                        </div>
                    </Section>

                    <Section title="3. Not Financial Advice">
                        <div style={{
                            background: 'rgba(244,63,94,0.06)',
                            border: '1px solid rgba(244,63,94,0.2)',
                            borderRadius: 10, padding: '12px 14px', marginBottom: 12,
                            color: '#fc8181', fontSize: 13,
                        }}>
                            ⚠️ {COMPANY} is a technical tool only. We do not provide financial advice,
                            investment recommendations, or brokerage services.
                        </div>
                        Trading financial instruments involves significant risk of loss.
                        {COMPANY} helps enforce risk rules you define — it does not guarantee
                        profits or prevent all losses. You are solely responsible for your
                        trading decisions.
                    </Section>

                    <Section title="4. Subscription and Payments">
                        <Li>Subscriptions are billed in advance on a per-plan basis (monthly or multi-month)</Li>
                        <Li>All payments are processed securely through Razorpay</Li>
                        <Li>Prices are listed in INR and are inclusive of applicable taxes</Li>
                        <Li>Subscriptions activate immediately upon successful payment</Li>
                        <Li>We reserve the right to change pricing with 30 days notice</Li>
                    </Section>

                    <Section title="5. Refund Policy">
                        Due to the digital nature of our product, all sales are final. We do not
                        offer refunds once the subscription has been activated and the EA file has
                        been made available for download. If you experience technical issues,
                        please contact us at {EMAIL} and we will do our best to resolve them.
                    </Section>

                    <Section title="6. Acceptable Use">
                        You agree not to:
                        <div style={{ marginTop: 10 }}>
                            <Li>Share your account credentials with others</Li>
                            <Li>Attempt to reverse-engineer or modify the EA file</Li>
                            <Li>Use the service for any unlawful purpose</Li>
                            <Li>Attempt to circumvent subscription validation</Li>
                        </div>
                    </Section>

                    <Section title="7. Service Availability">
                        We strive for maximum uptime but do not guarantee uninterrupted service.
                        The service may be temporarily unavailable due to maintenance, updates,
                        or circumstances beyond our control. We are not liable for any losses
                        incurred during service downtime.
                    </Section>

                    <Section title="8. Termination">
                        We reserve the right to suspend or terminate your account if you violate
                        these terms. Upon termination, your access to the service will cease
                        immediately. No refund will be issued for the remaining subscription period
                        in cases of termination due to violation.
                    </Section>

                    <Section title="9. Limitation of Liability">
                        To the maximum extent permitted by applicable law, {COMPANY} shall not be
                        liable for any indirect, incidental, special, or consequential damages
                        arising from your use of the service, including but not limited to trading
                        losses, loss of profits, or data loss.
                    </Section>

                    <Section title="10. Governing Law">
                        These terms are governed by the laws of India. Any disputes shall be
                        subject to the exclusive jurisdiction of the courts of India.
                    </Section>

                    <Section title="11. Contact">
                        For questions about these terms, contact us at:
                        <div style={{ marginTop: 10 }}>
                            <Li>Email: {EMAIL}</Li>
                            <Li>Phone: {PHONE}</Li>
                        </div>
                    </Section>

                </div>
            )}

            {/* ── PRIVACY POLICY ── */}
            {tab === 'privacy' && (
                <div className="anim-fade-up">

                    <Section title="1. Information We Collect">
                        We collect the following information when you use {COMPANY}:
                        <div style={{ marginTop: 10 }}>
                            <Li>Email address (used for account identification)</Li>
                            <Li>MetaTrader 5 account number (used to link EA data)</Li>
                            <Li>Trading status data sent by your MT5 EA (equity, trades, P&L percentages)</Li>
                            <Li>Subscription and payment status (we do not store card details)</Li>
                        </div>
                    </Section>

                    <Section title="2. How We Use Your Information">
                        <Li>To provide and maintain the {COMPANY} service</Li>
                        <Li>To validate your subscription and enforce risk rules</Li>
                        <Li>To display your live trading dashboard</Li>
                        <Li>To send important service updates (no marketing emails)</Li>
                    </Section>

                    <Section title="3. Payment Information">
                        <div style={{
                            background: 'rgba(163,230,53,0.05)',
                            border: '1px solid rgba(163,230,53,0.15)',
                            borderRadius: 10, padding: '12px 14px', marginBottom: 12,
                            fontSize: 13,
                        }}>
                            🔒 We never store your card, UPI, or banking details. All payment
                            processing is handled by Razorpay under their PCI DSS compliance.
                        </div>
                        We only receive a payment confirmation status from Razorpay — no
                        financial credentials are stored on our servers.
                    </Section>

                    <Section title="4. Data Storage">
                        Your data is stored on Supabase (PostgreSQL), a secure cloud database
                        provider. We retain your account data for the duration of your subscription
                        and for up to 90 days after cancellation.
                    </Section>

                    <Section title="5. Data Sharing">
                        We do not sell, trade, or share your personal information with third
                        parties except:
                        <div style={{ marginTop: 10 }}>
                            <Li>Razorpay — for payment processing</Li>
                            <Li>Supabase — for data storage</Li>
                            <Li>As required by Indian law or court order</Li>
                        </div>
                    </Section>

                    <Section title="6. MT5 Trading Data">
                        The EA installed on your MetaTrader 5 sends account data (equity, trade
                        count, loss percentage) to our servers. This data is:
                        <div style={{ marginTop: 10 }}>
                            <Li>Used only to display your dashboard and enforce your rules</Li>
                            <Li>Never shared with any third party</Li>
                            <Li>Not used for any analysis or advertising purposes</Li>
                        </div>
                    </Section>

                    <Section title="7. Cookies">
                        We use browser localStorage to store your session (email and account number)
                        so you don't have to log in every visit. We do not use advertising cookies
                        or third-party tracking cookies.
                    </Section>

                    <Section title="8. Your Rights">
                        You have the right to:
                        <div style={{ marginTop: 10 }}>
                            <Li>Request a copy of your stored data</Li>
                            <Li>Request deletion of your account and data</Li>
                            <Li>Correct inaccurate information</Li>
                        </div>
                        To exercise these rights, contact us at {EMAIL}.
                    </Section>

                    <Section title="9. Security">
                        We implement industry-standard security measures including SSL encryption
                        for all data in transit and secure database access controls. However, no
                        internet transmission is 100% secure — use the service at your own risk.
                    </Section>

                    <Section title="10. Changes to This Policy">
                        We may update this Privacy Policy from time to time. We will notify users
                        of significant changes via the email address on file. Continued use of the
                        service after changes constitutes acceptance of the updated policy.
                    </Section>

                    <Section title="11. Contact">
                        For privacy-related questions or data requests:
                        <div style={{ marginTop: 10 }}>
                            <Li>Email: {EMAIL}</Li>
                            <Li>Phone: {PHONE}</Li>
                        </div>
                    </Section>

                </div>
            )}

        </div>
    );
}