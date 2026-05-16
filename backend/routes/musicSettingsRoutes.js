const express = require('express');
const router = express.Router();
const {
  getMusicSettings,
  updateMusicSettings,
  resetMusicSettings,
} = require('../controllers/musicSettingsController');

router.route('/').get(getMusicSettings).put(updateMusicSettings).delete(resetMusicSettings);

module.exports = router;
