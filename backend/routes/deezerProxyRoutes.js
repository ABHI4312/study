const express = require('express');
const router = express.Router();
const { searchSongs } = require('../controllers/deezerProxyController');

router.route('/search').get(searchSongs);

module.exports = router;
