import { Link } from 'react-router-dom';

// Mini chart helpers to visually demonstrate scenarios
function MiniBarChart({ bars, lineLevel, googleColor = '#4285F4', facebookColor = '#1877F2' }) {
    return (
        <div className="mini-chart">
            <div className="mini-chart-bars">
                {bars.map((bar, i) => (
                    <div
                        key={i}
                        className="mini-chart-bar"
                        style={{
                            height: `${bar.height}%`,
                            backgroundColor: bar.platform === 'google'
                                ? googleColor + 'BB'
                                : facebookColor + 'BB',
                        }}
                        title={bar.label}
                    />
                ))}
            </div>
            {lineLevel !== undefined && (
                <div className="mini-chart-revenue-line" style={{ bottom: `${lineLevel}%` }} />
            )}
        </div>
    );
}

function QualityStrip({ cells }) {
    const colorMap = { green: '#23C552', yellow: '#FFD700', red: '#FF4D4D' };
    return (
        <div className="mini-quality-strip">
            {cells.map((c, i) => (
                <div key={i} className="mini-quality-cell" style={{ backgroundColor: colorMap[c], opacity: 0.75 }} />
            ))}
        </div>
    );
}

// Each scenario: visual on left, explanation + action on right
const scenarios = [
    {
        id: 'green-strip',
        emoji: '🟢',
        title: 'Platform drives real buyers — not just clicks',
        visual: () => (
            <div>
                <MiniBarChart
                    bars={[
                        { height: 55, platform: 'google' },
                        { height: 70, platform: 'google' },
                        { height: 60, platform: 'google' },
                        { height: 80, platform: 'google' },
                        { height: 65, platform: 'google' },
                        { height: 75, platform: 'google' },
                    ]}
                    lineLevel={52}
                />
                <QualityStrip cells={['green', 'green', 'green', 'green', 'green', 'green']} />
                <p className="mini-chart-label">Conversion Quality: 🟢 High</p>
            </div>
        ),
        scenario: 'Visit bars are consistent, and the revenue line (gold) tracks closely with visit height. The Conversion Quality strip is green across all hours.',
        insight: 'This platform is sending people who actually purchase. The ratio of revenue to visits is healthy and stable.',
        action: 'This platform is performing well. You can safely maintain or gradually increase its budget. Watch the strip if you scale — if it turns yellow, growth has reached a ceiling.',
    },
    {
        id: 'red-strip',
        emoji: '🔴',
        title: 'High clicks, flat revenue — possible junk traffic',
        visual: () => (
            <div>
                <MiniBarChart
                    bars={[
                        { height: 85, platform: 'facebook' },
                        { height: 90, platform: 'facebook' },
                        { height: 95, platform: 'facebook' },
                        { height: 88, platform: 'facebook' },
                        { height: 92, platform: 'facebook' },
                        { height: 87, platform: 'facebook' },
                    ]}
                    lineLevel={12}
                />
                <QualityStrip cells={['red', 'red', 'red', 'red', 'red', 'red']} />
                <p className="mini-chart-label">Conversion Quality: 🔴 Low</p>
            </div>
        ),
        scenario: 'The visit bars are very tall — lots of traffic is coming in. But the gold revenue line is nearly flat at the bottom. The Conversion Quality strip is red.',
        insight: 'A large number of clicks are arriving but almost none are converting to purchases. This often happens with broad audience targeting, misleading ad creatives, or low-quality traffic sources.',
        action: 'Pause or reduce the budget for this platform in this region. Review who you are targeting in that specific campaign — the audience is likely too broad or mismatched with your product. Do not increase spend here.',
    },
    {
        id: 'spend-efficiency',
        emoji: '💰',
        title: 'Spend Efficiency shows which platform earns its cost',
        visual: () => (
            <div className="mini-spend-cards">
                <div className="mini-spend-card winner">
                    <span style={{ color: '#4285F4' }}>● Google</span>
                    <div className="mini-spend-metric">
                        <span>Visits / $</span>
                        <strong>3.8</strong>
                    </div>
                    <div className="mini-spend-metric">
                        <span>Revenue / $</span>
                        <strong>$2.10</strong>
                    </div>
                    <span className="mini-winner-badge">✅ More Efficient</span>
                </div>
                <div className="mini-spend-card loser">
                    <span style={{ color: '#1877F2' }}>● Facebook</span>
                    <div className="mini-spend-metric">
                        <span>Visits / $</span>
                        <strong>1.4</strong>
                    </div>
                    <div className="mini-spend-metric">
                        <span>Revenue / $</span>
                        <strong>$0.70</strong>
                    </div>
                    <span className="mini-loser-badge">❌ Less Efficient</span>
                </div>
            </div>
        ),
        scenario: 'You entered $200 for Google and $200 for Facebook. The dashboard shows Google delivered 3.8 visits per dollar and $2.10 of revenue per dollar. Facebook delivered 1.4 visits per dollar and $0.70 revenue per dollar.',
        insight: 'Both platforms received equal budget, but Google returned roughly 3x more attributed revenue per dollar spent in this time window and region.',
        action: 'These numbers are from your own data. If this pattern holds over several days, consider shifting 20–30% of the Facebook budget to Google for this region. Always monitor the Conversion Quality strip after shifting — more Google spend can sometimes drop its quality too.',
    },
    {
        id: 'revenue-spike',
        emoji: '📈',
        title: 'Revenue spikes while visits stay normal',
        visual: () => (
            <div>
                <MiniBarChart
                    bars={[
                        { height: 50, platform: 'google' },
                        { height: 55, platform: 'google' },
                        { height: 52, platform: 'google' },
                        { height: 48, platform: 'google' },
                        { height: 53, platform: 'google' },
                        { height: 50, platform: 'google' },
                    ]}
                    lineLevel={75}
                />
                <QualityStrip cells={['green', 'green', 'green', 'green', 'green', 'green']} />
                <p className="mini-chart-label">Revenue spike with normal traffic</p>
            </div>
        ),
        scenario: 'Visit bars are at a normal, consistent height. But the gold revenue line is significantly higher than usual — well above where it normally sits relative to the bars.',
        insight: 'A small number of high-value customers made large purchases in this window. The conversion rate itself may not be exceptional, but the average order value was much higher.',
        action: 'Check what ads were running at that hour and to what audience. If a specific campaign or audience drove high-value orders, that is worth noting. Avoid changing the general budget based on a single spike — wait to see if it repeats.',
    },
    {
        id: 'visit-spike',
        emoji: '📉',
        title: 'Traffic spike with no revenue movement',
        visual: () => (
            <div>
                <MiniBarChart
                    bars={[
                        { height: 40, platform: 'facebook' },
                        { height: 42, platform: 'facebook' },
                        { height: 95, platform: 'facebook' },
                        { height: 90, platform: 'facebook' },
                        { height: 41, platform: 'facebook' },
                        { height: 38, platform: 'facebook' },
                    ]}
                    lineLevel={15}
                />
                <QualityStrip cells={['yellow', 'yellow', 'red', 'red', 'yellow', 'yellow']} />
                <p className="mini-chart-label">Traffic spike, revenue flat</p>
            </div>
        ),
        scenario: 'Visit bars suddenly shoot up in the middle of the day — much taller than the surrounding hours. But the gold revenue line barely moves. The Conversion Quality strip turns red specifically for those hours.',
        insight: 'A sudden traffic surge that produces no matching revenue often indicates bot clicks, a viral share with no purchase intent, or a campaign optimized for clicks rather than sales.',
        action: 'Note the exact hours. Review your ad platform logs to see if a specific ad set was spending heavily at that time. Consider pausing campaigns optimized for "traffic" and switching to "conversions" optimization in your ad platform settings.',
    },
    {
        id: 'region-difference',
        emoji: '🌍',
        title: 'Same platform, very different efficiency by region',
        visual: () => (
            <div className="mini-region-compare">
                <div className="mini-region-card">
                    <span className="mini-region-name">🇺🇸 United States</span>
                    <div className="mini-region-bar-wrap">
                        <div className="mini-region-bar" style={{ width: '85%', backgroundColor: '#4285F4' }}></div>
                        <span>3.9 visits/$</span>
                    </div>
                    <div className="mini-region-bar-wrap">
                        <div className="mini-region-bar" style={{ width: '85%', backgroundColor: '#FFD70088' }}></div>
                        <span>$2.20 rev/$</span>
                    </div>
                </div>
                <div className="mini-region-card">
                    <span className="mini-region-name">🇦🇺 Australia</span>
                    <div className="mini-region-bar-wrap">
                        <div className="mini-region-bar" style={{ width: '30%', backgroundColor: '#4285F4' }}></div>
                        <span>1.1 visits/$</span>
                    </div>
                    <div className="mini-region-bar-wrap">
                        <div className="mini-region-bar" style={{ width: '20%', backgroundColor: '#FFD70088' }}></div>
                        <span>$0.40 rev/$</span>
                    </div>
                </div>
            </div>
        ),
        scenario: 'You select "United States" from the sidebar — Google Ads shows strong efficiency. You then select "Australia" — the same Google Ads campaign shows much lower visits per dollar and revenue per dollar.',
        insight: 'The same ad creative and budget can perform very differently across regions due to differences in audience size, competition, and purchasing behavior. Running a single global strategy often overpays in low-performing regions.',
        action: 'If one region consistently underperforms over a week of data, consider either reducing spend specifically in that geo-target, or creating a separate ad set for it with adjusted creative and budget.',
    },
];

