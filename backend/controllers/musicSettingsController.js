const MusicSettings = require('../models/MusicSettings');

// @desc    Get music settings
// @route   GET /api/music
// @access  Public
exports.getMusicSettings = async (req, res, next) => {
  try {
    let settings = await MusicSettings.findOne();
    
    // Create default settings if none exist
    if (!settings) {
      settings = await MusicSettings.create({});
    }

    res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update music settings
// @route   PUT /api/music
// @access  Public
exports.updateMusicSettings = async (req, res, next) => {
  try {
    let settings = await MusicSettings.findOne();

    if (!settings) {
      settings = await MusicSettings.create(req.body);
    } else {
      settings = await MusicSettings.findByIdAndUpdate(
        settings._id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );
    }

    res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset music settings
// @route   DELETE /api/music
// @access  Public
exports.resetMusicSettings = async (req, res, next) => {
  try {
    await MusicSettings.deleteMany({});
    const settings = await MusicSettings.create({});

    res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    next(error);
  }
};
