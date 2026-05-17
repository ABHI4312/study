const axios = require('axios');

// Generate a placeholder image URL
const getPlaceholderImage = (text, size = 250) => {
  return `https://placehold.co/${size}x${size}/ec4899/ffffff?text=${encodeURIComponent(text)}`;
};

// Sample fallback songs with working preview URLs and reliable placeholder images
const fallbackSongs = [
  {
    id: 1,
    title: 'Tum Se',
    artist: { name: 'Raghav Chaitanya, Varun Jain, Sachin-Jigar' },
    album: {
      title: 'Teri Baaton Mein Aisa Uljha Jiya',
      cover_medium: getPlaceholderImage('Tum+Se', 250),
      cover_xl: getPlaceholderImage('Tum+Se', 500),
    },
    preview: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    duration: 245,
  },
  {
    id: 2,
    title: 'Sitaare',
    artist: { name: 'Arijit Singh' },
    album: {
      title: 'Sitaare',
      cover_medium: getPlaceholderImage('Sitaare', 250),
      cover_xl: getPlaceholderImage('Sitaare', 500),
    },
    preview: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    duration: 258,
  },
  {
    id: 3,
    title: 'Bairan',
    artist: { name: 'Arijit Singh' },
    album: {
      title: 'Bairan',
      cover_medium: getPlaceholderImage('Bairan', 250),
      cover_xl: getPlaceholderImage('Bairan', 500),
    },
    preview: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    duration: 267,
  },
  {
    id: 4,
    title: 'Perfect',
    artist: { name: 'Ed Sheeran' },
    album: {
      title: '÷ (Deluxe)',
      cover_medium: getPlaceholderImage('Perfect', 250),
      cover_xl: getPlaceholderImage('Perfect', 500),
    },
    preview: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    duration: 263,
  },
  {
    id: 5,
    title: 'Kesariya',
    artist: { name: 'Arijit Singh' },
    album: {
      title: 'Brahmastra',
      cover_medium: getPlaceholderImage('Kesariya', 250),
      cover_xl: getPlaceholderImage('Kesariya', 500),
    },
    preview: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    duration: 271,
  },
  {
    id: 6,
    title: 'Channa Mereya',
    artist: { name: 'Arijit Singh' },
    album: {
      title: 'Ae Dil Hai Mushkil',
      cover_medium: getPlaceholderImage('Channa', 250),
      cover_xl: getPlaceholderImage('Channa', 500),
    },
    preview: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
    duration: 295,
  },
  {
    id: 7,
    title: 'Tere Hawale',
    artist: { name: 'Arijit Singh, Shilpa Rao' },
    album: {
      title: 'Laal Singh Chaddha',
      cover_medium: getPlaceholderImage('Tere+Hawale', 250),
      cover_xl: getPlaceholderImage('Tere+Hawale', 500),
    },
    preview: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
    duration: 283,
  },
  {
    id: 8,
    title: 'Raataan Lambiyan',
    artist: { name: 'Jubin Nautiyal, Asees Kaur' },
    album: {
      title: 'Shershaah',
      cover_medium: getPlaceholderImage('Raataan', 250),
      cover_xl: getPlaceholderImage('Raataan', 500),
    },
    preview: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
    duration: 254,
  },
  {
    id: 9,
    title: 'Apna Bana Le',
    artist: { name: 'Arijit Singh, Sachin-Jigar' },
    album: {
      title: 'Bhediya',
      cover_medium: getPlaceholderImage('Apna+Bana', 250),
      cover_xl: getPlaceholderImage('Apna+Bana', 500),
    },
    preview: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3',
    duration: 248,
  },
  {
    id: 10,
    title: 'All of Me',
    artist: { name: 'John Legend' },
    album: {
      title: 'Love In The Future',
      cover_medium: getPlaceholderImage('All+of+Me', 250),
      cover_xl: getPlaceholderImage('All+of+Me', 500),
    },
    preview: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3',
    duration: 269,
  },
  {
    id: 11,
    title: 'Pehle Bhi Main',
    artist: { name: 'Vishal Mishra' },
    album: {
      title: 'Animal',
      cover_medium: getPlaceholderImage('Pehle+Bhi', 250),
      cover_xl: getPlaceholderImage('Pehle+Bhi', 500),
    },
    preview: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3',
    duration: 262,
  },
  {
    id: 12,
    title: 'Agar Tum Saath Ho',
    artist: { name: 'Alka Yagnik, Arijit Singh' },
    album: {
      title: 'Tamasha',
      cover_medium: getPlaceholderImage('Agar+Tum', 250),
      cover_xl: getPlaceholderImage('Agar+Tum', 500),
    },
    preview: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3',
    duration: 341,
  },
  {
    id: 13,
    title: 'Tum Hi Ho',
    artist: { name: 'Arijit Singh' },
    album: {
      title: 'Aashiqui 2',
      cover_medium: getPlaceholderImage('Tum+Hi+Ho', 250),
      cover_xl: getPlaceholderImage('Tum+Hi+Ho', 500),
    },
    preview: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3',
    duration: 262,
  },
  {
    id: 14,
    title: 'Shayad',
    artist: { name: 'Arijit Singh' },
    album: {
      title: 'Love Aaj Kal',
      cover_medium: getPlaceholderImage('Shayad', 250),
      cover_xl: getPlaceholderImage('Shayad', 500),
    },
    preview: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3',
    duration: 238,
  },
  {
    id: 15,
    title: 'Ve Kamleya',
    artist: { name: 'Arijit Singh, Shreya Ghoshal' },
    album: {
      title: 'Rocky Aur Rani Kii Prem Kahaani',
      cover_medium: getPlaceholderImage('Kamleya', 250),
      cover_xl: getPlaceholderImage('Kamleya', 500),
    },
    preview: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3',
    duration: 276,
  },
];

// @desc    Search songs via Deezer API
// @route   GET /api/deezer/search?q=query
// @access  Public
exports.searchSongs = async (req, res, next) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required',
      });
    }

    // For now, always use fallback songs with working preview URLs
    // Deezer preview URLs are blocked in many regions
    console.log('Using fallback songs with working preview URLs');
    
    const searchLower = q.toLowerCase();
    let songs = fallbackSongs.filter(song => 
      song.title.toLowerCase().includes(searchLower) ||
      song.artist.name.toLowerCase().includes(searchLower) ||
      searchLower.includes(song.title.toLowerCase()) ||
      searchLower.includes(song.artist.name.toLowerCase())
    );
    
    // If no match, return all fallback songs
    if (songs.length === 0) {
      songs = fallbackSongs;
    }

    res.status(200).json({
      success: true,
      data: songs,
      total: songs.length,
      message: 'Sample romantic songs (working preview URLs)',
    });
  } catch (error) {
    console.error('Error:', error.message);
    
    // On error, return fallback songs
    res.status(200).json({
      success: true,
      data: fallbackSongs,
      total: fallbackSongs.length,
      message: 'Sample romantic songs',
    });
  }
};