export default function Guide() {
    return (
        <div className="landing-page dark">
            <header className="landing-header">
                <div className="logo">
                    <span className="logo-icon">◈</span>
                    <span className="logo-text">Adlens</span>
                </div>
                <nav className="landing-nav">
                    <Link to="/" className="nav-link">Home</Link>
                    <Link to="/connect" className="nav-cta-btn">Sign In / Sign Up →</Link>
                </nav>
            </header>

            <section className="guide-hero">
                <h1 className="hero-title" style={{ fontSize: '2.5rem' }}>
                    What Your Dashboard<br />
                    <span className="hero-highlight">Is Actually Telling You</span>
                </h1>
                <p className="hero-subtitle" style={{ maxWidth: 620 }}>
                    Real dashboard scenarios, illustrated. Each one shows exactly what the data looks like, what it means, and what action to consider taking.
                </p>
                <p className="guide-disclaimer">
                    ⚠️ These illustrations use example numbers to explain patterns. Your actual dashboard will run the Contribution Math using your own real data from Stripe and the Adlens Custom Pixel.
                </p>
            </section>

            <section className="guide-steps-section">
                {scenarios.map((s) => (
                    <div className="guide-scenario-card" key={s.id}>
                        <div className="guide-scenario-header">
                            <span className="guide-scenario-emoji">{s.emoji}</span>
                            <h3 className="guide-step-title">{s.title}</h3>
                        </div>
                        <div className="guide-scenario-body">
                            <div className="guide-scenario-visual">
                                <p className="guide-visual-label">What it looks like in the dashboard:</p>
                                {s.visual()}
                            </div>
                            <div className="guide-scenario-text">
                                <div className="guide-step-block">
                                    <span className="guide-step-block-label">The scenario</span>
                                    <p>{s.scenario}</p>
                                </div>
                                <div className="guide-step-block">
                                    <span className="guide-step-block-label">What it means</span>
                                    <p>{s.insight}</p>
                                </div>
                                <div className="guide-step-block action-block">
                                    <span className="guide-step-block-label">Suggested action</span>
                                    <p>{s.action}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </section>

            <section className="guide-cta">
                <h2>Ready to map your own data?</h2>
                <p>Create a free account to instantly spin up your custom D1 tracker and see your real numbers.</p>
                <Link to="/connect" className="btn-primary" style={{ display: 'inline-flex', marginTop: 20 }}>Get Started →</Link>
            </section>

            <footer className="landing-footer">
                <div className="footer-logo">
                    <span className="logo-icon">◈</span>
                    <span className="logo-text">Adlens</span>
                </div>
                <p className="footer-copy">© 2026 Adlens. Powered by Cloudflare Workers.</p>
                <div className="footer-links">
                    <Link to="/">Home</Link>
                    <Link to="/connect">Log In</Link>
                </div>
            </footer>
        </div>
    );
}
