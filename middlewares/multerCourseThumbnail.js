const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary'); // same config you used for profile pics

// If you want transformations (resize, etc.) add a params.transformation array.
// Leaving raw so creators can design their own cover images.
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'course_thumbnails',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'], // allow webp too (optional)
    // transformation: [{ width: 600, height: 338, crop: 'fill', gravity: 'auto', quality: 'auto' }]
  },
});

// Reject non-image
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) return cb(null, true);
  cb(new Error('Invalid file type. Only images are allowed.'), false);
};

// 5MB limit (thumbnails can be wider than profile pics; adjust as needed)
const uploadCourseThumb = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

module.exports = uploadCourseThumb;
