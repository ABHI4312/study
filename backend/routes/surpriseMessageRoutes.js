const express = require('express');
const router = express.Router();
const {
  getSurpriseMessages,
  getUnopenedMessages,
  getSurpriseMessage,
  createSurpriseMessage,
  openSurpriseMessage,
  deleteSurpriseMessage,
} = require('../controllers/surpriseMessageController');

router.route('/').get(getSurpriseMessages).post(createSurpriseMessage);

router.route('/unopened').get(getUnopenedMessages);

router.route('/:id').get(getSurpriseMessage).delete(deleteSurpriseMessage);

router.route('/:id/open').put(openSurpriseMessage);

module.exports = router;
