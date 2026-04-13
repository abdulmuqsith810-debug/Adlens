import { useState } from 'react';
import { WORKER_URL } from '../config';

const PLATFORMS = [
    { key: 'shopify', label: 'Shopify' },
    { key: 'woocommerce', label: 'WooCommerce' },
    { key: 'custom', label: 'Custom HTML' },
];

const INSTRUCTIONS = {
    shopify: [
        'Log into your Shopify Admin dashboard.',
        (<>Go to <strong>Online Store</strong> → <strong>Themes</strong>.</>),
        (<>Click the three dots <strong>(...)</strong> next to your current theme and select <strong>Edit code</strong>.</>),
        (<>Open the <code>theme.liquid</code> file.</>),
        (<>Scroll to the closing <code>&lt;/head&gt;</code> tag.</>),
        (<>Paste your Script Tag directly above <code>&lt;/head&gt;</code> and click <strong>Save</strong>.</>),
    ],
    woocommerce: [
        'Log into your WordPress Admin dashboard.',
        (<>Go to <strong>Appearance</strong> → <strong>Theme File Editor</strong>.</>),
        (<>Select your active theme's <code>header.php</code> file from the right-hand file list.</>),
        (<>Find the closing <code>&lt;/head&gt;</code> tag.</>),
        (<>Paste your Script Tag directly above <code>&lt;/head&gt;</code> and click <strong>Update File</strong>.</>),
        (<><strong>Alternative:</strong> Use a plugin like <em>Insert Headers and Footers</em> and paste the tag into the "Scripts in Header" section.</>),
    ],
    custom: [
        'Open your website\'s HTML source in your code editor.',
        (<>Locate the <code>&lt;/head&gt;</code> closing tag in your main layout file (e.g. <code>index.html</code>, <code>layout.html</code>, <code>_layout.hbs</code>).</>),
        (<>Paste your Script Tag directly above <code>&lt;/head&gt;</code>.</>),
        'Save and deploy your site. The pixel fires automatically on every page load.',
    ],
};

export default function PixelDeployer({ token, onClose }) {
    const [copied, setCopied] = useState(false);
    const [activeTab, setActiveTab] = useState('shopify');

    const pixelCode = `<script src="${WORKER_URL}/pixel.js?token=${token}" async></script>`;

    const handleCopy = () => {
        navigator.clipboard.writeText(pixelCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="modal-content" style={{ background: 'var(--surface)', borderRadius: '12px', padding: '30px', maxWidth: '620px', width: '90%', border: '1px solid var(--border)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)', maxHeight: '90vh', overflowY: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                    <div>
                        <h2 style={{ fontSize: '24px', margin: '0 0 8px 0', color: 'var(--text)' }}>Install Your Adlens Pixel</h2>
                        <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '14px' }}>
                            Your dashboard will remain empty until you deploy this code. It takes 2 minutes.
                        </p>
                    </div>
                    <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '24px', cursor: 'pointer' }}>×</button>
                </div>

                {/* Script tag block */}
                <div className="pixel-code-block" style={{ background: 'var(--surface-light)', border: '1px solid var(--border)', borderRadius: '8px', padding: '20px', marginBottom: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <span style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Your Unique Script Tag</span>
                        <button
                            onClick={handleCopy}
                            style={{ background: 'var(--primary)', color: '#000', border: 'none', padding: '6px 16px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                        >
                            {copied ? 'Copied! ✅' : 'Copy Code'}
                        </button>
                    </div>
                    <code style={{ display: 'block', background: '#000', padding: '16px', borderRadius: '6px', fontSize: '13px', color: '#a78bfa', wordBreak: 'break-all', fontFamily: 'monospace' }}>
                        {pixelCode}
                    </code>
                </div>

                {/* Platform tabs */}
                <h3 style={{ fontSize: '17px', marginBottom: '12px', color: 'var(--text)' }}>Installation Instructions</h3>
                <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', marginBottom: '20px' }}>
                    {PLATFORMS.map(p => (
                        <button
                            key={p.key}
                            onClick={() => setActiveTab(p.key)}
                            style={{
                                padding: '10px 18px',
                                background: 'transparent',
                                border: 'none',
                                borderBottom: activeTab === p.key ? '2px solid var(--primary)' : '2px solid transparent',
                                color: activeTab === p.key ? 'var(--primary)' : 'var(--text-muted)',
                                fontWeight: activeTab === p.key ? 'bold' : 'normal',
                                fontSize: '14px',
                                cursor: 'pointer',
                                transition: 'color 0.2s',
                            }}
                        >
                            {p.label}
                        </button>
                    ))}
                </div>

                <ol style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.8, margin: 0, paddingLeft: '20px' }}>
                    {INSTRUCTIONS[activeTab].map((step, i) => (
                        <li key={i} style={{ marginBottom: '10px' }}>{step}</li>
                    ))}
                </ol>

                <p style={{ marginTop: '20px', fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                    ⚡ The pixel fires once per session and sends only the UTM source, campaign, and country — no personal data is collected.
                </p>
            </div>
        </div>
    );
}
