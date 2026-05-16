const SurpriseMessage = require('../models/SurpriseMessage');

// @desc    Get all surprise messages
// @route   GET /api/surprises
// @access  Public
exports.getSurpriseMessages = async (req, res, next) => {
  try {
    const messages = await SurpriseMessage.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get unopened surprise messages
// @route   GET /api/surprises/unopened
// @access  Public
exports.getUnopenedMessages = async (req, res, next) => {
  try {
    const messages = await SurpriseMessage.find({ isOpened: false }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single surprise message
// @route   GET /api/surprises/:id
// @access  Public
exports.getSurpriseMessage = async (req, res, next) => {
  try {
    const message = await SurpriseMessage.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Surprise message not found',
      });
    }

    res.status(200).json({
      success: true,
      data: message,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create surprise message
// @route   POST /api/surprises
// @access  Public
exports.createSurpriseMessage = async (req, res, next) => {
  try {
    const message = await SurpriseMessage.create(req.body);

    res.status(201).json({
      success: true,
      data: message,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Open surprise message
// @route   PUT /api/surprises/:id/open
// @access  Public
exports.openSurpriseMessage = async (req, res, next) => {
  try {
    const message = await SurpriseMessage.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Surprise message not found',
      });
    }

    message.isOpened = true;
    message.openedAt = new Date();
    await message.save();

    res.status(200).json({
      success: true,
      data: message,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete surprise message
// @route   DELETE /api/surprises/:id
// @access  Public
exports.deleteSurpriseMessage = async (req, res, next) => {
  try {
    const message = await SurpriseMessage.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Surprise message not found',
      });
    }

    await message.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};
