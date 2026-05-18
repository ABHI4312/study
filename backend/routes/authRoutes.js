const express = require('express');
const router = express.Router();
const { verifyCode, setupCode, changePassword } = require('../controllers/authController');

router.post('/verify', verifyCode);
router.post('/setup', setupCode);
router.post('/change-password', changePassword);

module.exports = router;
