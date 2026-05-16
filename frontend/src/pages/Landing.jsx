import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {ReactTyped} from 'react-typed';
import ParticlesBackground from '../components/ParticlesBackground';
import { TypeAnimation } from 'react-type-animation';

const Landing = () => {
  const features = [
    {
      icon: '📸',
      title: 'Memory Timeline',
      description: 'Capture and cherish every special moment together',
      link: '/memories',
    },
    {
      icon: '💌',
      title: 'Open When Letters',
      description: 'Heartfelt messages for different moments',
      link: '/open-when',
    },
    {
      icon: '🔐',
      title: 'Secret Messages',
      description: 'Hidden surprises waiting to be revealed',
      link: '/secret-login',
    },
  ];

  return (
    <div className="min-h-screen relative">
      <ParticlesBackground />
      
      {/* Cinematic Hero Section */}
      <section className="relative overflow-hidden min-h-screen flex items-center justify-center px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-romantic-900/30 via-dark-900 to-purple-900/30" />
        
        {/* Animated Stars */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0.2, 1, 0.2],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        <div className="relative max-w-7xl mx-auto text-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            {/* Typing Animation */}
            <h1 className="text-5xl md:text-8xl font-romantic font-bold mb-6">
              <TypeAnimation
                sequence={[
                  'Our Little Universe ❤️',
                  2000,
                  'Where Love Lives Forever 💕',
                  2000,
                  'Every Moment Matters ✨',
                  2000,
                ]}
                wrapper="span"
                speed={50}
                className="bg-gradient-to-r from-romantic-400 via-pink-400 to-purple-400 bg-clip-text text-transparent"
                repeat={Infinity}
              />
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
            >
              A cinematic journey through our love story, where every memory sparkles like a star in our universe
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 }}
              className="flex flex-col sm:flex-row gap-6 justify-center"
            >
              <Link to="/memories">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(236, 72, 153, 0.5)' }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-primary text-lg px-8 py-4 relative overflow-hidden group"
                >
                  <span className="relative z-10">Enter Our World</span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-purple-600 to-romantic-600"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.button>
              </Link>
              
              <Link to="/secret-login">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-secondary text-lg px-8 py-4 backdrop-blur-lg"
                >
                  🔐 Secret Portal
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Floating Hearts Animation */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-4xl"
                initial={{
                  x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                  y: typeof window !== 'undefined' ? window.innerHeight + 100 : 1000,
                  opacity: 0.6,
                }}
                animate={{
                  y: -100,
                  x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                  rotate: [0, 360],
                }}
                transition={{
                  duration: Math.random() * 15 + 10,
                  repeat: Infinity,
                  delay: Math.random() * 5,
                  ease: 'linear',
                }}
              >
                {['❤️', '💕', '💖', '💗', '💝', '💓', '💞'][Math.floor(Math.random() * 7)]}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        >
          <div className="text-gray-400 text-sm mb-2">Scroll to explore</div>
          <div className="w-6 h-10 border-2 border-romantic-500 rounded-full flex justify-center">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1 h-2 bg-romantic-500 rounded-full mt-2"
            />
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-32 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl font-romantic font-bold text-center mb-16 text-white"
          >
            Explore Our Universe
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                whileHover={{ y: -15, scale: 1.02 }}
              >
                <Link to={feature.link}>
                  <div className="card text-center h-full hover:shadow-2xl hover:shadow-romantic-500/30 backdrop-blur-lg bg-dark-800/80 border-2 border-transparent hover:border-romantic-500/50 transition-all duration-500">
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="text-7xl mb-6"
                    >
                      {feature.icon}
                    </motion.div>
                    <h3 className="text-2xl font-romantic font-semibold mb-4 text-white">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Romantic Quote Section */}
      <section className="py-32 px-4 bg-gradient-to-r from-romantic-900/20 to-purple-900/20 relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center relative z-10"
        >
          <motion.p
            className="text-4xl md:text-5xl font-romantic italic text-gray-200 mb-8 leading-relaxed"
            animate={{ opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            "In our little universe, every moment is infinite, every memory is a constellation, and our love is the gravity that holds it all together"
          </motion.p>
          
          <div className="flex justify-center space-x-4 text-5xl">
            {['✨', '💫', '⭐', '💖', '✨'].map((emoji, i) => (
              <motion.span
                key={i}
                animate={{
                  y: [0, -20, 0],
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              >
                {emoji}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* Background Glow Effect */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{ duration: 4, repeat: Infinity }}
            className="w-96 h-96 bg-romantic-500 rounded-full blur-3xl"
          />
        </div>
      </section>
    </div>
  );
};

export default Landing;
