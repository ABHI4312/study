const OpenWhen = require('../models/OpenWhen');

// @desc    Get all open when letters
// @route   GET /api/openwhen
// @access  Public
const getOpenWhens = async (req, res) => {
  try {
    const openWhens = await OpenWhen.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: openWhens.length,
      data: openWhens,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single open when letter
// @route   GET /api/openwhen/:id
// @access  Public
const getOpenWhen = async (req, res) => {
  try {
    const openWhen = await OpenWhen.findById(req.params.id);

    if (!openWhen) {
      return res.status(404).json({
        success: false,
        message: 'Open When letter not found',
      });
    }

    res.status(200).json({
      success: true,
      data: openWhen,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create new open when letter
// @route   POST /api/openwhen
// @access  Public
const createOpenWhen = async (req, res) => {
  try {
    const openWhen = await OpenWhen.create(req.body);

    res.status(201).json({
      success: true,
      data: openWhen,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Mark open when letter as opened
// @route   PUT /api/openwhen/:id/open
// @access  Public
const openLetter = async (req, res) => {
  try {
    const openWhen = await OpenWhen.findByIdAndUpdate(
      req.params.id,
      {
        isOpened: true,
        openedAt: Date.now(),
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!openWhen) {
      return res.status(404).json({
        success: false,
        message: 'Open When letter not found',
      });
    }

    res.status(200).json({
      success: true,
      data: openWhen,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete open when letter
// @route   DELETE /api/openwhen/:id
// @access  Public
const deleteOpenWhen = async (req, res) => {
  try {
    const openWhen = await OpenWhen.findByIdAndDelete(req.params.id);

    if (!openWhen) {
      return res.status(404).json({
        success: false,
        message: 'Open When letter not found',
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
  getOpenWhens,
  getOpenWhen,
  createOpenWhen,
  openLetter,
  deleteOpenWhen,
};
