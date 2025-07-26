const Product = require('../models/productModel');
const mongoose = require('mongoose');

const getAllProduct = async (req, res) => {
  try {
    const product = await Product.find()
      .populate('UserId')
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('UserId')
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return res.status(400).json({ message: 'Invalid course ID' });
    }
    res.status(500).json({ message: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const {
      title,
      details,
      price,
      category,
      content
    } = req.body;



    const product = await Product.create({
      title: cleanString(title),
      details: detailsText,
      price: Number(price),
      category: cleanString(category),
      thumbnail: thumbnailUrl,
      content: parseContentPayload(content),
      UserId: req.user.id
    });

    const populated = await Product.findById(course._id)
      .populate('UserId', 'name email')
      .lean();

    res.status(201).json(populated);
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({ message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Course not found' });

    const {
      title,
      details,
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

const deleteCourse = async (req, res) => {
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
