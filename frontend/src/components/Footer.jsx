import { motion } from 'framer-motion';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark-800 border-t border-dark-700 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col items-center justify-center space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h3 className="text-2xl font-romantic font-bold bg-gradient-to-r from-romantic-400 to-romantic-600 bg-clip-text text-transparent mb-2">
              Our Little Universe ❤️❤️
            </h3>
            <p className="text-gray-400 text-sm">
              Where every moment becomes a cherished memory
            </p>
          </motion.div>

          <div className="flex items-center space-x-6 text-gray-400 text-sm">
            <motion.div
              whileHover={{ scale: 1.1, color: '#ec4899' }}
              className="cursor-pointer"
            >
              Made with 💖
            </motion.div>
            <span>•</span>
            <div>{currentYear}</div>
          </div>

          <div className="flex space-x-4">
            {['💕', '✨', '🌙', '⭐', '💫'].map((emoji, index) => (
              <motion.span
                key={index}
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: index * 0.2,
                }}
                className="text-2xl"
              >
                {emoji}
              </motion.span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
