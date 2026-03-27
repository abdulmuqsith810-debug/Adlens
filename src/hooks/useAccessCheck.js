import { useState, useEffect } from 'react';
import { WORKER_URL } from '../config';

// Checks whether the current user's trial/subscription is still valid.
// Returns: { status: 'trial'|'active'|'expired'|'none', daysLeft, loading }
export function useAccessCheck() {
    const [result, setResult] = useState({ status: 'loading', daysLeft: 0 });

    useEffect(() => {
        const token = localStorage.getItem('iq_token');
        if (!token) {
            setResult({ status: 'none', daysLeft: 0 });
            return;
        }

        fetch(`${WORKER_URL}/api/check-access?token=${token}`)
            .then(r => r.json())
            .then(data => {
                setResult({
                    status: data.status || 'expired',
                    daysLeft: data.daysLeft || 0,
                });
            })
            .catch(() => {
                // If Worker is unreachable (e.g. not deployed yet), fall back to localStorage
                // This allows the demo to still work before the backend is live
                const onboardingDone = localStorage.getItem('iq_onboarding_complete');
                setResult({
                    status: onboardingDone ? 'trial' : 'none',
                    daysLeft: 14,
                    fallback: true,
                });
            });
    }, []);

    return result;
}
