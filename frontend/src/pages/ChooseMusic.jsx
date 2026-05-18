import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaPlay, FaPause, FaMusic, FaUpload, FaCheck } from 'react-icons/fa';
import { useMusic } from '../context/MusicContext';
import Confetti from 'react-confetti';

const ChooseMusic = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [playingPreview, setPlayingPreview] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [customUrl, setCustomUrl] = useState('');
  const [imageErrors, setImageErrors] = useState({});
  const [mySongs, setMySongs] = useState([]);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploadData, setUploadData] = useState({
    title: '',
    artist: '',
    description: '',
    emoji: '🎵',
    color: 'from-romantic-500 to-purple-500',
  });
  const [uploadFile, setUploadFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const previewAudioRef = useRef(null);
  
  const { playSong, currentSong } = useMusic();

  // Fallback image for when album cover fails to load
  const fallbackImage = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"%3E%3Crect fill="%23374151" width="300" height="300"/%3E%3Ctext x="150" y="150" font-size="80" text-anchor="middle" dy=".3em" fill="%23ec4899"%3E🎵%3C/text%3E%3C/svg%3E';

  // Load my songs from JSON file
  useEffect(() => {
    loadMySongs();
  }, []);

  const loadMySongs = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${API_URL}/songs`);
      const data = await response.json();
      
      if (data.success) {
        setMySongs(data.data);
      }
    } catch (err) {
      console.error('Error loading songs:', err);
      // Fallback to JSON file if API fails
      fetch('/music/songs.json')
        .then(res => res.json())
        .then(data => setMySongs(data))
        .catch(err => console.error('Error loading songs from JSON:', err));
    }
  };

  const handleImageError = (songId) => {
    setImageErrors(prev => ({ ...prev, [songId]: true }));
  };

  const searchSongs = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      // Using our backend proxy to avoid CORS issues
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await fetch(
        `${API_URL}/deezer/search?q=${encodeURIComponent(searchQuery)}`
      );
      const data = await response.json();
      
      if (data.success) {
        setSearchResults(data.data || []);
      } else {
        throw new Error(data.message || 'Failed to search songs');
      }
    } catch (error) {
      console.error('Error searching songs:', error);
      alert('Failed to search songs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const playPreview = (previewUrl) => {
    if (previewAudioRef.current) {
      if (playingPreview === previewUrl) {
        previewAudioRef.current.pause();
        setPlayingPreview(null);
      } else {
        previewAudioRef.current.src = previewUrl;
        previewAudioRef.current.play();
        setPlayingPreview(previewUrl);
      }
    }
  };

  const setAsBackgroundMusic = (song) => {
    playSong({
      title: song.title,
      artist: song.artist.name,
      albumCover: song.album.cover_xl,
      previewUrl: song.preview,
      isCustom: false,
    });

    // Stop preview
    if (previewAudioRef.current) {
      previewAudioRef.current.pause();
      setPlayingPreview(null);
    }

    // Show success
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const setCustomMusic = () => {
    if (!customUrl.trim()) {
      alert('Please enter a valid MP3 URL');
      return;
    }

    playSong({
      title: 'Custom Song',
      artist: 'Your Music',
      albumCover: 'https://via.placeholder.com/300?text=Custom+Music',
      previewUrl: customUrl,
      isCustom: true,
    });

    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
    setCustomUrl('');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check if it's an audio file
      if (!file.type.startsWith('audio/')) {
        alert('Please select an audio file (MP3, WAV, etc.)');
        return;
      }
      
      // Check file size (max 50MB)
      if (file.size > 50 * 1024 * 1024) {
        alert('File size must be less than 50MB');
        return;
      }
      
      setUploadFile(file);
    }
  };

  const handleUploadSong = async () => {
    if (!uploadFile) {
      alert('Please select an audio file');
      return;
    }

    if (!uploadData.title || !uploadData.artist) {
      alert('Please enter song title and artist name');
      return;
    }

    setUploading(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const formData = new FormData();
      formData.append('audio', uploadFile);
      formData.append('title', uploadData.title);
      formData.append('artist', uploadData.artist);
      formData.append('description', uploadData.description || 'Romantic Song');
      formData.append('emoji', uploadData.emoji);
      formData.append('color', uploadData.color);

      const response = await fetch(`${API_URL}/songs/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        alert(data.message);
        setShowUploadForm(false);
        setUploadData({
          title: '',
          artist: '',
          description: '',
          emoji: '🎵',
          color: 'from-romantic-500 to-purple-500',
        });
        setUploadFile(null);
        loadMySongs(); // Reload songs
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Error uploading song:', error);
      alert('Failed to upload song. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteSong = async (songId) => {
    if (!confirm('Are you sure you want to delete this song?')) {
      return;
    }

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${API_URL}/songs/${songId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        alert('Song deleted successfully!');
        loadMySongs(); // Reload songs
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Error deleting song:', error);
      alert('Failed to delete song');
    }
  };

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
                Music Set! 🎵
              </h2>
              <p className="text-white/90 text-lg">
                Your song will play across all pages ❤️
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-romantic font-bold mb-4 bg-gradient-to-r from-romantic-400 to-purple-400 bg-clip-text text-transparent">
            Choose Our Song ❤️
          </h1>
          <p className="text-gray-400 text-lg">
            Find the perfect soundtrack for your love story
          </p>
        </motion.div>

        {/* Current Song Display */}
        {currentSong && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card mb-8 bg-gradient-to-br from-romantic-500/20 to-purple-500/20 border-romantic-500/30"
          >
            <div className="flex items-center gap-4">
              <img
                src={currentSong.albumCover}
                alt={currentSong.title}
                className="w-20 h-20 rounded-lg object-cover"
                onError={(e) => { e.target.src = fallbackImage; }}
              />
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white">{currentSong.title}</h3>
                <p className="text-gray-400">{currentSong.artist}</p>
                <p className="text-romantic-400 text-sm mt-1">
                  ✨ Currently playing as background music
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Search Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card mb-8"
        >
          <h2 className="text-2xl font-romantic font-bold text-white mb-4">
            🔍 Search Songs
          </h2>
          <form onSubmit={searchSongs} className="flex gap-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for songs, artists, or albums..."
              className="input-field flex-1"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={loading}
              className="btn-primary px-8"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Searching...
                </span>
              ) : (
                <>
                  <FaSearch className="inline mr-2" />
                  Search
                </>
              )}
            </motion.button>
          </form>
        </motion.div>

        {/* Custom MP3 Upload */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card mb-8"
        >
          <h2 className="text-2xl font-romantic font-bold text-white mb-4">
            <FaUpload className="inline mr-2" />
            Custom MP3 URL
          </h2>
          <div className="flex gap-3">
            <input
              type="url"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              placeholder="https://example.com/your-song.mp3"
              className="input-field flex-1"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={setCustomMusic}
              className="btn-secondary px-8"
            >
              <FaMusic className="inline mr-2" />
              Set Custom
            </motion.button>
          </div>
          <p className="text-gray-500 text-sm mt-2">
            💡 Paste a direct link to an MP3 file hosted online
          </p>
        </motion.div>

        {/* My Songs Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="card mb-8"
        >
          <h2 className="text-2xl font-romantic font-bold text-white mb-6">
            💕 My Songs
          </h2>
          
          {mySongs.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">🎵</div>
              <p className="text-gray-400">No songs added yet</p>
              <p className="text-gray-500 text-sm mt-2">
                Add MP3 files to <code className="text-romantic-400">frontend/public/music/</code> and update songs.json
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mySongs.map((song) => (
                <motion.div
                  key={song.id}
                  whileHover={{ scale: 1.02 }}
                  className="bg-dark-700/50 rounded-lg p-4 border border-romantic-500/20 hover:border-romantic-500/50 transition-all"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-16 h-16 bg-gradient-to-br ${song.color} rounded-lg flex items-center justify-center text-3xl`}>
                      {song.emoji}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white line-clamp-1">{song.title}</h3>
                      <p className="text-gray-400 text-sm line-clamp-1">{song.artist}</p>
                      <p className="text-gray-500 text-xs line-clamp-1">{song.description}</p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      playSong({
                        title: song.title,
                        artist: song.artist,
                        albumCover: `data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"%3E%3Crect fill="%23${song.color.includes('romantic') ? 'ec4899' : 'a855f7'}" width="300" height="300"/%3E%3Ctext x="150" y="150" font-size="80" text-anchor="middle" dy=".3em" fill="%23ffffff"%3E${song.emoji}%3C/text%3E%3C/svg%3E`,
                        previewUrl: `/music/${song.filename}`,
                        isCustom: true,
                      });
                      setShowSuccess(true);
                      setTimeout(() => setShowSuccess(false), 3000);
                    }}
                    className="btn-primary w-full"
                  >
                    <FaMusic className="inline mr-2" />
                    Play This Song
                  </motion.button>
                </motion.div>
              ))}
            </div>
          )}
          
          <div className="mt-4 bg-romantic-500/10 border border-romantic-500/30 rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-2">
              📁 <strong>To add more songs:</strong>
            </p>
            <ol className="text-gray-400 text-sm space-y-1 ml-4">
              <li>1. Copy MP3 file to <code className="text-romantic-400">frontend/public/music/</code></li>
              <li>2. Edit <code className="text-romantic-400">frontend/public/music/songs.json</code></li>
              <li>3. Add new song entry with title, artist, filename, emoji, color</li>
              <li>4. Refresh page - song will appear automatically! 🎉</li>
            </ol>
          </div>
        </motion.div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-2xl font-romantic font-bold text-white mb-6">
              Search Results ({searchResults.length})
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.map((song, index) => (
                <motion.div
                  key={song.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="card hover:border-romantic-500/50 transition-all"
                >
                  {/* Album Cover */}
                  <div className="relative mb-4 rounded-lg overflow-hidden group">
                    <img
                      src={imageErrors[song.id] ? fallbackImage : song.album.cover_medium}
                      alt={song.title}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={() => handleImageError(song.id)}
                    />
                    {/* Preview Play Button */}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => playPreview(song.preview)}
                      className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      {playingPreview === song.preview ? (
                        <FaPause className="text-white text-4xl" />
                      ) : (
                        <FaPlay className="text-white text-4xl ml-2" />
                      )}
                    </motion.button>
                  </div>

                  {/* Song Info */}
                  <h3 className="text-lg font-bold text-white mb-1 line-clamp-1">
                    {song.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-1 line-clamp-1">
                    {song.artist.name}
                  </p>
                  <p className="text-gray-500 text-xs mb-4 line-clamp-1">
                    {song.album.title}
                  </p>

                  {/* Duration */}
                  <p className="text-gray-500 text-xs mb-4">
                    Duration: {Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}
                  </p>

                  {/* Set as Background Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setAsBackgroundMusic(song)}
                    className="btn-primary w-full"
                  >
                    <FaMusic className="inline mr-2" />
                    Set as Background Music
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && searchResults.length === 0 && searchQuery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="text-8xl mb-6">🎵</div>
            <h3 className="text-2xl font-romantic font-bold text-white mb-4">
              No Results Found
            </h3>
            <p className="text-gray-400">
              Try searching for a different song, artist, or album
            </p>
          </motion.div>
        )}

        {/* Initial State */}
        {!searchQuery && searchResults.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="text-8xl mb-6">🎶</div>
            <h3 className="text-2xl font-romantic font-bold text-white mb-4">
              Search for Your Perfect Song
            </h3>
            <p className="text-gray-400 mb-6">
              Find romantic songs to set the mood for your universe
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {['Love Songs', 'Romantic', 'Ed Sheeran', 'Taylor Swift', 'Bruno Mars'].map((suggestion) => (
                <motion.button
                  key={suggestion}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setSearchQuery(suggestion);
                    searchSongs({ preventDefault: () => {} });
                  }}
                  className="bg-dark-700 hover:bg-romantic-500 text-gray-300 hover:text-white px-4 py-2 rounded-lg transition-colors"
                >
                  {suggestion}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Hidden audio element for previews */}
      <audio
        ref={previewAudioRef}
        onEnded={() => setPlayingPreview(null)}
      />

      {/* Floating Music Notes */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-4xl opacity-10"
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
            {['🎵', '🎶', '🎼', '🎤'][Math.floor(Math.random() * 4)]}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ChooseMusic;
