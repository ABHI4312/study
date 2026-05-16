import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Confetti from 'react-confetti';
import { FaEnvelope, FaEnvelopeOpen, FaPlus } from 'react-icons/fa';

const SurpriseMessages = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isOpening, setIsOpening] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`${API_URL}/surprises`);
      setMessages(response.data.data);
    } catch (error) {
      console.error('Error fetching surprise messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenMessage = async (message) => {
    if (message.isOpened) {
      setSelectedMessage(message);
      return;
    }

    setIsOpening(true);
    setShowConfetti(true);

    // Animate envelope opening
    setTimeout(async () => {
      try {
        const response = await axios.put(`${API_URL}/surprises/${message._id}/open`);
        setSelectedMessage(response.data.data);
        fetchMessages(); // Refresh list
      } catch (error) {
        console.error('Error opening message:', error);
      } finally {
        setIsOpening(false);
        setTimeout(() => setShowConfetti(false), 3000);
      }
    }, 1500);
  };

  const closeModal = () => {
    setSelectedMessage(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">💌</div>
          <p className="text-gray-400">Loading surprise messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      {showConfetti && <Confetti recycle={false} numberOfPieces={300} />}

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-romantic font-bold mb-4 bg-gradient-to-r from-romantic-400 to-purple-400 bg-clip-text text-transparent">
            Surprise Messages 💌
          </h1>
          <p className="text-gray-400 text-lg mb-6">
            Hidden messages waiting to be discovered
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/add-surprise')}
            className="btn-primary"
          >
            <FaPlus className="inline mr-2" />
            Leave a Surprise Message
          </motion.button>
        </motion.div>

        {/* Messages Grid */}
        {messages.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <div className="text-8xl mb-6">📭</div>
            <h3 className="text-2xl font-romantic font-bold text-white mb-4">
              No Surprise Messages Yet
            </h3>
            <p className="text-gray-400 mb-6">
              Be the first to leave a surprise message!
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/add-surprise')}
              className="btn-primary"
            >
              Create First Message
            </motion.button>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {messages.map((message, index) => (
              <motion.div
                key={message._id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, rotate: message.isOpened ? 0 : 5 }}
                onClick={() => handleOpenMessage(message)}
                className="cursor-pointer"
              >
                <div className="card text-center p-8 relative overflow-hidden">
                  {/* Unopened Badge */}
                  {!message.isOpened && (
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute top-4 right-4 bg-romantic-500 text-white text-xs px-3 py-1 rounded-full font-bold"
                    >
                      NEW!
                    </motion.div>
                  )}

                  {/* Envelope Icon */}
                  <motion.div
                    animate={
                      message.isOpened
                        ? {}
                        : { rotate: [-5, 5, -5], y: [0, -10, 0] }
                    }
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-7xl mb-4"
                  >
                    {message.isOpened ? (
                      <FaEnvelopeOpen className="mx-auto text-gray-500" />
                    ) : (
                      <FaEnvelope className="mx-auto text-romantic-500" />
                    )}
                  </motion.div>

                  {/* Title */}
                  <h3 className="text-xl font-romantic font-bold text-white mb-2">
                    {message.title}
                  </h3>

                  {/* Author */}
                  <p className="text-sm text-gray-400 mb-4">
                    From: {message.author === 'me' ? 'Me ❤️' : 'You 💖'}
                  </p>

                  {/* Status */}
                  <div
                    className={`text-sm font-medium ${
                      message.isOpened ? 'text-gray-500' : 'text-romantic-400'
                    }`}
                  >
                    {message.isOpened ? (
                      <>Opened {new Date(message.openedAt).toLocaleDateString()}</>
                    ) : (
                      <>Click to open! ✨</>
                    )}
                  </div>

                  {/* Decorative Elements */}
                  {!message.isOpened && (
                    <div className="absolute inset-0 pointer-events-none">
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute text-2xl"
                          initial={{
                            x: Math.random() * 100 + '%',
                            y: Math.random() * 100 + '%',
                            opacity: 0.3,
                          }}
                          animate={{
                            y: ['-10%', '110%'],
                            rotate: 360,
                          }}
                          transition={{
                            duration: Math.random() * 5 + 5,
                            repeat: Infinity,
                            delay: Math.random() * 2,
                          }}
                        >
                          ✨
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Message Modal */}
      <AnimatePresence>
        {selectedMessage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ type: 'spring', duration: 0.8 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-dark-800 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto border-2 border-romantic-500/30 shadow-2xl"
            >
              {/* Envelope Opening Animation */}
              {isOpening && (
                <motion.div
                  initial={{ scaleY: 1 }}
                  animate={{ scaleY: 0 }}
                  transition={{ duration: 1.5 }}
                  className="absolute inset-0 bg-romantic-500 z-10 origin-top flex items-center justify-center"
                >
                  <FaEnvelope className="text-white text-9xl" />
                </motion.div>
              )}

              <div className="p-8">
                {/* Header */}
                <div className="text-center mb-6">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 0.5 }}
                    className="text-6xl mb-4"
                  >
                    {selectedMessage.emoji}
                  </motion.div>
                  <h2 className="text-3xl font-romantic font-bold text-white mb-2">
                    {selectedMessage.title}
                  </h2>
                  <p className="text-gray-400">
                    From: {selectedMessage.author === 'me' ? 'Me ❤️' : 'You 💖'}
                  </p>
                </div>

                {/* Image */}
                {selectedMessage.imageUrl && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mb-6 rounded-xl overflow-hidden"
                  >
                    <img
                      src={selectedMessage.imageUrl}
                      alt={selectedMessage.title}
                      className="w-full h-64 object-cover"
                    />
                  </motion.div>
                )}

                {/* Message */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-dark-700/50 rounded-xl p-6 mb-6"
                >
                  <p className="text-gray-200 leading-relaxed whitespace-pre-wrap font-serif text-lg">
                    {selectedMessage.message}
                  </p>
                </motion.div>

                {/* Metadata */}
                <div className="text-center text-sm text-gray-500">
                  <p>Created: {new Date(selectedMessage.createdAt).toLocaleDateString()}</p>
                  {selectedMessage.isOpened && (
                    <p>Opened: {new Date(selectedMessage.openedAt).toLocaleDateString()}</p>
                  )}
                </div>

                {/* Close Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={closeModal}
                  className="btn-primary w-full mt-6"
                >
                  Close
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Hearts */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-4xl opacity-20"
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
              y: typeof window !== 'undefined' ? window.innerHeight + 50 : 1000,
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
            {['💌', '💕', '💖', '✨'][Math.floor(Math.random() * 4)]}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SurpriseMessages;
