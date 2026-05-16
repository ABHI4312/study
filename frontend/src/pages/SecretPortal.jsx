import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { authAPI, secretAPI, counterAPI, goalsAPI } from '../services/api';
import CountdownTimer from '../components/CountdownTimer';
import Confetti from 'react-confetti';

const SecretPortal = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [secretCode, setSecretCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  
  // Portal content
  const [loveLetter, setLoveLetter] = useState('');
  const [loveCounter, setLoveCounter] = useState(0);
  const [goals, setGoals] = useState([]);

  useEffect(() => {
    // Check if already authenticated
    const auth = localStorage.getItem('secretAuth');
    if (auth === 'true') {
      setIsAuthenticated(true);
      fetchPortalContent();
    }
  }, []);

  const fetchPortalContent = async () => {
    try {
      // Fetch secret message
      const secretRes = await secretAPI.getAll();
      if (secretRes.data.data.length > 0) {
        setLoveLetter(secretRes.data.data[0].message);
      }

      // Fetch love counter
      const counterRes = await counterAPI.get('love-counter');
      setLoveCounter(counterRes.data.data.count);

      // Fetch goals
      const goalsRes = await goalsAPI.getAll();
      setGoals(goalsRes.data.data);
    } catch (error) {
      console.error('Error fetching portal content:', error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await authAPI.verify(secretCode);
      setIsAuthenticated(true);
      localStorage.setItem('secretAuth', 'true');
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
      fetchPortalContent();
    } catch (error) {
      setError('Invalid secret code. Try again! 💔');
    } finally {
      setLoading(false);
    }
  };

  const handleIncrementLove = async () => {
    try {
      const res = await counterAPI.increment('love-counter');
      setLoveCounter(res.data.data.count);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    } catch (error) {
      console.error('Error incrementing counter:', error);
    }
  };

  const handleToggleGoal = async (id) => {
    try {
      await goalsAPI.toggle(id);
      fetchPortalContent();
    } catch (error) {
      console.error('Error toggling goal:', error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-romantic-900/30 via-dark-900 to-purple-900/30" />
        
        {/* Floating Locks */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-4xl opacity-20"
              initial={{
                x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                y: -50,
              }}
              animate={{
                y: typeof window !== 'undefined' ? window.innerHeight + 50 : 1000,
                rotate: 360,
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                delay: Math.random() * 5,
              }}
            >
              🔒
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card max-w-md w-full relative z-10"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-8xl text-center mb-6"
          >
            🔐
          </motion.div>

          <h2 className="text-3xl font-romantic font-bold text-center text-white mb-2">
            Secret Portal
          </h2>
          <p className="text-gray-400 text-center mb-8">
            Enter the secret code to unlock our private universe
          </p>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <input
                type="password"
                value={secretCode}
                onChange={(e) => setSecretCode(e.target.value)}
                placeholder="Enter secret code..."
                className="input-field text-center text-2xl tracking-widest"
                autoFocus
              />
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-center text-sm"
              >
                {error}
              </motion.p>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? 'Unlocking...' : '🔓 Unlock Portal'}
            </motion.button>
          </form>

          <motion.p
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-center text-gray-500 text-xs mt-6"
          >
            💡 Hint: It's something only we know...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 relative">
      {showConfetti && <Confetti recycle={false} numberOfPieces={500} />}

      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.h1
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-5xl font-romantic font-bold mb-4 bg-gradient-to-r from-romantic-400 to-purple-400 bg-clip-text text-transparent"
          >
            Welcome to Our Secret Universe 💖
          </motion.h1>
          <p className="text-gray-400 text-lg">
            This is our private sanctuary, filled with love and dreams
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Love Letter */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="card"
          >
            <h3 className="text-2xl font-romantic font-bold text-white mb-4 flex items-center gap-2">
              💌 Hidden Love Letter
            </h3>
            <div className="bg-dark-700/50 rounded-lg p-6 border border-romantic-500/20">
              <p className="text-gray-200 leading-relaxed whitespace-pre-wrap font-romantic text-lg">
                {loveLetter || 'No secret message yet. Create one to see it here! ❤️'}
              </p>
            </div>
          </motion.div>

          {/* Love Counter */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="card text-center"
          >
            <h3 className="text-2xl font-romantic font-bold text-white mb-4">
              💕 I Love You Counter
            </h3>
            <motion.div
              key={loveCounter}
              initial={{ scale: 1.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-8xl font-bold bg-gradient-to-r from-romantic-400 to-purple-400 bg-clip-text text-transparent mb-6"
            >
              {loveCounter}
            </motion.div>
            <p className="text-gray-400 mb-6">
              Times I've said "I love you" ❤️
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleIncrementLove}
              className="btn-primary"
            >
              💖 Say It Again!
            </motion.button>
          </motion.div>
        </div>

        {/* Countdown Timer */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <CountdownTimer 
            targetDate="2026-12-31T23:59:59" 
            title="Until Our Next Adventure"
          />
        </motion.div>

        {/* Future Goals */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card"
        >
          <h3 className="text-3xl font-romantic font-bold text-white mb-6 flex items-center gap-2">
            🎯 Our Future Goals
          </h3>
          
          {goals.length === 0 ? (
            <p className="text-gray-400 text-center py-8">
              No goals yet. Let's dream together! ✨
            </p>
          ) : (
            <div className="space-y-4">
              {goals.map((goal) => (
                <motion.div
                  key={goal._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ x: 5 }}
                  className={`bg-dark-700/50 rounded-lg p-4 border-l-4 ${
                    goal.isCompleted ? 'border-green-500' : 'border-romantic-500'
                  } cursor-pointer`}
                  onClick={() => handleToggleGoal(goal._id)}
                >
                  <div className="flex items-start gap-4">
                    <motion.div
                      animate={{ scale: goal.isCompleted ? [1, 1.2, 1] : 1 }}
                      className="text-3xl"
                    >
                      {goal.isCompleted ? '✅' : '⭕'}
                    </motion.div>
                    <div className="flex-1">
                      <h4 className={`text-lg font-semibold ${
                        goal.isCompleted ? 'text-green-400 line-through' : 'text-white'
                      }`}>
                        {goal.title}
                      </h4>
                      {goal.description && (
                        <p className="text-gray-400 text-sm mt-1">
                          {goal.description}
                        </p>
                      )}
                      {goal.targetDate && (
                        <p className="text-gray-500 text-xs mt-2">
                          Target: {new Date(goal.targetDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default SecretPortal;
