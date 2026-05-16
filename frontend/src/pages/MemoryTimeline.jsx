import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { memoryAPI } from '../services/api';
import MemoryCard from '../components/MemoryCard';
import Loading from '../components/Loading';

const MemoryTimeline = () => {
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchMemories();
  }, []);

  const fetchMemories = async () => {
    try {
      const response = await memoryAPI.getAll();
      setMemories(response.data.data);
    } catch (error) {
      console.error('Error fetching memories:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['all', 'first-time', 'special-moment', 'adventure', 'milestone', 'other'];

  const filteredMemories = filter === 'all' 
    ? memories 
    : memories.filter(memory => memory.category === filter);

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
            Our Memory Timeline 📸
          </h1>
          <p className="text-gray-400 text-lg">
            Every moment we've shared, preserved forever
          </p>
        </motion.div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <motion.button
              key={category}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter(category)}
              className={`px-6 py-2 rounded-full capitalize transition-all duration-300 ${
                filter === category
                  ? 'bg-romantic-500 text-white'
                  : 'bg-dark-800 text-gray-300 hover:bg-dark-700'
              }`}
            >
              {category.replace('-', ' ')}
            </motion.button>
          ))}
        </div>

        {/* Memories Grid */}
        {filteredMemories.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-4xl mb-4">💭</p>
            <p className="text-gray-400 text-lg">No memories yet. Start creating some!</p>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMemories.map((memory) => (
              <MemoryCard key={memory._id} memory={memory} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MemoryTimeline;
