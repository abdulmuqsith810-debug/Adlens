import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { WORKER_URL } from '../config';

export default function ConnectApis() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [stripeKey, setStripeKey] = useState('');
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState('');

    async function handleConnect() {
        // Client-side validation
        const newErrors = {};
        if (!email.trim()) newErrors.email = 'Email address is required';
        else if (!email.includes('@') || !email.includes('.')) newErrors.email = 'Enter a valid email address';
        if (!stripeKey.trim()) newErrors.stripe = 'Stripe Restricted Key is required';
        else if (!stripeKey.startsWith('rk_') && !stripeKey.startsWith('sk_test_')) {
            newErrors.stripe = 'Invalid key format. Expected a Restricted Key starting with rk_live_ or rk_test_';
        }

        if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

        setLoading(true);
        setServerError('');

        try {
            const onboardingData = JSON.parse(localStorage.getItem('iq_onboarding_data') || '{}');

            const res = await fetch(`${WORKER_URL}/api/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: email.trim(),
                    stripeKey: stripeKey.trim(),
                    businessType: onboardingData.businessType || '',
                    domain: onboardingData.domain || '',
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setServerError(data.error || 'Something went wrong. Please try again.');
                setLoading(false);
                return;
            }

            // Save credentials locally for Worker calls
            localStorage.setItem('iq_token', data.token);
            localStorage.setItem('iq_email', email.trim());
            localStorage.setItem('iq_stripe_key', stripeKey.trim());

            navigate('/onboarding');
        } catch {
            // Worker not deployed yet — fall back to demo mode
            localStorage.setItem('iq_email', email.trim());
            localStorage.setItem('iq_stripe_key', stripeKey.trim());
            navigate('/onboarding');
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
                    <h2 className="onboarding-title">Start Your Free Trial</h2>
                    <p className="onboarding-subtitle">
                        14 days free. No credit card required. Connect your live data and see the full dashboard.
                    </p>

                    <div className="declaration-notice" style={{ background: 'rgba(35, 197, 82, 0.08)', borderColor: 'rgba(35, 197, 82, 0.3)', color: '#23C552' }}>
                        🔒 <strong>Privacy First:</strong> Your API keys are never stored on our servers. They are passed securely to our Edge Workers purely to fetch your data on the fly.
                    </div>

                    {/* Email */}
                    <div className="onboarding-field" style={{ marginTop: '24px' }}>
                        <label className="field-label">Email Address <span className="required-star">*</span></label>
                        <p className="field-hint">Used to manage your account and trial. We do not send marketing emails.</p>
                        <input
                            type="email"
                            placeholder="you@example.com"
                            className={`field-input ${errors.email ? 'input-error' : ''}`}
                            value={email}
                            onChange={e => { setEmail(e.target.value); setErrors({ ...errors, email: null }); setServerError(''); }}
                        />
                        {errors.email && <p className="onboarding-error">{errors.email}</p>}
                    </div>

                    {/* Stripe Key */}
                    <div className="onboarding-field" style={{ marginTop: '20px' }}>
                        <label className="field-label">Stripe Restricted API Key <span className="required-star">*</span></label>
                        <p className="field-hint">Create a restricted key in Stripe Dashboard → Developers → API keys with Read access to Charges & Payment Intents.</p>
                        <input
                            type="password"
                            placeholder="rk_live_xxxxxxxxxxxxxxxxxxxxxx"
                            className={`field-input ${errors.stripe ? 'input-error' : ''}`}
                            value={stripeKey}
                            onChange={e => { setStripeKey(e.target.value); setErrors({ ...errors, stripe: null }); setServerError(''); }}
                        />
                        {errors.stripe && <p className="onboarding-error">{errors.stripe}</p>}
                    </div>

                    {serverError && (
                        <div style={{ marginTop: 16, padding: '12px 16px', background: 'rgba(255,77,77,0.08)', border: '1px solid rgba(255,77,77,0.3)', borderRadius: 8, fontSize: 13, color: '#FF4D4D' }}>
                            ⚠️ {serverError}
                        </div>
                    )}

                    <button
                        className="btn-primary"
                        style={{ width: '100%', marginTop: '32px', display: 'flex', justifyContent: 'center', fontSize: '15px', opacity: loading ? 0.7 : 1 }}
                        onClick={handleConnect}
                        disabled={loading}
                    >
                        {loading ? 'Verifying...' : 'Start Free Trial →'}
                    </button>
                    <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)', marginTop: '12px', lineHeight: 1.6 }}>
                        By proceeding you agree that this account is for one business only.<br />
                        Each email and Stripe account is permitted one free trial.
                    </p>
                </div>
            </div>
        </div>
    );
}
