import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Confetti from 'react-confetti';
import { FaImage, FaCheck } from 'react-icons/fa';

const AddSurprise = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    author: 'me',
    emoji: '💌',
    imageUrl: '',
  });
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [imagePreview, setImagePreview] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const emojiOptions = ['💌', '💕', '💖', '💝', '💗', '💓', '💞', '💘', '❤️', '🎁', '✨', '🌟'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === 'imageUrl' && value) {
      setImagePreview(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(`${API_URL}/surprises`, formData);
      
      setShowSuccess(true);
      
      setTimeout(() => {
        navigate('/surprises');
      }, 3000);
    } catch (error) {
      console.error('Error creating surprise message:', error);
      alert('Failed to create surprise message. Please try again.');
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
                Surprise Sent! 🎉
              </h2>
              <p className="text-white/90 text-lg">
                Your secret message is waiting to be discovered 💌
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-romantic font-bold mb-4 bg-gradient-to-r from-romantic-400 to-purple-400 bg-clip-text text-transparent">
            Leave a Surprise Message 💌
          </h1>
          <p className="text-gray-400 text-lg">
            Create a hidden message that will bring joy when discovered
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSubmit}
          className="card"
        >
          <div className="space-y-6">
            {/* Author Selection */}
            <div>
              <label className="block text-gray-300 mb-3 font-medium">
                Who's leaving this surprise? 💕
              </label>
              <div className="grid grid-cols-2 gap-4">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setFormData({ ...formData, author: 'me' })}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    formData.author === 'me'
                      ? 'border-romantic-500 bg-romantic-500/20 text-white'
                      : 'border-dark-600 bg-dark-700/50 text-gray-400'
                  }`}
                >
                  <div className="text-3xl mb-2">❤️</div>
                  <div className="font-medium">From Me</div>
                </motion.button>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setFormData({ ...formData, author: 'you' })}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    formData.author === 'you'
                      ? 'border-purple-500 bg-purple-500/20 text-white'
                      : 'border-dark-600 bg-dark-700/50 text-gray-400'
                  }`}
                >
                  <div className="text-3xl mb-2">💖</div>
                  <div className="font-medium">From You</div>
                </motion.button>
              </div>
            </div>

            {/* Emoji Selection */}
            <div>
              <label className="block text-gray-300 mb-3 font-medium">
                Choose an emoji for your envelope
              </label>
              <div className="grid grid-cols-6 gap-3">
                {emojiOptions.map((emoji) => (
                  <motion.button
                    key={emoji}
                    type="button"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setFormData({ ...formData, emoji })}
                    className={`p-4 rounded-xl border-2 text-3xl transition-all ${
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
                Message Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="input-field font-handwriting text-lg"
                placeholder="A little surprise for you..."
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-gray-300 mb-2 font-medium">
                Your Secret Message *
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="8"
                className="textarea-field font-handwriting text-lg leading-relaxed"
                placeholder="Write your heartfelt message here... This will remain hidden until they open it 💕"
                style={{
                  backgroundImage: 'repeating-linear-gradient(transparent, transparent 31px, #374151 31px, #374151 32px)',
                  lineHeight: '32px',
                  paddingTop: '8px',
                }}
              />
              <p className="text-gray-500 text-sm mt-2">
                💡 Tip: Make it personal, heartfelt, and full of love!
              </p>
            </div>

            {/* Image URL with Preview */}
            <div>
              <label className="block text-gray-300 mb-2 font-medium">
                <FaImage className="inline mr-2" />
                Add an Image (optional)
              </label>
              <input
                type="url"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                className="input-field"
                placeholder="https://example.com/image.jpg"
              />
              
              {imagePreview && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-4 rounded-xl overflow-hidden border-2 border-romantic-500/30"
                >
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-64 object-cover"
                    onError={() => setImagePreview('')}
                  />
                  <div className="bg-dark-700/50 p-2 text-center text-sm text-gray-400">
                    Image Preview
                  </div>
                </motion.div>
              )}
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
                Your message will appear as a sealed envelope. When opened, there will be a beautiful animation and confetti celebration! The message will remain private until discovered.
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
                  Creating Surprise...
                </span>
              ) : (
                '💌 Leave Surprise Message'
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

export default AddSurprise;
