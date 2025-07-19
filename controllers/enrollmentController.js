const Enrollment = require('../models/enrollmentModel');
const Course = require('../models/courseModel');

// @desc Enroll user to a course
// @route POST /api/enroll/:courseId
exports.enrollCourse = async (req, res) => {
    try {
        const courseId = req.params.courseId;

        // Check if course exists
        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({ message: "Course not found" });

        // Check if already enrolled
        const existing = await Enrollment.findOne({ user: req.user.id, course: courseId });
        if (existing) return res.status(400).json({ message: "Already enrolled in this course" });

        // Create enrollment
        const enrollment = await Enrollment.create({
            user: req.user.id,
            course: courseId,
            paymentStatus: 'completed'
        });

        res.status(201).json({ message: "Enrolled successfully", enrollment });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Get user's enrolled courses
// @route GET /api/enroll/my-courses
exports.getMyCourses = async (req, res) => {
    try {
        const enrollments = await Enrollment.find({ user: req.user.id }).populate('course');
        res.json(enrollments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Check if user is enrolled in a course
// @route GET /api/enroll/:courseId
exports.checkEnrollment = async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const enrollment = await Enrollment.findOne({ user: req.user.id, course: courseId });
        res.json({ enrolled: !!enrollment });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
