const Memory = require('../models/Memory');

// @desc    Get all memories
// @route   GET /api/memories
// @access  Public
const getMemories = async (req, res) => {
  try {
    const memories = await Memory.find().sort({ date: -1 });
    res.status(200).json({
      success: true,
      count: memories.length,
      data: memories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single memory
// @route   GET /api/memories/:id
// @access  Public
const getMemory = async (req, res) => {
  try {
    const memory = await Memory.findById(req.params.id);

    if (!memory) {
      return res.status(404).json({
        success: false,
        message: 'Memory not found',
      });
    }

    res.status(200).json({
      success: true,
      data: memory,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create new memory
// @route   POST /api/memories
// @access  Public
const createMemory = async (req, res) => {
  try {
    const memory = await Memory.create(req.body);

    res.status(201).json({
      success: true,
      data: memory,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update memory
// @route   PUT /api/memories/:id
// @access  Public
const updateMemory = async (req, res) => {
  try {
    const memory = await Memory.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!memory) {
      return res.status(404).json({
        success: false,
        message: 'Memory not found',
      });
    }

    res.status(200).json({
      success: true,
      data: memory,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete memory
// @route   DELETE /api/memories/:id
// @access  Public
const deleteMemory = async (req, res) => {
  try {
    const memory = await Memory.findByIdAndDelete(req.params.id);

    if (!memory) {
      return res.status(404).json({
        success: false,
        message: 'Memory not found',
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
  getMemories,
  getMemory,
  createMemory,
  updateMemory,
  deleteMemory,
};
