import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { MusicProvider } from './context/MusicContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MusicPlayer from './components/MusicPlayer';
import LoadingScreen from './components/LoadingScreen';
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

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <LoadingScreen onLoadingComplete={() => setLoading(false)} />;
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
