import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function ConnectApis() {
    const navigate = useNavigate();
    const [ga4Id, setGa4Id] = useState(localStorage.getItem('iq_ga4_id') || '');
    const [stripeKey, setStripeKey] = useState(localStorage.getItem('iq_stripe_key') || '');
    const [errors, setErrors] = useState({});

    function handleConnect() {
        const newErrors = {};
        if (!ga4Id.trim()) newErrors.ga4 = 'GA4 Property ID is required';
        if (!stripeKey.trim()) newErrors.stripe = 'Stripe Restricted Key is required';
        else if (!stripeKey.startsWith('rk_') && !stripeKey.startsWith('sk_test_')) {
            newErrors.stripe = 'Invalid key format. Expected a Restricted Key (rk_live_...)';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // Save keys securely in local storage for the frontend to pass to the Worker
        localStorage.setItem('iq_ga4_id', ga4Id.trim());
        localStorage.setItem('iq_stripe_key', stripeKey.trim());

        // Move to the next step (data compatibility check)
        navigate('/onboarding');
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
                    <h2 className="onboarding-title">Connect Your APIs</h2>
                    <p className="onboarding-subtitle">
                        To build your dashboard, Adlens requires read-only access to your Google Analytics 4 and Stripe accounts.
                    </p>

                    <div className="declaration-notice" style={{ background: 'rgba(35, 197, 82, 0.08)', borderColor: 'rgba(35, 197, 82, 0.3)', color: '#23C552' }}>
                        🔒 <strong>Privacy First:</strong> Your API keys are never stored on our database. They remain in your browser and are passed securely to our Edge Workers purely to fetch data on the fly.
                    </div>

                    <div className="onboarding-field" style={{ marginTop: '24px' }}>
                        <label className="field-label">Google Analytics 4 Property ID <span className="required-star">*</span></label>
                        <p className="field-hint">Found in GA4 Admin → Property Settings (e.g., 213025502)</p>
                        <input
                            type="text"
                            placeholder="e.g. 213025502"
                            className={`field-input ${errors.ga4 ? 'input-error' : ''}`}
                            value={ga4Id}
                            onChange={(e) => { setGa4Id(e.target.value); setErrors({...errors, ga4: null}); }}
                        />
                        {errors.ga4 && <p className="onboarding-error">{errors.ga4}</p>}
                    </div>

                    <div className="onboarding-field" style={{ marginTop: '20px' }}>
                        <label className="field-label">Stripe Restricted API Key <span className="required-star">*</span></label>
                        <p className="field-hint">Create a restricted key in Stripe with 'Read' access to Charges & Intents.</p>
                        <input
                            type="password"
                            placeholder="rk_live_xxxxxxxxxxxxxxxxxxxxxx"
                            className={`field-input ${errors.stripe ? 'input-error' : ''}`}
                            value={stripeKey}
                            onChange={(e) => { setStripeKey(e.target.value); setErrors({...errors, stripe: null}); }}
                        />
                        {errors.stripe && <p className="onboarding-error">{errors.stripe}</p>}
                    </div>

                    <button 
                        className="btn-primary" 
                        style={{ width: '100%', marginTop: '32px', display: 'flex', justifyContent: 'center', fontSize: '15px' }}
                        onClick={handleConnect}
                    >
                        Save & Continue →
                    </button>
                    <p style={{ textAlign: 'center', fontSize: '13px', color: 'var(--text-muted)', marginTop: '16px' }}>
                        By proceeding, you start your 14-day free trial.
                    </p>
                </div>
            </div>
        </div>
    );
}
