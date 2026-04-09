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
                {/* TODO: Replace href below with your real xFlow payment URL */}
                <a
                    href="#"
                    onClick={e => { e.preventDefault(); alert('Payment link not configured yet. Please contact Adlens support.'); }}
                    className="btn-primary"
                    style={{ padding: '14px 40px', fontSize: '15px', textDecoration: 'none' }}
                >
                    Subscribe — $29/month →
                </a>
                <Link to="/" className="btn-secondary" style={{ fontSize: '13px' }}>
                    ← Back to Home
                </Link>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', maxWidth: 420, textAlign: 'center', lineHeight: 1.6 }}>
                    After payment, your access is restored immediately for 30 days from the payment date — not a calendar month.
                </p>
            </div>
        </div>
    );
}
