const Enrollment = require('../models/enrollmentModel');
const Course = require('../models/courseModel');
const mongoose = require('mongoose');

const ALLOW_SELF_ENROLL =
  process.env.ALLOW_SELF_ENROLL === 'true' || process.env.NODE_ENV !== 'production';

// @desc Enroll (dummy, instant buy)
// @route POST /api/enroll/:courseId
// @access Private
exports.enrollCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: 'Invalid course ID' });
    }

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    if (!ALLOW_SELF_ENROLL && course.createdBy.toString() === req.user.id.toString()) {
      return res.status(400).json({ message: "Creators can't enroll in their own course" });
    }

    // Create enrollment
    const enrollment = await Enrollment.create({
      user: req.user.id,
      course: courseId,
      paymentStatus: 'completed'
    });

    // Increment course enrolled count
    await Course.findByIdAndUpdate(courseId, { $inc: { enrolledCount: 1 } });

    return res.status(201).json({ message: 'Enrolled successfully', enrollment });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }
    res.status(500).json({ message: error.message });
  }
};

exports.getMyCourses = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ user: req.user.id })
      .populate({
        path: 'course',
        populate: { path: 'createdBy', select: 'name email' }
      })
      .sort({ createdAt: -1 });

    if (!enrollments.length) {
      return res.status(200).json({
        success: true,
        message: 'You are not enrolled in any courses yet.',
        count: 0,
        courses: []
      });
    }

    const courses = enrollments.map(en => ({
      enrollmentId: en._id,
      paymentStatus: en.paymentStatus,
      enrolledAt: en.createdAt,
      course: en.course
    }));

    res.status(200).json({
      success: true,
      message: 'Enrolled courses retrieved successfully.',
      count: courses.length,
      courses
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Failed to load your courses.',
      error: err.message
    });
  }
};

exports.checkEnrollment = async (req, res) => {
  try {
    const { courseId } = req.params;
    const enrollment = await Enrollment.findOne({ user: req.user.id, course: courseId });
    res.json({ enrolled: !!enrollment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
