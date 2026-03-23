// Mock hourly data for Attribution Dashboard
// In production, this will be replaced by GA4 + Stripe API responses via Cloudflare Workers

const hours = Array.from({ length: 24 }, (_, i) => {
  const h = i % 12 === 0 ? 12 : i % 12;
  const period = i < 12 ? 'AM' : 'PM';
  return `${h}${period}`;
});

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function generateHourlyData(googleBase, facebookBase, revenueBase) {
  return hours.map((timeLabel, i) => {
    const timeFactor = Math.sin((i / 24) * Math.PI * 2 - 1) * 0.5 + 1;
    const googleVisits = Math.max(0, Math.round(googleBase * timeFactor * (0.7 + Math.random() * 0.6)));
    const facebookVisits = Math.max(0, Math.round(facebookBase * timeFactor * (0.7 + Math.random() * 0.6)));
    const revenue = Math.max(0, Math.round(revenueBase * timeFactor * (0.6 + Math.random() * 0.8)));

    const googleRevenue = Math.round(revenue * (googleVisits / (googleVisits + facebookVisits || 1)) * (0.8 + Math.random() * 0.4));
    const facebookRevenue = Math.max(0, revenue - googleRevenue);

    return { timeLabel, googleVisits, facebookVisits, googleRevenue, facebookRevenue, revenue };
  });
}

function generateWeeklyData(googleBase, facebookBase, revenueBase) {
  return days.map((timeLabel, i) => {
    // Weekends usually perform differently
    const timeFactor = (i >= 5) ? 1.4 : 0.9;
    // Scale up base numbers for daily totals instead of hourly
    const googleVisits = Math.max(0, Math.round(googleBase * 15 * timeFactor * (0.8 + Math.random() * 0.4)));
    const facebookVisits = Math.max(0, Math.round(facebookBase * 15 * timeFactor * (0.8 + Math.random() * 0.4)));
    const revenue = Math.max(0, Math.round(revenueBase * 15 * timeFactor * (0.7 + Math.random() * 0.6)));

    const googleRevenue = Math.round(revenue * (googleVisits / (googleVisits + facebookVisits || 1)) * (0.8 + Math.random() * 0.4));
    const facebookRevenue = Math.max(0, revenue - googleRevenue);

    return { timeLabel, googleVisits, facebookVisits, googleRevenue, facebookRevenue, revenue };
  });
}

export const regions = ['Overall', 'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'France'];

export const mockDataDay = {
  Overall: generateHourlyData(420, 380, 1200),
  'United States': generateHourlyData(200, 180, 600),
  'United Kingdom': generateHourlyData(80, 70, 230),
  'Canada': generateHourlyData(50, 40, 150),
  'Australia': generateHourlyData(60, 70, 150),
  'Germany': generateHourlyData(20, 15, 50),
  'France': generateHourlyData(10, 5, 20),
};

export const mockDataWeek = {
  Overall: generateWeeklyData(420, 380, 1200),
  'United States': generateWeeklyData(200, 180, 600),
  'United Kingdom': generateWeeklyData(80, 70, 230),
  'Canada': generateWeeklyData(50, 40, 150),
  'Australia': generateWeeklyData(60, 70, 150),
  'Germany': generateWeeklyData(20, 15, 50),
  'France': generateWeeklyData(10, 5, 20),
};

// Dominant platform per region for map coloring
export const regionDominance = {
  'United States': 'google',
  'United Kingdom': 'facebook',
  'Canada': 'google',
  'Australia': 'facebook',
  'Germany': 'google',
  'France': 'facebook',
};

export function getSummary(data) {
  return {
    totalGoogleVisits: data.reduce((s, d) => s + d.googleVisits, 0),
    totalFacebookVisits: data.reduce((s, d) => s + d.facebookVisits, 0),
    totalGoogleRevenue: data.reduce((s, d) => s + d.googleRevenue, 0),
    totalFacebookRevenue: data.reduce((s, d) => s + d.facebookRevenue, 0),
    totalRevenue: data.reduce((s, d) => s + d.revenue, 0),
    peakRevenueLabel: data.reduce((best, d) => (d.revenue > best.revenue ? d : best), data[0]).timeLabel,
  };
}
