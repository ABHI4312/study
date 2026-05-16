import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ParticlesBackground from '../components/ParticlesBackground';

const SecretLogin = () => {
  const [secretCode, setSecretCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/verify`,
        { secretCode }
      );

      if (response.data.success) {
        localStorage.setItem('secretToken', response.data.token);
        navigate('/secret-dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid secret code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      <ParticlesBackground />
      
      {/* Animated Background Glow */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <div className="w-96 h-96 bg-romantic-500 rounded-full blur-3xl" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="card backdrop-blur-xl bg-dark-800/90 border-2 border-romantic-500/30">
          {/* Lock Icon */}
          <motion.div
            animate={{
              rotate: [0, -10, 10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-center mb-8"
          >
            <div className="text-8xl mb-4">🔐</div>
            <h2 className="text-3xl font-romantic font-bold bg-gradient-to-r from-romantic-400 to-purple-400 bg-clip-text text-transparent">
              Secret Portal
            </h2>
            <p className="text-gray-400 mt-2">Enter the code to unlock our secrets</p>
          </motion.div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="password"
                value={secretCode}
                onChange={(e) => setSecretCode(e.target.value)}
                placeholder="Enter secret code..."
                className="input-field text-center text-lg tracking-widest"
                required
                autoFocus
              />
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-400 text-center"
              >
                {error}
              </motion.div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="btn-primary w-full text-lg"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Verifying...
                </span>
              ) : (
                'Unlock Secrets'
              )}
            </motion.button>
          </form>

          {/* Hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-6 text-center"
          >
            <p className="text-gray-500 text-sm">
              💡 Hint: It's something only we know...
            </p>
          </motion.div>
        </div>

        {/* Floating Hearts */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-3xl"
              initial={{
                x: Math.random() * 400,
                y: 500,
                opacity: 0.6,
              }}
              animate={{
                y: -100,
                rotate: [0, 360],
              }}
              transition={{
                duration: Math.random() * 5 + 5,
                repeat: Infinity,
                delay: Math.random() * 3,
              }}
            >
              {['💕', '💖', '💗', '💝'][Math.floor(Math.random() * 4)]}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default SecretLogin;
