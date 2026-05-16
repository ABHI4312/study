const express = require('express');
const router = express.Router();
const {
  getSecretMessages,
  getSecretMessage,
  createSecretMessage,
  revealSecret,
  deleteSecretMessage,
} = require('../controllers/secretMessageController');

router.route('/').get(getSecretMessages).post(createSecretMessage);

router.route('/:id').get(getSecretMessage).delete(deleteSecretMessage);

router.route('/:id/reveal').put(revealSecret);

module.exports = router;
