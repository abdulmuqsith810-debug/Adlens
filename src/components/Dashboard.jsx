import { useState, useMemo, useEffect } from 'react';
import PlatformGraph from './PlatformGraph';
import SpendEfficiency from './SpendEfficiency';
import UtmGenerator from './UtmGenerator';
import PixelDeployer from './PixelDeployer';
import { WORKER_URL } from '../config';

const REGIONS = ['Overall', 'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'France'];

function getSummary(data, platforms = ['meta', 'google']) {
    if (!data || data.length === 0) {
        return { totalRevenue: 0, platformStats: {}, peakRevenueLabel: 'N/A' };
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

    summary.totalVisits = Math.max(allVisits, 1);
    
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

function RegionSelector({ active, onChange }) {
    return (
        <div className="region-selector">
            {REGIONS.map(r => (
                <button
                    key={r}
                    onClick={() => onChange(r)}
                    className={`region-btn ${active === r ? 'active' : ''}`}
                >
                    {r}
                </button>
            ))}
        </div>
    );
}

export default function Dashboard() {
    const [region, setRegion] = useState('Overall');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [timeRange, setTimeRange] = useState('day');
    const [theme, setTheme] = useState('dark');
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const [apiData, setApiData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showUtm, setShowUtm] = useState(false);
    const [showPixelDeployer, setShowPixelDeployer] = useState(false);

    useEffect(() => {
        const fetchAnalytics = async () => {
            setLoading(true);
            setError('');
            try {
                const token = localStorage.getItem('iq_token');
                if (!token) {
                    // No session — show beautiful demo data
                    setApiData({
                        platforms: ['meta', 'google'],
                        Overall: [
                            { timeLabel: 'Today 08:00', revenue: 120, metaVisits: 80, googleVisits: 45, metaRevenue: 50, googleRevenue: 70 },
                            { timeLabel: 'Today 12:00', revenue: 450, metaVisits: 320, googleVisits: 140, metaRevenue: 300, googleRevenue: 150 },
                            { timeLabel: 'Today 16:00', revenue: 890, metaVisits: 560, googleVisits: 420, metaRevenue: 500, googleRevenue: 390 },
                            { timeLabel: 'Today 20:00', revenue: 640, metaVisits: 410, googleVisits: 310, metaRevenue: 380, googleRevenue: 260 }
                        ]
                    });
                    setLoading(false);
                    return;
                }

                const res = await fetch(`${WORKER_URL}/api/analytics`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token, range: timeRange })
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
    }, [timeRange]);

    const data = useMemo(() => {
        if (!apiData?.Overall) return [];
        return apiData[region] || apiData['Overall'] || [];
    }, [apiData, region]);
    const summary = useMemo(() => getSummary(data, apiData?.platforms || ['meta', 'google']), [data, apiData]);

    return (
        <div className={`dashboard ${theme} ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
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
                            localStorage.removeItem('iq_stripe_key');
                            localStorage.removeItem('iq_email');
                            window.location.href = '/connect';
                        }}
                        title="Disconnect APIs & Logout"
                        style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-muted)', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', marginLeft: '10px' }}
                    >
                        Disconnect
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
                            onClose={() => setShowUtm(false)}
                        />
                    )}

                    {showPixelDeployer && (
                        <PixelDeployer 
                            token={localStorage.getItem('iq_token')}
                            onClose={() => setShowPixelDeployer(false)}
                        />
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
