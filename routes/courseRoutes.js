const express = require('express');
const {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  buyCourse,
  // buyCourse // <-- we'll wire this in later
} = require('../controllers/courseController');
const { protect } = require('../middlewares/authMiddleware');

// Multer+Cloudinary upload middleware for course thumbnails
// (See file below: ../middlewares/multerCourseThumbnail)
const uploadCourseThumb = require('../middlewares/multerCourseThumbnail');

const router = express.Router();

// Public
router.get('/', getCourses);
router.get('/:id', getCourse);

// Create course (ANY authenticated user can sell)
router.post(
  '/',
  protect,
  (req, res, next) => {
    uploadCourseThumb.single('thumbnail')(req, res, (err) => {
      if (err) return res.status(400).json({ message: err.message });
      next();
    });
  },
  createCourse
);

// Update course (creator or admin)
router.put(
  '/:id',
  protect,
  (req, res, next) => {
    uploadCourseThumb.single('thumbnail')(req, res, (err) => {
      if (err) return res.status(400).json({ message: err.message });
      next();
    });
  },
  updateCourse
);

// Delete course (creator or admin)
router.delete('/:id', protect, deleteCourse);

module.exports = router;
