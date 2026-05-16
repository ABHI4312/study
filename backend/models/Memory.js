const mongoose = require('mongoose');

const memorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
      maxlength: [1000, 'Description cannot be more than 1000 characters'],
    },
    date: {
      type: Date,
      required: [true, 'Please add a date'],
    },
    category: {
      type: String,
      enum: ['first-time', 'special-moment', 'adventure', 'milestone', 'other'],
      default: 'other',
    },
    imageUrl: {
      type: String,
      default: '',
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    isFavorite: {
      type: Boolean,
      default: false,
    },
    author: {
      type: String,
      enum: ['me', 'you'],
      default: 'me',
      required: true,
    },
    voiceNoteUrl: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Memory', memorySchema);
