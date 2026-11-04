const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage for art images
const artStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'art-diary',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'heic'],
    transformation: [{ width: 1200, height: 1200, crop: 'limit', quality: 'auto' }],
  },
});

// Storage for music files
const musicStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'music',
    resource_type: 'video',
    allowed_formats: ['mp3', 'wav', 'ogg', 'm4a'],
  },
});

const uploadArt = multer({ storage: artStorage });
const uploadMusic = multer({ storage: musicStorage });

module.exports = {
  cloudinary,
  uploadArt,
  uploadMusic,
};
