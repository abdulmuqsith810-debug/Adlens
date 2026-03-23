import { useState } from 'react';

export default function SpendEfficiency({ region, summary }) {
    const [googleSpend, setGoogleSpend] = useState('');
    const [facebookSpend, setFacebookSpend] = useState('');

    const gSpend = parseFloat(googleSpend) || 0;
    const fSpend = parseFloat(facebookSpend) || 0;

    const gVisitsPerDollar = gSpend > 0 ? (summary.totalGoogleVisits / gSpend).toFixed(2) : null;
    const fVisitsPerDollar = fSpend > 0 ? (summary.totalFacebookVisits / fSpend).toFixed(2) : null;

    const gRevenuePerDollar = gSpend > 0 && summary.totalGoogleRevenue > 0
        ? (summary.totalGoogleRevenue / gSpend).toFixed(2)
        : null;
    const fRevenuePerDollar = fSpend > 0 && summary.totalFacebookRevenue > 0
        ? (summary.totalFacebookRevenue / fSpend).toFixed(2)
        : null;

    const gWins = gVisitsPerDollar && fVisitsPerDollar && parseFloat(gVisitsPerDollar) > parseFloat(fVisitsPerDollar);
    const fWins = gVisitsPerDollar && fVisitsPerDollar && parseFloat(fVisitsPerDollar) > parseFloat(gVisitsPerDollar);
    const hasResults = gVisitsPerDollar || fVisitsPerDollar;

    return (
        <div className="spend-efficiency">
            <div className="spend-header">
                <h3 className="spend-title">💰 Spend Efficiency</h3>
                <span className="spend-region-tag">{region}</span>
            </div>

            <div className="spend-inputs">
                <div className="spend-input-group">
                    <label className="spend-label google-label">
                        <span className="platform-dot" style={{ backgroundColor: '#4285F4' }} />
                        Google Ads Spend Today ($)
                    </label>
                    <input
                        type="number"
                        className="spend-input"
                        placeholder="e.g. 500"
                        value={googleSpend}
                        onChange={e => setGoogleSpend(e.target.value)}
                        min="0"
                    />
                </div>
                <div className="spend-input-group">
                    <label className="spend-label facebook-label">
                        <span className="platform-dot" style={{ backgroundColor: '#23C552' }} />
                        Facebook Ads Spend Today ($)
                    </label>
                    <input
                        type="number"
                        className="spend-input"
                        placeholder="e.g. 300"
                        value={facebookSpend}
                        onChange={e => setFacebookSpend(e.target.value)}
                        min="0"
                    />
                </div>
            </div>

            {hasResults && (
                <div className="efficiency-results">
                    <div className={`efficiency-card ${gWins ? 'winner' : fWins ? 'loser' : ''}`}>
                        <div className="eff-platform">
                            <span className="platform-dot" style={{ backgroundColor: '#4285F4' }} />
                            Google Ads
                            {gWins && <span className="winner-badge">✅ More Efficient</span>}
                            {fWins && <span className="loser-badge">❌ Less Efficient</span>}
                        </div>
                        <div className="eff-metrics">
                            <div className="eff-metric">
                                <span className="eff-metric-label">Visits / $</span>
                                <span className="eff-metric-value" style={{ color: '#4285F4' }}>
                                    {gVisitsPerDollar ?? '—'}
                                </span>
                            </div>
                            <div className="eff-metric">
                                <span className="eff-metric-label">Revenue / $</span>
                                <span className="eff-metric-value" style={{ color: '#FFD700' }}>
                                    {gRevenuePerDollar ? `$${gRevenuePerDollar}` : '—'}
                                </span>
                            </div>
                            <div className="eff-metric">
                                <span className="eff-metric-label">Spend</span>
                                <span className="eff-metric-value">${gSpend.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    <div className={`efficiency-card ${fWins ? 'winner' : gWins ? 'loser' : ''}`}>
                        <div className="eff-platform">
                            <span className="platform-dot" style={{ backgroundColor: '#23C552' }} />
                            Facebook Ads
                            {fWins && <span className="winner-badge">✅ More Efficient</span>}
                            {gWins && <span className="loser-badge">❌ Less Efficient</span>}
                        </div>
                        <div className="eff-metrics">
                            <div className="eff-metric">
                                <span className="eff-metric-label">Visits / $</span>
                                <span className="eff-metric-value" style={{ color: '#23C552' }}>
                                    {fVisitsPerDollar ?? '—'}
                                </span>
                            </div>
                            <div className="eff-metric">
                                <span className="eff-metric-label">Revenue / $</span>
                                <span className="eff-metric-value" style={{ color: '#FFD700' }}>
                                    {fRevenuePerDollar ? `$${fRevenuePerDollar}` : '—'}
                                </span>
                            </div>
                            <div className="eff-metric">
                                <span className="eff-metric-label">Spend</span>
                                <span className="eff-metric-value">${fSpend.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {hasResults && gWins && (
                <div className="spend-insight">
                    💡 <strong>Insight:</strong> Google Ads is returning <strong>{(parseFloat(gVisitsPerDollar) / parseFloat(fVisitsPerDollar)).toFixed(1)}x</strong> more visits per dollar than Facebook. Consider shifting budget to Google for {region}.
                </div>
            )}
            {hasResults && fWins && (
                <div className="spend-insight">
                    💡 <strong>Insight:</strong> Facebook Ads is returning <strong>{(parseFloat(fVisitsPerDollar) / parseFloat(gVisitsPerDollar)).toFixed(1)}x</strong> more visits per dollar than Google. Consider shifting budget to Facebook for {region}.
                </div>
            )}

            {!hasResults && (
                <p className="spend-placeholder">Enter your ad spend above to see efficiency metrics.</p>
            )}
        </div>
    );
}
