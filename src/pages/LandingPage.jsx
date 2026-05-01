import { useState, useEffect, useRef } from "react";

const NAV_LINKS = [
    { label: "Features", id: "features" },
    { label: "How it works", id: "how-it-works" },
    { label: "Pricing", id: "pricing" },
    { label: "About", id: "about" },
    { label: "Contact", id: "contact" },
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

const TESTIMONIALS = [
    { name: "Rohit M.", location: "Mumbai", avatar: "RM", color: "#00D4FF", text: "I used to blow my weekly gains in one revenge trade. RiskGuard just stops me cold. First profitable month in 8 months." },
    { name: "Arjun S.", location: "Pune", avatar: "AS", color: "#a3e635", text: "The consecutive loss limit is a game changer. After 2 losses it locks me out. I've stopped the emotional spiral completely." },
    { name: "Priya K.", location: "Bangalore", avatar: "PK", color: "#f59e0b", text: "I was overtrading 15+ times a day. Now I'm capped at 5 and my win rate went from 32% to 61% in 3 weeks." },
    { name: "Vikram D.", location: "Delhi", avatar: "VD", color: "#f43f5e", text: "Lost ₹2L in one bad week before RiskGuard. Now my daily loss limit kicks in and I walk away. Already recovered ₹80k." },
    { name: "Sneha R.", location: "Chennai", avatar: "SR", color: "#a78bfa", text: "The midnight reset is brilliant. Every day starts fresh. I stopped carrying yesterday's losses into new trades." },
    { name: "Karan P.", location: "Hyderabad", avatar: "KP", color: "#00D4FF", text: "My prop firm challenge was failing every month. Set up RiskGuard, passed in week 3. The discipline is automatic now." },
    { name: "Meera T.", location: "Ahmedabad", avatar: "MT", color: "#a3e635", text: "I'm a part-time trader. RiskGuard runs while I'm at work and I never come back to a blown account anymore." },
    { name: "Suresh B.", location: "Kolkata", avatar: "SB", color: "#f59e0b", text: "Tried every journal and rule app. Nothing worked because I could always override them. This one I can't. That's the difference." },
];

function TestimonialCard({ t }) {
    return (
        <div style={{
            width: "300px", flexShrink: 0,
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: "16px", padding: "24px",
        }}>
            <div style={{ display: "flex", gap: "3px", marginBottom: "14px" }}>
                {[...Array(5)].map((_, i) => (
                    <span key={i} style={{ color: "#f59e0b", fontSize: "13px" }}>★</span>
                ))}
            </div>
            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.7)", lineHeight: "1.75", marginBottom: "20px", fontStyle: "italic" }}>
                "{t.text}"
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{
                    width: "36px", height: "36px", borderRadius: "50%",
                    background: `${t.color}22`, border: `1.5px solid ${t.color}44`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "11px", fontWeight: "700", color: t.color, flexShrink: 0,
                }}>{t.avatar}</div>
                <div>
                    <div style={{ fontSize: "13px", fontWeight: "700", color: "#fff" }}>{t.name}</div>
                    <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)" }}>{t.location} · MT5 Trader</div>
                </div>
            </div>
        </div>
    );
}

function Testimonials() {
    return (
        <section style={{ padding: "60px 0", background: "#040814", overflow: "hidden", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
            <style>{`
                @keyframes marquee {
                    0%   { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .marquee-track {
                    display: flex; gap: 16px;
                    width: max-content;
                    animation: marquee 35s linear infinite;
                }
                .marquee-track:hover { animation-play-state: paused; }
            `}</style>
            <div style={{ textAlign: "center", marginBottom: "36px", padding: "0 20px" }}>
                <div style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "3px", color: "#00D4FF", marginBottom: "10px", textTransform: "uppercase" }}>What traders say</div>
                <h2 style={{ fontSize: "28px", fontWeight: "800", color: "#fff", fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: "-0.5px" }}>
                    Real traders. Real results.
                </h2>
            </div>
            <div style={{ position: "relative" }}>
                <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "80px", background: "linear-gradient(to right, #040814, transparent)", zIndex: 2, pointerEvents: "none" }} />
                <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "80px", background: "linear-gradient(to left, #040814, transparent)", zIndex: 2, pointerEvents: "none" }} />
                <div style={{ overflow: "hidden", padding: "8px 0" }}>
                    <div className="marquee-track">
                        {TESTIMONIALS.map((t, i) => <TestimonialCard key={`a-${i}`} t={t} />)}
                        {TESTIMONIALS.map((t, i) => <TestimonialCard key={`b-${i}`} t={t} />)}
                    </div>
                </div>
            </div>
        </section>
    );
}

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

