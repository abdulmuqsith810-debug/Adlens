import { Link } from 'react-router-dom';

export default function LandingPage() {
    return (
        <div className="landing-page dark">

            {/* ── HEADER ── */}
            <header className="landing-header">
                <div className="logo">
                    <span className="logo-icon">◈</span>
                    <span className="logo-text">Adlens</span>
                </div>
                <nav className="landing-nav">
                    <Link to="/guide" className="nav-link">How It Works</Link>
                    <a href="#pricing" className="nav-link">Pricing</a>
                    <a href="#pricing" className="nav-cta-btn">View Pricing →</a>
                </nav>
            </header>

            {/* ── HERO ── */}
            <section className="hero-section">
                <div className="hero-content">
                    <div className="hero-badge">⚠️ A known problem with all ad platforms</div>
                    <h1 className="hero-title">
                        When Did You Last<br />
                        <span className="hero-highlight">Truly Know</span><br />
                        Which Ad Worked?
                    </h1>
                    <p className="hero-subtitle">
                        Google Ads and Facebook Ads both report conversions — but they each count the same sale as their own win. Adlens connects your <strong>Stripe revenue to your independent Adlens Pixel data</strong> so you can see which platform genuinely earned its spend.
                    </p>
                    <div className="hero-truth-box">
                        <span className="truth-icon">📖</span>
                        <p>We only show you numbers derived from your own data. No estimates. No inflated benchmarks. No promises of specific results.</p>
                    </div>
                    <div className="hero-actions">
                        <a href="#pricing" className="btn-primary">View Pricing (14-Day Free Trial)</a>
                        <Link to="/demo" className="btn-secondary" style={{ background: 'rgba(255,255,255,0.1)' }}>View Live Demo</Link>
                        <Link to="/guide" className="btn-secondary" style={{ border: 'none' }}>How It Works</Link>
                    </div>
                    <p className="hero-trust-note">
                        🔒 Absolute Privacy. We actively encrypt your Stripe Key in our backend vault, only keep your merchant email to manage your account, never log your customers' names or emails, and strictly never sell your data.
                    </p>
                </div>

                <div className="hero-visual">
                    <div className="mock-dashboard-preview">
                        <div className="preview-header-bar">
                            <span className="dot red"></span>
                            <span className="dot yellow"></span>
                            <span className="dot green"></span>
                            <span className="preview-title-text">Adlens — Dashboard Preview</span>
                        </div>
                        <div className="preview-body">
                            <div className="preview-stat-row">
                                <div className="preview-stat">
                                    <span className="preview-stat-label">Google Visits</span>
                                    <span className="preview-stat-val" style={{color: '#4285F4'}}>Your data</span>
                                </div>
                                <div className="preview-stat">
                                    <span className="preview-stat-label">Facebook Visits</span>
                                    <span className="preview-stat-val" style={{color: '#1877F2'}}>Your data</span>
                                </div>
                                <div className="preview-stat">
                                    <span className="preview-stat-label">Attributed Revenue</span>
                                    <span className="preview-stat-val" style={{color: '#FFD700'}}>From Stripe</span>
                                </div>
                            </div>
                            <div className="preview-chart-placeholder">
                                <div className="preview-chart-bar" style={{height: '60%', backgroundColor: '#4285F480'}}></div>
                                <div className="preview-chart-bar" style={{height: '80%', backgroundColor: '#4285F480'}}></div>
                                <div className="preview-chart-bar" style={{height: '50%', backgroundColor: '#4285F480'}}></div>
                                <div className="preview-chart-bar" style={{height: '90%', backgroundColor: '#4285F480'}}></div>
                                <div className="preview-chart-bar" style={{height: '70%', backgroundColor: '#4285F480'}}></div>
                                <div className="preview-chart-bar" style={{height: '85%', backgroundColor: '#4285F480'}}></div>
                                <div className="preview-chart-line"></div>
                            </div>
                            <div className="preview-efficiency-row">
                                <div className="preview-eff-card" style={{background:'rgba(66,133,244,0.1)', border:'1px solid rgba(66,133,244,0.3)', color:'#4285F4'}}>
                                    <span>Google Ads</span>
                                    <span>Spend Efficiency Score</span>
                                </div>
                                <div className="preview-eff-card" style={{background:'rgba(24,119,242,0.1)', border:'1px solid rgba(24,119,242,0.3)', color:'#1877F2'}}>
                                    <span>Facebook Ads</span>
                                    <span>Spend Efficiency Score</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── WHAT WE DO ── */}
            <section className="steps-section">
                <h2 className="section-title">How Adlens Works</h2>
                <p className="section-subtitle">No black boxes. Here is exactly what happens with your data.</p>
                <div className="steps-grid">
                    <div className="step-card">
                        <div className="step-num">01</div>
                        <h3>You Connect Your APIs</h3>
                        <p>Provide your Read-Only Stripe API key and install our lightweight tracking pixel. We request the bare minimum permissions needed — no write access, no billing access.</p>
                    </div>
                    <div className="step-card">
                        <div className="step-num">02</div>
                        <h3>Your Data Stays Yours</h3>
                        <p>A Cloudflare Worker in your account fetches the data on your behalf. It is processed on the edge and shown only to you. We do not store your data on our servers.</p>
                    </div>
                    <div className="step-card">
                        <div className="step-num">03</div>
                        <h3>You See the Real Picture</h3>
                        <p>The dashboard shows you visit trends, revenue attribution, and spend efficiency — all calculated from your actual live data, not estimates or industry averages.</p>
                    </div>
                </div>
            </section>

            {/* ── WHAT YOU CAN SEE ── */}
            <section className="features-section">
                <h2 className="section-title">What the Dashboard Shows You</h2>
                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon">📊</div>
                        <h3>Hourly Visit Trends</h3>
                        <p>See how visits from Google and Facebook move hour by hour, overlaid with your actual revenue line from Stripe.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">💰</div>
                        <h3>Spend Efficiency Score</h3>
                        <p>Enter how much you spent on each platform today. The dashboard calculates visits-per-dollar and revenue-per-dollar from your actual data.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">🎨</div>
                        <h3>Conversion Quality Indicator</h3>
                        <p>A color strip (green → red) shows whether high traffic from a platform is actually converting to Stripe purchases or just generating empty clicks.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">🌍</div>
                        <h3>Region Breakdown</h3>
                        <p>Filter by country — US, UK, Canada, Australia, Germany, France — to see if platform performance varies by region.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">📅</div>
                        <h3>Hourly & Daily Toggle</h3>
                        <p>Switch between a 24-hour view for daily monitoring and a 7-day view for weekly trend analysis.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">🔒</div>
                        <h3>Privacy by Design</h3>
                        <p>We process the macro data only. We never extract, access, or store your individual customers' names, emails, or personal data.</p>
                    </div>
                </div>
            </section>

            {/* ── HONEST LIMITATIONS ── */}
            <section className="limitations-section">
                <h2 className="section-title">What This Tool Does Not Do</h2>
                <p className="section-subtitle">We believe in telling you this upfront.</p>
                <div className="limitations-grid">
                    <div className="limitation-item">
                        <span className="limitation-icon">⚠️</span>
                        <div>
                            <strong>Not a replacement for your ad platform data</strong>
                            <p>Adlens helps you compare platform efficiency using your Stripe revenue. It does not replace Google Ads or Facebook Ads Manager reporting.</p>
                        </div>
                    </div>
                    <div className="limitation-item">
                        <span className="limitation-icon">⚠️</span>
                        <div>
                            <strong>Attribution uses Macro Mix Modeling</strong>
                            <p>Revenue attribution relies on statistical velocity modeling rather than invasive cookie trackers. We overlap your macro ad click volume against your macro Stripe payments.</p>
                        </div>
                    </div>
                    <div className="limitation-item">
                        <span className="limitation-icon">⚠️</span>
                        <div>
                            <strong>Results depend on UTM Tracking</strong>
                            <p>If your Facebook Ads or Google Ads campaigns are missing UTM parameters, the Adlens Pixel cannot map the traffic. Proper UTM tags are required.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── PRICING ── */}
            <section className="pricing-section" id="pricing">
                <h2 className="section-title">Pricing</h2>
                <p className="section-subtitle">Try it free with demo data. Subscribe when you are ready to connect your own accounts.</p>
                <div className="pricing-grid">
                    <div className="pricing-card">
                        <div className="pricing-plan-name">14-Day Trial</div>
                        <div className="pricing-price">$0<span>/14 days</span></div>
                        <ul className="pricing-features">
                            <li>✅ Live Stripe data connection</li>
                            <li>✅ Live Cloudflare D1 Pixel connection</li>
                            <li>✅ All 6 regions</li>
                            <li>✅ Hourly & Daily views</li>
                            <li>✅ Spend efficiency calculator</li>
                        </ul>
                        <Link to="/connect" className="btn-secondary pricing-btn">Start Free Trial</Link>
                    </div>
                    <div className="pricing-card featured">
                        <div className="pricing-pill">Most Popular</div>
                        <div className="pricing-plan-name">Pro</div>
                        <div className="pricing-price">$29<span>/month</span></div>
                        <ul className="pricing-features">
                            <li>✅ Live Stripe API connection</li>
                            <li>✅ Live Cloudflare D1 Pixel connection</li>
                            <li>✅ Unlimited data processing</li>
                            <li>✅ Hourly & Daily views</li>
                            <li>✅ Ad spend efficiency tracker</li>
                        </ul>
                        <Link to="/connect" className="btn-primary pricing-btn">Start Free Trial →</Link>
                    </div>
                </div>
            </section>

            {/* ── FOOTER ── */}
            <footer className="landing-footer">
                <div className="footer-logo">
                    <span className="logo-icon">◈</span>
                    <span className="logo-text">Adlens</span>
                </div>
                <p className="footer-copy">© 2026 Adlens. Powered by Cloudflare Workers.</p>
                <div className="footer-links">
                    <Link to="/guide">Guide</Link>
                    <a href="mailto:support@adlens.app">Contact</a>
                    <Link to="/dashboard">Dashboard</Link>
                </div>
            </footer>
        </div>
    );
}
