const mongoose = require('mongoose');

const musicSettingsSchema = new mongoose.Schema(
  {
    songTitle: {
      type: String,
      default: '',
    },
    artist: {
      type: String,
      default: '',
    },
    albumCover: {
      type: String,
      default: '',
    },
    previewUrl: {
      type: String,
      default: '',
    },
    deezerId: {
      type: String,
      default: '',
    },
    customMp3Url: {
      type: String,
      default: '',
    },
    isCustom: {
      type: Boolean,
      default: false,
    },
    volume: {
      type: Number,
      default: 0.5,
      min: 0,
      max: 1,
    },
    isPlaying: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('MusicSettings', musicSettingsSchema);
