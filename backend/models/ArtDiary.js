const mongoose = require('mongoose');

const artDiarySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, 'Description cannot be more than 2000 characters'],
    },
    imageUrl: {
      type: String,
      required: [true, 'Please upload an image'],
    },
    imagePublicId: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: [true, 'Please add a date'],
      default: Date.now,
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
    artType: {
      type: String,
      enum: ['drawing', 'painting', 'digital-art', 'sketch', 'craft', 'other'],
      default: 'other',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('ArtDiary', artDiarySchema);
