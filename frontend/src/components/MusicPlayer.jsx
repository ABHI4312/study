import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaMusic, FaPlay, FaPause, FaVolumeUp, FaVolumeMute, FaCog } from 'react-icons/fa';
import { useMusic } from '../context/MusicContext';

const MusicPlayer = () => {
  const [showPlayer, setShowPlayer] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { currentSong, isPlaying, volume, isMuted, togglePlay, changeVolume, toggleMute } = useMusic();

  // Fallback image for when album cover fails to load
  const fallbackImage = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"%3E%3Crect fill="%23374151" width="100" height="100"/%3E%3Ctext x="50" y="50" font-size="40" text-anchor="middle" dy=".3em" fill="%23ec4899"%3E🎵%3C/text%3E%3C/svg%3E';

  return (
    <>
      {/* Floating Music Button */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="fixed bottom-6 right-6 z-50"
      >
        {/* Visualizer Rings */}
        {isPlaying && currentSong && (
          <>
            <motion.div
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 0, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute inset-0 bg-romantic-500 rounded-full"
            />
            <motion.div
              animate={{
                scale: [1, 1.8, 1],
                opacity: [0.3, 0, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 0.5,
              }}
              className="absolute inset-0 bg-purple-500 rounded-full"
            />
          </>
        )}

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowPlayer(!showPlayer)}
          className="relative bg-gradient-to-r from-romantic-500 to-romantic-600 text-white p-4 rounded-full shadow-2xl hover:shadow-romantic-500/50 transition-all duration-300"
        >
          <motion.div
            animate={isPlaying ? { rotate: 360 } : {}}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          >
            <FaMusic className="text-2xl" />
          </motion.div>
        </motion.button>

        {/* Player Controls */}
        <AnimatePresence>
          {showPlayer && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.8 }}
              className="absolute bottom-20 right-0 bg-dark-800/95 backdrop-blur-lg rounded-2xl p-4 shadow-2xl border border-romantic-500/30 min-w-[280px]"
            >
              {/* Current Song Info */}
              {currentSong ? (
                <div className="mb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={imageError ? fallbackImage : currentSong.albumCover}
                      alt={currentSong.title}
                      className="w-12 h-12 rounded-lg object-cover"
                      onError={() => setImageError(true)}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">
                        {currentSong.title}
                      </p>
                      <p className="text-gray-400 text-xs truncate">
                        {currentSong.artist}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mb-4 text-center">
                  <p className="text-gray-400 text-sm mb-2">No song selected</p>
                  <Link to="/choose-music">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="text-romantic-400 text-xs hover:text-romantic-300"
                    >
                      Choose a song →
                    </motion.button>
                  </Link>
                </div>
              )}

              {/* Controls */}
              <div className="flex items-center justify-between gap-3 mb-3">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={togglePlay}
                  disabled={!currentSong}
                  className={`p-3 rounded-full transition-colors ${
                    currentSong
                      ? 'bg-romantic-500 text-white hover:bg-romantic-600'
                      : 'bg-dark-700 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isPlaying ? <FaPause /> : <FaPlay />}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={toggleMute}
                  disabled={!currentSong}
                  className={`p-3 rounded-full transition-colors ${
                    currentSong
                      ? 'bg-dark-700 text-white hover:bg-dark-600'
                      : 'bg-dark-700 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
                </motion.button>

                <Link to="/choose-music">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="bg-dark-700 text-white p-3 rounded-full hover:bg-dark-600 transition-colors"
                  >
                    <FaCog />
                  </motion.button>
                </Link>
              </div>

              {/* Volume Slider */}
              {currentSong && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>Volume</span>
                    <span>{Math.round(volume * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={(e) => changeVolume(parseFloat(e.target.value))}
                    className="w-full h-2 bg-dark-700 rounded-lg appearance-none cursor-pointer slider"
                    style={{
                      background: `linear-gradient(to right, #ec4899 0%, #ec4899 ${volume * 100}%, #374151 ${volume * 100}%, #374151 100%)`,
                    }}
                  />
                </div>
              )}

              {/* Status */}
              <div className="mt-3 text-center">
                <p className="text-xs text-gray-400">
                  {currentSong ? (isPlaying ? '🎵 Playing...' : '⏸️ Paused') : '🎶 No music'}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Floating Music Visualizer */}
      {isPlaying && currentSong && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              initial={{
                x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                y: typeof window !== 'undefined' ? window.innerHeight + 50 : 1000,
                scale: Math.random() * 0.5 + 0.5,
                opacity: 0.1,
              }}
              animate={{
                y: -100,
                rotate: [0, 360],
                scale: [Math.random() * 0.5 + 0.5, Math.random() * 1 + 0.8, Math.random() * 0.5 + 0.5],
              }}
              transition={{
                duration: Math.random() * 8 + 8,
                repeat: Infinity,
                delay: Math.random() * 3,
                ease: 'linear',
              }}
            >
              <div className="text-4xl">
                {['🎵', '🎶', '🎼', '🎤', '🎧', '💿'][Math.floor(Math.random() * 6)]}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </>
  );
};

export default MusicPlayer;
