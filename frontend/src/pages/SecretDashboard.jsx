import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Confetti from 'react-confetti';
import axios from 'axios';
import { FaHeart, FaCheckCircle, FaCircle, FaEdit, FaPlus, FaTrash } from 'react-icons/fa';

const SecretDashboard = () => {
  const [showConfetti, setShowConfetti] = useState(false);
  const [loveCounter, setLoveCounter] = useState(0);
  const [goals, setGoals] = useState([]);
  const [secretMessage, setSecretMessage] = useState(null);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [nextMeetingDate, setNextMeetingDate] = useState(new Date('2026-06-01T00:00:00'));
  const [showEditDate, setShowEditDate] = useState(false);
  const [newDate, setNewDate] = useState('');
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [newGoal, setNewGoal] = useState({ title: '', description: '', targetDate: '', category: 'together' });
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [nextMeetingDate]); // Update countdown when meeting date changes

  const fetchData = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      
      // Fetch love counter
      const counterRes = await axios.get(`${API_URL}/counter/love-counter`);
      setLoveCounter(counterRes.data.data.count);
      
      // Set meeting date from counter if exists
      if (counterRes.data.data.meetingDate) {
        setNextMeetingDate(new Date(counterRes.data.data.meetingDate));
      }

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
    } else {
      // Meeting date has passed
      setCountdown({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
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

  const handleUpdateMeetingDate = async () => {
    if (!newDate) {
      alert('Please select a date');
      return;
    }

    const selectedDate = new Date(newDate);
    const now = new Date();
    
    if (selectedDate <= now) {
      alert('Please select a future date! ⏰');
      return;
    }

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      await axios.put(`${API_URL}/counter/love-counter/meeting-date`, {
        meetingDate: newDate,
      });
      setNextMeetingDate(selectedDate);
      setShowEditDate(false);
      setNewDate('');
      alert('Meeting date updated! 💕');
    } catch (error) {
      console.error('Error updating meeting date:', error);
      alert('Failed to update date');
    }
  };

  const handleAddGoal = async () => {
    if (!newGoal.title) {
      alert('Please enter a goal title');
      return;
    }

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      await axios.post(`${API_URL}/goals`, newGoal);
      setShowAddGoal(false);
      setNewGoal({ title: '', description: '', targetDate: '', category: 'together' });
      fetchData();
      alert('Goal added! 🎯');
    } catch (error) {
      console.error('Error adding goal:', error);
      alert('Failed to add goal');
    }
  };

  const handleDeleteGoal = async (goalId) => {
    if (!confirm('Are you sure you want to delete this goal?')) {
      return;
    }

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      await axios.delete(`${API_URL}/goals/${goalId}`);
      fetchData();
    } catch (error) {
      console.error('Error deleting goal:', error);
      alert('Failed to delete goal');
    }
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
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-romantic font-bold text-white flex items-center">
                <span className="mr-3">⏰</span>
                {nextMeetingDate.getTime() > new Date().getTime() 
                  ? 'Until We Meet Again' 
                  : 'We\'ve Met! 💕'}
              </h2>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowEditDate(true)}
                className="text-romantic-400 hover:text-romantic-300 transition-colors"
              >
                <FaEdit size={20} />
              </motion.button>
            </div>
            
            {nextMeetingDate.getTime() > new Date().getTime() ? (
              <>
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
                
                <p className="text-gray-400 text-sm text-center mt-4">
                  Meeting on: {nextMeetingDate.toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </>
            ) : (
              <div className="text-center py-8">
                <motion.div
                  animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-8xl mb-4"
                >
                  🎉
                </motion.div>
                <p className="text-2xl text-romantic-400 font-romantic font-bold mb-2">
                  The wait is over!
                </p>
                <p className="text-gray-400 text-sm">
                  Last meeting was on: {nextMeetingDate.toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
                <p className="text-gray-500 text-xs mt-2">
                  Click the edit button to set your next meeting date
                </p>
              </div>
            )}
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
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-romantic font-bold text-white flex items-center">
                <span className="mr-3">🎯</span>
                Our Future Goals
              </h2>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowAddGoal(true)}
                className="bg-romantic-500 hover:bg-romantic-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <FaPlus /> Add Goal
              </motion.button>
            </div>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {goals.length === 0 ? (
                <p className="text-gray-400 text-center py-8">
                  No goals yet. Click "Add Goal" to create one!
                </p>
              ) : (
                goals.map((goal) => (
                  <motion.div
                    key={goal._id}
                    whileHover={{ x: 5 }}
                    className="flex items-center space-x-3 p-4 bg-dark-700/50 rounded-lg border border-dark-600 group"
                  >
                    <div
                      onClick={() => toggleGoal(goal._id)}
                      className="cursor-pointer"
                    >
                      {goal.isCompleted ? (
                        <FaCheckCircle className="text-green-500 text-xl flex-shrink-0" />
                      ) : (
                        <FaCircle className="text-gray-600 text-xl flex-shrink-0" />
                      )}
                    </div>
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
                      {goal.targetDate && (
                        <p className="text-gray-600 text-xs mt-1">
                          📅 {new Date(goal.targetDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDeleteGoal(goal._id)}
                      className="text-red-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <FaTrash />
                    </motion.button>
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

      {/* Edit Meeting Date Modal */}
      <AnimatePresence>
        {showEditDate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowEditDate(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-dark-800 to-dark-900 rounded-2xl p-8 max-w-md w-full border-2 border-romantic-500/30"
            >
              <h3 className="text-3xl font-romantic font-bold text-white mb-6 text-center">
                Update Meeting Date 📅
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2">Select New Date</label>
                  <input
                    type="datetime-local"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-4 py-3 bg-dark-700 border-2 border-romantic-500/30 rounded-lg text-white focus:outline-none focus:border-romantic-500"
                  />
                </div>

                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleUpdateMeetingDate}
                    className="flex-1 bg-gradient-to-r from-romantic-500 to-purple-500 text-white py-3 rounded-lg font-semibold"
                  >
                    Update Date
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowEditDate(false)}
                    className="flex-1 bg-dark-700 text-gray-300 py-3 rounded-lg font-semibold"
                  >
                    Cancel
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Goal Modal */}
      <AnimatePresence>
        {showAddGoal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowAddGoal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-dark-800 to-dark-900 rounded-2xl p-8 max-w-md w-full border-2 border-romantic-500/30 max-h-[90vh] overflow-y-auto"
            >
              <h3 className="text-3xl font-romantic font-bold text-white mb-6 text-center">
                Add New Goal 🎯
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2">Goal Title *</label>
                  <input
                    type="text"
                    value={newGoal.title}
                    onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                    placeholder="e.g., Visit Paris Together"
                    className="w-full px-4 py-3 bg-dark-700 border-2 border-romantic-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-romantic-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Description</label>
                  <textarea
                    value={newGoal.description}
                    onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                    placeholder="Add more details about this goal..."
                    rows="3"
                    className="w-full px-4 py-3 bg-dark-700 border-2 border-romantic-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-romantic-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Target Date (Optional)</label>
                  <input
                    type="date"
                    value={newGoal.targetDate}
                    onChange={(e) => setNewGoal({ ...newGoal, targetDate: e.target.value })}
                    className="w-full px-4 py-3 bg-dark-700 border-2 border-romantic-500/30 rounded-lg text-white focus:outline-none focus:border-romantic-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Category</label>
                  <select
                    value={newGoal.category}
                    onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value })}
                    className="w-full px-4 py-3 bg-dark-700 border-2 border-romantic-500/30 rounded-lg text-white focus:outline-none focus:border-romantic-500"
                  >
                    <option value="together">Together</option>
                    <option value="travel">Travel</option>
                    <option value="personal">Personal</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAddGoal}
                    className="flex-1 bg-gradient-to-r from-romantic-500 to-purple-500 text-white py-3 rounded-lg font-semibold"
                  >
                    Add Goal
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setShowAddGoal(false);
                      setNewGoal({ title: '', description: '', targetDate: '', category: 'together' });
                    }}
                    className="flex-1 bg-dark-700 text-gray-300 py-3 rounded-lg font-semibold"
                  >
                    Cancel
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SecretDashboard;
