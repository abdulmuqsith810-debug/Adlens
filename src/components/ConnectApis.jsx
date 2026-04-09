import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { WORKER_URL } from '../config';

export default function ConnectApis() {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(false);
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [stripeKey, setStripeKey] = useState('');
    const [platforms, setPlatforms] = useState({ meta: true, google: true, tiktok: false, snapchat: false, pinterest: false, linkedin: false });
    
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState('');

    async function handleSubmit() {
        const newErrors = {};
        if (!email.trim()) newErrors.email = 'Email address is required';
        if (!password.trim()) newErrors.password = 'Password is required';
        else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';

        if (!isLogin) {
            if (!stripeKey.trim()) newErrors.stripe = 'Stripe Restricted Key is required';
            else if (!stripeKey.startsWith('rk_') && !stripeKey.startsWith('sk_test_')) {
                newErrors.stripe = 'Expected a Restricted Key starting with rk_live_ or sk_test_';
            }
            
            const selectedPlatforms = Object.keys(platforms).filter(k => platforms[k]);
            if (selectedPlatforms.length === 0) {
                newErrors.platforms = 'Please select at least one ad platform.';
            }
        }

        if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

        setLoading(true);
        setServerError('');

        try {
            const onboardingData = JSON.parse(localStorage.getItem('iq_onboarding_data') || '{}');
            const endpoint = isLogin ? '/api/login' : '/api/register';
            
            const payload = isLogin 
                ? { email: email.trim(), password }
                : { 
                    email: email.trim(), 
                    password, 
                    stripeKey: stripeKey.trim(), 
                    businessType: onboardingData.businessType || '', 
                    domain: onboardingData.domain || '', 
                    platforms: Object.keys(platforms).filter(k => platforms[k]) 
                };

            const res = await fetch(`${WORKER_URL}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok) {
                setServerError(data.error || 'Something went wrong. Please try again.');
                setLoading(false);
                return;
            }

            // Save credentials. We NO LONGER store the raw stripe key in localStorage!
            localStorage.setItem('iq_token', data.token);
            localStorage.setItem('iq_email', email.trim());
            localStorage.setItem('iq_platforms', JSON.stringify(data.platforms || []));

            navigate(isLogin ? '/dashboard' : '/onboarding');
        } catch (err) {
            setServerError('Failed to connect to the server. Please ensure you are connected to the internet.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="landing-page dark" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <header className="landing-header">
                <div className="logo">
                    <span className="logo-icon">◈</span>
                    <span className="logo-text">Adlens</span>
                </div>
                <Link to="/" className="nav-link" style={{ marginLeft: 'auto' }}>← Back to Home</Link>
            </header>

            <div className="onboarding-container" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="onboarding-card" style={{ width: '100%', maxWidth: '520px' }}>
                    <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', marginBottom: '24px' }}>
                        <button 
                            onClick={() => { setIsLogin(false); setErrors({}); setServerError(''); }}
                            style={{ flex: 1, padding: '16px', background: 'transparent', border: 'none', borderBottom: !isLogin ? '3px solid var(--primary)' : '3px solid transparent', color: !isLogin ? 'var(--primary)' : 'var(--text-muted)', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}
                        >
                            Sign Up
                        </button>
                        <button 
                            onClick={() => { setIsLogin(true); setErrors({}); setServerError(''); }}
                            style={{ flex: 1, padding: '16px', background: 'transparent', border: 'none', borderBottom: isLogin ? '3px solid var(--primary)' : '3px solid transparent', color: isLogin ? 'var(--primary)' : 'var(--text-muted)', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}
                        >
                            Log In
                        </button>
                    </div>

                    <h2 className="onboarding-title">{isLogin ? 'Welcome Back' : 'Start Your Free Trial'}</h2>
                    {!isLogin && (
                        <p className="onboarding-subtitle">14 days free. No credit card required.</p>
                    )}

                    <div className="declaration-notice" style={{ background: 'rgba(35, 197, 82, 0.08)', borderColor: 'rgba(35, 197, 82, 0.3)', color: '#23C552' }}>
                        🔒 <strong>Absolute Privacy:</strong> We store your email purely to manage your trial. Your Stripe API Key is securely stored and encrypted in our server vault. It is strictly never exposed to the frontend again.
                    </div>

                    {/* Email */}
                    <div className="onboarding-field" style={{ marginTop: '24px' }}>
                        <label className="field-label">Email Address <span className="required-star">*</span></label>
                        <input
                            type="email"
                            placeholder="you@example.com"
                            className={`field-input ${errors.email ? 'input-error' : ''}`}
                            value={email}
                            onChange={e => { setEmail(e.target.value); setErrors({ ...errors, email: null }); setServerError(''); }}
                        />
                        {errors.email && <p className="onboarding-error">{errors.email}</p>}
                    </div>

                    {/* Password */}
                    <div className="onboarding-field" style={{ marginTop: '20px' }}>
                        <label className="field-label">Password <span className="required-star">*</span></label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            className={`field-input ${errors.password ? 'input-error' : ''}`}
                            value={password}
                            onChange={e => { setPassword(e.target.value); setErrors({ ...errors, password: null }); setServerError(''); }}
                        />
                        {errors.password && <p className="onboarding-error">{errors.password}</p>}
                    </div>

                    {/* Stripe Key (Sign Up Only) */}
                    {!isLogin && (
                        <div className="onboarding-field" style={{ marginTop: '20px' }}>
                            <label className="field-label">Stripe Restricted API Key <span className="required-star">*</span></label>
                            <p className="field-hint">Create a restricted key in Stripe Dashboard → Developers → API keys with Read access to Charges.</p>
                            <input
                                type="password"
                                placeholder="rk_live_xxxxxxxxxxxxxxxxxxxxxx"
                                className={`field-input ${errors.stripe ? 'input-error' : ''}`}
                                value={stripeKey}
                                onChange={e => { setStripeKey(e.target.value); setErrors({ ...errors, stripe: null }); setServerError(''); }}
                            />
                            {errors.stripe && <p className="onboarding-error">{errors.stripe}</p>}
                        </div>
                    )}

                    {/* Platforms (Sign Up Only) */}
                    {!isLogin && (
                        <div className="onboarding-field" style={{ marginTop: '24px' }}>
                            <label className="field-label">Which Ad Platforms do you use? <span className="required-star">*</span></label>
                            <p className="field-hint">Select all that apply. This configures your algorithm.</p>
                            <div className="platform-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '10px', marginTop: '10px' }}>
                                {Object.entries({ meta: 'Meta Ads (FB/IG)', google: 'Google Ads', tiktok: 'TikTok Ads', snapchat: 'Snapchat Ads', pinterest: 'Pinterest Ads', linkedin: 'LinkedIn Ads' }).map(([key, label]) => (
                                    <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', background: 'var(--surface-light)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border)' }}>
                                        <input 
                                            type="checkbox" 
                                            checked={platforms[key]} 
                                            onChange={(e) => { setPlatforms({ ...platforms, [key]: e.target.checked }); setErrors({ ...errors, platforms: null }); }} 
                                            style={{ accentColor: 'var(--primary)', width: '16px', height: '16px' }} />
                                        <span style={{ fontSize: '14px', color: 'var(--text)', whiteSpace: 'nowrap' }}>{label}</span>
                                    </label>
                                ))}
                            </div>
                            {errors.platforms && <p className="onboarding-error">{errors.platforms}</p>}
                        </div>
                    )}

                    {serverError && (
                        <div style={{ marginTop: 16, padding: '12px 16px', background: 'rgba(255,77,77,0.08)', border: '1px solid rgba(255,77,77,0.3)', borderRadius: 8, fontSize: 13, color: '#FF4D4D' }}>
                            ⚠️ {serverError}
                        </div>
                    )}

                    <button
                        className="btn-primary"
                        style={{ width: '100%', marginTop: '32px', display: 'flex', justifyContent: 'center', fontSize: '15px', opacity: loading ? 0.7 : 1 }}
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? 'Authenticating...' : (isLogin ? 'Log In →' : 'Create Account →')}
                    </button>
                    
                    {!isLogin && (
                        <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)', marginTop: '12px', lineHeight: 1.6 }}>
                            Each email and Stripe account is permitted one free trial.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
