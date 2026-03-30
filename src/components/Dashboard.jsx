import { useState, useMemo, useEffect } from 'react';
import PlatformGraph from './PlatformGraph';
import SpendEfficiency from './SpendEfficiency';
import { WORKER_URL } from '../config';

const REGIONS = ['Overall', 'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'France'];

function getSummary(data) {
    if (!data || data.length === 0) {
        return { totalGoogleVisits: 0, totalFacebookVisits: 0, totalGoogleRevenue: 0, totalFacebookRevenue: 0, totalRevenue: 0, peakRevenueLabel: 'N/A' };
    }
    return {
        totalGoogleVisits: data.reduce((s, d) => s + (d.googleVisits || 0), 0),
        totalFacebookVisits: data.reduce((s, d) => s + (d.facebookVisits || 0), 0),
        totalGoogleRevenue: data.reduce((s, d) => s + (d.googleRevenue || 0), 0),
        totalFacebookRevenue: data.reduce((s, d) => s + (d.facebookRevenue || 0), 0),
        totalRevenue: data.reduce((s, d) => s + (d.revenue || 0), 0),
        peakRevenueLabel: data.reduce((best, d) => (d.revenue > best.revenue ? d : best), data[0]).timeLabel,
    };
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

    useEffect(() => {
        const fetchAnalytics = async () => {
            setLoading(true);
            setError('');
            try {
                const token = localStorage.getItem('iq_token');
                const stripeKey = localStorage.getItem('iq_stripe_key');
                if (!token || !stripeKey) throw new Error('Missing credentials. Please hit reconnect your APIs from the start page.');

                const res = await fetch(`${WORKER_URL}/api/analytics`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token, stripeKey, range: timeRange })
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
        if (!apiData) return [];
        return apiData[region] || apiData['Overall'] || [];
    }, [apiData, region]);
    const summary = useMemo(() => getSummary(data), [data]);

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
                    <span className="live-badge">● LIVE</span>
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
                                    label="Total Google Visits"
                                    value={summary.totalGoogleVisits.toLocaleString()}
                                    sub="from Google Ads"
                                    accent="#4285F4"
                                />
                                <SummaryCard
                                    label="Total Facebook Visits"
                                    value={summary.totalFacebookVisits.toLocaleString()}
                                    sub="from Facebook Ads"
                                    accent="#23C552"
                                />
                                <SummaryCard
                                    label="Total Revenue"
                                    value={`$${summary.totalRevenue.toLocaleString()}`}
                                    sub={`Peak at ${summary.peakRevenueLabel || 'N/A'}`}
                                    accent="#FFD700"
                                />
                                <SummaryCard
                                    label="Revenue Per Visit"
                                    value={`$${((summary.totalRevenue / Math.max(summary.totalGoogleVisits + summary.totalFacebookVisits, 1))).toFixed(2)}`}
                                    sub="Combined avg"
                                    accent="#a78bfa"
                                />
                            </div>

                            {/* Platform Graphs Side by Side */}
                            <div className="graphs-row">
                                <PlatformGraph
                                    platform="google"
                                    data={data}
                                    title="Google Ads"
                                />
                                <PlatformGraph
                                    platform="facebook"
                                    data={data}
                                    title="Facebook Ads"
                                />
                            </div>

                            {/* Graph Legend */}
            <div className="graph-legend-row">
                <div className="legend-item">
                    <span className="legend-bar" style={{ backgroundColor: '#4285F4' }} /> Google Visits (bars)
                </div>
                <div className="legend-item">
                    <span className="legend-bar" style={{ backgroundColor: '#23C552' }} /> Facebook Visits (bars)
                </div>
                <div className="legend-item">
                    <span className="legend-line" style={{ backgroundColor: '#FFD700' }} /> Revenue Line (both graphs)
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
                            />

                            {/* Spend Efficiency */}
                            <SpendEfficiency
                                region={region}
                                summary={summary}
                            />
                        </>
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
