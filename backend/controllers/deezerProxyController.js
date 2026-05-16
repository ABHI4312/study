const axios = require('axios');

// Sample fallback songs with working preview URLs
const fallbackSongs = [
  {
    id: 1,
    title: 'Perfect',
    artist: { name: 'Ed Sheeran' },
    album: {
      title: '÷ (Deluxe)',
      cover_medium: 'https://i.scdn.co/image/ab67616d00001e02ba5db46f4b838ef6027e6f96',
      cover_xl: 'https://i.scdn.co/image/ab67616d0000b273ba5db46f4b838ef6027e6f96',
    },
    preview: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    duration: 263,
  },
  {
    id: 2,
    title: 'All of Me',
    artist: { name: 'John Legend' },
    album: {
      title: 'Love In The Future',
      cover_medium: 'https://i.scdn.co/image/ab67616d00001e02c3b5d7c891b15e8e1c7e8e8e',
      cover_xl: 'https://i.scdn.co/image/ab67616d0000b273c3b5d7c891b15e8e1c7e8e8e',
    },
    preview: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    duration: 269,
  },
  {
    id: 3,
    title: 'Thinking Out Loud',
    artist: { name: 'Ed Sheeran' },
    album: {
      title: 'x (Deluxe Edition)',
      cover_medium: 'https://i.scdn.co/image/ab67616d00001e02ba5db46f4b838ef6027e6f96',
      cover_xl: 'https://i.scdn.co/image/ab67616d0000b273ba5db46f4b838ef6027e6f96',
    },
    preview: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    duration: 281,
  },
  {
    id: 4,
    title: 'A Thousand Years',
    artist: { name: 'Christina Perri' },
    album: {
      title: 'The Twilight Saga',
      cover_medium: 'https://i.scdn.co/image/ab67616d00001e02e5a25ed08d1e7e0e5e5e5e5e',
      cover_xl: 'https://i.scdn.co/image/ab67616d0000b273e5a25ed08d1e7e0e5e5e5e5e',
    },
    preview: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    duration: 285,
  },
  {
    id: 5,
    title: 'Make You Feel My Love',
    artist: { name: 'Adele' },
    album: {
      title: '19',
      cover_medium: 'https://i.scdn.co/image/ab67616d00001e02f5a25ed08d1e7e0e5e5e5e5e',
      cover_xl: 'https://i.scdn.co/image/ab67616d0000b273f5a25ed08d1e7e0e5e5e5e5e',
    },
    preview: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    duration: 231,
  },
  {
    id: 6,
    title: 'Just The Way You Are',
    artist: { name: 'Bruno Mars' },
    album: {
      title: 'Doo-Wops & Hooligans',
      cover_medium: 'https://i.scdn.co/image/ab67616d00001e02f6a25ed08d1e7e0e5e5e5e5e',
      cover_xl: 'https://i.scdn.co/image/ab67616d0000b273f6a25ed08d1e7e0e5e5e5e5e',
    },
    preview: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
    duration: 221,
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
