const express = require('express');
const router = express.Router();
const {
  getOpenWhens,
  getOpenWhen,
  createOpenWhen,
  openLetter,
  deleteOpenWhen,
} = require('../controllers/openWhenController');

router.route('/').get(getOpenWhens).post(createOpenWhen);

router.route('/:id').get(getOpenWhen).delete(deleteOpenWhen);

router.route('/:id/open').put(openLetter);

module.exports = router;
