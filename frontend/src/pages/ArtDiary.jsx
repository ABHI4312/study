import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import Loading from '../components/Loading';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ArtDiary = () => {
  const [artEntries, setArtEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [filter, setFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid', 'tree', 'wall', 'heart', or 'hexagon'
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    artType: 'other',
    tags: '',
    isFavorite: false,
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchArtEntries();
  }, [filter, currentPage]);

  const fetchArtEntries = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 100, // Increased to 100 to show more entries
      };
      if (filter === 'favorites') params.favorite = 'true';
      if (filter !== 'all' && filter !== 'favorites') params.artType = filter;

      const response = await axios.get(`${API_URL}/art-diary`, { params });
      setArtEntries(response.data.data);
      setTotalPages(response.data.totalPages);
      setTotalCount(response.data.total);
    } catch (error) {
      console.error('Error fetching art entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) {
      alert('Please select an image!');
      return;
    }

    setSubmitting(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('image', imageFile);
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('date', formData.date);
      formDataToSend.append('artType', formData.artType);
      formDataToSend.append('tags', formData.tags);
      formDataToSend.append('isFavorite', formData.isFavorite);

      await axios.post(`${API_URL}/art-diary`, formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // Reset form
      setFormData({
        title: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        artType: 'other',
        tags: '',
        isFavorite: false,
      });
      setImageFile(null);
      setImagePreview(null);
      setShowAddForm(false);
      setCurrentPage(1); // Reset to first page
      fetchArtEntries();
    } catch (error) {
      console.error('Error creating art entry:', error);
      alert('Error uploading art. Please try again!');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this art?')) return;

    try {
      await axios.delete(`${API_URL}/art-diary/${id}`);
      fetchArtEntries();
      setSelectedEntry(null);
    } catch (error) {
      console.error('Error deleting art entry:', error);
      alert('Error deleting art. Please try again!');
    }
  };

  const toggleFavorite = async (id) => {
    try {
      await axios.patch(`${API_URL}/art-diary/${id}/favorite`);
      fetchArtEntries();
      if (selectedEntry && selectedEntry._id === id) {
        setSelectedEntry({ ...selectedEntry, isFavorite: !selectedEntry.isFavorite });
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="container mx-auto px-4 py-8 mt-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-2">
            🎨 Chuimui's Art Diary
          </h1>
          <p className="text-gray-300 text-lg">A collection of beautiful creations</p>
          {totalCount > 0 && (
            <p className="text-gray-400 text-sm mt-2">
              {totalCount} artwork{totalCount !== 1 ? 's' : ''} in collection
            </p>
          )}
        </motion.div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {['all', 'favorites', 'drawing', 'painting', 'digital-art', 'sketch', 'craft', 'other'].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                filter === type
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50'
                  : 'bg-gray-800/80 text-gray-300 hover:bg-gray-700 hover:shadow-md border border-gray-700'
              }`}
            >
              {type.replace('-', ' ').charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}
            </button>
          ))}
        </div>

        {/* View Mode Toggle */}
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-6 py-2 rounded-full font-medium transition-all ${
              viewMode === 'grid'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50'
                : 'bg-gray-800/80 text-gray-300 hover:bg-gray-700 border border-gray-700'
            }`}
          >
            🖼️ Grid
          </button>
          <button
            onClick={() => setViewMode('hexagon')}
            className={`px-6 py-2 rounded-full font-medium transition-all ${
              viewMode === 'hexagon'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50'
                : 'bg-gray-800/80 text-gray-300 hover:bg-gray-700 border border-gray-700'
            }`}
          >
            🐝 Honeycomb
          </button>
          <button
            onClick={() => setViewMode('tree')}
            className={`px-6 py-2 rounded-full font-medium transition-all ${
              viewMode === 'tree'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50'
                : 'bg-gray-800/80 text-gray-300 hover:bg-gray-700 border border-gray-700'
            }`}
          >
            🌳 Tree
          </button>
          <button
            onClick={() => setViewMode('wall')}
            className={`px-6 py-2 rounded-full font-medium transition-all ${
              viewMode === 'wall'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50'
                : 'bg-gray-800/80 text-gray-300 hover:bg-gray-700 border border-gray-700'
            }`}
          >
            🎭 Gallery
          </button>
          <button
            onClick={() => setViewMode('heart')}
            className={`px-6 py-2 rounded-full font-medium transition-all ${
              viewMode === 'heart'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50'
                : 'bg-gray-800/80 text-gray-300 hover:bg-gray-700 border border-gray-700'
            }`}
          >
            ❤️ Heart
          </button>
        </div>

        {/* Add Button */}
        <div className="flex justify-center mb-8">
          <button
            onClick={() => setShowAddForm(true)}
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold hover:scale-105 transition-transform shadow-lg shadow-purple-500/50"
          >
            ✨ Add New Art
          </button>
        </div>

        {/* Grid View */}
        {viewMode === 'grid' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              <AnimatePresence>
                {artEntries.map((entry) => (
                  <motion.div
                    key={entry._id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    whileHover={{ y: -5 }}
                    className="bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-lg shadow-purple-900/20 overflow-hidden cursor-pointer group relative border border-gray-700/50 hover:border-purple-500/50 transition-all"
                    onClick={() => setSelectedEntry(entry)}
                  >
                    <div className="relative aspect-square overflow-hidden">
                      <img
                        src={entry.imageUrl}
                        alt={entry.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      {entry.isFavorite && (
                        <div className="absolute top-3 right-3 bg-gray-900/80 backdrop-blur-sm rounded-full p-2">
                          <span className="text-2xl">❤️</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-lg text-gray-100 mb-1 truncate">{entry.title}</h3>
                      <p className="text-sm text-gray-400">
                        {new Date(entry.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {artEntries.length === 0 && (
              <div className="text-center py-16">
                <p className="text-2xl text-gray-500">No art entries yet. Start creating! 🎨</p>
              </div>
            )}
          </>
        )}

        {/* Tree View */}
        {viewMode === 'tree' && (
          <div className="relative py-12 overflow-x-auto">
            {artEntries.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-2xl text-gray-500">No art entries yet. Start creating! 🎨</p>
              </div>
            ) : (
              <div className="relative min-h-screen">
                {/* Background Tree Branches Pattern */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30" style={{ zIndex: 0 }}>
                  <defs>
                    <pattern id="tree-pattern" x="0" y="0" width="100%" height="100%">
                      {/* Main vertical lines */}
                      {[...Array(Math.ceil(artEntries.length / 3))].map((_, i) => (
                        <line
                          key={`v-${i}`}
                          x1={`${20 + (i % 4) * 25}%`}
                          y1="0%"
                          x2={`${20 + (i % 4) * 25}%`}
                          y2="100%"
                          stroke="#4ade80"
                          strokeWidth="3"
                          opacity="0.5"
                        />
                      ))}
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#tree-pattern)" />
                </svg>

                {/* Photos arranged in tree structure */}
                <div className="relative grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 px-8 py-16" style={{ zIndex: 1 }}>
                  {artEntries.map((entry, index) => {
                    const rotations = [-8, 5, -5, 8, -6, 7, -7, 6];
                    const rotation = rotations[index % rotations.length];

                    return (
                      <motion.div
                        key={entry._id}
                        initial={{ opacity: 0, y: -50, rotate: rotation * 2 }}
                        animate={{ opacity: 1, y: 0, rotate: rotation }}
                        transition={{
                          duration: 0.6,
                          delay: index * 0.15,
                          type: 'spring',
                          stiffness: 100,
                        }}
                        className="relative flex flex-col items-center"
                        style={{ zIndex: 10 + index }}
                      >
                        {/* Hanging String/Thread */}
                        <div className="relative mb-4">
                          {/* Pin/Clip at top */}
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 z-20">
                            <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-full shadow-lg flex items-center justify-center border-2 border-green-700">
                              <div className="w-2 h-2 bg-white rounded-full" />
                            </div>
                          </div>

                          {/* String */}
                          <div
                            className="absolute left-1/2 transform -translate-x-1/2 bg-gradient-to-b from-gray-400 to-gray-500"
                            style={{
                              width: '2px',
                              height: '40px',
                              top: '-40px',
                            }}
                          />
                        </div>

                        {/* Polaroid Photo Card */}
                        <motion.div
                          whileHover={{
                            scale: 1.1,
                            rotate: 0,
                            zIndex: 100,
                            transition: { duration: 0.3 },
                          }}
                          className="cursor-pointer group"
                          onClick={() => setSelectedEntry(entry)}
                          style={{
                            rotate: `${rotation}deg`,
                          }}
                        >
                          {/* Polaroid Frame */}
                          <div className="bg-white p-3 pb-16 shadow-2xl relative rounded-sm">
                            {/* Favorite badge */}
                            {entry.isFavorite && (
                              <div className="absolute -top-3 -right-3 z-20 bg-red-500 rounded-full p-2 shadow-lg animate-pulse">
                                <span className="text-xl">❤️</span>
                              </div>
                            )}

                            {/* Photo */}
                            <div className="relative w-48 h-48 overflow-hidden bg-gray-200">
                              <img
                                src={entry.imageUrl}
                                alt={entry.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                              />
                            </div>

                            {/* Polaroid Text Area */}
                            <div className="mt-4 px-2">
                              <p className="text-gray-800 font-handwriting text-sm font-semibold text-center truncate">
                                {entry.title}
                              </p>
                              <p className="text-gray-500 text-xs text-center mt-1">
                                {new Date(entry.date).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                })}
                              </p>
                            </div>

                            {/* Decorative elements */}
                            <div className="absolute bottom-2 right-2 opacity-50">
                              {entry.artType === 'painting' && '🎨'}
                              {entry.artType === 'drawing' && '✏️'}
                              {entry.artType === 'digital-art' && '💻'}
                              {entry.artType === 'sketch' && '📝'}
                              {entry.artType === 'craft' && '✂️'}
                              {entry.artType === 'other' && '🖼️'}
                            </div>
                          </div>

                          {/* Shadow effect */}
                          <div className="absolute inset-0 bg-black opacity-5 rounded-sm transform translate-y-1 -z-10" />
                        </motion.div>

                        {/* Decorative leaves/flowers around some photos */}
                        {index % 3 === 0 && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.15 + 0.5 }}
                            className="absolute -top-6 -left-6 text-4xl pointer-events-none"
                            style={{ rotate: `${-rotation}deg` }}
                          >
                            🌿
                          </motion.div>
                        )}
                        {index % 4 === 0 && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.15 + 0.6 }}
                            className="absolute -top-4 -right-6 text-3xl pointer-events-none"
                            style={{ rotate: `${rotation}deg` }}
                          >
                            🌸
                          </motion.div>
                        )}
                        {index % 5 === 0 && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.15 + 0.7 }}
                            className="absolute -bottom-4 -left-4 text-3xl pointer-events-none"
                            style={{ rotate: `${-rotation * 1.5}deg` }}
                          >
                            🍃
                          </motion.div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>

                {/* Decorative elements at corners */}
                <div className="absolute top-8 left-8 text-6xl opacity-40 pointer-events-none">🌳</div>
                <div className="absolute top-8 right-8 text-6xl opacity-40 pointer-events-none">🌳</div>
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-7xl opacity-40 pointer-events-none">
                  🌲
                </div>
              </div>
            )}
          </div>
        )}

        {/* Gallery Wall View */}
        {viewMode === 'wall' && (
          <div className="relative py-12">
            {artEntries.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-2xl text-gray-500">No art entries yet. Start creating! 🎨</p>
              </div>
            ) : (
              <div className="relative px-8">
                {/* Wall texture background */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 opacity-60" />
                
                {/* Spotlight effects */}
                <div className="absolute top-0 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
                <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl" />

                {/* Masonry layout with varied sizes */}
                <div className="relative columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
                  {artEntries.map((entry, index) => {
                    // Vary the sizes
                    const sizes = ['small', 'medium', 'large', 'medium', 'small', 'large'];
                    const size = sizes[index % sizes.length];
                    
                    const sizeClasses = {
                      small: 'h-48',
                      medium: 'h-64',
                      large: 'h-80',
                    };

                    const frames = [
                      'border-8 border-amber-900 shadow-xl',
                      'border-[12px] border-gray-800 shadow-2xl',
                      'border-4 border-white shadow-lg',
                      'border-6 border-purple-900 shadow-xl',
                      'border-[10px] border-pink-900 shadow-2xl',
                    ];
                    const frameStyle = frames[index % frames.length];

                    return (
                      <motion.div
                        key={entry._id}
                        initial={{ opacity: 0, scale: 0.8, y: 50 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{
                          duration: 0.5,
                          delay: index * 0.1,
                          type: 'spring',
                        }}
                        className="break-inside-avoid mb-6"
                      >
                        <motion.div
                          whileHover={{
                            scale: 1.05,
                            zIndex: 50,
                            transition: { duration: 0.3 },
                          }}
                          className="cursor-pointer group relative"
                          onClick={() => setSelectedEntry(entry)}
                        >
                          {/* Frame with artwork */}
                          <div className={`relative ${frameStyle} bg-gray-900 rounded-sm overflow-hidden`}>
                            {/* Gallery light effect */}
                            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-24 h-8 bg-gradient-to-b from-yellow-300/30 to-transparent rounded-full blur-xl group-hover:from-yellow-300/50 transition-all" />

                            {/* Photo */}
                            <div className={`relative ${sizeClasses[size]} overflow-hidden bg-gray-800`}>
                              <img
                                src={entry.imageUrl}
                                alt={entry.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                              
                              {/* Overlay on hover */}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="absolute bottom-4 left-4 right-4">
                                  <h3 className="text-white font-bold text-lg mb-1 drop-shadow-lg">
                                    {entry.title}
                                  </h3>
                                  <p className="text-gray-300 text-sm drop-shadow-md">
                                    {new Date(entry.date).toLocaleDateString('en-US', {
                                      month: 'long',
                                      day: 'numeric',
                                      year: 'numeric',
                                    })}
                                  </p>
                                </div>
                              </div>

                              {/* Favorite badge */}
                              {entry.isFavorite && (
                                <div className="absolute top-3 right-3 z-20 bg-red-500/90 backdrop-blur-sm rounded-full p-2 shadow-lg">
                                  <span className="text-xl">❤️</span>
                                </div>
                              )}
                            </div>

                            {/* Bottom nameplate */}
                            <div className="bg-gradient-to-r from-amber-100 to-amber-50 p-3 border-t-2 border-amber-800">
                              <p className="text-gray-800 font-serif text-sm italic text-center truncate">
                                "{entry.title}"
                              </p>
                              <div className="flex justify-between items-center mt-1">
                                <span className="text-xs text-gray-600">
                                  {entry.artType.replace('-', ' ').toUpperCase()}
                                </span>
                                <span className="text-xs text-gray-600">
                                  {new Date(entry.date).getFullYear()}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Wall mounting nails/screws */}
                          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-gray-700 rounded-full shadow-md border border-gray-600" />
                          
                          {/* Shadow on wall */}
                          <div className="absolute inset-0 bg-black/30 blur-xl -z-10 transform translate-y-2 scale-95" />
                        </motion.div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Gallery floor/baseboard */}
                <div className="relative mt-16 h-4 bg-gradient-to-b from-amber-900 to-amber-950 shadow-inner" />
                
                {/* Decorative elements */}
                <div className="absolute bottom-8 left-8 text-6xl opacity-20">🎨</div>
                <div className="absolute bottom-8 right-8 text-6xl opacity-20">🖼️</div>
              </div>
            )}
          </div>
        )}

        {/* Heart Collage View */}
        {viewMode === 'heart' && (
          <div className="relative py-12">
            {artEntries.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-2xl text-gray-500">No art entries yet. Start creating! 🎨</p>
              </div>
            ) : (
              <div className="relative flex items-center justify-center min-h-screen px-4">
                {/* Floating hearts background */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  {[...Array(15)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute text-pink-500/20"
                      initial={{ y: '100vh', x: `${Math.random() * 100}vw` }}
                      animate={{
                        y: '-10vh',
                        x: `${Math.random() * 100}vw`,
                      }}
                      transition={{
                        duration: 10 + Math.random() * 10,
                        repeat: Infinity,
                        delay: Math.random() * 5,
                      }}
                      style={{ fontSize: `${20 + Math.random() * 40}px` }}
                    >
                      ❤️
                    </motion.div>
                  ))}
                </div>

                {/* Heart shape container */}
                <div className="relative w-full max-w-5xl aspect-square">
                  {/* Heart outline glow */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1 }}
                    className="absolute inset-0 blur-2xl opacity-50"
                    style={{
                      background: 'radial-gradient(circle, rgba(236,72,153,0.3) 0%, transparent 70%)',
                    }}
                  />

                  {/* Photos arranged in heart shape */}
                  {artEntries.map((entry, index) => {
                    // Heart shape mathematical positioning
                    const totalPhotos = artEntries.length;
                    const angle = (index / totalPhotos) * Math.PI * 2;
                    
                    // Heart curve equations (parametric)
                    const t = angle;
                    const heartX = 16 * Math.pow(Math.sin(t), 3);
                    const heartY = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
                    
                    // Scale and position
                    const scale = 15; // Adjust size
                    const centerX = 50;
                    const centerY = 50;
                    
                    const posX = centerX + (heartX * scale) / 10;
                    const posY = centerY + (heartY * scale) / 10;

                    // Random rotations for natural look
                    const rotations = [-15, -10, -5, 0, 5, 10, 15, -12, 8, -8, 12, -18, 18];
                    const rotation = rotations[index % rotations.length];

                    // Random sizes
                    const sizes = ['w-24 h-24', 'w-28 h-28', 'w-32 h-32', 'w-20 h-20'];
                    const sizeClass = sizes[index % sizes.length];

                    return (
                      <motion.div
                        key={entry._id}
                        initial={{ opacity: 0, scale: 0, rotate: rotation * 2 }}
                        animate={{ opacity: 1, scale: 1, rotate: rotation }}
                        transition={{
                          duration: 0.8,
                          delay: index * 0.05,
                          type: 'spring',
                          stiffness: 100,
                        }}
                        className="absolute cursor-pointer"
                        style={{
                          left: `${posX}%`,
                          top: `${posY}%`,
                          transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
                          zIndex: 10 + index,
                        }}
                        whileHover={{
                          scale: 1.3,
                          rotate: 0,
                          zIndex: 100,
                          transition: { duration: 0.3 },
                        }}
                        onClick={() => setSelectedEntry(entry)}
                      >
                        {/* Polaroid style photo */}
                        <div className={`${sizeClass} bg-white p-2 pb-6 shadow-2xl rounded-sm group`}>
                          {/* Favorite badge */}
                          {entry.isFavorite && (
                            <div className="absolute -top-2 -right-2 z-20 bg-red-500 rounded-full p-1 shadow-lg animate-pulse">
                              <span className="text-sm">❤️</span>
                            </div>
                          )}

                          {/* Photo */}
                          <div className="relative w-full h-full overflow-hidden bg-gray-200">
                            <img
                              src={entry.imageUrl}
                              alt={entry.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>

                          {/* Title on polaroid bottom */}
                          <div className="absolute bottom-1 left-0 right-0 px-1">
                            <p className="text-gray-800 text-xs font-handwriting text-center truncate">
                              {entry.title}
                            </p>
                          </div>
                        </div>

                        {/* Shadow */}
                        <div className="absolute inset-0 bg-black/20 blur-md -z-10 transform translate-y-1" />
                      </motion.div>
                    );
                  })}

                  {/* Center text */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none"
                  >
                    <div className="text-6xl mb-2">❤️</div>
                    <p className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 text-2xl font-bold">
                      Art with Love
                    </p>
                    <p className="text-gray-400 text-sm mt-2">
                      {artEntries.length} precious memories
                    </p>
                  </motion.div>
                </div>

                {/* Decorative elements */}
                <div className="absolute top-8 left-8 text-6xl animate-pulse">💕</div>
                <div className="absolute top-8 right-8 text-6xl animate-pulse" style={{ animationDelay: '1s' }}>
                  💖
                </div>
                <div className="absolute bottom-8 left-1/4 text-5xl animate-pulse" style={{ animationDelay: '2s' }}>
                  💗
                </div>
                <div className="absolute bottom-8 right-1/4 text-5xl animate-pulse" style={{ animationDelay: '1.5s' }}>
                  💝
                </div>
              </div>
            )}
          </div>
        )}

        {/* Hexagon/Honeycomb View */}
        {viewMode === 'hexagon' && (
          <div className="relative py-12">
            {artEntries.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-2xl text-gray-500">No art entries yet. Start creating! 🎨</p>
              </div>
            ) : (
              <div className="relative px-8">
                {/* Background honeycomb pattern */}
                <div className="absolute inset-0 opacity-5">
                  <svg width="100%" height="100%">
                    <defs>
                      <pattern id="hexagons" width="100" height="87" patternUnits="userSpaceOnUse">
                        <polygon
                          points="50,0 93.3,25 93.3,75 50,100 6.7,75 6.7,25"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#hexagons)" />
                  </svg>
                </div>

                {/* Hexagon grid layout */}
                <div className="relative flex flex-wrap justify-center gap-4 py-8">
                  {artEntries.map((entry, index) => {
                    // Calculate hexagon positioning
                    const hexSize = 140; // Size of each hexagon
                    const row = Math.floor(index / 5);
                    const col = index % 5;
                    const offsetX = col * (hexSize * 0.75);
                    const offsetY = row * (hexSize * 0.87) + (col % 2 === 1 ? hexSize * 0.435 : 0);

                    return (
                      <motion.div
                        key={entry._id}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                          duration: 0.5,
                          delay: index * 0.05,
                          type: 'spring',
                        }}
                        className="relative cursor-pointer group"
                        style={{
                          width: `${hexSize}px`,
                          height: `${hexSize}px`,
                          margin: '10px',
                        }}
                        whileHover={{ scale: 1.15, zIndex: 50 }}
                        onClick={() => setSelectedEntry(entry)}
                      >
                        {/* Hexagon clip path container */}
                        <div
                          className="relative w-full h-full overflow-hidden"
                          style={{
                            clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                          }}
                        >
                          {/* Hexagon border/frame */}
                          <div
                            className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 p-1"
                            style={{
                              clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                            }}
                          >
                            {/* Inner hexagon with photo */}
                            <div
                              className="w-full h-full overflow-hidden bg-gray-800"
                              style={{
                                clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                              }}
                            >
                              <img
                                src={entry.imageUrl}
                                alt={entry.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              />

                              {/* Overlay with info on hover */}
                              <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4">
                                <h3 className="text-white font-bold text-sm text-center mb-1">
                                  {entry.title}
                                </h3>
                                <p className="text-gray-300 text-xs text-center">
                                  {new Date(entry.date).toLocaleDateString('en-US', {
                                    month: 'short',
                                    year: 'numeric',
                                  })}
                                </p>
                                {entry.isFavorite && (
                                  <div className="mt-2 text-2xl animate-pulse">❤️</div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Favorite badge */}
                          {entry.isFavorite && (
                            <div className="absolute top-2 right-2 z-20 bg-red-500 rounded-full p-1 shadow-lg group-hover:scale-125 transition-transform">
                              <span className="text-xs">❤️</span>
                            </div>
                          )}
                        </div>

                        {/* Glow effect */}
                        <div
                          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity blur-xl -z-10"
                          style={{
                            background: 'radial-gradient(circle, rgba(168,85,247,0.4) 0%, transparent 70%)',
                          }}
                        />
                      </motion.div>
                    );
                  })}
                </div>

                {/* Decorative bees */}
                <motion.div
                  className="absolute top-16 right-16 text-5xl"
                  animate={{
                    x: [0, 20, 0],
                    y: [0, -20, 0],
                    rotate: [0, 10, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  🐝
                </motion.div>
                <motion.div
                  className="absolute bottom-16 left-16 text-4xl"
                  animate={{
                    x: [0, -15, 0],
                    y: [0, 15, 0],
                    rotate: [0, -10, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: 1,
                  }}
                >
                  🐝
                </motion.div>
              </div>
            )}
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-8 mb-4">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-6 py-2 bg-gray-800 border border-gray-700 text-gray-300 rounded-full font-medium hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              ← Previous
            </button>
            
            <div className="flex items-center gap-2">
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`w-10 h-10 rounded-full font-medium transition-all ${
                    currentPage === index + 1
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50'
                      : 'bg-gray-800 border border-gray-700 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-6 py-2 bg-gray-800 border border-gray-700 text-gray-300 rounded-full font-medium hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Next →
            </button>
          </div>
        )}
      </div>

      {/* Add/Edit Form Modal */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowAddForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900 border border-gray-700 rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-6">
                Add New Art
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Upload Image *
                  </label>
                  <div className="border-2 border-dashed border-gray-700 rounded-xl p-6 text-center hover:border-purple-500 transition-colors bg-gray-800/50">
                    {imagePreview ? (
                      <div className="relative">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="max-h-64 mx-auto rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setImageFile(null);
                            setImagePreview(null);
                          }}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                          id="image-upload"
                          required
                        />
                        <label
                          htmlFor="image-upload"
                          className="cursor-pointer inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full hover:scale-105 transition-transform"
                        >
                          Choose Image
                        </label>
                        <p className="text-sm text-gray-400 mt-2">
                          JPG, PNG, GIF, WEBP (Max 10MB)
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Give your art a title..."
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    rows="4"
                    placeholder="Tell us about this artwork..."
                  />
                </div>

                {/* Date and Art Type */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Date *
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Art Type
                    </label>
                    <select
                      value={formData.artType}
                      onChange={(e) => setFormData({ ...formData, artType: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="drawing">Drawing</option>
                      <option value="painting">Painting</option>
                      <option value="digital-art">Digital Art</option>
                      <option value="sketch">Sketch</option>
                      <option value="craft">Craft</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="colorful, abstract, nature..."
                  />
                </div>

                {/* Favorite */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isFavorite}
                    onChange={(e) => setFormData({ ...formData, isFavorite: e.target.checked })}
                    className="w-5 h-5 text-purple-600 bg-gray-800 border-gray-700 rounded focus:ring-2 focus:ring-purple-500"
                    id="favorite"
                  />
                  <label htmlFor="favorite" className="ml-3 text-sm font-medium text-gray-300">
                    Mark as favorite ❤️
                  </label>
                </div>

                {/* Buttons */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold hover:scale-105 transition-transform shadow-lg shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Uploading...' : '✨ Add to Diary'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-6 py-3 bg-gray-800 border border-gray-700 text-gray-300 rounded-full font-semibold hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Detail View Modal */}
      <AnimatePresence>
        {selectedEntry && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedEntry(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900 border border-gray-700 rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                  {selectedEntry.title}
                </h2>
                <button
                  onClick={() => setSelectedEntry(null)}
                  className="text-gray-400 hover:text-gray-200 text-2xl"
                >
                  ✕
                </button>
              </div>

              <img
                src={selectedEntry.imageUrl}
                alt={selectedEntry.title}
                className="w-full rounded-2xl shadow-lg mb-6"
              />

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400 font-medium">Date</p>
                  <p className="text-lg text-gray-200">
                    {new Date(selectedEntry.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>

                {selectedEntry.description && (
                  <div>
                    <p className="text-sm text-gray-400 font-medium">Description</p>
                    <p className="text-lg text-gray-200">{selectedEntry.description}</p>
                  </div>
                )}

                <div>
                  <p className="text-sm text-gray-400 font-medium">Art Type</p>
                  <span className="inline-block px-4 py-1 bg-purple-900/50 text-purple-300 rounded-full text-sm font-medium border border-purple-700">
                    {selectedEntry.artType.replace('-', ' ').toUpperCase()}
                  </span>
                </div>

                {selectedEntry.tags && selectedEntry.tags.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-400 font-medium mb-2">Tags</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedEntry.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-pink-900/50 text-pink-300 rounded-full text-sm border border-pink-700"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-4 pt-4">
                  <button
                    onClick={() => toggleFavorite(selectedEntry._id)}
                    className={`flex-1 px-6 py-3 rounded-full font-semibold transition-all ${
                      selectedEntry.isFavorite
                        ? 'bg-red-500 text-white hover:bg-red-600'
                        : 'bg-gray-800 border border-gray-700 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    {selectedEntry.isFavorite ? '❤️ Unfavorite' : '🤍 Add to Favorites'}
                  </button>
                  <button
                    onClick={() => handleDelete(selectedEntry._id)}
                    className="px-6 py-3 bg-red-500/90 text-white rounded-full font-semibold hover:bg-red-600 transition-colors"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ArtDiary;
