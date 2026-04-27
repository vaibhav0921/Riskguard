import { useState, useEffect, useRef } from "react";

const NAV_LINKS = [
    { label: "Features", id: "features" },
    { label: "How it works", id: "how-it-works" },
    { label: "Pricing", id: "pricing" },
];

const PROBLEMS = [
    { icon: "⚡", color: "#FF6B35", bg: "rgba(255,107,53,0.1)", title: "Revenge trading", desc: "One loss triggers emotional decisions that spiral into catastrophic drawdowns." },
    { icon: "📊", color: "#F7C948", bg: "rgba(247,201,72,0.1)", title: "Overtrading", desc: "Chasing setups all day wipes weekly gains in a single reckless session." },
    { icon: "💀", color: "#FF4757", bg: "rgba(255,71,87,0.1)", title: "No hard stops", desc: "Without enforced limits, one bad day destroys months of disciplined work." },
];

const FEATURES = [
    { num: "01", title: "Consecutive loss limit", desc: "Set exactly how many losses in a row are allowed. The EA halts all trading the moment you hit the threshold — no exceptions." },
    { num: "02", title: "Daily loss limit", desc: "Define a maximum equity drawdown percentage per day. When breached, positions close and trading locks until midnight reset." },
    { num: "03", title: "Max trades per day", desc: "Hard cap on daily trade count. Your edge only works when you're selective. RiskGuard keeps you selective automatically." },
];

const STEPS = [
    { n: "1", title: "Sign up & choose plan", desc: "Create your account in under 2 minutes. Pick the plan that fits your account size." },
    { n: "2", title: "Set your rules", desc: "Define your risk limits on the dashboard. Change them anytime — updates reflect in EA within 10 seconds." },
    { n: "3", title: "Connect the EA", desc: "Download the compiled .ex5 file. Attach to any MT5 chart. Protection activates instantly." },
];

const FEATURES_ALL = [
    "All 3 risk rules",
    "1 MT5 account",
    "Dashboard access",
    "Real-time rule sync",
    "Daily auto-reset",
    "Email support",
];

const PLANS = [
    { name: "Basic", price: "₹799", period: "/ 1 month", desc: "Try RiskGuard for a month and start trading with discipline.", duration: "1 month", popular: false },
    { name: "Pro", price: "₹1399", period: "/ 2 months", desc: "Best value for traders committed to protecting their account.", duration: "2 months", popular: true },
    { name: "Advanced", price: "₹1999", period: "/ 6 months", desc: "Maximum savings for serious long-term traders.", duration: "6 months", popular: false },
];

