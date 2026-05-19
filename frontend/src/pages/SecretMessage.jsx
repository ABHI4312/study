import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { secretAPI } from '../services/api';
import Loading from '../components/Loading';

const SecretMessage = () => {
  const [secrets, setSecrets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [revealedSecret, setRevealedSecret] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    voiceNoteUrl: '',
    videoUrl: '',
    isPasswordProtected: false,
  });

  useEffect(() => {
    fetchSecrets();
  }, []);

  const fetchSecrets = async () => {
    try {
      const response = await secretAPI.getAll();
      setSecrets(response.data.data);
    } catch (error) {
      console.error('Error fetching secrets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReveal = async (secret) => {
    if (!secret.isRevealed) {
      try {
        await secretAPI.reveal(secret._id);
        fetchSecrets();
      } catch (error) {
        console.error('Error revealing secret:', error);
      }
    }
    setRevealedSecret(secret);
  };

  const handleCreateSecret = async (e) => {
    e.preventDefault();
    try {
      await secretAPI.create(formData);
      setFormData({
        title: '',
        message: '',
        voiceNoteUrl: '',
        videoUrl: '',
        isPasswordProtected: false,
      });
      setShowCreateForm(false);
      fetchSecrets();
      alert('✨ Secret message created successfully!');
    } catch (error) {
      console.error('Error creating secret:', error);
      alert('Failed to create secret message');
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleDeleteSecret = async (secretId, e) => {
    e.stopPropagation(); // Prevent opening the secret when clicking delete
    if (window.confirm('Are you sure you want to delete this secret message?')) {
      try {
        await secretAPI.delete(secretId);
        fetchSecrets();
      } catch (error) {
        console.error('Error deleting secret:', error);
        alert('Failed to delete secret message');
      }
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-romantic font-bold mb-4 bg-gradient-to-r from-romantic-400 to-purple-400 bg-clip-text text-transparent">
            Secret Messages 🔐
          </h1>
          <p className="text-gray-400 text-lg">
            Hidden surprises waiting to be discovered
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCreateForm(true)}
            className="btn-primary mt-6"
          >
            ✨ Create New Secret
          </motion.button>
        </motion.div>

        {secrets.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-4xl mb-4">🔒</p>
            <p className="text-gray-400 text-lg">No secrets yet. Create your first one!</p>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {secrets.map((secret, index) => (
              <motion.div
                key={secret._id}
                initial={{ opacity: 0, rotateY: 90 }}
                animate={{ opacity: 1, rotateY: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="card cursor-pointer relative"
                onClick={() => handleReveal(secret)}
              >
                <button
                  onClick={(e) => handleDeleteSecret(secret._id, e)}
                  className="absolute top-3 right-3 bg-red-500/80 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center transition-colors z-10"
                  title="Delete secret"
                >
                  ×
                </button>
                <div className="text-center">
                  <motion.div
                    animate={{
                      scale: secret.isRevealed ? 1 : [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: secret.isRevealed ? 0 : Infinity,
                    }}
                    className="text-6xl mb-4"
                  >
                    {secret.isRevealed ? '🔓' : '🔒'}
                  </motion.div>
                  <h3 className="text-xl font-romantic font-semibold mb-2 text-white">
                    {secret.isRevealed ? secret.title : 'Tap to Reveal'}
                  </h3>
                  {secret.isRevealed && (
                    <p className="text-xs text-romantic-400">
                      Revealed on {new Date(secret.revealedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Secret Modal */}
        {revealedSecret && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
            onClick={() => setRevealedSecret(null)}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0, rotateY: 90 }}
              animate={{ scale: 1, opacity: 1, rotateY: 0 }}
              transition={{ type: 'spring', duration: 0.8 }}
              className="bg-gradient-to-br from-romantic-900/50 to-purple-900/50 backdrop-blur-lg rounded-xl p-8 max-w-2xl w-full border border-romantic-500/30"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 1 }}
                  className="text-6xl mb-4"
                >
                  ✨
                </motion.div>
                <h2 className="text-3xl font-romantic font-bold text-white mb-2">
                  {revealedSecret.title}
                </h2>
                <p className="text-romantic-400 text-sm">
                  Secret Revealed!
                </p>
              </div>
              <div className="bg-dark-800/50 rounded-lg p-6 mb-6 border border-romantic-500/20">
                <p className="text-gray-200 text-lg text-center leading-relaxed mb-4">
                  {revealedSecret.message}
                </p>
                
                {revealedSecret.voiceNoteUrl && (
                  <div className="mt-4">
                    <p className="text-romantic-300 text-sm mb-2 text-center">🎵 Voice Note:</p>
                    <audio controls className="w-full">
                      <source src={revealedSecret.voiceNoteUrl} type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                )}
                
                {revealedSecret.videoUrl && (
                  <div className="mt-4">
                    <p className="text-romantic-300 text-sm mb-2 text-center">🎬 Video:</p>
                    <video controls className="w-full rounded-lg">
                      <source src={revealedSecret.videoUrl} type="video/mp4" />
                      Your browser does not support the video element.
                    </video>
                  </div>
                )}
              </div>
              <button
                onClick={() => setRevealedSecret(null)}
                className="btn-primary w-full"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}

        {/* Create Secret Form Modal */}
        {showCreateForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
            onClick={() => setShowCreateForm(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-gradient-to-br from-romantic-900/50 to-purple-900/50 backdrop-blur-lg rounded-xl p-8 max-w-2xl w-full border border-romantic-500/30 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-3xl font-romantic font-bold text-white mb-6 text-center">
                Create Secret Message 🔐
              </h2>
              <form onSubmit={handleCreateSecret} className="space-y-4">
                <div>
                  <label className="block text-romantic-300 mb-2 font-medium">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-dark-800/50 border border-romantic-500/30 rounded-lg text-white focus:outline-none focus:border-romantic-500 transition-colors"
                    placeholder="Give your secret a title..."
                  />
                </div>

                <div>
                  <label className="block text-romantic-300 mb-2 font-medium">
                    Secret Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows="6"
                    maxLength="2000"
                    className="w-full px-4 py-3 bg-dark-800/50 border border-romantic-500/30 rounded-lg text-white focus:outline-none focus:border-romantic-500 transition-colors resize-none"
                    placeholder="Write your secret message here..."
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    {formData.message.length}/2000 characters
                  </p>
                </div>

                <div>
                  <label className="block text-romantic-300 mb-2 font-medium">
                    Voice Note URL (Optional)
                  </label>
                  <input
                    type="url"
                    name="voiceNoteUrl"
                    value={formData.voiceNoteUrl}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-dark-800/50 border border-romantic-500/30 rounded-lg text-white focus:outline-none focus:border-romantic-500 transition-colors"
                    placeholder="https://example.com/voice-note.mp3"
                  />
                </div>

                <div>
                  <label className="block text-romantic-300 mb-2 font-medium">
                    Video URL (Optional)
                  </label>
                  <input
                    type="url"
                    name="videoUrl"
                    value={formData.videoUrl}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-dark-800/50 border border-romantic-500/30 rounded-lg text-white focus:outline-none focus:border-romantic-500 transition-colors"
                    placeholder="https://example.com/video.mp4"
                  />
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="isPasswordProtected"
                    id="isPasswordProtected"
                    checked={formData.isPasswordProtected}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-romantic-500 bg-dark-800/50 border-romantic-500/30 rounded focus:ring-romantic-500"
                  />
                  <label htmlFor="isPasswordProtected" className="text-romantic-300 font-medium">
                    Password Protected
                  </label>
                </div>

                <div className="flex gap-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="flex-1 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 btn-primary"
                  >
                    Create Secret ✨
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SecretMessage;
