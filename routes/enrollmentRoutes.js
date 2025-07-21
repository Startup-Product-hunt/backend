const express = require('express');
const { enrollCourse, getMyCourses, checkEnrollment } = require('../controllers/enrollmentController');


const router = express.Router();

router.post('/:courseId',  enrollCourse);
router.get('/my',  getMyCourses);
router.get('/:courseId/check',  checkEnrollment);

module.exports = router;
