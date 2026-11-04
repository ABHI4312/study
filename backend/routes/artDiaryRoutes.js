const express = require('express');
const router = express.Router();
const { uploadArt } = require('../config/cloudinary');
const {
  getArtDiaries,
  getArtDiary,
  createArtDiary,
  updateArtDiary,
  deleteArtDiary,
  toggleFavorite,
} = require('../controllers/artDiaryController');

router.route('/')
  .get(getArtDiaries)
  .post(uploadArt.single('image'), createArtDiary);

router.route('/:id')
  .get(getArtDiary)
  .put(uploadArt.single('image'), updateArtDiary)
  .delete(deleteArtDiary);

router.patch('/:id/favorite', toggleFavorite);

module.exports = router;
