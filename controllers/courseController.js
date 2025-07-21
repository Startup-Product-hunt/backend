const Course = require('../models/courseModel');
const mongoose = require('mongoose');

function cleanString(val) {
  return typeof val === 'string' ? val.trim() : val;
}
function parseContentPayload(raw) {
  if (!raw) return [];
  let data = raw;
  if (typeof raw === 'string') {
    try { data = JSON.parse(raw); } catch { return []; }
  }
  if (!Array.isArray(data)) return [];
  return data
    .map(i => ({ type: i?.type, url: i?.url }))
    .filter(i => i.type && i.url);
}
function userCanEditCourse(course, reqUser) {
  if (!reqUser) return false;
  if (reqUser.role === 'admin') return true;
  return course.createdBy.toString() === reqUser.id.toString();
}

exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .populate('createdBy', 'name email')
      .lean();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('createdBy', 'name email')
      .lean();
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return res.status(400).json({ message: 'Invalid course ID' });
    }
    res.status(500).json({ message: error.message });
  }
};

exports.createCourse = async (req, res) => {
  try {
    const {
      title,
      details,
      description,
      price,
      category,
      content
    } = req.body;

    if (!title) return res.status(400).json({ message: 'Title is required.' });
    const detailsText = details || description;
    if (!detailsText) return res.status(400).json({ message: 'Details are required.' });
    if (price === undefined) return res.status(400).json({ message: 'Price is required.' });
    if (!category) return res.status(400).json({ message: 'Category is required.' });

    let thumbnailUrl = '';
    if (req.file?.path) thumbnailUrl = req.file.path;
    else if (req.body.thumbnail) thumbnailUrl = cleanString(req.body.thumbnail);

    const course = await Course.create({
      title: cleanString(title),
      details: detailsText,
      price: Number(price),
      category: cleanString(category),
      thumbnail: thumbnailUrl,
      content: parseContentPayload(content),
      createdBy: req.user.id
    });

    const populated = await Course.findById(course._id)
      .populate('createdBy', 'name email')
      .lean();

    res.status(201).json(populated);
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    if (!userCanEditCourse(course, req.user)) {
      return res.status(403).json({ message: 'Not authorized to update this course' });
    }

    const {
      title,
      details,
      description,
      price,
      category,
      content
    } = req.body;

    if (title !== undefined) course.title = cleanString(title);
    if (details !== undefined || description !== undefined) {
      course.details = details || description;
    }
    if (price !== undefined) course.price = Number(price);
    if (category !== undefined) course.category = cleanString(category);

    if (req.file?.path) {
      course.thumbnail = req.file.path;
    } else if (req.body.thumbnail !== undefined) {
      course.thumbnail = cleanString(req.body.thumbnail);
    }

    if (content !== undefined) {
      course.content = parseContentPayload(content);
    }

    await course.save();

    const populated = await Course.findById(course._id)
      .populate('createdBy', 'name email')
      .lean();

    res.json(populated);
  } catch (error) {
    console.error('Update course error:', error);
    if (error instanceof mongoose.Error.CastError) {
      return res.status(400).json({ message: 'Invalid course ID' });
    }
    res.status(500).json({ message: error.message });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    if (!userCanEditCourse(course, req.user)) {
      return res.status(403).json({ message: 'Not authorized to delete this course' });
    }

    await course.deleteOne();
    res.json({ message: 'Course removed' });
  } catch (error) {
    console.error('Delete course error:', error);
    if (error instanceof mongoose.Error.CastError) {
      return res.status(400).json({ message: 'Invalid course ID' });
    }
    res.status(500).json({ message: error.message });
  }
};
