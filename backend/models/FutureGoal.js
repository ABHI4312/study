const mongoose = require('mongoose');

const futureGoalSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true,
    },
    description: {
      type: String,
      maxlength: [500, 'Description cannot be more than 500 characters'],
    },
    targetDate: {
      type: Date,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    completedAt: {
      type: Date,
    },
    category: {
      type: String,
      enum: ['travel', 'personal', 'together', 'career', 'other'],
      default: 'other',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('FutureGoal', futureGoalSchema);
