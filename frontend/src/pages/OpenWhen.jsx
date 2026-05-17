import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { openWhenAPI } from '../services/api';
import Loading from '../components/Loading';
import { FaPlus } from 'react-icons/fa';

const OpenWhen = () => {
  const navigate = useNavigate();
  const [letters, setLetters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLetter, setSelectedLetter] = useState(null);

  const defaultLetters = [
    { emoji: '😢', title: 'Open When You Are Sad', condition: 'you are sad' },
    { emoji: '💭', title: 'Open When You Miss Me', condition: 'you miss me' },
    { emoji: '😠', title: 'Open When You Are Angry', condition: 'you are angry' },
    { emoji: '😔', title: 'Open When You Feel Lonely', condition: 'you feel lonely' },
    { emoji: '💪', title: 'Open When You Need Motivation', condition: 'you need motivation' },
  ];

  useEffect(() => {
    fetchLetters();
  }, []);

  const fetchLetters = async () => {
    try {
      const response = await openWhenAPI.getAll();
      setLetters(response.data.data);
    } catch (error) {
      console.error('Error fetching letters:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenLetter = async (letter) => {
    if (!letter.isOpened) {
      try {
        await openWhenAPI.open(letter._id);
        fetchLetters();
      } catch (error) {
        console.error('Error opening letter:', error);
      }
    }
    setSelectedLetter(letter);
  };

  if (loading) return <Loading />;

  const displayLetters = letters.length > 0 ? letters : defaultLetters.map((l, i) => ({
    ...l,
    _id: `default-${i}`,
    message: `This is a placeholder message. Add real letters from the backend!`,
    isOpened: false,
  }));

  return (
    <div className="min-h-screen py-12 px-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-3xl"
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
              y: typeof window !== 'undefined' ? window.innerHeight + 50 : 1000,
              opacity: 0.2,
            }}
            animate={{
              y: -50,
              rotate: [0, 360],
            }}
            transition={{
              duration: Math.random() * 15 + 10,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          >
            💌
          </motion.div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-romantic font-bold mb-4 bg-gradient-to-r from-romantic-400 to-purple-400 bg-clip-text text-transparent">
            Open When... 💌
          </h1>
          <p className="text-gray-400 text-lg mb-6">
            Letters for different moments in your life
          </p>
          
          {/* Create New Letter Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/add-open-when')}
            className="btn-primary inline-flex items-center gap-2 px-8 py-3 text-lg"
          >
            <FaPlus /> Create New Letter
          </motion.button>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayLetters.map((letter, index) => (
            <motion.div
              key={letter._id}
              initial={{ opacity: 0, scale: 0.8, rotateY: 90 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.05, y: -10 }}
              className="card cursor-pointer backdrop-blur-lg bg-dark-800/80 border-2 border-transparent hover:border-romantic-500/50 transition-all duration-300"
              onClick={() => handleOpenLetter(letter)}
            >
              <div className="text-center">
                <motion.div
                  animate={{
                    scale: letter.isOpened ? 1 : [1, 1.2, 1],
                    rotate: letter.isOpened ? 0 : [0, -10, 10, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: letter.isOpened ? 0 : Infinity,
                  }}
                  className="text-6xl mb-4"
                >
                  {letter.emoji || (letter.isOpened ? '📭' : '📬')}
                </motion.div>
                <h3 className="text-xl font-romantic font-semibold mb-2 text-white">
                  {letter.title}
                </h3>
                <p className="text-gray-400 text-sm mb-3">
                  Open when: {letter.condition}
                </p>
                {letter.isOpened && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs text-romantic-400"
                  >
                    ✓ Opened on {new Date(letter.openedAt).toLocaleDateString()}
                  </motion.span>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Letter Modal */}
        <AnimatePresence>
          {selectedLetter && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50 backdrop-blur-sm"
              onClick={() => setSelectedLetter(null)}
            >
              <motion.div
                initial={{ scale: 0.5, opacity: 0, rotateY: 90 }}
                animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                exit={{ scale: 0.5, opacity: 0, rotateY: -90 }}
                transition={{ type: 'spring', duration: 0.8 }}
                className="bg-gradient-to-br from-dark-800 to-dark-900 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border-2 border-romantic-500/30 shadow-2xl shadow-romantic-500/20"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Envelope Opening Animation */}
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="text-center mb-6"
                >
                  <motion.div
                    animate={{ rotate: [0, -5, 5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-6xl mb-4"
                  >
                    {selectedLetter.emoji || '💌'}
                  </motion.div>
                  <h2 className="text-3xl font-romantic font-bold text-white mb-2">
                    {selectedLetter.title}
                  </h2>
                  <p className="text-gray-400">Open when: {selectedLetter.condition}</p>
                </motion.div>

                {/* Letter Content */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-dark-700/50 rounded-lg p-6 mb-6 border border-romantic-500/20"
                >
                  <p className="text-gray-200 whitespace-pre-wrap leading-relaxed font-serif text-lg">
                    {selectedLetter.message}
                  </p>
                </motion.div>

                {/* Voice Note */}
                {selectedLetter.voiceNoteUrl && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mb-6"
                  >
                    <p className="text-gray-400 mb-2">🎵 Voice Message:</p>
                    <audio controls className="w-full">
                      <source src={selectedLetter.voiceNoteUrl} type="audio/mpeg" />
                    </audio>
                  </motion.div>
                )}

                {/* Video */}
                {selectedLetter.videoUrl && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="mb-6"
                  >
                    <p className="text-gray-400 mb-2">🎥 Video Message:</p>
                    <video controls className="w-full rounded-lg">
                      <source src={selectedLetter.videoUrl} type="video/mp4" />
                    </video>
                  </motion.div>
                )}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedLetter(null)}
                  className="btn-primary w-full"
                >
                  Close Letter
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default OpenWhen;
