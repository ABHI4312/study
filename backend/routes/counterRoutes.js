const express = require('express');
const router = express.Router();
const {
  getCounter,
  incrementCounter,
  resetCounter,
} = require('../controllers/counterController');

router.route('/:name').get(getCounter);

router.route('/:name/increment').post(incrementCounter);

router.route('/:name/reset').put(resetCounter);

module.exports = router;
