import { memo } from 'react';
import {
    ComposedChart,
    Area,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    ReferenceLine,
} from 'recharts';

const PLATFORM_COLORS = {
    google: '#4285F4',
    facebook: '#1877F2',
};

const PLATFORM_VISIT_COLORS = {
    google: '#4285F4',
    facebook: '#1877F2',
};

const REVENUE_COLOR = '#FFD700';

const CustomTooltip = ({ active, payload, label, platform }) => {
    if (active && payload && payload.length) {
        const visits = payload.find(p => p.dataKey === 'visits');
        const revenue = payload.find(p => p.dataKey === 'revenue');
        const conversionGap = visits && revenue
            ? ((revenue.value / Math.max(visits.value, 1)) * 100).toFixed(1)
            : 0;

        return (
            <div className="custom-tooltip">
                <p className="tooltip-hour">{label}</p>
                {visits && (
                    <p className="tooltip-visits" style={{ color: PLATFORM_VISIT_COLORS[platform] }}>
                        Visits: <strong>{visits.value.toLocaleString()}</strong>
                    </p>
                )}
                {revenue && (
                    <p className="tooltip-revenue" style={{ color: REVENUE_COLOR }}>
                        Revenue: <strong>${revenue.value.toLocaleString()}</strong>
                    </p>
                )}
                <p className="tooltip-gap">
                    Rev/Visit: <strong>${conversionGap}</strong>
                </p>
            </div>
        );
    }
    return null;
};

const PlatformGraph = ({ platform, data, title }) => {
    const visitColor = PLATFORM_VISIT_COLORS[platform];

    const chartData = data.map(d => ({
        timeLabel: d.timeLabel,
        visits: platform === 'google' ? d.googleVisits : d.facebookVisits,
        revenue: d.revenue,
    }));

    const maxVisits = Math.max(...chartData.map(d => d.visits));
    const maxRevenue = Math.max(...chartData.map(d => d.revenue));
    const avgRevenue = Math.round(chartData.reduce((s, d) => s + d.revenue, 0) / chartData.length);

    return (
        <div className="platform-graph-card">
            <div className="graph-header">
                <div className="platform-badge" style={{ backgroundColor: visitColor + '22', borderColor: visitColor }}>
                    <span className="platform-dot" style={{ backgroundColor: visitColor }} />
                    <span className="platform-label">{title}</span>
                </div>
                <div className="graph-stats">
                    <span className="stat-pill visits-pill" style={{ color: visitColor }}>
                        {chartData.reduce((s, d) => s + d.visits, 0).toLocaleString()} visits
                    </span>
                    <span className="stat-pill revenue-pill">
                        ${chartData.reduce((s, d) => s + d.revenue, 0).toLocaleString()} rev
                    </span>
                </div>
            </div>

            <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }} barCategoryGap={0} barGap={0}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                    <XAxis
                        dataKey="timeLabel"
                        tick={{ fill: '#8892a4', fontSize: 10 }}
                        axisLine={false}
                        tickLine={false}
                        interval={2}
                    />
                    <YAxis
                        yAxisId="visits"
                        orientation="left"
                        tick={{ fill: visitColor, fontSize: 10 }}
                        axisLine={false}
                        tickLine={false}
                        width={45}
                        tickFormatter={v => v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v}
                    />
                    <YAxis
                        yAxisId="revenue"
                        orientation="right"
                        tick={{ fill: REVENUE_COLOR, fontSize: 10 }}
                        axisLine={false}
                        tickLine={false}
                        width={55}
                        tickFormatter={v => `$${v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v}`}
                    />
                    <Tooltip content={<CustomTooltip platform={platform} />} />
                    <ReferenceLine
                        yAxisId="revenue"
                        y={avgRevenue}
                        stroke="rgba(255,215,0,0.25)"
                        strokeDasharray="4 4"
                        label={{ value: 'Avg Rev', fill: 'rgba(255,215,0,0.5)', fontSize: 9, position: 'insideTopRight' }}
                    />
                    <Area
                        yAxisId="visits"
                        type="monotone"
                        dataKey="visits"
                        fill={visitColor}
                        fillOpacity={0.4}
                        stroke={visitColor}
                        strokeWidth={2}
                        name={`${title} Visits`}
                    />
                    <Line
                        yAxisId="revenue"
                        type="monotone"
                        dataKey="revenue"
                        stroke={REVENUE_COLOR}
                        strokeWidth={2.5}
                        dot={false}
                        activeDot={{ r: 5, fill: REVENUE_COLOR, stroke: '#fff', strokeWidth: 2 }}
                        name="Revenue ($)"
                    />
                </ComposedChart>
            </ResponsiveContainer>

            <div className="conversion-gap-bar">
                <span className="gap-label">Conversion Quality</span>
                <div className="gap-track">
                    {chartData.map((d, i) => {
                        const quality = maxVisits > 0 && maxRevenue > 0
                            ? (d.revenue / maxRevenue) / Math.max(d.visits / maxVisits, 0.01)
                            : 0;
                        const capped = Math.min(quality, 2) / 2;
                        const color = capped > 0.6 ? '#23C552' : capped > 0.35 ? '#FFD700' : '#FF4D4D';
                        return (
                            <div
                                key={i}
                                className="gap-cell"
                                style={{ backgroundColor: color, opacity: 0.5 + capped * 0.5 }}
                                title={`${d.timeLabel}: Quality ${(capped * 100).toFixed(0)}%`}
                            />
                        );
                    })}
                </div>
                <div className="gap-legend">
                    <span style={{ color: '#FF4D4D' }}>● Low</span>
                    <span style={{ color: '#FFD700' }}>● Mid</span>
                    <span style={{ color: '#23C552' }}>● High</span>
                </div>
            </div>
        </div>
    );
};

export default memo(PlatformGraph);
