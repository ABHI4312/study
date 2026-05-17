import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { MusicProvider } from './context/MusicContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MusicPlayer from './components/MusicPlayer';
import LoadingScreen from './components/LoadingScreen';
import SitePasswordGate from './components/SitePasswordGate';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './pages/Landing';
import MemoryTimeline from './pages/MemoryTimeline';
import MemoryDetail from './pages/MemoryDetail';
import OpenWhen from './pages/OpenWhen';
import SecretMessage from './pages/SecretMessage';
import AddMemory from './pages/AddMemory';
import SecretLogin from './pages/SecretLogin';
import SecretDashboard from './pages/SecretDashboard';
import SurpriseMessages from './pages/SurpriseMessages';
import AddSurprise from './pages/AddSurprise';
import ChooseMusic from './pages/ChooseMusic';
import AddOpenWhen from './pages/AddOpenWhen';

function App() {
  const [loading, setLoading] = useState(true);
  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => {
    // Check if site is already unlocked in this session
    const unlocked = sessionStorage.getItem('siteUnlocked');
    if (unlocked === 'true') {
      setIsUnlocked(true);
    }

    // Simulate initial loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleUnlock = () => {
    setIsUnlocked(true);
  };

  if (loading) {
    return <LoadingScreen onLoadingComplete={() => setLoading(false)} />;
  }

  // Show password gate if not unlocked
  if (!isUnlocked) {
    return <SitePasswordGate onUnlock={handleUnlock} />;
  }

  return (
    <MusicProvider>
      <Router>
        <div className="flex flex-col min-h-screen relative">
          <Navbar />
          <MusicPlayer />
          <AnimatePresence mode="wait">
            <motion.main
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex-grow"
            >
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/memories" element={<MemoryTimeline />} />
                <Route path="/memory/:id" element={<MemoryDetail />} />
                <Route path="/open-when" element={<OpenWhen />} />
                <Route path="/add-open-when" element={<AddOpenWhen />} />
                <Route path="/secrets" element={<SecretMessage />} />
                <Route path="/add-memory" element={<AddMemory />} />
                <Route path="/surprises" element={<SurpriseMessages />} />
                <Route path="/add-surprise" element={<AddSurprise />} />
                <Route path="/choose-music" element={<ChooseMusic />} />
                <Route path="/secret-login" element={<SecretLogin />} />
                <Route path="/secret-portal" element={<SecretLogin />} />
                <Route
                  path="/secret-dashboard"
                  element={
                    <ProtectedRoute>
                      <SecretDashboard />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </motion.main>
          </AnimatePresence>
          <Footer />
        </div>
      </Router>
    </MusicProvider>
  );
}

export default App;
