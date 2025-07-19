const express = require('express');
const { protect } = require('../middlewares/authMiddleware');
const { getProfile, updateProfile } = require('../controllers/userController');
const upload = require('../middlewares/multerCloudinary');
const { getMyCourses } = require('../controllers/userController');

const router = express.Router();

router.get('/profile', protect, getProfile);
router.patch(
  '/profile',
  protect,
  (req, res, next) => {
    upload.single('profilePic')(req, res, err => {
      if (err) {
        // Multer/Coudinary‐Storage error ‑ return JSON
        return res.status(400).json({ message: err.message });
      }
      next();
    });
  },
  updateProfile
);
router.get('/me/courses', protect, getMyCourses);

module.exports = router;