// ── ADDED: mobile detection hook ────────────────────────────────
function useMobile() {
    const [isMobile, setIsMobile] = useState(typeof window !== "undefined" ? window.innerWidth < 768 : false);
    useEffect(() => {
        const fn = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener("resize", fn);
        return () => window.removeEventListener("resize", fn);
    }, []);
    return isMobile;
}

function Navbar({ onCTA }) {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);  // ADDED
    const isMobile = useMobile();                       // ADDED
    useEffect(() => {
        const fn = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", fn);
        return () => window.removeEventListener("scroll", fn);
    }, []);

    const scrollTo = (id) => {                          // ADDED
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
        setMenuOpen(false);
    };

    return (
        <>
            <nav style={{
                position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
                padding: isMobile ? "0 20px" : "0 48px",   // CHANGED
                height: "60px",                              // CHANGED from 64px
                display: "flex", alignItems: "center", justifyContent: "space-between",
                background: scrolled || menuOpen ? "rgba(4,8,20,0.97)" : "transparent",
                backdropFilter: scrolled || menuOpen ? "blur(12px)" : "none",
                borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
                transition: "all 0.3s ease",
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{ width: "28px", height: "28px", background: "linear-gradient(135deg, #00D4FF, #0099CC)", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1L13 4V10L7 13L1 10V4L7 1Z" stroke="white" strokeWidth="1.5" fill="none" /><circle cx="7" cy="7" r="2" fill="white" /></svg>
                    </div>
                    <span style={{ fontSize: "16px", fontWeight: "700", color: "#fff", fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: "-0.3px" }}>RiskGuard</span>
                </div>

                {/* Desktop nav links — hidden on mobile */}
                {!isMobile && (
                    <div style={{ display: "flex", gap: "28px" }}>
                        {NAV_LINKS.map(l => (
                            <span key={l.label}
                                onClick={() => scrollTo(l.id)}
                                style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", cursor: "pointer", transition: "color 0.2s", letterSpacing: "0.2px" }}
                                onMouseEnter={e => e.target.style.color = "#fff"}
                                onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.5)"}
                            >{l.label}</span>
                        ))}
                    </div>
                )}

                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    {!isMobile && (
                        <button onClick={onCTA} style={{
                            background: "linear-gradient(135deg, #00D4FF, #0077AA)",
                            color: "white", border: "none", padding: "9px 22px",
                            borderRadius: "8px", fontSize: "13px", fontWeight: "600",
                            cursor: "pointer", letterSpacing: "0.2px",
                        }}>Get Started →</button>
                    )}
                    {/* Hamburger — mobile only */}
                    {isMobile && (
                        <button onClick={() => setMenuOpen(!menuOpen)} style={{
                            background: "transparent", border: "none", cursor: "pointer",
                            color: "#fff", fontSize: "22px", padding: "4px", lineHeight: 1,
                        }}>
                            {menuOpen ? "✕" : "☰"}
                        </button>
                    )}
                </div>
            </nav>

            {/* Mobile dropdown menu */}
            {isMobile && menuOpen && (
                <div style={{
                    position: "fixed", top: "60px", left: 0, right: 0, zIndex: 99,
                    background: "rgba(4,8,20,0.98)", borderBottom: "1px solid rgba(255,255,255,0.06)",
                    padding: "12px 20px 24px",
                }}>
                    {NAV_LINKS.map(l => (
                        <div key={l.label} onClick={() => scrollTo(l.id)}
                            style={{ padding: "14px 0", fontSize: "15px", color: "rgba(255,255,255,0.7)", cursor: "pointer", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                            {l.label}
                        </div>
                    ))}
                    <button onClick={() => { onCTA(); setMenuOpen(false); }} style={{
                        width: "100%", marginTop: "20px",
                        background: "linear-gradient(135deg, #00D4FF, #0077AA)",
                        color: "white", border: "none", padding: "14px",
                        borderRadius: "10px", fontSize: "15px", fontWeight: "600", cursor: "pointer",
                    }}>Get Started →</button>
                </div>
            )}
        </>
    );
}

function Hero({ onCTA, onTryFree }) {
    const [mounted, setMounted] = useState(false);
    const isMobile = useMobile();  // ADDED
    useEffect(() => { setTimeout(() => setMounted(true), 100); }, []);
    return (
        <section style={{
            minHeight: "100vh",
            background: "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(0,180,255,0.12) 0%, transparent 60%), #040814",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            padding: isMobile ? "90px 20px 60px" : "100px 48px 60px",  // CHANGED
            position: "relative", overflow: "hidden",
        }}>
            <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(0,180,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,180,255,0.04) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
            <div style={{ position: "absolute", top: "20%", left: "10%", width: "300px", height: "300px", background: "radial-gradient(circle, rgba(0,180,255,0.06) 0%, transparent 70%)", borderRadius: "50%" }} />
            <div style={{ position: "absolute", bottom: "20%", right: "10%", width: "250px", height: "250px", background: "radial-gradient(circle, rgba(0,120,200,0.06) 0%, transparent 70%)", borderRadius: "50%" }} />
            <div style={{ position: "relative", textAlign: "center", maxWidth: "820px", width: "100%" }}>  {/* ADDED width:100% */}

                {/* LIVE badge */}
                <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(0,180,255,0.08)", border: "1px solid rgba(0,180,255,0.2)", borderRadius: "20px", padding: "6px 16px", marginBottom: "28px", opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(16px)", transition: "all 0.6s ease" }}>
                    <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#00D4FF", animation: "pulse 2s infinite" }} />
                    <span style={{ fontSize: "12px", color: "#00D4FF", fontWeight: "500", letterSpacing: "0.5px" }}>LIVE — EA monitoring 24/7</span>
                </div>

                {/* Bold statement lines */}
                <div style={{
                    display: "flex", flexDirection: "column", gap: "10px", alignItems: "center", marginBottom: "28px",
                    opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(20px)",
                    transition: "all 0.65s ease 0.05s",
                }}>
                    {[
                        { text: "Stop Blowing Your Trading Account.", icon: "💸" },
                        { text: "Overtrading Is Killing Your Account.", icon: "📉" },
                    ].map((line) => (
                        <div key={line.text} style={{
                            display: "inline-flex", alignItems: "center", gap: "10px",
                            background: "rgba(255,71,87,0.06)",
                            border: "1px solid rgba(255,71,87,0.2)",
                            borderRadius: "12px", padding: isMobile ? "10px 16px" : "12px 24px",  // CHANGED
                            width: isMobile ? "100%" : "auto",                                      // ADDED
                        }}>
                            <span style={{ fontSize: isMobile ? "16px" : "20px" }}>{line.icon}</span>  {/* CHANGED */}
                            <span style={{
                                fontSize: isMobile ? "13px" : "18px",  // CHANGED
                                fontWeight: "700",
                                color: "rgba(255,255,255,0.75)",
                                fontFamily: "'Plus Jakarta Sans', sans-serif",
                                letterSpacing: "-0.3px",
                                textAlign: "left",
                            }}>{line.text}</span>
                        </div>
                    ))}
                </div>

                {/* Main headline */}
                <h1 style={{
                    fontSize: isMobile ? "34px" : "52px",  // CHANGED
                    fontWeight: "800", lineHeight: "1.2",   // CHANGED lineHeight
                    color: "#ffffff", fontFamily: "'Plus Jakarta Sans', sans-serif",
                    letterSpacing: isMobile ? "-0.5px" : "-2px",  // CHANGED
                    marginBottom: "20px",
                    opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(24px)", transition: "all 0.7s ease 0.1s"
                }}>
                    Your broker won't save you.<br />
                    <span style={{ background: "linear-gradient(135deg, #00D4FF, #0099CC)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>We will.</span>
                </h1>

                <p style={{
                    fontSize: isMobile ? "14px" : "16px",  // CHANGED
                    color: "rgba(255,255,255,0.5)", lineHeight: "1.8",
                    marginBottom: "32px", maxWidth: "520px", margin: "0 auto 32px",
                    opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(24px)", transition: "all 0.7s ease 0.2s"
                }}>
                    RiskGuard enforces your trading rules automatically on MetaTrader 5. No emotions. No excuses. Just discipline.
                </p>

                {/* CTA buttons — stack on mobile */}
                <div style={{
                    display: "flex",
                    flexDirection: isMobile ? "column" : "row",  // CHANGED
                    gap: "12px", justifyContent: "center", marginBottom: "52px",
                    opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(24px)", transition: "all 0.7s ease 0.3s"
                }}>
                    <button onClick={onCTA} style={{ background: "linear-gradient(135deg, #00D4FF, #0077AA)", color: "white", border: "none", padding: "15px 36px", borderRadius: "10px", fontSize: "15px", fontWeight: "600", cursor: "pointer" }}>Start protecting my account →</button>
                    <button onClick={onTryFree} style={{ background: "rgba(163,230,53,0.1)", color: "#a3e635", border: "1px solid rgba(163,230,53,0.3)", padding: "15px 28px", borderRadius: "10px", fontSize: "15px", fontWeight: "600", cursor: "pointer" }}>🎁 Try free for 7 days</button>
                    <button onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })} style={{ background: "transparent", color: "rgba(255,255,255,0.7)", border: "1px solid rgba(255,255,255,0.12)", padding: "15px 28px", borderRadius: "10px", fontSize: "15px", cursor: "pointer" }}>See how it works</button>                </div>

                <div style={{ display: "flex", gap: isMobile ? "28px" : "48px", justifyContent: "center", opacity: mounted ? 1 : 0, transition: "all 0.7s ease 0.4s" }}>
                    {[["500+", "Active traders"], ["₹0", "Lost to EA bugs"], ["10s", "Rule sync speed"]].map(([n, l]) => (
                        <div key={l} style={{ textAlign: "center" }}>
                            <div style={{ fontSize: isMobile ? "18px" : "22px", fontWeight: "700", color: "#fff", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{n}</div>
                            <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", marginTop: "4px" }}>{l}</div>
                        </div>
                    ))}
                </div>
            </div>
            <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
        </section>
    );
}

function Problems() {
    const [ref, inView] = useInView();
    const isMobile = useMobile();  // ADDED
    return (
        <section ref={ref} style={{ padding: isMobile ? "60px 20px" : "80px 48px", background: "#060c1c" }}>
            <div style={{ maxWidth: "960px", margin: "0 auto" }}>
                <div style={{ marginBottom: "40px" }}>
                    <div style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "3px", color: "#00D4FF", marginBottom: "12px", textTransform: "uppercase" }}>The problem</div>
                    <h2 style={{ fontSize: isMobile ? "26px" : "34px", fontWeight: "800", color: "#fff", fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: "-0.5px", lineHeight: "1.3" }}>
                        You already know the rules.<br /><span style={{ color: "rgba(255,255,255,0.3)" }}>You just can't follow them.</span>
                    </h2>
                </div>
                {/* CHANGED: 1fr on mobile, 3 cols on desktop */}
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3,1fr)", gap: "16px" }}>
                    {PROBLEMS.map((p, i) => (
                        <div key={p.title} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "16px", padding: "28px 24px", opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(32px)", transition: `all 0.6s ease ${i * 0.1}s` }}>
                            <div style={{ width: "48px", height: "48px", background: p.bg, borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", marginBottom: "20px" }}>{p.icon}</div>
                            <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#fff", marginBottom: "10px" }}>{p.title}</h3>
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
    const isMobile = useMobile();  // ADDED
    return (
        <section id="features" ref={ref} style={{ padding: isMobile ? "60px 20px" : "80px 48px", background: "#040814", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
            <div style={{ maxWidth: "960px", margin: "0 auto" }}>
                {/* CHANGED: 1fr on mobile, 2 cols on desktop */}
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? "40px" : "80px", alignItems: "start" }}>
                    <div>
                        <div style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "3px", color: "#00D4FF", marginBottom: "12px", textTransform: "uppercase" }}>Features</div>
                        <h2 style={{ fontSize: isMobile ? "26px" : "34px", fontWeight: "800", color: "#fff", fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: "-0.5px", lineHeight: "1.3", marginBottom: "20px" }}>Three rules.<br />Total control.</h2>
                        <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.4)", lineHeight: "1.8" }}>RiskGuard's EA monitors your MT5 account every 10 seconds, enforcing rules you define from the dashboard. Change limits anytime — the EA syncs within seconds.</p>
                        <div style={{ marginTop: "32px", padding: "20px 24px", background: "rgba(0,212,255,0.05)", border: "1px solid rgba(0,212,255,0.15)", borderRadius: "12px" }}>
                            <div style={{ fontSize: "12px", color: "#00D4FF", fontWeight: "600", marginBottom: "6px", letterSpacing: "0.5px" }}>DAILY AUTO-RESET</div>
                            <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.5)", lineHeight: "1.6" }}>All counters reset automatically at midnight IST. Every day starts fresh.</div>
                        </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        {FEATURES.map((f, i) => (
                            <div key={f.num} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "14px", padding: "24px 28px", opacity: inView ? 1 : 0, transform: inView ? "translateX(0)" : "translateX(32px)", transition: `all 0.6s ease ${i * 0.12}s` }}>
                                <div style={{ fontSize: "11px", fontWeight: "700", color: "#00D4FF", letterSpacing: "2px", marginBottom: "10px" }}>RULE {f.num}</div>
                                <div style={{ fontSize: "14px", fontWeight: "700", color: "#fff", marginBottom: "8px" }}>{f.title}</div>
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
    const isMobile = useMobile();  // ADDED
    return (
        <section id="how-it-works" ref={ref} style={{ padding: isMobile ? "60px 20px" : "80px 48px", background: "#060c1c" }}>
            <div style={{ maxWidth: "960px", margin: "0 auto", textAlign: "center" }}>
                <div style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "3px", color: "#00D4FF", marginBottom: "12px", textTransform: "uppercase" }}>How it works</div>
                <h2 style={{ fontSize: isMobile ? "26px" : "34px", fontWeight: "800", color: "#fff", fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: "-0.5px", marginBottom: "16px" }}>Up and running in 3 steps</h2>
                <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.4)", marginBottom: "48px" }}>No coding. Works with any MT5 broker worldwide.</p>
                {/* CHANGED: 1fr on mobile, 3 cols on desktop */}
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3,1fr)", gap: isMobile ? "24px" : "24px", position: "relative" }}>
                    {!isMobile && <div style={{ position: "absolute", top: "32px", left: "calc(16% + 32px)", right: "calc(16% + 32px)", height: "1px", background: "linear-gradient(90deg, rgba(0,212,255,0.3), rgba(0,212,255,0.1), rgba(0,212,255,0.3))" }} />}
                    {STEPS.map((s, i) => (
                        <div key={s.n} style={{
                            opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(28px)", transition: `all 0.6s ease ${i * 0.15}s`,
                            display: "flex", flexDirection: isMobile ? "row" : "column",  // CHANGED: row on mobile
                            alignItems: isMobile ? "flex-start" : "center",
                            gap: isMobile ? "16px" : "0",
                            textAlign: isMobile ? "left" : "center",
                        }}>
                            <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "linear-gradient(135deg, rgba(0,212,255,0.2), rgba(0,120,200,0.1))", border: "1px solid rgba(0,212,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: isMobile ? "0" : "0 auto 24px", fontSize: "20px", fontWeight: "800", color: "#00D4FF", position: "relative", zIndex: 1, flexShrink: 0 }}>{s.n}</div>
                            <div>
                                <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#fff", marginBottom: "10px" }}>{s.title}</h3>
                                <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", lineHeight: "1.7" }}>{s.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function Pricing({ onCTA }) {
    const [ref, inView] = useInView();
    const isMobile = useMobile();  // ADDED
    return (
        <section id="pricing" ref={ref} style={{ padding: isMobile ? "60px 20px" : "80px 48px", background: "#040814" }}>
            <div style={{ maxWidth: "960px", margin: "0 auto", textAlign: "center" }}>
                <div style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "3px", color: "#00D4FF", marginBottom: "12px", textTransform: "uppercase" }}>Pricing</div>
                <h2 style={{ fontSize: isMobile ? "26px" : "34px", fontWeight: "800", color: "#fff", fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: "-0.5px", marginBottom: "16px" }}>Simple pricing. No surprises.</h2>
                <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.4)", marginBottom: "56px" }}>Cancel anytime. Start protecting your account today.</p>
                {/* CHANGED: 1fr on mobile, 3 cols on desktop */}
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3,1fr)", gap: "20px" }}>
                    {PLANS.map((plan, i) => (
                        <div key={plan.name} style={{ background: plan.popular ? "rgba(0,212,255,0.04)" : "rgba(255,255,255,0.02)", border: plan.popular ? "1px solid rgba(0,212,255,0.25)" : "1px solid rgba(255,255,255,0.06)", borderRadius: "20px", padding: "36px 28px", position: "relative", opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(28px)", transition: `all 0.6s ease ${i * 0.1}s` }}>
                            {plan.popular && <div style={{ position: "absolute", top: "-12px", left: "50%", transform: "translateX(-50%)", background: "linear-gradient(135deg, #00D4FF, #0077AA)", color: "white", fontSize: "11px", fontWeight: "700", padding: "4px 16px", borderRadius: "20px", whiteSpace: "nowrap" }}>MOST POPULAR</div>}
                            <div style={{ fontSize: "12px", fontWeight: "700", color: "#00D4FF", letterSpacing: "2px", marginBottom: "16px", textTransform: "uppercase" }}>{plan.name}</div>
                            <div style={{ display: "flex", alignItems: "baseline", gap: "4px", marginBottom: "8px" }}>
                                <span style={{ fontSize: "36px", fontWeight: "800", color: "#fff", fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: "-0.5px" }}>{plan.price}</span>
                                <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.35)" }}>{plan.period}</span>
                            </div>
                            <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.35)", marginBottom: "24px", lineHeight: "1.6" }}>{plan.desc}</p>
                            <div style={{ height: "1px", background: "rgba(255,255,255,0.06)", marginBottom: "24px" }} />
                            {FEATURES_ALL.map(f => (
                                <div key={f} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "7px 0", fontSize: "13px", color: "rgba(255,255,255,0.55)" }}>
                                    <span style={{ color: "#00D4FF" }}>✓</span>{f}
                                </div>
                            ))}
                            <button onClick={onCTA} style={{ width: "100%", marginTop: "24px", padding: "13px", borderRadius: "10px", fontSize: "14px", fontWeight: "600", cursor: "pointer", background: plan.popular ? "linear-gradient(135deg, #00D4FF, #0077AA)" : "transparent", color: plan.popular ? "white" : "rgba(255,255,255,0.6)", border: plan.popular ? "none" : "1px solid rgba(255,255,255,0.12)" }}>Get {plan.name} →</button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function AboutUs() {
    const [ref, inView] = useInView();
    const isMobile = useMobile();  // ADDED
    return (
        <section id="about" ref={ref} style={{ padding: isMobile ? "60px 20px" : "80px 48px", background: "#060c1c" }}>
            <div style={{ maxWidth: "960px", margin: "0 auto" }}>
                {/* CHANGED: 1fr on mobile, 2 cols on desktop */}
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? "40px" : "80px", alignItems: "center" }}>
                    <div style={{ opacity: inView ? 1 : 0, transform: inView ? "translateX(0)" : "translateX(-32px)", transition: "all 0.7s ease" }}>
                        <div style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "3px", color: "#00D4FF", marginBottom: "12px", textTransform: "uppercase" }}>About us</div>
                        <h2 style={{ fontSize: isMobile ? "26px" : "34px", fontWeight: "800", color: "#fff", fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: "-0.5px", lineHeight: "1.3", marginBottom: "20px" }}>
                            Built by traders,<br /><span style={{ color: "rgba(255,255,255,0.35)" }}>for traders.</span>
                        </h2>
                        <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.45)", lineHeight: "1.8", marginBottom: "20px" }}>
                            RiskGuard was born from frustration. We were traders who knew our rules but couldn't follow them in the heat of the moment. So we built the tool we always wished existed.
                        </p>
                        <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.45)", lineHeight: "1.8" }}>
                            Our mission is simple: help retail traders survive long enough to become profitable. Because the biggest threat to most traders isn't bad strategy — it's bad discipline.
                        </p>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px", opacity: inView ? 1 : 0, transform: inView ? "translateX(0)" : "translateX(32px)", transition: "all 0.7s ease 0.15s" }}>
                        {[
                            { icon: "🎯", title: "Our mission", desc: "Make disciplined trading accessible to every retail trader, regardless of experience level." },
                            { icon: "🛡️", title: "Our promise", desc: "We never touch your trades or funds. RiskGuard only enforces the rules you set." },
                            { icon: "🌍", title: "Our reach", desc: "Serving traders across India and beyond, working with all major MT5 brokers worldwide." },
                        ].map((item) => (
                            <div key={item.title} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "14px", padding: "22px 24px", display: "flex", gap: "16px", alignItems: "flex-start" }}>
                                <div style={{ fontSize: "22px", marginTop: "2px", flexShrink: 0 }}>{item.icon}</div>
                                <div>
                                    <div style={{ fontSize: "14px", fontWeight: "700", color: "#fff", marginBottom: "6px" }}>{item.title}</div>
                                    <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", lineHeight: "1.6" }}>{item.desc}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

function ContactUs() {
    const [ref, inView] = useInView();
    const isMobile = useMobile();  // ADDED
    const [form, setForm] = useState({ name: "", email: "", message: "" });
    const [sent, setSent] = useState(false);
    const [sending, setSending] = useState(false);

    const handleSubmit = () => {
        if (!form.name || !form.email || !form.message) return;
        setSending(true);
        setTimeout(() => { setSending(false); setSent(true); }, 1200);
    };

    return (
        <section id="contact" ref={ref} style={{ padding: isMobile ? "60px 20px" : "80px 48px", background: "#040814", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
            <div style={{ maxWidth: "960px", margin: "0 auto" }}>
                {/* CHANGED: 1fr on mobile, 2 cols on desktop */}
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? "40px" : "80px", alignItems: "start" }}>
                    <div style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(28px)", transition: "all 0.7s ease" }}>
                        <div style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "3px", color: "#00D4FF", marginBottom: "12px", textTransform: "uppercase" }}>Contact us</div>
                        <h2 style={{ fontSize: isMobile ? "26px" : "34px", fontWeight: "800", color: "#fff", fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: "-0.5px", lineHeight: "1.3", marginBottom: "20px" }}>
                            Got questions?<br /><span style={{ color: "rgba(255,255,255,0.35)" }}>We are here to help.</span>
                        </h2>
                        <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.45)", lineHeight: "1.8", marginBottom: "40px" }}>
                            Whether you need help setting up the EA, have a subscription question, or want to give feedback — reach out and we will get back to you within 24 hours.
                        </p>
                        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                            {[
                                { icon: "📧", label: "Email", value: "vaibhavnanavare600@gmail.com" },
                                { icon: "⏰", label: "Response time", value: "Within 24 hours" },
                                { icon: "💬", label: "Support hours", value: "Mon – Sat, 10am – 7pm IST" },
                            ].map(item => (
                                <div key={item.label} style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                                    <div style={{ width: "40px", height: "40px", background: "rgba(0,212,255,0.08)", border: "1px solid rgba(0,212,255,0.15)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", flexShrink: 0 }}>{item.icon}</div>
                                    <div>
                                        <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", marginBottom: "2px", letterSpacing: "0.5px" }}>{item.label.toUpperCase()}</div>
                                        <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.7)", fontWeight: "500" }}>{item.value}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(28px)", transition: "all 0.7s ease 0.15s" }}>
                        {sent ? (
                            <div style={{ background: "rgba(0,212,255,0.05)", border: "1px solid rgba(0,212,255,0.2)", borderRadius: "20px", padding: "48px", textAlign: "center" }}>
                                <div style={{ fontSize: "40px", marginBottom: "16px" }}>✅</div>
                                <div style={{ fontSize: "18px", fontWeight: "700", color: "#fff", marginBottom: "8px" }}>Message sent!</div>
                                <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)" }}>We will get back to you within 24 hours.</div>
                                <button onClick={() => { setSent(false); setForm({ name: "", email: "", message: "" }); }} style={{ marginTop: "24px", background: "transparent", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.5)", padding: "10px 24px", borderRadius: "8px", fontSize: "13px", cursor: "pointer" }}>Send another</button>
                            </div>
                        ) : (
                            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "20px", padding: "36px" }}>
                                {[{ key: "name", label: "Your name", placeholder: "John Doe", type: "text" }, { key: "email", label: "Email address", placeholder: "john@example.com", type: "email" }].map(field => (
                                    <div key={field.key} style={{ marginBottom: "20px" }}>
                                        <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "rgba(255,255,255,0.4)", marginBottom: "8px", letterSpacing: "0.5px" }}>{field.label.toUpperCase()}</label>
                                        <input type={field.type} placeholder={field.placeholder} value={form[field.key]} onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))} style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", padding: "12px 16px", fontSize: "14px", color: "#fff", outline: "none", fontFamily: "inherit" }} />
                                    </div>
                                ))}
                                <div style={{ marginBottom: "24px" }}>
                                    <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "rgba(255,255,255,0.4)", marginBottom: "8px", letterSpacing: "0.5px" }}>MESSAGE</label>
                                    <textarea placeholder="How can we help you?" rows={5} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", padding: "12px 16px", fontSize: "14px", color: "#fff", outline: "none", resize: "none", fontFamily: "inherit" }} />
                                </div>
                                <button onClick={handleSubmit} disabled={sending} style={{ width: "100%", padding: "14px", borderRadius: "10px", fontSize: "14px", fontWeight: "600", cursor: "pointer", background: "linear-gradient(135deg, #00D4FF, #0077AA)", color: "white", border: "none", opacity: sending ? 0.7 : 1 }}>
                                    {sending ? "Sending..." : "Send message →"}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}

