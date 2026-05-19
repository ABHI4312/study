import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { memoryAPI } from '../services/api';
import Confetti from 'react-confetti';
import { FaImage, FaHeart, FaCheck } from 'react-icons/fa';
import Loading from '../components/Loading';

const EditMemory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    category: 'other',
    imageUrl: '',
    tags: '',
    isFavorite: false,
    author: 'me',
    voiceNoteUrl: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMemory();
  }, [id]);

  const fetchMemory = async () => {
    try {
      const response = await memoryAPI.getOne(id);
      const memory = response.data.data;
      
      setFormData({
        title: memory.title || '',
        description: memory.description || '',
        date: memory.date ? new Date(memory.date).toISOString().split('T')[0] : '',
        category: memory.category || 'other',
        imageUrl: memory.imageUrl || '',
        tags: memory.tags ? memory.tags.join(', ') : '',
        isFavorite: memory.isFavorite || false,
        author: memory.author || 'me',
        voiceNoteUrl: memory.voiceNoteUrl || '',
      });
      
      if (memory.imageUrl) {
        setImagePreview(memory.imageUrl);
      }
    } catch (error) {
      console.error('Error fetching memory:', error);
      setError('Failed to load memory');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });

    // Update image preview when URL changes
    if (name === 'imageUrl' && value) {
      setImagePreview(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const dataToSend = {
        ...formData,
        tags: formData.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
      };

      await memoryAPI.update(id, dataToSend);
      
      // Show success animation
      setShowSuccess(true);
      
      // Navigate after animation
      setTimeout(() => {
        navigate(`/memory/${id}`);
      }, 2000);
    } catch (error) {
      console.error('Error updating memory:', error);
      alert('Failed to update memory. Please try again.');
      setSaving(false);
    }
  };

  if (loading) return <Loading />;

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <p className="text-6xl mb-4">😢</p>
          <h2 className="text-3xl font-romantic font-bold text-white mb-4">
            Failed to Load Memory
          </h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <Link to="/memories">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary"
            >
              ← Back to Memories
            </motion.button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      {showSuccess && <Confetti recycle={false} numberOfPieces={300} />}
      
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
                Memory Updated! 🎉
              </h2>
              <p className="text-white/90 text-lg">
                Your changes have been saved ❤️
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Link to={`/memory/${id}`}>
            <motion.button
              whileHover={{ scale: 1.05, x: -5 }}
              whileTap={{ scale: 0.95 }}
              className="btn-secondary"
            >
              ← Back to Memory
            </motion.button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-romantic font-bold mb-4 bg-gradient-to-r from-romantic-400 to-purple-400 bg-clip-text text-transparent">
            Edit Memory ✏️
          </h1>
          <p className="text-gray-400 text-lg">
            Update this special moment
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
                Who's adding this memory? 💕
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
                  <div className="font-medium">Added by Me</div>
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
                  <div className="font-medium">Added by You</div>
                </motion.button>
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-gray-300 mb-2 font-medium">
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="input-field font-handwriting text-lg"
                placeholder="Our first date..."
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-gray-300 mb-2 font-medium">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="6"
                className="textarea-field font-handwriting text-lg leading-relaxed"
                placeholder="Tell the story of this memory... Write from your heart 💕"
                style={{
                  backgroundImage: 'repeating-linear-gradient(transparent, transparent 31px, #374151 31px, #374151 32px)',
                  lineHeight: '32px',
                  paddingTop: '8px',
                }}
              />
            </div>

            {/* Date */}
            <div>
              <label className="block text-gray-300 mb-2 font-medium">
                Date *
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="input-field"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-gray-300 mb-2 font-medium">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="input-field"
              >
                <option value="first-time">First Time 💫</option>
                <option value="special-moment">Special Moment ✨</option>
                <option value="adventure">Adventure 🌟</option>
                <option value="milestone">Milestone 🎯</option>
                <option value="other">Other 💝</option>
              </select>
            </div>

            {/* Image URL with Preview */}
            <div>
              <label className="block text-gray-300 mb-2 font-medium">
                <FaImage className="inline mr-2" />
                Image URL (optional)
              </label>
              <input
                type="url"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                className="input-field"
                placeholder="https://example.com/image.jpg"
              />
              
              {/* Image Preview */}
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

            {/* Voice Note URL */}
            <div>
              <label className="block text-gray-300 mb-2 font-medium">
                🎤 Voice Note URL (optional)
              </label>
              <input
                type="url"
                name="voiceNoteUrl"
                value={formData.voiceNoteUrl}
                onChange={handleChange}
                className="input-field"
                placeholder="https://example.com/voice-note.mp3"
              />
              <p className="text-gray-500 text-sm mt-1">
                Add a link to a voice recording to make it extra special
              </p>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-gray-300 mb-2 font-medium">
                Tags (comma separated)
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="input-field"
                placeholder="love, happiness, adventure"
              />
            </div>

            {/* Favorite */}
            <div className="flex items-center">
              <input
                type="checkbox"
                name="isFavorite"
                checked={formData.isFavorite}
                onChange={handleChange}
                id="favorite"
                className="w-5 h-5 text-romantic-500 bg-dark-700 border-dark-600 rounded focus:ring-romantic-500"
              />
              <label htmlFor="favorite" className="ml-3 text-gray-300 flex items-center cursor-pointer">
                <FaHeart className="text-romantic-500 mr-2" />
                Mark as favorite
              </label>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4">
              <Link to={`/memory/${id}`} className="flex-1">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-secondary w-full text-lg py-4"
                >
                  Cancel
                </motion.button>
              </Link>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={saving}
                className="btn-primary flex-1 text-lg py-4"
              >
                {saving ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Saving...
                  </span>
                ) : (
                  '💾 Save Changes'
                )}
              </motion.button>
            </div>
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
              {['❤️', '💕', '💖', '✨', '⭐', '💫', '🌟', '💝'][i]}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EditMemory;
