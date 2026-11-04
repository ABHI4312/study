import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Loading from '../components/Loading';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ArtDiary = () => {
  const [artEntries, setArtEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [filter, setFilter] = useState('all');
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
  }, [filter]);

  const fetchArtEntries = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filter === 'favorites') params.favorite = 'true';
      if (filter !== 'all' && filter !== 'favorites') params.artType = filter;

      const response = await axios.get(`${API_URL}/art-diary`, { params });
      setArtEntries(response.data.data);
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
      <Navbar />
      
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

        {/* Add Button */}
        <div className="flex justify-center mb-8">
          <button
            onClick={() => setShowAddForm(true)}
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold hover:scale-105 transition-transform shadow-lg shadow-purple-500/50"
          >
            ✨ Add New Art
          </button>
        </div>

        {/* Art Gallery Grid */}
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

      <Footer />
    </div>
  );
};

export default ArtDiary;
