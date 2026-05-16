import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {ReactTyped} from 'react-typed';
import ParticlesBackground from '../components/ParticlesBackground';

const LandingEnhanced = () => {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    setTimeout(() => setShowContent(true), 500);
  }, []);

  const features = [
    {
      icon: '📸',
      title: 'Memory Timeline',
      description: 'Capture and cherish every special moment together',
      link: '/memories',
      gradient: 'from-pink-500 to-rose-500',
    },
    {
      icon: '💌',
      title: 'Open When Letters',
      description: 'Heartfelt messages for different moments',
      link: '/open-when',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      icon: '🔐',
      title: 'Secret Messages',
      description: 'Hidden surprises waiting to be revealed',
      link: '/secrets',
      gradient: 'from-romantic-500 to-purple-500',
    },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Particles Background */}
      <ParticlesBackground />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-romantic-900/20 via-dark-900 to-purple-900/20" />
        
        <div className="relative max-w-7xl mx-auto text-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 30 }}
            transition={{ duration: 1 }}
          >
            {/* Animated Title */}
            <motion.h1 
              className="text-6xl md:text-8xl font-romantic font-bold mb-6"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, type: 'spring' }}
            >
              <span className="bg-gradient-to-r from-romantic-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                Our Little Universe
              </span>
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="inline-block ml-4"
              >
                ❤️
              </motion.span>
            </motion.h1>

            {/* Typing Animation */}
            <div className="text-2xl md:text-3xl text-gray-300 mb-8 h-20 flex items-center justify-center">
              <ReactTyped
                strings={[
                  'Where every moment becomes eternal...',
                  'A digital sanctuary for our love story...',
                  'Preserving memories, one heartbeat at a time...',
                  'Our universe, our rules, our forever...',
                ]}
                typeSpeed={50}
                backSpeed={30}
                loop
                className="font-romantic"
              />
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
              <Link to="/memories">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(236, 72, 153, 0.5)' }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-primary text-lg px-10 py-4 relative overflow-hidden group"
                >
                  <span className="relative z-10">✨ Enter Our World</span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-purple-600 to-romantic-600"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.button>
              </Link>
              <Link to="/secrets">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-secondary text-lg px-10 py-4"
                >
                  🔐 Secret Portal
                </motion.button>
              </Link>
            </div>

            {/* Scroll Indicator */}
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-gray-400 text-sm"
            >
              <p className="mb-2">Scroll to explore</p>
              <div className="text-2xl">↓</div>
            </motion.div>
          </motion.div>

          {/* Floating Hearts Animation */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-4xl"
                initial={{
                  x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                  y: typeof window !== 'undefined' ? window.innerHeight + 100 : 1000,
                }}
                animate={{
                  y: -100,
                  x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                  rotate: [0, 360],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: Math.random() * 10 + 10,
                  repeat: Infinity,
                  delay: Math.random() * 5,
                }}
              >
                {['❤️', '💕', '💖', '💗', '💝', '✨', '⭐', '💫'][Math.floor(Math.random() * 8)]}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-5xl font-romantic font-bold text-center mb-16 text-white"
          >
            Our Special Features
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ y: -15, scale: 1.02 }}
              >
                <Link to={feature.link}>
                  <div className="card text-center h-full hover:shadow-2xl hover:shadow-romantic-500/30 relative overflow-hidden group">
                    {/* Gradient Overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                    
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                      className="text-7xl mb-6"
                    >
                      {feature.icon}
                    </motion.div>
                    <h3 className="text-2xl font-romantic font-semibold mb-4 text-white group-hover:text-romantic-400 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                      {feature.description}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-romantic-900/10 to-purple-900/10 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.p 
            className="text-3xl md:text-5xl font-romantic italic text-gray-200 mb-6"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            "In our little universe, every moment is infinite"
          </motion.p>
          <div className="flex justify-center space-x-4 text-5xl">
            <motion.span animate={{ rotate: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
              ✨
            </motion.span>
            <motion.span animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 2, repeat: Infinity }}>
              💫
            </motion.span>
            <motion.span animate={{ rotate: [0, -10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
              ✨
            </motion.span>
          </div>
        </motion.div>
      </section>

      {/* Easter Egg Hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        whileHover={{ opacity: 1, scale: 1.1 }}
        className="fixed bottom-20 left-6 text-xs text-gray-500 cursor-pointer z-50"
      >
        <p>💡 Psst... there's a secret here</p>
      </motion.div>
    </div>
  );
};

export default LandingEnhanced;
