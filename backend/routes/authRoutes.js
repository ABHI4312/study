const express = require('express');
const router = express.Router();
const { verifyCode, setupCode } = require('../controllers/authController');

router.post('/verify', verifyCode);
router.post('/setup', setupCode);

module.exports = router;
