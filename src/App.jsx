import './index.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import Guide from './components/Guide';
import Onboarding from './components/Onboarding';

// Guard: if onboarding not complete, send to /onboarding
function DashboardGuard() {
    const done = localStorage.getItem('iq_onboarding_complete');
    return done ? <Dashboard /> : <Navigate to="/onboarding" replace />;
}

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/guide" element={<Guide />} />
                <Route path="/onboarding" element={<Onboarding />} />
                <Route path="/dashboard" element={<DashboardGuard />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
