const ArtDiary = require('../models/ArtDiary');
const { cloudinary } = require('../config/cloudinary');

// @desc    Get all art diary entries
// @route   GET /api/art-diary
// @access  Public
const getArtDiaries = async (req, res) => {
  try {
    const { page = 1, limit = 12, sort = '-date', tags, artType, favorite } = req.query;
    
    const filter = {};
    if (tags) {
      filter.tags = { $in: tags.split(',') };
    }
    if (artType) {
      filter.artType = artType;
    }
    if (favorite === 'true') {
      filter.isFavorite = true;
    }

    const artDiaries = await ArtDiary.find(filter)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await ArtDiary.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: artDiaries.length,
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      data: artDiaries,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single art diary entry
// @route   GET /api/art-diary/:id
// @access  Public
const getArtDiary = async (req, res) => {
  try {
    const artDiary = await ArtDiary.findById(req.params.id);

    if (!artDiary) {
      return res.status(404).json({
        success: false,
        message: 'Art diary entry not found',
      });
    }

    res.status(200).json({
      success: true,
      data: artDiary,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create new art diary entry with image upload
// @route   POST /api/art-diary
// @access  Public
const createArtDiary = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image',
      });
    }

    const { title, description, date, tags, artType, isFavorite } = req.body;

    const artDiary = await ArtDiary.create({
      title,
      description,
      imageUrl: req.file.path,
      imagePublicId: req.file.filename,
      date: date || Date.now(),
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      artType: artType || 'other',
      isFavorite: isFavorite === 'true',
    });

    res.status(201).json({
      success: true,
      data: artDiary,
    });
  } catch (error) {
    // If error occurs and file was uploaded, delete it from Cloudinary
    if (req.file) {
      await cloudinary.uploader.destroy(req.file.filename);
    }
    
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update art diary entry
// @route   PUT /api/art-diary/:id
// @access  Public
const updateArtDiary = async (req, res) => {
  try {
    let artDiary = await ArtDiary.findById(req.params.id);

    if (!artDiary) {
      return res.status(404).json({
        success: false,
        message: 'Art diary entry not found',
      });
    }

    const updateData = { ...req.body };

    // Handle tags
    if (req.body.tags && typeof req.body.tags === 'string') {
      updateData.tags = req.body.tags.split(',').map(tag => tag.trim());
    }

    // If new image is uploaded, delete old one and update
    if (req.file) {
      // Delete old image from Cloudinary
      await cloudinary.uploader.destroy(artDiary.imagePublicId);
      
      updateData.imageUrl = req.file.path;
      updateData.imagePublicId = req.file.filename;
    }

    artDiary = await ArtDiary.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      data: artDiary,
    });
  } catch (error) {
    // If error occurs and new file was uploaded, delete it
    if (req.file) {
      await cloudinary.uploader.destroy(req.file.filename);
    }
    
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete art diary entry
// @route   DELETE /api/art-diary/:id
// @access  Public
const deleteArtDiary = async (req, res) => {
  try {
    const artDiary = await ArtDiary.findById(req.params.id);

    if (!artDiary) {
      return res.status(404).json({
        success: false,
        message: 'Art diary entry not found',
      });
    }

    // Delete image from Cloudinary
    await cloudinary.uploader.destroy(artDiary.imagePublicId);

    // Delete from database
    await artDiary.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
      message: 'Art diary entry deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Toggle favorite status
// @route   PATCH /api/art-diary/:id/favorite
// @access  Public
const toggleFavorite = async (req, res) => {
  try {
    const artDiary = await ArtDiary.findById(req.params.id);

    if (!artDiary) {
      return res.status(404).json({
        success: false,
        message: 'Art diary entry not found',
      });
    }

    artDiary.isFavorite = !artDiary.isFavorite;
    await artDiary.save();

    res.status(200).json({
      success: true,
      data: artDiary,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getArtDiaries,
  getArtDiary,
  createArtDiary,
  updateArtDiary,
  deleteArtDiary,
  toggleFavorite,
};
