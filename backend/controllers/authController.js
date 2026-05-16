const Auth = require('../models/Auth');

// @desc    Verify secret code
// @route   POST /api/auth/verify
// @access  Public
const verifyCode = async (req, res) => {
  try {
    const { secretCode } = req.body;

    if (!secretCode) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a secret code',
      });
    }

    const auth = await Auth.findOne({ secretCode, isActive: true });

    if (!auth) {
      return res.status(401).json({
        success: false,
        message: 'Invalid secret code',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Access granted',
      data: {
        authenticated: true,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create or update secret code
// @route   POST /api/auth/setup
// @access  Public (should be protected in production)
const setupCode = async (req, res) => {
  try {
    const { secretCode } = req.body;

    if (!secretCode) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a secret code',
      });
    }

    // Delete all existing codes
    await Auth.deleteMany({});

    // Create new code
    const auth = await Auth.create({ secretCode });

    res.status(201).json({
      success: true,
      message: 'Secret code set successfully',
      data: auth,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  verifyCode,
  setupCode,
};
