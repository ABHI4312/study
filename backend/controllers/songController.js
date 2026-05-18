const Song = require('../models/Song');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary (you'll need to add these to .env)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'your_cloud_name',
  api_key: process.env.CLOUDINARY_API_KEY || 'your_api_key',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'your_api_secret',
});

// Configure multer storage for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'our-little-universe/songs',
    resource_type: 'video', // Cloudinary uses 'video' for audio files
    allowed_formats: ['mp3', 'wav', 'ogg', 'm4a'],
  },
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB max
  },
});

// @desc    Get all songs
// @route   GET /api/songs
// @access  Public
const getSongs = async (req, res) => {
  try {
    const songs = await Song.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: songs.length,
      data: songs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single song
// @route   GET /api/songs/:id
// @access  Public
const getSong = async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);

    if (!song) {
      return res.status(404).json({
        success: false,
        message: 'Song not found',
      });
    }

    res.status(200).json({
      success: true,
      data: song,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Upload new song
// @route   POST /api/songs/upload
// @access  Public
const uploadSong = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an audio file',
      });
    }

    const { title, artist, description, emoji, color } = req.body;

    if (!title || !artist) {
      // Delete uploaded file from Cloudinary if validation fails
      if (req.file.public_id) {
        await cloudinary.uploader.destroy(req.file.public_id, { resource_type: 'video' });
      }
      
      return res.status(400).json({
        success: false,
        message: 'Please provide title and artist',
      });
    }

    const song = await Song.create({
      title,
      artist,
      description: description || 'Romantic Song',
      filename: req.file.originalname,
      fileUrl: req.file.path,
      cloudinaryId: req.file.public_id,
      emoji: emoji || '🎵',
      color: color || 'from-romantic-500 to-purple-500',
      fileSize: req.file.size,
      duration: req.file.duration || 0,
    });

    res.status(201).json({
      success: true,
      message: 'Song uploaded successfully! 🎵',
      data: song,
    });
  } catch (error) {
    // Delete uploaded file from Cloudinary if database save fails
    if (req.file && req.file.public_id) {
      await cloudinary.uploader.destroy(req.file.public_id, { resource_type: 'video' });
    }

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete song
// @route   DELETE /api/songs/:id
// @access  Public
const deleteSong = async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);

    if (!song) {
      return res.status(404).json({
        success: false,
        message: 'Song not found',
      });
    }

    // Delete from Cloudinary
    if (song.cloudinaryId) {
      await cloudinary.uploader.destroy(song.cloudinaryId, { resource_type: 'video' });
    }

    // Delete from database
    await song.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Song deleted successfully',
      data: {},
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update song details
// @route   PUT /api/songs/:id
// @access  Public
const updateSong = async (req, res) => {
  try {
    const song = await Song.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!song) {
      return res.status(404).json({
        success: false,
        message: 'Song not found',
      });
    }

    res.status(200).json({
      success: true,
      data: song,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getSongs,
  getSong,
  uploadSong,
  deleteSong,
  updateSong,
  upload,
};
