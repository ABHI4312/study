import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { memoryAPI } from '../services/api';
import Loading from '../components/Loading';

const MemoryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [memory, setMemory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMemory();
  }, [id]);

  const fetchMemory = async () => {
    try {
      const response = await memoryAPI.getOne(id);
      setMemory(response.data.data);
    } catch (error) {
      console.error('Error fetching memory:', error);
      setError('Memory not found');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      'first-time': 'from-romantic-500 to-pink-500',
      'special-moment': 'from-purple-500 to-pink-500',
      'adventure': 'from-blue-500 to-cyan-500',
      'milestone': 'from-green-500 to-emerald-500',
      'other': 'from-gray-500 to-slate-500',
    };
    return colors[category] || colors.other;
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this memory?')) {
      try {
        await memoryAPI.delete(id);
        navigate('/memories');
      } catch (error) {
        console.error('Error deleting memory:', error);
        alert('Failed to delete memory');
      }
    }
  };

  if (loading) return <Loading />;

  if (error || !memory) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <p className="text-6xl mb-4">😢</p>
          <h2 className="text-3xl font-romantic font-bold text-white mb-4">
            Memory Not Found
          </h2>
          <p className="text-gray-400 mb-6">
            This memory doesn't exist or has been deleted.
          </p>
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
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Link to="/memories">
            <motion.button
              whileHover={{ scale: 1.05, x: -5 }}
              whileTap={{ scale: 0.95 }}
              className="btn-secondary"
            >
              ← Back to Memories
            </motion.button>
          </Link>
        </motion.div>

        {/* Memory Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          {/* Header with Favorite */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-5xl font-romantic font-bold text-white mb-2"
              >
                {memory.title}
                {memory.isFavorite && (
                  <motion.span
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="ml-4 text-5xl"
                  >
                    ❤️
                  </motion.span>
                )}
              </motion.h1>
              <p className="text-gray-400 text-lg mb-2">
                {formatDate(memory.date)}
              </p>
              {/* Author Label */}
              {memory.author && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <span
                    className={`inline-block text-sm px-4 py-2 rounded-full font-medium ${
                      memory.author === 'me'
                        ? 'bg-romantic-500/20 text-romantic-400 border border-romantic-500/30'
                        : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                    }`}
                  >
                    {memory.author === 'me' ? 'Added by Me ❤️' : 'Added by You 💖'}
                  </span>
                </motion.div>
              )}
            </div>
          </div>

          {/* Category Badge */}
          <div className="mb-6">
            <span
              className={`inline-block bg-gradient-to-r ${getCategoryColor(
                memory.category
              )} text-white px-6 py-2 rounded-full text-sm font-medium`}
            >
              {memory.category.replace('-', ' ').toUpperCase()}
            </span>
          </div>

          {/* Image */}
          {memory.imageUrl && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-6 rounded-xl overflow-hidden"
            >
              <img
                src={memory.imageUrl}
                alt={memory.title}
                className="w-full h-auto max-h-[500px] object-cover"
              />
            </motion.div>
          )}

          {/* Description */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-6"
          >
            <h3 className="text-2xl font-romantic font-semibold text-white mb-4">
              Our Story
            </h3>
            <p className="text-gray-300 text-lg leading-relaxed whitespace-pre-wrap">
              {memory.description}
            </p>
          </motion.div>

          {/* Voice Note */}
          {memory.voiceNoteUrl && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              className="mb-6"
            >
              <h3 className="text-2xl font-romantic font-semibold text-white mb-4">
                🎤 Voice Note
              </h3>
              <div className="bg-dark-700/50 rounded-xl p-4">
                <audio controls className="w-full">
                  <source src={memory.voiceNoteUrl} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              </div>
            </motion.div>
          )}

          {/* Tags */}
          {memory.tags && memory.tags.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mb-6"
            >
              <h3 className="text-xl font-romantic font-semibold text-white mb-3">
                Tags
              </h3>
              <div className="flex flex-wrap gap-3">
                {memory.tags.map((tag, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="bg-dark-700 text-gray-300 px-4 py-2 rounded-lg text-sm hover:bg-romantic-500 hover:text-white transition-colors cursor-default"
                  >
                    #{tag}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          )}

          {/* Metadata */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="border-t border-dark-600 pt-6 mt-6"
          >
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-400">
              <div>
                <p className="font-semibold text-gray-300 mb-1">Created</p>
                <p>{new Date(memory.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-300 mb-1">Last Updated</p>
                <p>{new Date(memory.updatedAt).toLocaleDateString()}</p>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex gap-4 mt-8"
          >
            <Link to={`/edit-memory/${memory._id}`} className="flex-1">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-secondary w-full"
              >
                ✏️ Edit Memory
              </motion.button>
            </Link>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              🗑️ Delete
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Decorative Elements */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-4xl opacity-20"
              initial={{
                x: Math.random() * window.innerWidth,
                y: -50,
              }}
              animate={{
                y: window.innerHeight + 50,
                rotate: 360,
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                delay: Math.random() * 5,
              }}
            >
              {['❤️', '💕', '💖', '✨', '⭐'][i]}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MemoryDetail;
