import { useState } from 'react';

const UTM_FORMATS = {
    meta: {
        name: 'Meta Ads (Facebook / Instagram)',
        code: '?utm_source={{site_source_name}}&utm_medium={{placement}}&utm_campaign={{campaign.name}}&utm_content={{ad.name}}',
        instruction: 'Paste this into the "URL Parameters" box at the very bottom of the Facebook Ad creation screen.'
    },
    google: {
        name: 'Google Ads',
        code: '?utm_source=google&utm_medium=cpc&utm_campaign={campaignid}&utm_content={adgroupid}_{creative}',
        instruction: 'Paste this into the "Tracking template" field under Ad URL options.'
    },
    tiktok: {
        name: 'TikTok Ads',
        code: '?utm_source=tiktok&utm_medium=cpc&utm_campaign=__CAMPAIGN_NAME__&utm_content=__AID_NAME__',
        instruction: 'Paste this into the "Tracking Link" section of your TikTok ad.'
    },
    snapchat: {
        name: 'Snapchat Ads',
        code: '?utm_source=snapchat&utm_medium=cpc&utm_campaign={{campaign.name}}&utm_content={{ad.name}}',
        instruction: 'Append this to your base Website URL in the Snapchat ad editor.'
    },
    pinterest: {
        name: 'Pinterest Ads',
        code: '?utm_source=pinterest&utm_medium=cpc&utm_campaign={campaign_name}&utm_content={adgroup_name}',
        instruction: 'Add this to the destination URL of your pin ad.'
    },
    linkedin: {
        name: 'LinkedIn Ads',
        code: '?utm_source=linkedin&utm_medium=cpc&utm_campaign={{campaign.name}}&utm_content={{creative.id}}',
        instruction: 'Add to the destination URL for your Sponsored Content.'
    }
};

export default function UtmGenerator({ token, onClose }) {
    const [copied, setCopied] = useState('');

    const handleCopy = (code) => {
        navigator.clipboard.writeText(code);
        setCopied(code);
        setTimeout(() => setCopied(''), 2000);
    };

    return (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="modal-content" style={{ background: 'var(--surface)', borderRadius: '12px', padding: '30px', maxWidth: '600px', width: '90%', border: '1px solid var(--border)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)', maxHeight: '90vh', overflowY: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                    <div>
                        <h2 style={{ fontSize: '24px', margin: '0 0 8px 0', color: 'var(--text)' }}>Exact UTM Formats</h2>
                        <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '14px' }}>
                            These perfectly mapped dynamic strings are how Adlens instantly knows which ad drove the sale. Just copy and paste into your Ad Manager!
                        </p>
                    </div>
                    <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '24px', cursor: 'pointer' }}>×</button>
                </div>

                <div style={{ padding: '16px', background: 'rgba(35, 197, 82, 0.1)', borderLeft: '4px solid #23C552', borderRadius: '4px', marginBottom: '24px' }}>
                    <h3 style={{ margin: '0 0 8px 0', fontSize: '15px', color: '#23C552' }}>💡 Why are these links necessary?</h3>
                    <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                        Ad networks refuse to share customer data with each other. A "UTM Parameter" is simply an invisible tag that gets glued to your website address when someone clicks an ad. By pasting these exact formats into your Ads Manager, you force the ad networks to pass the "source" and "campaign name" directly into your Adlens Pixel. <strong>Without these, Adlens cannot credit your sales back to the specific ads!</strong>
                    </p>
                </div>
                
                <div className="utm-list" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {Object.values(UTM_FORMATS).map((fmt, idx) => {
                        return (
                            <div key={idx} className="utm-card" style={{ background: 'var(--surface-light)', border: '1px solid var(--border)', borderRadius: '8px', padding: '16px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                    <h3 style={{ margin: 0, fontSize: '16px', color: 'var(--primary)' }}>{fmt.name}</h3>
                                    <button 
                                        onClick={() => handleCopy(`${fmt.code}&adlens_id=${token.slice(0, 8)}`)}
                                        style={{ background: 'var(--primary)', color: '#000', border: 'none', padding: '6px 12px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                                    >
                                        {copied === fmt.code ? 'Copied! ✅' : 'Copy'}
                                    </button>
                                </div>
                                <code style={{ display: 'block', background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '4px', fontSize: '13px', color: '#a78bfa', wordBreak: 'break-all', marginBottom: '10px', userSelect: 'all' }}>
                                    {fmt.code}&amp;adlens_id={token.slice(0, 8)}
                                </code>
                                <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>
                                    💡 <strong>Where to place:</strong> {fmt.instruction}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
