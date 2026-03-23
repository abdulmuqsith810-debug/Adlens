import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    HARAM_DECLARATIONS,
    HALAL_ECOMMERCE_CATEGORIES,
    BUSINESS_TYPES,
    isMCCBlocked,
    getMCCLabel,
} from '../data/haramFilter';

// ── Blocked Screen ────────────────────────────────────────────

function BlockedScreen() {
    return (
        <div className="onboarding-blocked-page">
            <div className="blocked-icon">⚠️</div>
            <h1 className="blocked-title">This product is not built for this type of data</h1>
            <div className="blocked-message">
                <p>
                    AttributeIQ's attribution model is highly specialized. Based on your selections, our platform is not calibrated for your specific business category or product type.
                </p>
                <p>
                    If we processed your data, the dashboard would show highly inaccurate attribution numbers and spend efficiency metrics. To prevent misleading insights, we cannot create an account for this business type at this time.
                </p>
                <p>We apologize for the inconvenience.</p>
            </div>
            <Link to="/" className="btn-secondary" style={{ marginTop: 24 }}>← Back to Home</Link>
        </div>
    );
}

// ── Inaccurate Data Warning Screen ───────────────────────────

function InaccurateWarningScreen({ businessType, onAccept }) {
    const type = BUSINESS_TYPES.find(b => b.value === businessType);
    return (
        <div className="onboarding-warning-page">
            <div className="warning-icon">⚠️</div>
            <h1 className="warning-title">This product is not built for this type of data</h1>
            <p className="warning-subtitle">We want to be honest with you before you proceed.</p>
            <div className="warning-box">
                <p>{type?.note}</p>
                <p style={{ marginTop: 12 }}>
                    <strong>If you continue, the dashboard will load</strong>, but the attribution numbers
                    may not accurately reflect your actual marketing performance. We recommend treating
                    the data as approximate and verifying all figures with your own analytics.
                </p>
            </div>
            <div style={{ display: 'flex', gap: 14, marginTop: 28, flexWrap: 'wrap' }}>
                <button className="btn-secondary" onClick={onAccept} style={{ cursor: 'pointer' }}>
                    I understand — continue anyway
                </button>
                <Link to="/" className="btn-secondary" style={{ borderColor: 'var(--border)' }}>← Back to Home</Link>
            </div>
        </div>
    );
}

// ── Main Onboarding Component ─────────────────────────────────

const STEPS = {
    BUSINESS_TYPE: 1,
    ECOMMERCE_DETAIL: 2,
    HARAM_CHECK: 3,
};

