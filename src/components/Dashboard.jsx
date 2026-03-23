import { useState, useMemo } from 'react';
import PlatformGraph from './PlatformGraph';
import SpendEfficiency from './SpendEfficiency';
import { mockDataDay, mockDataWeek, regions, getSummary } from '../data/mockData';

const REGIONS = regions;

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
    const [date, setDate] = useState('2026-03-15');
    const [timeRange, setTimeRange] = useState('day');
    const [theme, setTheme] = useState('dark');
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const data = useMemo(() => {
        const sourceMenu = timeRange === 'day' ? mockDataDay : mockDataWeek;
        return sourceMenu[region] || sourceMenu['Overall'];
    }, [region, timeRange]);
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

                    {/* Footer */}
                    <footer className="dash-footer">
                        <span>Adlens — Data from Google Analytics 4 + Stripe · Powered by Cloudflare Workers</span>
                        <span className="footer-note">⚠ Revenue shown is total store revenue, not platform-specific</span>
                    </footer>
                </main>
            </div>
        </div>
    );
}