function CTA({ onCTA }) {
    const [ref, inView] = useInView();
    const isMobile = useMobile();  // ADDED
    return (
        <section ref={ref} style={{ padding: isMobile ? "60px 20px" : "80px 48px", background: "radial-gradient(ellipse 80% 80% at 50% 50%, rgba(0,150,220,0.12) 0%, transparent 70%), #040814", textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
            <div style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(28px)", transition: "all 0.7s ease" }}>
                <h2 style={{ fontSize: isMobile ? "28px" : "38px", fontWeight: "800", color: "#fff", fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: "-0.5px", marginBottom: "16px", lineHeight: "1.3" }}>
                    Ready to trade<br />
                    <span style={{ background: "linear-gradient(135deg, #00D4FF, #0077AA)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>with discipline?</span>
                </h2>
                <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.4)", marginBottom: "40px" }}>Join hundreds of traders protecting their accounts with RiskGuard.</p>
                <button onClick={onCTA} style={{ background: "linear-gradient(135deg, #00D4FF, #0077AA)", color: "white", border: "none", padding: isMobile ? "14px 28px" : "17px 44px", borderRadius: "12px", fontSize: "16px", fontWeight: "600", cursor: "pointer" }}>Start protecting my account →</button>
            </div>
        </section>
    );
}

function Footer() {
    const isMobile = useMobile();  // ADDED
    return (
        <footer style={{
            padding: isMobile ? "28px 20px" : "32px 48px",
            background: "#040814", borderTop: "1px solid rgba(255,255,255,0.04)",
            display: "flex",
            flexDirection: isMobile ? "column" : "row",  // CHANGED
            justifyContent: "space-between", alignItems: isMobile ? "flex-start" : "center",
            gap: isMobile ? "20px" : "0",
        }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{ width: "22px", height: "22px", background: "linear-gradient(135deg, #00D4FF, #0099CC)", borderRadius: "5px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="11" height="11" viewBox="0 0 14 14" fill="none"><path d="M7 1L13 4V10L7 13L1 10V4L7 1Z" stroke="white" strokeWidth="1.5" fill="none" /><circle cx="7" cy="7" r="2" fill="white" /></svg>
                </div>
                <span style={{ fontSize: "14px", fontWeight: "700", color: "rgba(255,255,255,0.5)" }}>RiskGuard</span>
            </div>
            <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
                {["Features", "Pricing", "About", "Contact"].map(l => (
                    <span key={l} onClick={() => document.getElementById(l.toLowerCase())?.scrollIntoView({ behavior: "smooth" })} style={{ fontSize: "12px", color: "rgba(255,255,255,0.25)", cursor: "pointer" }}
                        onMouseEnter={e => e.target.style.color = "rgba(255,255,255,0.6)"}
                        onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.25)"}
                    >{l}</span>
                ))}
            </div>
            <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.2)" }}>© 2026 RiskGuard. All rights reserved.</span>
        </footer>
    );
}

export default function LandingPage({ onGetStarted, onTryFree }) {
    const handleCTA = () => { if (onGetStarted) onGetStarted(); };
    const handleTryFree = () => { if (onTryFree) onTryFree(); };
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
                input::placeholder, textarea::placeholder { color: rgba(255,255,255,0.2); }
                input:focus, textarea:focus { border-color: rgba(0,212,255,0.3) !important; }
                section { margin-top: -1px; }
            `}</style>
            <Navbar onCTA={handleCTA} />
            <Hero onCTA={handleCTA} onTryFree={handleTryFree} />
            <Testimonials />
            <Problems />
            <Features />
            <HowItWorks />
            <Pricing onCTA={handleCTA} />
            <AboutUs />
            <ContactUs />
            <CTA onCTA={handleCTA} />
            <Footer />
        </div>
    );
}