export default function Onboarding() {
    const navigate = useNavigate();

    const [step, setStep] = useState(STEPS.BUSINESS_TYPE);
    const [businessType, setBusinessType] = useState('');
    const [productCategories, setProductCategories] = useState([]);
    const [domainName, setDomainName] = useState('');
    const [declarations, setDeclarations] = useState(
        HARAM_DECLARATIONS.map(() => false)
    );
    const [blockReason, setBlockReason] = useState(null);
    const [showWarning, setShowWarning] = useState(false);
    const [errors, setErrors] = useState({});

    // ── Step 1: Business Type ──
    function handleBusinessTypeNext() {
        if (!businessType) {
            setErrors({ businessType: 'Please select your business type to continue.' });
            return;
        }
        setErrors({});
        const type = BUSINESS_TYPES.find(b => b.value === businessType);
        if (businessType === 'ecommerce') {
            setStep(STEPS.ECOMMERCE_DETAIL);
        } else {
            setStep(STEPS.HARAM_CHECK);
        }
    }

    // ── Step 2: Ecommerce Detail ──
    function toggleCategory(val) {
        setProductCategories(prev =>
            prev.includes(val) ? prev.filter(c => c !== val) : [...prev, val]
        );
    }

    function handleEcommerceNext() {
        const newErrors = {};
        if (productCategories.length === 0) newErrors.categories = 'Please select at least one product category.';
        if (!domainName.trim()) newErrors.domain = 'Please enter your store domain name.';
        if (Object.keys(newErrors).length) { setErrors(newErrors); return; }
        setErrors({});
        setStep(STEPS.HARAM_CHECK);
    }

    // ── Step 3: Haram Declaration ──
    function toggleDeclaration(i) {
        setDeclarations(prev => prev.map((v, idx) => idx === i ? !v : v));
    }

    function handleFinalSubmit() {
        // If any declaration is checked → blocked
        const checkedItem = declarations.findIndex(v => v);
        if (checkedItem !== -1) {
            setBlockReason(`You indicated that: "${HARAM_DECLARATIONS[checkedItem]}". We are unable to provide services to businesses in this category.`);
            return;
        }

        // Check if business type needs a warning
        const type = BUSINESS_TYPES.find(b => b.value === businessType);
        if (!type?.supported) {
            setShowWarning(true);
            return;
        }

        // All clear → proceed
        proceedToDashboard();
    }

    function proceedToDashboard() {
        localStorage.setItem('iq_onboarding_complete', 'true');
        localStorage.setItem('iq_business_type', businessType);
        navigate('/dashboard');
    }

    // ── Render: Blocked ──
    if (blockReason) return <BlockedScreen />;

    // ── Render: Inaccurate Warning ──
    if (showWarning) {
        return (
            <InaccurateWarningScreen
                businessType={businessType}
                onAccept={proceedToDashboard}
            />
        );
    }

    // ── Render: Multi-Step Form ──
    return (
        <div className="landing-page dark">
            <header className="landing-header">
                <div className="logo">
                    <span className="logo-icon">◈</span>
                    <span className="logo-text">AttributeIQ</span>
                </div>
                <Link to="/" className="nav-link" style={{ marginLeft: 'auto' }}>← Back to Home</Link>
            </header>

            <div className="onboarding-container">

                {/* Progress */}
                <div className="onboarding-progress">
                    {['Business Type', 'Product Detail', 'Final Check'].map((label, i) => {
                        const num = i + 1;
                        const isActive = step === num;
                        const isDone = step > num;
                        const skip = num === 2 && businessType !== 'ecommerce';
                        if (skip) return null;
                        return (
                            <div key={num} className={`progress-step ${isActive ? 'active' : ''} ${isDone ? 'done' : ''}`}>
                                <div className="progress-dot">{isDone ? '✓' : num}</div>
                                <span>{label}</span>
                            </div>
                        );
                    })}
                </div>

                {/* ── Step 1 ── */}
                {step === STEPS.BUSINESS_TYPE && (
                    <div className="onboarding-card">
                        <h2 className="onboarding-title">What type of business are you?</h2>
                        <p className="onboarding-subtitle">This is mandatory. AttributeIQ's attribution model is designed for specific business types.</p>
                        <div className="onboarding-options">
                            {BUSINESS_TYPES.map(type => (
                                <label key={type.value} className={`option-card ${businessType === type.value ? 'selected' : ''}`}>
                                    <input
                                        type="radio"
                                        name="businessType"
                                        value={type.value}
                                        checked={businessType === type.value}
                                        onChange={() => { setBusinessType(type.value); setErrors({}); }}
                                        style={{ display: 'none' }}
                                    />
                                    <span className="option-label">{type.label}</span>
                                </label>
                            ))}
                        </div>
                        {errors.businessType && <p className="onboarding-error">{errors.businessType}</p>}
                        <button className="btn-primary onboarding-btn" onClick={handleBusinessTypeNext}>
                            Continue →
                        </button>
                    </div>
                )}

                {/* ── Step 2: Ecommerce Detail ── */}
                {step === STEPS.ECOMMERCE_DETAIL && (
                    <div className="onboarding-card">
                        <h2 className="onboarding-title">What products does your store sell?</h2>
                        <p className="onboarding-subtitle">Select all that apply. This helps us verify your store is compatible with our platform.</p>

                        <div className="onboarding-checkgrid">
                            {HALAL_ECOMMERCE_CATEGORIES.map(cat => (
                                <label key={cat.value} className={`check-card ${productCategories.includes(cat.value) ? 'selected' : ''}`}>
                                    <input
                                        type="checkbox"
                                        checked={productCategories.includes(cat.value)}
                                        onChange={() => { toggleCategory(cat.value); setErrors({}); }}
                                        style={{ display: 'none' }}
                                    />
                                    <span className="check-tick">{productCategories.includes(cat.value) ? '✓' : '+'}</span>
                                    <span>{cat.label}</span>
                                </label>
                            ))}
                        </div>
                        {errors.categories && <p className="onboarding-error">{errors.categories}</p>}

                        <div className="onboarding-field">
                            <label className="field-label">Store Domain Name <span className="required-star">*</span></label>
                            <p className="field-hint">We use this to verify your store during our compliance check. Example: mystore.com</p>
                            <input
                                className={`field-input ${errors.domain ? 'input-error' : ''}`}
                                type="text"
                                placeholder="mystore.com"
                                value={domainName}
                                onChange={e => { setDomainName(e.target.value); setErrors({}); }}
                            />
                            {errors.domain && <p className="onboarding-error">{errors.domain}</p>}
                        </div>

                        <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                            <button className="btn-secondary" onClick={() => setStep(STEPS.BUSINESS_TYPE)}>← Back</button>
                            <button className="btn-primary onboarding-btn" onClick={handleEcommerceNext}>Continue →</button>
                        </div>
                    </div>
                )}

                {/* ── Step 3: Haram Declaration ── */}
                {step === STEPS.HARAM_CHECK && (
                    <div className="onboarding-card">
                        <h2 className="onboarding-title">Final compliance check</h2>
                        <p className="onboarding-subtitle">
                            AttributeIQ is a halal SaaS product. Please read each statement carefully and check any that apply to your business.
                            <strong> If any statement is true for your business, we will be unable to provide service.</strong>
                        </p>

                        <div className="declaration-notice">
                            📖 <strong>By submitting this form, you declare these answers are truthful.</strong> Providing false information to gain access to a service built on Islamic principles is a serious matter. We trust you to be honest.
                        </div>

                        <div className="declaration-list">
                            {HARAM_DECLARATIONS.map((item, i) => (
                                <label key={i} className={`declaration-item ${declarations[i] ? 'declared' : ''}`}>
                                    <input
                                        type="checkbox"
                                        checked={declarations[i]}
                                        onChange={() => toggleDeclaration(i)}
                                        className="declaration-checkbox"
                                    />
                                    <span>{item}</span>
                                </label>
                            ))}
                        </div>

                        <div className="stripe-note">
                            <span>🔗</span>
                            <p>When you connect your Stripe account, we will also automatically check your registered Merchant Category Code (MCC) against our blocked business list. If your MCC matches a prohibited category, access will be revoked regardless of the above declarations.</p>
                        </div>

                        <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                            <button className="btn-secondary" onClick={() => setStep(businessType === 'ecommerce' ? STEPS.ECOMMERCE_DETAIL : STEPS.BUSINESS_TYPE)}>← Back</button>
                            <button className="btn-primary onboarding-btn" onClick={handleFinalSubmit}>
                                Submit & Open Dashboard →
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
