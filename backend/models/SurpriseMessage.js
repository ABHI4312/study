const mongoose = require('mongoose');

const surpriseMessageSchema = new mongoose.Schema(
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
    author: {
      type: String,
      enum: ['me', 'you'],
      required: true,
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
    imageUrl: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('SurpriseMessage', surpriseMessageSchema);
