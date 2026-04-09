import { useState } from 'react';
import { WORKER_URL } from '../config';

export default function PixelDeployer({ token, onClose }) {
    const [copied, setCopied] = useState(false);

    const pixelCode = `<script src="${WORKER_URL}/pixel.js?token=${token}" async></script>`;

    const handleCopy = () => {
        navigator.clipboard.writeText(pixelCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="modal-content" style={{ background: 'var(--surface)', borderRadius: '12px', padding: '30px', maxWidth: '600px', width: '90%', border: '1px solid var(--border)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)', maxHeight: '90vh', overflowY: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                    <div>
                        <h2 style={{ fontSize: '24px', margin: '0 0 8px 0', color: 'var(--text)' }}>Install Your Adlens Pixel</h2>
                        <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '14px' }}>
                            Your dashboard will remain empty until you deploy this code to your website. It takes 2 minutes.
                        </p>
                    </div>
                    <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '24px', cursor: 'pointer' }}>×</button>
                </div>

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
                    
                    <code style={{ display: 'block', background: '#000', padding: '16px', borderRadius: '6px', fontSize: '14px', color: '#a78bfa', wordBreak: 'break-all', fontFamily: 'monospace' }}>
                        {pixelCode}
                    </code>
                </div>

                <div className="installation-steps">
                    <h3 style={{ fontSize: '18px', marginBottom: '16px', color: 'var(--text)' }}>How to install (Shopify, WooCommerce, Custom Sites, etc):</h3>
                    <ol style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.6, margin: 0, paddingLeft: '20px' }}>
                        <li style={{ marginBottom: '10px' }}>Log into your Shopify Admin dashboard.</li>
                        <li style={{ marginBottom: '10px' }}>Go to <strong>Online Store</strong> → <strong>Themes</strong>.</li>
                        <li style={{ marginBottom: '10px' }}>Click the three dots <strong>(...)</strong> next to your current theme and click <strong>Edit code</strong>.</li>
                        <li style={{ marginBottom: '10px' }}>Open the <code>theme.liquid</code> file.</li>
                        <li style={{ marginBottom: '10px' }}>Scroll down until you see the closing <code>&lt;/head&gt;</code> tag.</li>
                        <li>Paste your copied Script Tag directly above <code>&lt;/head&gt;</code> and click <strong>Save</strong>.</li>
                    </ol>
                </div>
            </div>
        </div>
    );
}
