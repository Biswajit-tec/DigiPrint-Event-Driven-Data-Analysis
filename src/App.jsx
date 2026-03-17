import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import Navigation from './components/Navigation';
import { ModeProvider } from './components/ui/ModeToggle';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import socketService from './services/socketService';

// Pages
import Landing from './pages/Landing';
import LoginPage from './pages/login';
import SignupPage from './pages/signup';
import Dashboard from './pages/Dashboard';
import LiveStream from './pages/LiveStream';
import Analytics from './pages/Analytics';
import UserAnalytics from './pages/UserAnalytics';
import EventReplay from './pages/EventReplay';
import AnomalyDetection from './pages/AnomalyDetection';
import ArchitectureViz from './pages/ArchitectureViz';
import QueryPlayground from './pages/QueryPlayground';
import Privacy from './pages/Privacy';
import CaseStudy from './pages/CaseStudy';

function App() {
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);

  useEffect(() => {
    // Detect reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setShouldReduceMotion(mediaQuery.matches);

    const handleChange = (e) => setShouldReduceMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);

    // Connect Socket.IO
    socketService.connect();

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
      socketService.disconnect();
    };
  }, []);

  return (
    <AuthProvider>
      <ModeProvider>
        <Router>
          <div className="min-h-screen bg-background text-foreground">
            <Navigation />

            <AnimatePresence mode="wait">
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/architecture" element={<ArchitectureViz />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/case-study" element={<CaseStudy />} />

                {/* Protected routes */}
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/live-stream" element={<ProtectedRoute><LiveStream /></ProtectedRoute>} />
                <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
                <Route path="/user-analytics" element={<ProtectedRoute><UserAnalytics /></ProtectedRoute>} />
                <Route path="/event-replay" element={<ProtectedRoute><EventReplay /></ProtectedRoute>} />
                <Route path="/anomalies" element={<ProtectedRoute><AnomalyDetection /></ProtectedRoute>} />
                <Route path="/query-playground" element={<ProtectedRoute><QueryPlayground /></ProtectedRoute>} />

                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </AnimatePresence>
          </div>
        </Router>
      </ModeProvider>
    </AuthProvider>
  );
}

export default App;
