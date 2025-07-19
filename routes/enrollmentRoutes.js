const express = require('express');
const { enrollCourse, getMyCourses, checkEnrollment } = require('../controllers/enrollmentController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/:courseId', protect, enrollCourse);
router.get('/my', protect, getMyCourses);
router.get('/:courseId/check', protect, checkEnrollment);

module.exports = router;
