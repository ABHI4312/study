import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { secretAPI } from '../services/api';
import Loading from '../components/Loading';

const SecretMessage = () => {
  const [secrets, setSecrets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [revealedSecret, setRevealedSecret] = useState(null);

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
                className="card cursor-pointer"
                onClick={() => handleReveal(secret)}
              >
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
                    {secret.isRevealed ? 'Revealed Secret' : 'Tap to Reveal'}
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
                <h2 className="text-3xl font-romantic font-bold text-white mb-4">
                  Secret Revealed!
                </h2>
              </div>
              <div className="bg-dark-800/50 rounded-lg p-6 mb-6 border border-romantic-500/20">
                <p className="text-gray-200 text-lg text-center leading-relaxed">
                  {revealedSecret.message}
                </p>
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
      </div>
    </div>
  );
};

export default SecretMessage;