function useInView(threshold = 0.15) {
    const ref = useRef(null);
    const [inView, setInView] = useState(false);
    useEffect(() => {
        const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, []);
    return [ref, inView];
}

function Navbar({ onCTA }) {
    const [scrolled, setScrolled] = useState(false);
    useEffect(() => {
        const fn = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", fn);
        return () => window.removeEventListener("scroll", fn);
    }, []);
    return (
        <nav style={{
            position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
            padding: "0 48px",
            height: "64px",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            background: scrolled ? "rgba(4,8,20,0.95)" : "transparent",
            backdropFilter: scrolled ? "blur(12px)" : "none",
            borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
            transition: "all 0.3s ease",
        }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{ width: "28px", height: "28px", background: "linear-gradient(135deg, #00D4FF, #0099CC)", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1L13 4V10L7 13L1 10V4L7 1Z" stroke="white" strokeWidth="1.5" fill="none" /><circle cx="7" cy="7" r="2" fill="white" /></svg>
                </div>
                <span style={{ fontSize: "16px", fontWeight: "700", color: "#fff", fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: "-0.3px" }}>RiskGuard</span>
            </div>
            <div style={{ display: "flex", gap: "36px" }}>
                {NAV_LINKS.map(l => (
                    <span key={l.label}
                        onClick={() => document.getElementById(l.id)?.scrollIntoView({ behavior: "smooth" })}
                        style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", cursor: "pointer", transition: "color 0.2s", letterSpacing: "0.2px" }}
                        onMouseEnter={e => e.target.style.color = "#fff"}
                        onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.5)"}
                    >{l.label}</span>
                ))}
            </div>
            <button onClick={onCTA} style={{
                background: "linear-gradient(135deg, #00D4FF, #0077AA)",
                color: "white", border: "none", padding: "9px 22px",
                borderRadius: "8px", fontSize: "13px", fontWeight: "600",
                cursor: "pointer", letterSpacing: "0.2px",
            }}>Get Started →</button>
        </nav>
    );
}

function Hero({ onCTA }) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => { setTimeout(() => setMounted(true), 100); }, []);

    return (
        <section style={{
            minHeight: "100vh",
            background: "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(0,180,255,0.12) 0%, transparent 60%), #040814",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            padding: "100px 48px 60px",
            position: "relative", overflow: "hidden",
        }}>
            {/* Grid */}
            <div style={{
                position: "absolute", inset: 0,
                backgroundImage: "linear-gradient(rgba(0,180,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,180,255,0.04) 1px, transparent 1px)",
                backgroundSize: "60px 60px",
            }} />
            {/* Orbs */}
            <div style={{ position: "absolute", top: "20%", left: "10%", width: "300px", height: "300px", background: "radial-gradient(circle, rgba(0,180,255,0.06) 0%, transparent 70%)", borderRadius: "50%" }} />
            <div style={{ position: "absolute", bottom: "20%", right: "10%", width: "250px", height: "250px", background: "radial-gradient(circle, rgba(0,120,200,0.06) 0%, transparent 70%)", borderRadius: "50%" }} />

            <div style={{ position: "relative", textAlign: "center", maxWidth: "780px" }}>
                <div style={{
                    display: "inline-flex", alignItems: "center", gap: "8px",
                    background: "rgba(0,180,255,0.08)", border: "1px solid rgba(0,180,255,0.2)",
                    borderRadius: "20px", padding: "6px 16px", marginBottom: "32px",
                    opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(16px)",
                    transition: "all 0.6s ease",
                }}>
                    <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#00D4FF", animation: "pulse 2s infinite" }} />
                    <span style={{ fontSize: "12px", color: "#00D4FF", fontWeight: "500", letterSpacing: "0.5px" }}>LIVE — EA monitoring 24/7</span>
                </div>

                <h1 style={{
                    fontSize: "52px", fontWeight: "800", lineHeight: "1.25",
                    color: "#ffffff", fontFamily: "'Plus Jakarta Sans', sans-serif",
                    letterSpacing: "-2px", marginBottom: "24px",
                    opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(24px)",
                    transition: "all 0.7s ease 0.1s",
                }}>
                    Stop losing money<br />
                    <span style={{ background: "linear-gradient(135deg, #00D4FF, #0099CC)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                        to yourself.
                    </span>
                </h1>

                <p style={{
                    fontSize: "16px", color: "rgba(255,255,255,0.5)", lineHeight: "1.8",
                    marginBottom: "40px", maxWidth: "520px", margin: "0 auto 40px",
                    opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(24px)",
                    transition: "all 0.7s ease 0.2s",
                }}>
                    RiskGuard enforces your trading rules automatically on MetaTrader 5. No emotions. No excuses. Just discipline.
                </p>

                <div style={{
                    display: "flex", gap: "12px", justifyContent: "center", marginBottom: "64px",
                    opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(24px)",
                    transition: "all 0.7s ease 0.3s",
                }}>
                    <button onClick={onCTA} style={{
                        background: "linear-gradient(135deg, #00D4FF, #0077AA)",
                        color: "white", border: "none", padding: "15px 36px",
                        borderRadius: "10px", fontSize: "15px", fontWeight: "600",
                        cursor: "pointer", letterSpacing: "0.2px",
                    }}>Start protecting my account →</button>
                    <button onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })} style={{
                        background: "transparent", color: "rgba(255,255,255,0.7)",
                        border: "1px solid rgba(255,255,255,0.12)", padding: "15px 28px",
                        borderRadius: "10px", fontSize: "15px", cursor: "pointer",
                    }}>See how it works</button>
                </div>

                <div style={{
                    display: "flex", gap: "48px", justifyContent: "center",
                    opacity: mounted ? 1 : 0, transition: "all 0.7s ease 0.4s",
                }}>
                    {[["500+", "Active traders"], ["₹0", "Lost to EA bugs"], ["10s", "Rule sync speed"]].map(([n, l]) => (
                        <div key={l} style={{ textAlign: "center" }}>
                            <div style={{ fontSize: "22px", fontWeight: "700", color: "#fff", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{n}</div>
                            <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)", marginTop: "4px", letterSpacing: "0.3px" }}>{l}</div>
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
      `}</style>
        </section>
    );
}

function Problems() {
    const [ref, inView] = useInView();
    return (
        <section ref={ref} style={{ padding: "80px 48px", background: "#060c1c" }}>
            <div style={{ maxWidth: "960px", margin: "0 auto" }}>
                <div style={{ marginBottom: "56px" }}>
                    <div style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "3px", color: "#00D4FF", marginBottom: "12px", textTransform: "uppercase" }}>The problem</div>
                    <h2 style={{ fontSize: "34px", fontWeight: "800", color: "#fff", fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: "-0.5px", lineHeight: "1.3" }}>
                        You already know the rules.<br /><span style={{ color: "rgba(255,255,255,0.3)" }}>You just can't follow them.</span>
                    </h2>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "20px" }}>
                    {PROBLEMS.map((p, i) => (
                        <div key={p.title} style={{
                            background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
                            borderRadius: "16px", padding: "32px 28px",
                            opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(32px)",
                            transition: `all 0.6s ease ${i * 0.1}s`,
                        }}>
                            <div style={{ width: "48px", height: "48px", background: p.bg, borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", marginBottom: "20px" }}>{p.icon}</div>
                            <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#fff", marginBottom: "10px", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{p.title}</h3>
                            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)", lineHeight: "1.7" }}>{p.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function Features() {
    const [ref, inView] = useInView();
    return (
        <section id="features" ref={ref} style={{ padding: "80px 48px", background: "#040814", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
            <div style={{ maxWidth: "960px", margin: "0 auto" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "start" }}>
                    <div>
                        <div style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "3px", color: "#00D4FF", marginBottom: "12px", textTransform: "uppercase" }}>Features</div>
                        <h2 style={{ fontSize: "42px", fontWeight: "800", color: "#fff", fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: "-1px", lineHeight: "1.1", marginBottom: "20px" }}>
                            Three rules.<br />Total control.
                        </h2>
                        <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.4)", lineHeight: "1.8" }}>
                            RiskGuard's EA monitors your MT5 account every 10 seconds, enforcing rules you define from the dashboard. Change limits anytime — the EA syncs within seconds.
                        </p>
                        <div style={{ marginTop: "32px", padding: "20px 24px", background: "rgba(0,212,255,0.05)", border: "1px solid rgba(0,212,255,0.15)", borderRadius: "12px" }}>
                            <div style={{ fontSize: "12px", color: "#00D4FF", fontWeight: "600", marginBottom: "6px", letterSpacing: "0.5px" }}>DAILY AUTO-RESET</div>
                            <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.5)", lineHeight: "1.6" }}>All counters reset automatically at midnight IST. Every day starts fresh.</div>
                        </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        {FEATURES.map((f, i) => (
                            <div key={f.num} style={{
                                background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
                                borderRadius: "14px", padding: "24px 28px",
                                opacity: inView ? 1 : 0, transform: inView ? "translateX(0)" : "translateX(32px)",
                                transition: `all 0.6s ease ${i * 0.12}s`,
                            }}>
                                <div style={{ fontSize: "11px", fontWeight: "700", color: "#00D4FF", letterSpacing: "2px", marginBottom: "10px" }}>RULE {f.num}</div>
                                <div style={{ fontSize: "14px", fontWeight: "700", color: "#fff", marginBottom: "8px", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{f.title}</div>
                                <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", lineHeight: "1.65" }}>{f.desc}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

function HowItWorks() {
    const [ref, inView] = useInView();
    return (
        <section id="how-it-works" ref={ref} style={{ padding: "80px 48px", background: "#060c1c" }}>
            <div style={{ maxWidth: "960px", margin: "0 auto", textAlign: "center" }}>
                <div style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "3px", color: "#00D4FF", marginBottom: "12px", textTransform: "uppercase" }}>How it works</div>
                <h2 style={{ fontSize: "34px", fontWeight: "800", color: "#fff", fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: "-0.5px", marginBottom: "16px" }}>Up and running in 3 steps</h2>
                <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.4)", marginBottom: "64px" }}>No coding. Works with any MT5 broker worldwide.</p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "24px", position: "relative" }}>
                    <div style={{ position: "absolute", top: "32px", left: "calc(16% + 32px)", right: "calc(16% + 32px)", height: "1px", background: "linear-gradient(90deg, rgba(0,212,255,0.3), rgba(0,212,255,0.1), rgba(0,212,255,0.3))" }} />
                    {STEPS.map((s, i) => (
                        <div key={s.n} style={{
                            opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(28px)",
                            transition: `all 0.6s ease ${i * 0.15}s`,
                        }}>
                            <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "linear-gradient(135deg, rgba(0,212,255,0.2), rgba(0,120,200,0.1))", border: "1px solid rgba(0,212,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", fontSize: "20px", fontWeight: "800", color: "#00D4FF", fontFamily: "'Plus Jakarta Sans', sans-serif", position: "relative", zIndex: 1 }}>{s.n}</div>
                            <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#fff", marginBottom: "10px", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{s.title}</h3>
                            <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", lineHeight: "1.7" }}>{s.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function Pricing({ onCTA }) {
    const [ref, inView] = useInView();
    return (
        <section id="pricing" ref={ref} style={{ padding: "80px 48px", background: "#040814" }}>
            <div style={{ maxWidth: "960px", margin: "0 auto", textAlign: "center" }}>
                <div style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "3px", color: "#00D4FF", marginBottom: "12px", textTransform: "uppercase" }}>Pricing</div>
                <h2 style={{ fontSize: "34px", fontWeight: "800", color: "#fff", fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: "-0.5px", marginBottom: "16px" }}>Simple pricing. No surprises.</h2>
                <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.4)", marginBottom: "56px" }}>Cancel anytime. Start protecting your account today.</p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "20px" }}>
                    {PLANS.map((plan, i) => (
                        <div key={plan.name} style={{
                            background: plan.popular ? "rgba(0,212,255,0.04)" : "rgba(255,255,255,0.02)",
                            border: plan.popular ? "1px solid rgba(0,212,255,0.25)" : "1px solid rgba(255,255,255,0.06)",
                            borderRadius: "20px", padding: "36px 28px",
                            position: "relative",
                            opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(28px)",
                            transition: `all 0.6s ease ${i * 0.1}s`,
                        }}>
                            {plan.popular && (
                                <div style={{ position: "absolute", top: "-12px", left: "50%", transform: "translateX(-50%)", background: "linear-gradient(135deg, #00D4FF, #0077AA)", color: "white", fontSize: "11px", fontWeight: "700", padding: "4px 16px", borderRadius: "20px", letterSpacing: "0.5px", whiteSpace: "nowrap" }}>MOST POPULAR</div>
                            )}
                            <div style={{ fontSize: "12px", fontWeight: "700", color: "#00D4FF", letterSpacing: "2px", marginBottom: "16px", textTransform: "uppercase" }}>{plan.name}</div>
                            <div style={{ display: "flex", alignItems: "baseline", gap: "4px", marginBottom: "8px" }}>
                                <span style={{ fontSize: "36px", fontWeight: "800", color: "#fff", fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: "-0.5px" }}>{plan.price}</span>
                                <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.35)" }}>{plan.period}</span>
                            </div>
                            <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.35)", marginBottom: "24px", lineHeight: "1.6" }}>{plan.desc}</p>
                            <div style={{ height: "1px", background: "rgba(255,255,255,0.06)", marginBottom: "24px" }} />
                            {FEATURES_ALL.map(f => (
                                <div key={f} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "7px 0", fontSize: "13px", color: "rgba(255,255,255,0.55)" }}>
                                    <span style={{ color: "#00D4FF", fontSize: "14px" }}>✓</span>{f}
                                </div>
                            ))}
                            <button onClick={onCTA} style={{
                                width: "100%", marginTop: "24px", padding: "13px",
                                borderRadius: "10px", fontSize: "14px", fontWeight: "600",
                                cursor: "pointer", letterSpacing: "0.2px",
                                background: plan.popular ? "linear-gradient(135deg, #00D4FF, #0077AA)" : "transparent",
                                color: plan.popular ? "white" : "rgba(255,255,255,0.6)",
                                border: plan.popular ? "none" : "1px solid rgba(255,255,255,0.12)",
                            }}>Get {plan.name} →</button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function CTA({ onCTA }) {
    const [ref, inView] = useInView();
    return (
        <section ref={ref} style={{
            padding: "80px 48px",
            background: "radial-gradient(ellipse 80% 80% at 50% 50%, rgba(0,150,220,0.12) 0%, transparent 70%), #040814",
            textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.04)",
        }}>
            <div style={{
                opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(28px)",
                transition: "all 0.7s ease",
            }}>
                <h2 style={{ fontSize: "38px", fontWeight: "800", color: "#fff", fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: "-0.5px", marginBottom: "16px", lineHeight: "1.3" }}>
                    Ready to trade<br />
                    <span style={{ background: "linear-gradient(135deg, #00D4FF, #0077AA)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>with discipline?</span>
                </h2>
                <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.4)", marginBottom: "40px" }}>Join hundreds of traders protecting their accounts with RiskGuard.</p>
                <button onClick={onCTA} style={{
                    background: "linear-gradient(135deg, #00D4FF, #0077AA)",
                    color: "white", border: "none", padding: "17px 44px",
                    borderRadius: "12px", fontSize: "16px", fontWeight: "600",
                    cursor: "pointer", letterSpacing: "0.2px",
                }}>Start protecting my account →</button>
            </div>
        </section>
    );
}

function Footer() {
    return (
        <footer style={{ padding: "32px 48px", background: "#040814", borderTop: "1px solid rgba(255,255,255,0.04)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{ width: "22px", height: "22px", background: "linear-gradient(135deg, #00D4FF, #0099CC)", borderRadius: "5px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="11" height="11" viewBox="0 0 14 14" fill="none"><path d="M7 1L13 4V10L7 13L1 10V4L7 1Z" stroke="white" strokeWidth="1.5" fill="none" /><circle cx="7" cy="7" r="2" fill="white" /></svg>
                </div>
                <span style={{ fontSize: "14px", fontWeight: "700", color: "rgba(255,255,255,0.5)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>RiskGuard</span>
            </div>
            <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.2)" }}>© 2026 RiskGuard. All rights reserved.</span>
        </footer>
    );
}

export default function LandingPage({ onGetStarted }) {
    const handleCTA = () => { if (onGetStarted) onGetStarted(); };

    useEffect(() => {
        document.documentElement.style.background = "#040814";
        document.body.style.background = "#040814";
        document.documentElement.style.overscrollBehavior = "none";
        document.body.style.overscrollBehavior = "none";
    }, []);
    return (
        <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: "#040814", minHeight: "100vh" }}>
            <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { background: #040814; }
    html { scroll-behavior: smooth; }
    button { font-family: inherit; }
    section { margin-top: -1px; }
`}</style>
            <Navbar onCTA={handleCTA} />
            <Hero onCTA={handleCTA} />
            <Problems />
            <Features />
            <HowItWorks />
            <Pricing onCTA={handleCTA} />
            <CTA onCTA={handleCTA} />
            <Footer />
        </div>
    );
}