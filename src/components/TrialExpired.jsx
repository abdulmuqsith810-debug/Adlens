import { Link } from 'react-router-dom';

export default function TrialExpired() {
    return (
        <div className="onboarding-blocked-page">
            <div className="blocked-icon">⏰</div>
            <h1 className="blocked-title">Your Free Trial Has Ended</h1>
            <div className="blocked-message">
                <p>
                    Your 14-day free trial of Adlens has expired. You've seen what accurate
                    marketing attribution looks like — subscribe to keep full access to your data.
                </p>
                <p style={{ marginTop: 12 }}>
                    <strong>Subscription: $29/month</strong><br />
                    30 days of access per payment. No auto-renew surprises.
                </p>
            </div>

            <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
                <a
                    href="https://buy.stripe.com/adlens_placeholder"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary"
                    style={{ padding: '14px 40px', fontSize: '15px', textDecoration: 'none' }}
                >
                    Subscribe — $29/month →
                </a>
                <Link to="/connect" className="btn-secondary" style={{ fontSize: '13px' }}>
                    ← Back to Login
                </Link>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', maxWidth: 420, textAlign: 'center', lineHeight: 1.6 }}>
                    After payment, your access is restored within minutes. 30 days from payment date — not a calendar month.
                    <br /><br />
                    <strong style={{ color: 'var(--text)' }}>Need help?</strong> Email us at <a href="mailto:support@adlens.app" style={{ color: 'var(--accent)' }}>support@adlens.app</a>
                </p>
            </div>
        </div>
    );
}
