const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const {
  uploadImage,
  uploadMultipleImages,
  uploadMiddleware
} = require('../controllers/upload.controller');

router.post('/image', protect, uploadMiddleware.single('image'), uploadImage);
router.post('/images', protect, uploadMiddleware.array('images', 5), uploadMultipleImages);

module.exports = router;
