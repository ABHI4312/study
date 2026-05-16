const FutureGoal = require('../models/FutureGoal');

// @desc    Get all future goals
// @route   GET /api/goals
// @access  Public
const getGoals = async (req, res) => {
  try {
    const goals = await FutureGoal.find().sort({ targetDate: 1 });
    res.status(200).json({
      success: true,
      count: goals.length,
      data: goals,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single goal
// @route   GET /api/goals/:id
// @access  Public
const getGoal = async (req, res) => {
  try {
    const goal = await FutureGoal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Goal not found',
      });
    }

    res.status(200).json({
      success: true,
      data: goal,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create new goal
// @route   POST /api/goals
// @access  Public
const createGoal = async (req, res) => {
  try {
    const goal = await FutureGoal.create(req.body);

    res.status(201).json({
      success: true,
      data: goal,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update goal
// @route   PUT /api/goals/:id
// @access  Public
const updateGoal = async (req, res) => {
  try {
    const goal = await FutureGoal.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Goal not found',
      });
    }

    res.status(200).json({
      success: true,
      data: goal,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Toggle goal completion
// @route   PUT /api/goals/:id/toggle
// @access  Public
const toggleGoal = async (req, res) => {
  try {
    const goal = await FutureGoal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Goal not found',
      });
    }

    goal.isCompleted = !goal.isCompleted;
    goal.completedAt = goal.isCompleted ? Date.now() : null;
    await goal.save();

    res.status(200).json({
      success: true,
      data: goal,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete goal
// @route   DELETE /api/goals/:id
// @access  Public
const deleteGoal = async (req, res) => {
  try {
    const goal = await FutureGoal.findByIdAndDelete(req.params.id);

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Goal not found',
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
  getGoals,
  getGoal,
  createGoal,
  updateGoal,
  toggleGoal,
  deleteGoal,
};
