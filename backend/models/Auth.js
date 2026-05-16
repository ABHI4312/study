const mongoose = require('mongoose');

const authSchema = new mongoose.Schema(
  {
    secretCode: {
      type: String,
      required: true,
      unique: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Auth', authSchema);
