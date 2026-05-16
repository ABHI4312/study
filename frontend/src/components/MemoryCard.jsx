import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const MemoryCard = ({ memory }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      'first-time': 'bg-romantic-500',
      'special-moment': 'bg-purple-500',
      'adventure': 'bg-blue-500',
      'milestone': 'bg-green-500',
      'other': 'bg-gray-500',
    };
    return colors[category] || colors.other;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="card group cursor-pointer"
    >
      <Link to={`/memory/${memory._id}`}>
        {memory.imageUrl && (
          <div className="mb-4 rounded-lg overflow-hidden">
            <img
              src={memory.imageUrl}
              alt={memory.title}
              className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
            />
          </div>
        )}

        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-xl font-romantic font-semibold text-white group-hover:text-romantic-400 transition-colors">
              {memory.title}
            </h3>
            {/* Author Label */}
            {memory.author && (
              <div className="mt-1">
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    memory.author === 'me'
                      ? 'bg-romantic-500/20 text-romantic-400'
                      : 'bg-purple-500/20 text-purple-400'
                  }`}
                >
                  {memory.author === 'me' ? 'Added by Me ❤️' : 'Added by You 💖'}
                </span>
              </div>
            )}
          </div>
          {memory.isFavorite && (
            <span className="text-2xl animate-pulse">❤️</span>
          )}
        </div>

        <p className="text-gray-400 text-sm mb-3 line-clamp-2">
          {memory.description}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-gray-500 text-sm">{formatDate(memory.date)}</span>
          <span
            className={`${getCategoryColor(
              memory.category
            )} text-white text-xs px-3 py-1 rounded-full`}
          >
            {memory.category.replace('-', ' ')}
          </span>
        </div>

        {memory.tags && memory.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {memory.tags.map((tag, index) => (
              <span
                key={index}
                className="text-xs bg-dark-700 text-gray-300 px-2 py-1 rounded"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </Link>
    </motion.div>
  );
};

export default MemoryCard;
