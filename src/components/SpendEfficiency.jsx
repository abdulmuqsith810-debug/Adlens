import { useState, useMemo } from 'react';

const COLORS = {
    meta: '#1877F2',
    google: '#4285F4',
    tiktok: '#ff0050',
    snapchat: '#fffc00',
    pinterest: '#E60023',
    linkedin: '#0A66C2',
    default: '#a78bfa'
};

export default function SpendEfficiency({ region, summary, platforms = [] }) {
    const [spends, setSpends] = useState({});

    const handleSpendChange = (platform, value) => {
        setSpends(prev => ({ ...prev, [platform]: value }));
    };

    const metrics = useMemo(() => {
        if (!platforms) return [];
        
        return platforms.map(p => {
            const rawSpend = parseFloat(spends[p]) || 0;
            const stats = summary?.platformStats?.[p] || { visits: 0, revenue: 0 };
            
            const vpd = rawSpend > 0 ? (stats.visits / rawSpend).toFixed(2) : null;
            const rpd = rawSpend > 0 && stats.revenue > 0 ? (stats.revenue / rawSpend).toFixed(2) : null;
            
            return {
                platform: p,
                title: `${p.charAt(0).toUpperCase() + p.slice(1)} Ads`,
                color: COLORS[p] || COLORS.default,
                spend: rawSpend,
                visits: stats.visits,
                revenue: stats.revenue,
                vpd: vpd ? parseFloat(vpd) : 0,
                rpd: rpd ? parseFloat(rpd) : 0,
                vpdText: vpd,
                rpdText: rpd
            };
        }).filter(m => m.spend > 0);
    }, [platforms, spends, summary]);

    // Find the winner by visits per dollar
    const sorted = [...metrics].sort((a, b) => b.vpd - a.vpd);
    const winner = sorted.length > 1 ? sorted[0] : null;
    const runnerUp = sorted.length > 1 ? sorted[1] : null;
    const hasResults = sorted.length > 0;

    return (
        <div className="spend-efficiency">
            <div className="spend-header">
                <h3 className="spend-title">💰 ROAS Calculator</h3>
                <span className="spend-region-tag">{region}</span>
            </div>

            <div className="spend-inputs">
                {platforms.map(p => (
                    <div className="spend-input-group" key={p}>
                        <label className="spend-label">
                            <span className="platform-dot" style={{ backgroundColor: COLORS[p] || COLORS.default }} />
                            {p.charAt(0).toUpperCase() + p.slice(1)} Spend Today ($)
                        </label>
                        <input
                            type="number"
                            className="spend-input"
                            placeholder="e.g. 500"
                            value={spends[p] || ''}
                            onChange={e => handleSpendChange(p, e.target.value)}
                            min="0"
                        />
                    </div>
                ))}
            </div>

            {hasResults && (
                <div className="efficiency-results" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                    {sorted.map((m, i) => (
                        <div key={m.platform} className={`efficiency-card ${i === 0 && sorted.length > 1 ? 'winner' : (i > 0 ? 'loser' : '')}`}>
                            <div className="eff-platform">
                                <span className="platform-dot" style={{ backgroundColor: m.color }} />
                                {m.title}
                                {i === 0 && sorted.length > 1 && <span className="winner-badge">✅ Most Efficient</span>}
                            </div>
                            <div className="eff-metrics">
                                <div className="eff-metric">
                                    <span className="eff-metric-label">Visits / $</span>
                                    <span className="eff-metric-value" style={{ color: m.color }}>
                                        {m.vpdText ?? '—'}
                                    </span>
                                </div>
                                <div className="eff-metric">
                                    <span className="eff-metric-label">Revenue / $</span>
                                    <span className="eff-metric-value" style={{ color: '#FFD700' }}>
                                        {m.rpdText ? `$${m.rpdText}` : '—'}
                                    </span>
                                </div>
                                <div className="eff-metric">
                                    <span className="eff-metric-label">Spend</span>
                                    <span className="eff-metric-value">${m.spend.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {winner && runnerUp && winner.vpd > 0 && runnerUp.vpd > 0 && (
                <div className="spend-insight">
                    💡 <strong>Insight:</strong> {winner.title} is returning <strong>{(winner.vpd / runnerUp.vpd).toFixed(1)}x</strong> more visits per dollar than {runnerUp.title}. Consider shifting budget to {winner.title} for {region}.
                </div>
            )}

            {!hasResults && (
                <p className="spend-placeholder">Enter your ad spend above to see efficiency metrics.</p>
            )}
        </div>
    );
}
