const express = require('express');
const router = express.Router();
const {
  getCounter,
  incrementCounter,
  resetCounter,
  updateMeetingDate,
} = require('../controllers/counterController');

router.route('/:name').get(getCounter);

router.route('/:name/increment').post(incrementCounter);

router.route('/:name/reset').put(resetCounter);

router.route('/:name/meeting-date').put(updateMeetingDate);

module.exports = router;
