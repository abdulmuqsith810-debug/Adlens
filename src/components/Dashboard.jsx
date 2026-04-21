import { useState, useMemo, useEffect } from 'react';
import PlatformGraph from './PlatformGraph';
import SpendEfficiency from './SpendEfficiency';
import UtmGenerator from './UtmGenerator';
import PixelDeployer from './PixelDeployer';
import { WORKER_URL } from '../config';

const REGIONS = ['Overall', 'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'France'];

function getSummary(data, platforms = ['meta', 'google']) {
    if (!data || data.length === 0) {
        return { totalRevenue: 0, totalVisits: 0, platformStats: {}, peakRevenueLabel: 'N/A' };
    }
    
    const summary = {
        totalRevenue: data.reduce((s, d) => s + (d.revenue || 0), 0),
        peakRevenueLabel: data.reduce((best, d) => ((d.revenue || 0) > (best.revenue || 0) ? d : best), data[0]).timeLabel,
        platformStats: {}
    };

    let allVisits = 0;
    
    platforms.forEach(p => {
        const visits = data.reduce((s, d) => s + (d[`${p}Visits`] || 0), 0);
        const revenue = data.reduce((s, d) => s + (d[`${p}Revenue`] || 0), 0);
        summary.platformStats[p] = { visits, revenue };
        allVisits += visits;
    });

    summary.totalVisits = allVisits;
    
    return summary;
}

function SummaryCard({ label, value, sub, accent }) {
    return (
        <div className="summary-card" style={{ '--accent': accent }}>
            <p className="summary-label">{label}</p>
            <p className="summary-value">{value}</p>
            {sub && <p className="summary-sub">{sub}</p>}
        </div>
    );
}


const TUTORIAL_STEPS = [
    {
        title: "Welcome to Adlens 🚀",
        text: "This is exactly what your dashboard will look like when live. The data here changes mathematically based on the Region and Time Range you select.\n\nLet's walk through how to actually USE this data to make money.",
    },
    {
        title: "Step 1: The Platform Graphs 📊",
        text: "Look at the graphs below. The shaded area is 'Visits' (How many clicks you paid for). The yellow line is 'Revenue' (How much Stripe actually collected from those specific clicks).\n\n💡 DECISION RULE: If the yellow line drops way below the shaded area, you are paying for window-shoppers. Turn that ad off! If the line is higher than the shaded area, SCALE YOUR BUDGET.",
    },
    {
        title: "Step 2: Spend Efficiency 💸",
        text: "Scroll down to 'Spend Efficiency'. This is the magic. We take your True Attributed Revenue from Stripe directly, divide by your Ad Spend, and give you your True Spend Efficiency Score.\n\n💡 DECISION RULE: If the Spend Efficiency is green (above 1.5x), increase your daily budget safely! If it turns red, pull back.",
    },
    {
        title: "Step 3: Region Tracking 🌍",
        text: "Click the 'United States' or 'United Kingdom' tabs on the left menu. Notice how the graphs instantly change to regional data?\n\nNo setup is required. Our Cloudflare system tracks regional probability mathematically in the background on every link click.",
    }
];

function generateDemoData(timeRange) {
    const isDay = timeRange === 'day';
    const points = isDay ? 24 : 7;
    const baseData = {};

    REGIONS.forEach(reg => {
        const regionMultiplier = reg === 'Overall' ? 1.0 : (reg === 'United States' ? 0.6 : (reg === 'United Kingdom' ? 0.25 : 0.05));
        const arr = [];
        
        for (let i = 0; i < points; i++) {
            const trafficWave = Math.max(0, Math.sin((i - 8) * Math.PI / (points / 2))) + 0.5; 
            
            const metaBase = Math.floor(trafficWave * 400 * regionMultiplier) + Math.floor(Math.random() * 50);
            const googleBase = Math.floor(trafficWave * 250 * regionMultiplier) + Math.floor(Math.random() * 30);
            const tiktokBase = Math.floor(trafficWave * 600 * regionMultiplier) + Math.floor(Math.random() * 80);

            const metaRev = metaBase * 0.8;
            const googleRev = googleBase * 1.5;
            const tiktokRev = tiktokBase * 0.2;

            arr.push({
                timeLabel: isDay ? `${String(i).padStart(2, '0')}:00` : `Day ${i+1}`,
                revenue: Math.floor(metaRev + googleRev + tiktokRev) + Math.floor(Math.random() * 100),
                metaVisits: metaBase,
                googleVisits: googleBase,
                tiktokVisits: tiktokBase,
                metaRevenue: Math.floor(metaRev),
                googleRevenue: Math.floor(googleRev),
                tiktokRevenue: Math.floor(tiktokRev)
            });
        }
        baseData[reg] = arr;
    });

    return { platforms: ['meta', 'google', 'tiktok'], ...baseData };
}

export default function Dashboard({ daysLeft, trialStatus, isDemo }) {
    const [region, setRegion] = useState('Overall');
    const [date, setDate] = useState(() => {
        // Use local date (not UTC) so users in non-UTC timezones see today's date correctly
        return new Date().toLocaleDateString('en-CA'); // en-CA gives YYYY-MM-DD format
    });
    const [timeRange, setTimeRange] = useState('day');
    const [theme, setTheme] = useState('dark');
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [tutorialStep, setTutorialStep] = useState(0);

    const [apiData, setApiData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showUtm, setShowUtm] = useState(false);
    const [showPixelDeployer, setShowPixelDeployer] = useState(false);

    useEffect(() => {
        const fetchAnalytics = async () => {
            // In demo mode, always use generated data — never hit the network
            if (isDemo) {
                setApiData(generateDemoData(timeRange));
                setLoading(false);
                return;
            }

            setLoading(true);
            setError('');
            try {
                const token = localStorage.getItem('iq_token');
                if (!token) {
                    setApiData(generateDemoData(timeRange));
                    setLoading(false);
                    return;
                }

                const res = await fetch(`${WORKER_URL}/api/analytics`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token, range: timeRange, date })
                });

                if (!res.ok) {
                    const err = await res.json();
                    throw new Error(err.error || 'Failed to fetch analytics from Adlens Tracker.');
                }

                setApiData(await res.json());
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, [timeRange, date, isDemo]);

    const data = useMemo(() => {
        if (!apiData?.Overall) return [];
        return apiData[region] || apiData['Overall'] || [];
    }, [apiData, region]);
    const summary = useMemo(() => getSummary(data, apiData?.platforms || ['meta', 'google']), [data, apiData]);

    return (
        <div className={`dashboard ${theme} ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
            {/* Trial: days remaining banner */}
            {trialStatus === 'trial' && daysLeft > 0 && (
                <div style={{ background: 'rgba(255, 179, 0, 0.12)', borderBottom: '1px solid rgba(255, 179, 0, 0.3)', padding: '8px 32px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, fontSize: 13 }}>
                    <span>⏳</span>
                    <span style={{ color: '#FFB300', fontWeight: 600 }}>Free Trial:</span>
                    <span style={{ color: 'var(--text)' }}><strong>{daysLeft} day{daysLeft !== 1 ? 's' : ''}</strong> remaining.</span>
                    <a href="mailto:support@adlens.app" style={{ color: 'var(--accent)', fontWeight: 600, textDecoration: 'none', fontSize: 12 }}>Subscribe →</a>
                </div>
            )}
            {/* Demo mode banner */}
            {isDemo && (
                <div style={{ background: 'rgba(167,139,250,0.10)', borderBottom: '1px solid rgba(167,139,250,0.25)', padding: '8px 32px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, fontSize: 13 }}>
                    <span style={{ color: 'var(--accent)', fontWeight: 600 }}>📊 DEMO MODE</span>
                    <span style={{ color: 'var(--text-muted)' }}>— You're viewing generated sample data, not real analytics.</span>
                    <a href="/connect" style={{ color: 'var(--accent)', fontWeight: 600, textDecoration: 'none', fontSize: 12 }}>Start Free Trial →</a>
                </div>
            )}
            {/* Header */}
            <header className="dash-header">
                <div className="header-left">
                    <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
                        ☰
                    </button>
                    <div className="logo">
                        <span className="logo-icon">◈</span>
                        <span className="logo-text">Adlens</span>
                    </div>
                    <span className="header-tagline">Marketing Attribution Dashboard</span>
                </div>
                <div className="header-right">
                    <div className="time-range-toggle">
                        <button className={timeRange === 'day' ? 'active' : ''} onClick={() => setTimeRange('day')}>Hourly</button>
                        <button className={timeRange === 'week' ? 'active' : ''} onClick={() => setTimeRange('week')}>Daily</button>
                    </div>
                    <button
                        className="theme-toggle"
                        onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
                        title="Toggle light/dark mode"
                    >
                        {theme === 'dark' ? '☀️' : '🌙'}
                    </button>
                    <input
                        type="date"
                        className="date-picker"
                        value={date}
                        onChange={e => setDate(e.target.value)}
                    />
                    <span className="live-badge" style={{ marginRight: '10px' }}>● LIVE</span>
                    <button 
                        className="btn-secondary"
                        onClick={() => setShowPixelDeployer(true)}
                        style={{ padding: '6px 12px', fontSize: '13px', borderRadius: '6px', marginRight: '10px', background: 'transparent', border: '1px solid var(--border)', color: 'var(--text)' }}
                    >
                        &lt;/&gt; Deploy Pixel
                    </button>
                    <button 
                        className="btn-primary"
                        onClick={() => setShowUtm(true)}
                        style={{ padding: '6px 12px', fontSize: '13px', borderRadius: '6px' }}
                    >
                        ⚙ Setup Tracking
                    </button>
                    <button 
                        className="disconnect-btn"
                        onClick={() => {
                            localStorage.removeItem('iq_token');
                            localStorage.removeItem('iq_email');
                            localStorage.removeItem('iq_platforms');
                            localStorage.removeItem('iq_onboarding_complete');
                            localStorage.removeItem('iq_onboarding_data');
                            localStorage.removeItem('iq_business_type');
                            window.location.href = '/connect';
                        }}
                        title="Log Out"
                        style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-muted)', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', marginLeft: '10px' }}
                    >
                        Log Out
                    </button>
                </div>
            </header>

            <div className="dash-body">
                {/* Sidebar */}
                <aside className="dash-sidebar">
                    <div className="sidebar-header">📍 Regions</div>
                    <div className="sidebar-menu">
                        {REGIONS.map(r => (
                            <button
                                key={r}
                                onClick={() => setRegion(r)}
                                className={`sidebar-btn ${region === r ? 'active' : ''}`}
                            >
                                {r}
                            </button>
                        ))}
                    </div>
                </aside>

                <main className="dash-main">
                    {loading && (
                        <div className="dashboard-loading" style={{ padding: '60px', textAlign: 'center' }}>
                            <div className="spinner" style={{ margin: '0 auto 20px auto' }}></div>
                            <h2 style={{ fontWeight: 400, color: 'var(--text-light)' }}>Crunching Media Mix Math...</h2>
                            <p style={{ color: 'var(--text-muted)' }}>Fetching live views from D1 and revenue from Stripe</p>
                        </div>
                    )}
                    
                    {error && (
                        <div className="dashboard-error" style={{ background: 'rgba(255,0,0,0.1)', border: '1px solid red', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
                            <h3 style={{ color: '#ff4d4d', marginTop: 0 }}>Analytics Engine Error</h3>
                            <p>{error}</p>
                        </div>
                    )}

                    {!loading && !error && (
                        <>
                            {/* Summary Cards */}
                            <div className="summary-row">
                                <SummaryCard
                                    label="Total Global Visits"
                                    value={summary.totalVisits.toLocaleString()}
                                    sub="across all platforms"
                                    accent="#4285F4"
                                />
                                <SummaryCard
                                    label="Tracked Revenue"
                                    value={`$${summary.totalRevenue.toLocaleString()}`}
                                    sub="from connected Stripe"
                                    accent="#FFD700"
                                />
                                <SummaryCard
                                    label="Peak Conversion Window"
                                    value={summary.peakRevenueLabel || 'N/A'}
                                    sub="highest hourly volume"
                                    accent="#23C552"
                                />
                                <SummaryCard
                                    label="Revenue Per Visit"
                                    value={`$${(summary.totalRevenue / summary.totalVisits).toFixed(2)}`}
                                    sub="Efficiency metric"
                                    accent="#a78bfa"
                                />
                            </div>

                            {/* Platform Graphs Side by Side */}
                            <div className="graphs-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>
                                {(apiData?.platforms || ['meta', 'google']).map(p => (
                                    <PlatformGraph
                                        key={p}
                                        platform={p}
                                        data={data}
                                        title={`${p.charAt(0).toUpperCase() + p.slice(1)} Ads`}
                                    />
                                ))}
                            </div>

                            {/* Graph Legend */}
            <div className="graph-legend-row" style={{ marginTop: '20px' }}>
                <div className="legend-item">
                    <span className="legend-bar" style={{ backgroundColor: '#1877F2' }} /> Visits (bars)
                </div>
                <div className="legend-item">
                    <span className="legend-line" style={{ backgroundColor: '#FFD700' }} /> Mathematical Revenue Share (line)
                </div>
                <div className="legend-item">
                    <span className="legend-gap-demo">
                        <span style={{ background: '#FF4D4D', borderRadius: 3, width: 10, height: 10, display: 'inline-block' }} />
                        <span style={{ background: '#FFD700', borderRadius: 3, width: 10, height: 10, display: 'inline-block', marginLeft: 2 }} />
                        <span style={{ background: '#23C552', borderRadius: 3, width: 10, height: 10, display: 'inline-block', marginLeft: 2 }} />
                    </span>
                    Conversion Quality (low → high)
                </div>
            </div>

                            {/* Spend Efficiency */}
                            <SpendEfficiency
                                region={region}
                                summary={summary}
                                platforms={apiData?.platforms || ['meta', 'google']}
                            />
                        </>
                    )}

                    {showUtm && (
                        <UtmGenerator 
                            platforms={apiData?.platforms || ['meta', 'google']}
                            token={localStorage.getItem('iq_token') || 'demo_user'}
                            onClose={() => setShowUtm(false)}
                        />
                    )}

                    {showPixelDeployer && (
                        <PixelDeployer 
                            token={localStorage.getItem('iq_token')}
                            onClose={() => setShowPixelDeployer(false)}
                        />
                    )}

                    {isDemo && tutorialStep < TUTORIAL_STEPS.length && (
                        <div style={{ position: 'fixed', zIndex: 9999, bottom: '40px', right: '40px', background: 'var(--surface)', border: '2px solid var(--primary)', borderRadius: '12px', padding: '24px', width: '380px', boxShadow: '0 20px 40px rgba(0,0,0,0.8)' }}>
                            <h3 style={{ marginTop: 0, color: 'var(--text)', fontSize: '18px' }}>{TUTORIAL_STEPS[tutorialStep].title}</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{TUTORIAL_STEPS[tutorialStep].text}</p>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                                <button onClick={() => setTutorialStep(s => s - 1)} disabled={tutorialStep === 0} style={{ background: 'transparent', border: '1px solid var(--border)', color: tutorialStep === 0 ? 'var(--text-muted)' : 'var(--text)', padding: '6px 12px', borderRadius: '4px', cursor: tutorialStep === 0 ? 'not-allowed' : 'pointer' }}>Back</button>
                                <button onClick={() => setTutorialStep(s => s + 1)} style={{ background: 'var(--primary)', color: '#000', border: 'none', padding: '6px 16px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>{tutorialStep === TUTORIAL_STEPS.length - 1 ? 'Finish Tutorial' : 'Next →'}</button>
                            </div>
                        </div>
                    )}

                    {/* Footer */}
                    <footer className="dash-footer">
                        <span>Adlens — Powered by Cloudflare D1 Tracker & Workers</span>
                        <span className="footer-note">⚠ Revenue tracks live Stripe success charges directly.</span>
                    </footer>
                </main>
            </div>
        </div>
    );
}
