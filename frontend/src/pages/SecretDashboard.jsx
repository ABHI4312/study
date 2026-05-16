import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Confetti from 'react-confetti';
import axios from 'axios';
import { FaHeart, FaCheckCircle, FaCircle } from 'react-icons/fa';

const SecretDashboard = () => {
  const [showConfetti, setShowConfetti] = useState(false);
  const [loveCounter, setLoveCounter] = useState(0);
  const [goals, setGoals] = useState([]);
  const [secretMessage, setSecretMessage] = useState(null);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const navigate = useNavigate();

  // Set your next meeting date here
  const nextMeetingDate = new Date('2026-06-01T00:00:00');

  useEffect(() => {
    fetchData();
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      
      // Fetch love counter
      const counterRes = await axios.get(`${API_URL}/counter/love-counter`);
      setLoveCounter(counterRes.data.data.count);

      // Fetch goals
      const goalsRes = await axios.get(`${API_URL}/goals`);
      setGoals(goalsRes.data.data);

      // Fetch secret message
      const secretsRes = await axios.get(`${API_URL}/secrets`);
      if (secretsRes.data.data.length > 0) {
        setSecretMessage(secretsRes.data.data[0]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const updateCountdown = () => {
    const now = new Date().getTime();
    const distance = nextMeetingDate.getTime() - now;

    if (distance > 0) {
      setCountdown({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }
  };

  const handleLoveClick = async () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 5000);

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await axios.post(`${API_URL}/counter/love-counter/increment`);
      setLoveCounter(response.data.data.count);
    } catch (error) {
      console.error('Error incrementing counter:', error);
    }
  };

  const toggleGoal = async (goalId) => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      await axios.put(`${API_URL}/goals/${goalId}/toggle`);
      fetchData();
    } catch (error) {
      console.error('Error toggling goal:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('secretToken');
    navigate('/secret-login');
  };

  return (
    <div className="min-h-screen py-12 px-4 relative overflow-hidden">
      {showConfetti && <Confetti recycle={false} numberOfPieces={500} />}

      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-2xl"
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
              y: typeof window !== 'undefined' ? window.innerHeight + 50 : 1000,
              opacity: 0.3,
            }}
            animate={{
              y: -50,
              rotate: [0, 360],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          >
            {['✨', '💫', '⭐', '💖'][Math.floor(Math.random() * 4)]}
          </motion.div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-romantic font-bold mb-4 bg-gradient-to-r from-romantic-400 to-purple-400 bg-clip-text text-transparent">
            Our Secret Universe 💝
          </h1>
          <p className="text-gray-400 text-lg">Welcome to our private sanctuary</p>
          <button
            onClick={handleLogout}
            className="mt-4 text-gray-500 hover:text-romantic-400 transition-colors"
          >
            Logout
          </button>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Secret Love Letter */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="card backdrop-blur-lg bg-dark-800/80"
          >
            <h2 className="text-3xl font-romantic font-bold mb-6 text-white flex items-center">
              <span className="mr-3">💌</span>
              Hidden Love Letter
            </h2>
            <div className="bg-dark-700/50 rounded-lg p-6 border border-romantic-500/20">
              <p className="text-gray-200 leading-relaxed whitespace-pre-wrap font-serif text-lg">
                {secretMessage?.message || 
                  "My Dearest Love,\n\nEvery moment with you feels like a beautiful dream. You are my sunshine on cloudy days, my anchor in stormy seas, and my home wherever we are.\n\nI love you more than words can express.\n\nForever yours ❤️"}
              </p>
            </div>
          </motion.div>

          {/* Countdown Timer */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="card backdrop-blur-lg bg-dark-800/80"
          >
            <h2 className="text-3xl font-romantic font-bold mb-6 text-white flex items-center">
              <span className="mr-3">⏰</span>
              Until We Meet Again
            </h2>
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: 'Days', value: countdown.days },
                { label: 'Hours', value: countdown.hours },
                { label: 'Minutes', value: countdown.minutes },
                { label: 'Seconds', value: countdown.seconds },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 1, repeat: Infinity, delay: index * 0.2 }}
                  className="bg-gradient-to-br from-romantic-500/20 to-purple-500/20 rounded-xl p-4 text-center border border-romantic-500/30"
                >
                  <div className="text-4xl font-bold text-romantic-400 mb-2">
                    {item.value}
                  </div>
                  <div className="text-gray-400 text-sm">{item.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* I Love You Counter */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card backdrop-blur-lg bg-dark-800/80 text-center"
          >
            <h2 className="text-3xl font-romantic font-bold mb-6 text-white">
              I Love You Counter
            </h2>
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-8xl font-bold bg-gradient-to-r from-romantic-400 to-purple-400 bg-clip-text text-transparent mb-6"
            >
              {loveCounter}
            </motion.div>
            <p className="text-gray-400 mb-6">Times I've said "I love you"</p>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleLoveClick}
              className="btn-primary text-xl px-8 py-4"
            >
              <FaHeart className="inline mr-2" />
              Say It Again!
            </motion.button>
          </motion.div>

          {/* Future Goals Checklist */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="card backdrop-blur-lg bg-dark-800/80"
          >
            <h2 className="text-3xl font-romantic font-bold mb-6 text-white flex items-center">
              <span className="mr-3">🎯</span>
              Our Future Goals
            </h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {goals.length === 0 ? (
                <p className="text-gray-400 text-center py-8">
                  No goals yet. Add some from the backend!
                </p>
              ) : (
                goals.map((goal) => (
                  <motion.div
                    key={goal._id}
                    whileHover={{ x: 5 }}
                    onClick={() => toggleGoal(goal._id)}
                    className="flex items-center space-x-3 p-4 bg-dark-700/50 rounded-lg cursor-pointer hover:bg-dark-700 transition-colors border border-dark-600"
                  >
                    {goal.isCompleted ? (
                      <FaCheckCircle className="text-green-500 text-xl flex-shrink-0" />
                    ) : (
                      <FaCircle className="text-gray-600 text-xl flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p
                        className={`${
                          goal.isCompleted
                            ? 'line-through text-gray-500'
                            : 'text-gray-200'
                        }`}
                      >
                        {goal.title}
                      </p>
                      {goal.description && (
                        <p className="text-gray-500 text-sm mt-1">
                          {goal.description}
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </div>

        {/* Easter Egg */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="mt-12 text-center"
        >
          <motion.p
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-gray-600 text-sm"
          >
            💫 You found the secret dashboard! You're amazing! 💫
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};

export default SecretDashboard;
