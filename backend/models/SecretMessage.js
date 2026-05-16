const mongoose = require('mongoose');

const secretMessageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Please add a message'],
      maxlength: [2000, 'Message cannot be more than 2000 characters'],
    },
    voiceNoteUrl: {
      type: String,
      default: '',
    },
    videoUrl: {
      type: String,
      default: '',
    },
    isRevealed: {
      type: Boolean,
      default: false,
    },
    revealedAt: {
      type: Date,
    },
    isPasswordProtected: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('SecretMessage', secretMessageSchema);