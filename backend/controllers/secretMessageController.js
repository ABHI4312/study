const SecretMessage = require('../models/SecretMessage');

// @desc    Get all secret messages
// @route   GET /api/secrets
// @access  Public
const getSecretMessages = async (req, res) => {
  try {
    const secrets = await SecretMessage.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: secrets.length,
      data: secrets,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single secret message
// @route   GET /api/secrets/:id
// @access  Public
const getSecretMessage = async (req, res) => {
  try {
    const secret = await SecretMessage.findById(req.params.id);

    if (!secret) {
      return res.status(404).json({
        success: false,
        message: 'Secret message not found',
      });
    }

    res.status(200).json({
      success: true,
      data: secret,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create new secret message
// @route   POST /api/secrets
// @access  Public
const createSecretMessage = async (req, res) => {
  try {
    const secret = await SecretMessage.create(req.body);

    res.status(201).json({
      success: true,
      data: secret,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Reveal secret message
// @route   PUT /api/secrets/:id/reveal
// @access  Public
const revealSecret = async (req, res) => {
  try {
    const secret = await SecretMessage.findByIdAndUpdate(
      req.params.id,
      {
        isRevealed: true,
        revealedAt: Date.now(),
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!secret) {
      return res.status(404).json({
        success: false,
        message: 'Secret message not found',
      });
    }

    res.status(200).json({
      success: true,
      data: secret,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete secret message
// @route   DELETE /api/secrets/:id
// @access  Public
const deleteSecretMessage = async (req, res) => {
  try {
    const secret = await SecretMessage.findByIdAndDelete(req.params.id);

    if (!secret) {
      return res.status(404).json({
        success: false,
        message: 'Secret message not found',
      });
    }

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getSecretMessages,
  getSecretMessage,
  createSecretMessage,
  revealSecret,
  deleteSecretMessage,
};
