import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import Navigation from './components/Navigation';
import { ModeProvider } from './components/ui/ModeToggle';
import socketService from './services/socketService';

// Pages
import Landing from './pages/Landing';
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
    <ModeProvider>
      <Router>
        <div className="min-h-screen bg-dark-950 text-gray-100">
          <Navigation />

          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/live-stream" element={<LiveStream />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/user-analytics" element={<UserAnalytics />} />
              <Route path="/event-replay" element={<EventReplay />} />
              <Route path="/anomalies" element={<AnomalyDetection />} />
              <Route path="/architecture" element={<ArchitectureViz />} />
              <Route path="/query-playground" element={<QueryPlayground />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/case-study" element={<CaseStudy />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AnimatePresence>
        </div>
      </Router>
    </ModeProvider>
  );
}

export default App;
