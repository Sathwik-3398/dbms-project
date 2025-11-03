const cloudinary = require('../config/cloudinary');
const multer = require('multer');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Check if Cloudinary is configured
const isCloudinaryConfigured = () => {
  return cloudinary.config().cloud_name && 
         cloudinary.config().cloud_name !== 'demo' &&
         cloudinary.config().api_key !== 'demo';
};

exports.uploadMiddleware = upload;

exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    // If Cloudinary is not configured, return placeholder
    if (!isCloudinaryConfigured()) {
      return res.json({
        success: true,
        url: 'https://via.placeholder.com/400x600?text=Book+Cover',
        message: 'Cloudinary not configured, using placeholder'
      });
    }

    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'book-marketplace' },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(req.file.buffer);
    });

    res.json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id
    });
  } catch (error) {
    console.error('Upload error:', error);
    // Return placeholder on error
    res.json({
      success: true,
      url: 'https://via.placeholder.com/400x600?text=Book+Cover',
      message: 'Upload failed, using placeholder'
    });
  }
};

exports.uploadMultipleImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No files uploaded' });
    }

    const uploadPromises = req.files.map(file => {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'book-marketplace' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result.secure_url);
          }
        );
        uploadStream.end(file.buffer);
      });
    });

    const urls = await Promise.all(uploadPromises);

    res.json({ success: true, urls });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
