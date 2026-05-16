const mongoose = require('mongoose');

const openWhenSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    message: {
      type: String,
      required: [true, 'Please add a message'],
      maxlength: [2000, 'Message cannot be more than 2000 characters'],
    },
    condition: {
      type: String,
      required: [true, 'Please add a condition'],
      trim: true,
    },
    voiceNoteUrl: {
      type: String,
      default: '',
    },
    videoUrl: {
      type: String,
      default: '',
    },
    isOpened: {
      type: Boolean,
      default: false,
    },
    openedAt: {
      type: Date,
    },
    emoji: {
      type: String,
      default: '💌',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('OpenWhen', openWhenSchema);
