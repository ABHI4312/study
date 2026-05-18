const mongoose = require('mongoose');

const songSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a song title'],
      trim: true,
    },
    artist: {
      type: String,
      required: [true, 'Please add an artist name'],
      trim: true,
    },
    description: {
      type: String,
      default: 'Romantic Song',
    },
    filename: {
      type: String,
      required: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    cloudinaryId: {
      type: String,
    },
    emoji: {
      type: String,
      default: '🎵',
    },
    color: {
      type: String,
      default: 'from-romantic-500 to-purple-500',
    },
    duration: {
      type: Number, // in seconds
    },
    fileSize: {
      type: Number, // in bytes
    },
    uploadedBy: {
      type: String,
      default: 'user',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Song', songSchema);
