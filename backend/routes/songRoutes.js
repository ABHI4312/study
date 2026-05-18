const express = require('express');
const router = express.Router();
const {
  getSongs,
  getSong,
  uploadSong,
  deleteSong,
  updateSong,
  upload,
} = require('../controllers/songController');

router.route('/').get(getSongs);

router.route('/upload').post(upload.single('audio'), uploadSong);

router.route('/:id')
  .get(getSong)
  .put(updateSong)
  .delete(deleteSong);

module.exports = router;
