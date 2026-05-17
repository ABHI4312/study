import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaLock, FaHeart, FaEye, FaEyeSlash } from 'react-icons/fa';

const SitePasswordGate = ({ onUnlock }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [attempts, setAttempts] = useState(0);

  // The site access password (you can change this)
  const SITE_PASSWORD = 'Abhiya@1328';

  // Floating hearts animation
  const FloatingHeart = ({ delay }) => (
    <motion.div
      className="absolute text-romantic-400 opacity-20"
      initial={{
        x: Math.random() * window.innerWidth,
        y: window.innerHeight + 50,
      }}
      animate={{
        y: -50,
        x: Math.random() * window.innerWidth,
      }}
      transition={{
        duration: 8 + Math.random() * 4,
        delay: delay,
        repeat: Infinity,
      }}
    >
      <FaHeart size={20 + Math.random() * 20} />
    </motion.div>
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (password === SITE_PASSWORD) {
      // Store in sessionStorage (will expire when browser closes)
      sessionStorage.setItem('siteUnlocked', 'true');
      setError('');
      onUnlock();
    } else {
      setAttempts(attempts + 1);
      setError('Incorrect password. Try again! 💔');
      setPassword('');
      
      // Shake animation
      const dialog = document.getElementById('password-dialog');
      dialog.classList.add('shake');
      setTimeout(() => dialog.classList.remove('shake'), 500);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-gradient-to-br from-dark-900 via-purple-900/20 to-romantic-900/30 flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <FloatingHeart key={i} delay={i * 0.5} />
        ))}
      </div>

      {/* Particles Effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-romantic-400 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              opacity: 0,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      {/* Password Dialog */}
      <motion.div
        id="password-dialog"
        initial={{ scale: 0, rotate: -180, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        transition={{ type: 'spring', duration: 0.8, bounce: 0.4 }}
        className="relative z-10 bg-gradient-to-br from-dark-800/95 to-dark-900/95 backdrop-blur-xl rounded-3xl p-8 md:p-12 max-w-md w-full mx-4 border-2 border-romantic-500/30 shadow-2xl shadow-romantic-500/20"
      >
        {/* Lock Icon */}
        <motion.div
          animate={{
            rotate: [0, -10, 10, -10, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 1,
          }}
          className="flex justify-center mb-6"
        >
          <div className="bg-gradient-to-br from-romantic-500 to-purple-500 p-6 rounded-full">
            <FaLock className="text-white text-4xl" />
          </div>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-romantic font-bold mb-3 bg-gradient-to-r from-romantic-400 to-purple-400 bg-clip-text text-transparent">
            Our Little Universe
          </h1>
          <p className="text-gray-400 text-sm">
            This is a private space. Please enter the password to continue.
          </p>
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-3xl mt-3"
          >
            💕
          </motion.div>
        </motion.div>

        {/* Password Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              placeholder="Enter password..."
              className="w-full px-6 py-4 bg-dark-700/50 border-2 border-romantic-500/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-romantic-500 transition-all pr-12"
              autoFocus
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-romantic-400 transition-colors"
            >
              {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </button>
          </div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm text-center"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full bg-gradient-to-r from-romantic-500 to-purple-500 text-white font-semibold py-4 rounded-xl hover:shadow-lg hover:shadow-romantic-500/50 transition-all flex items-center justify-center gap-2"
          >
            <FaLock />
            Unlock Our Universe
          </motion.button>
        </motion.form>

        {/* Hint */}
        {attempts >= 3 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 text-center text-gray-500 text-xs"
          >
            💡 Hint: Check with the person who shared this with you
          </motion.div>
        )}

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 text-center text-gray-600 text-xs"
        >
          🔒 This site is password protected for privacy
        </motion.div>
      </motion.div>

      {/* CSS for shake animation */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        .shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default SitePasswordGate;
