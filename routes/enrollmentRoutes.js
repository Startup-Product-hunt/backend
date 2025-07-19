const express = require('express');
const { enrollCourse, getMyCourses, checkEnrollment } = require('../controllers/enrollmentController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/:courseId', protect, enrollCourse);
router.get('/my-courses', protect, getMyCourses);
router.get('/:courseId', protect, checkEnrollment);

module.exports = router;
