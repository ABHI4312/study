import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { openWhenAPI } from '../services/api';
import Confetti from 'react-confetti';
import { FaCheck } from 'react-icons/fa';

const AddOpenWhen = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    condition: '',
    emoji: '💌',
  });
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const emojiOptions = [
    '💌', '💕', '💖', '😢', '😊', '😄', '😰', '🦁',
    '🎊', '🤗', '🫂', '🏆', '☁️', '🌟', '🙏', '💪',
    '🌙', '💝', '🌸', '🎉', '❤️', '💗', '✨', '🌈',
  ];

  const quickSuggestions = [
    { title: 'Open When You\'re Sad', condition: 'you\'re feeling sad', emoji: '😢' },
    { title: 'Open When You Miss Me', condition: 'you miss me', emoji: '💕' },
    { title: 'Open When You Need a Hug', condition: 'you need a hug', emoji: '🤗' },
    { title: 'Open When You\'re Stressed', condition: 'you\'re stressed', emoji: '😰' },
    { title: 'Open When You\'re Happy', condition: 'you\'re happy', emoji: '😊' },
    { title: 'Open When It\'s Your Birthday', condition: 'it\'s your birthday', emoji: '🎊' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const useSuggestion = (suggestion) => {
    setFormData({
      ...formData,
      title: suggestion.title,
      condition: suggestion.condition,
      emoji: suggestion.emoji,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await openWhenAPI.create(formData);
      
      setShowSuccess(true);
      
      setTimeout(() => {
        navigate('/open-when');
      }, 3000);
    } catch (error) {
      console.error('Error creating Open When letter:', error);
      alert('Failed to create letter. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4">
      {showSuccess && <Confetti recycle={false} numberOfPieces={500} />}
      
      {/* Success Modal */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', duration: 0.8 }}
              className="bg-gradient-to-br from-romantic-500 to-purple-500 p-12 rounded-3xl text-center"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5, repeat: 3 }}
              >
                <FaCheck className="text-white text-6xl mx-auto mb-4" />
              </motion.div>
              <h2 className="text-4xl font-romantic font-bold text-white mb-2">
                Letter Created! 💌
              </h2>
              <p className="text-white/90 text-lg">
                Your heartfelt message is ready to be opened ❤️
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-romantic font-bold mb-4 bg-gradient-to-r from-romantic-400 to-purple-400 bg-clip-text text-transparent">
            Create Open When Letter 💌
          </h1>
          <p className="text-gray-400 text-lg">
            Write a heartfelt message for a special moment
          </p>
        </motion.div>

        {/* Quick Suggestions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card mb-8"
        >
          <h2 className="text-2xl font-romantic font-bold text-white mb-4">
            ✨ Quick Suggestions
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {quickSuggestions.map((suggestion, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => useSuggestion(suggestion)}
                className="bg-dark-700 hover:bg-romantic-500 text-gray-300 hover:text-white px-4 py-3 rounded-lg transition-colors text-sm text-left"
              >
                <span className="text-2xl mr-2">{suggestion.emoji}</span>
                <span className="text-xs">{suggestion.title}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSubmit}
          className="card"
        >
          <div className="space-y-6">
            {/* Emoji Selection */}
            <div>
              <label className="block text-gray-300 mb-3 font-medium">
                Choose an Emoji
              </label>
              <div className="grid grid-cols-8 gap-2">
                {emojiOptions.map((emoji) => (
                  <motion.button
                    key={emoji}
                    type="button"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setFormData({ ...formData, emoji })}
                    className={`p-3 rounded-lg border-2 text-3xl transition-all ${
                      formData.emoji === emoji
                        ? 'border-romantic-500 bg-romantic-500/20'
                        : 'border-dark-600 bg-dark-700/50 hover:border-romantic-500/50'
                    }`}
                  >
                    {emoji}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-gray-300 mb-2 font-medium">
                Letter Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="input-field font-handwriting text-lg"
                placeholder="Open When You're..."
              />
              <p className="text-gray-500 text-sm mt-1">
                Example: "Open When You're Sad" or "Open When You Miss Me"
              </p>
            </div>

            {/* Condition */}
            <div>
              <label className="block text-gray-300 mb-2 font-medium">
                Condition (Short Description) *
              </label>
              <input
                type="text"
                name="condition"
                value={formData.condition}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="you're feeling sad"
              />
              <p className="text-gray-500 text-sm mt-1">
                Keep it short: "you're sad", "you miss me", "you need motivation"
              </p>
            </div>

            {/* Message */}
            <div>
              <label className="block text-gray-300 mb-2 font-medium">
                Your Heartfelt Message *
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="10"
                className="textarea-field font-handwriting text-lg leading-relaxed"
                placeholder="Write your heartfelt message here... Pour your heart out 💕"
                style={{
                  backgroundImage: 'repeating-linear-gradient(transparent, transparent 31px, #374151 31px, #374151 32px)',
                  lineHeight: '32px',
                  paddingTop: '8px',
                }}
              />
              <p className="text-gray-500 text-sm mt-2">
                💡 Tip: Be genuine, be loving, be you. This message will mean the world to them!
              </p>
            </div>

            {/* Info Box */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-romantic-500/10 border border-romantic-500/30 rounded-xl p-4"
            >
              <p className="text-gray-300 text-sm">
                <span className="font-bold text-romantic-400">✨ How it works:</span>
                <br />
                Your letter will appear as a sealed envelope on the "Open When" page. When opened, your heartfelt message will be revealed with a beautiful animation!
              </p>
            </motion.div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="btn-primary w-full text-lg py-4"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Creating Letter...
                </span>
              ) : (
                '💌 Create Open When Letter'
              )}
            </motion.button>
          </div>
        </motion.form>

        {/* Decorative Elements */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-3xl opacity-10"
              initial={{
                x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                y: -50,
              }}
              animate={{
                y: typeof window !== 'undefined' ? window.innerHeight + 50 : 1000,
                rotate: 360,
              }}
              transition={{
                duration: Math.random() * 15 + 15,
                repeat: Infinity,
                delay: Math.random() * 5,
              }}
            >
              {['💌', '💕', '💖', '✨', '⭐', '💫', '🌟', '💝'][i]}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AddOpenWhen;
