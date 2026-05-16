const Counter = require('../models/Counter');

// @desc    Get counter
// @route   GET /api/counter/:name
// @access  Public
const getCounter = async (req, res) => {
  try {
    let counter = await Counter.findOne({ name: req.params.name });

    if (!counter) {
      counter = await Counter.create({ name: req.params.name, count: 0 });
    }

    res.status(200).json({
      success: true,
      data: counter,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Increment counter
// @route   POST /api/counter/:name/increment
// @access  Public
const incrementCounter = async (req, res) => {
  try {
    let counter = await Counter.findOne({ name: req.params.name });

    if (!counter) {
      counter = await Counter.create({
        name: req.params.name,
        count: 1,
        lastIncremented: Date.now(),
      });
    } else {
      counter.count += 1;
      counter.lastIncremented = Date.now();
      await counter.save();
    }

    res.status(200).json({
      success: true,
      data: counter,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Reset counter
// @route   PUT /api/counter/:name/reset
// @access  Public
const resetCounter = async (req, res) => {
  try {
    const counter = await Counter.findOneAndUpdate(
      { name: req.params.name },
      { count: 0, lastIncremented: null },
      { new: true, upsert: true }
    );

    res.status(200).json({
      success: true,
      data: counter,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getCounter,
  incrementCounter,
  resetCounter,
};
