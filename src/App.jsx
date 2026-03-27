import './index.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import Guide from './components/Guide';
import Onboarding from './components/Onboarding';
import ConnectApis from './components/ConnectApis';
import TrialExpired from './components/TrialExpired';
import { useAccessCheck } from './hooks/useAccessCheck';
import { WORKER_URL } from './config';

// Guard: checks server for trial/subscription status on every load
function DashboardGuard() {
    const onboardingDone = localStorage.getItem('iq_onboarding_complete');
    const token = localStorage.getItem('iq_token');

    // If onboarding not done at all, send to connect
    if (!onboardingDone && !token) {
        return <Navigate to="/connect" replace />;
    }

    // If onboarding done but no token (demo mode or Worker not deployed yet)
    // Allow access — this is the pre-backend demo state
    if (onboardingDone && !token) {
        return <Dashboard />;
    }

    return <AccessCheckedDashboard token={token} />;
}

function AccessCheckedDashboard({ token }) {
    const access = useAccessCheck();

    if (access.status === 'loading') {
        return (
            <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
                <div style={{ width: 40, height: 40, border: '3px solid var(--border)', borderTop: '3px solid var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Verifying access...</p>
            </div>
        );
    }

    if (access.status === 'expired') {
        return <TrialExpired />;
    }

    // status = 'trial' | 'active' | 'none' (fallback)
    return <Dashboard daysLeft={access.daysLeft} trialStatus={access.status} />;
}

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/guide" element={<Guide />} />
                <Route path="/connect" element={<ConnectApis />} />
                <Route path="/onboarding" element={<Onboarding />} />
                <Route path="/dashboard" element={<DashboardGuard />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
