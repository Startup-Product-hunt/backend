const courseModel = require('../models/courseModel');
const User = require('../models/userModel');



exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    .select('-password')
    .select('-resetPasswordVerified')
    .select('-resetPasswordAttempts');

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getMyCourses = async (req, res) => {
  try {
    const userId = req.user.id;
    const courses = await courseModel.find({ buyers: userId }).populate('createdBy', 'name email');
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const {
      name,
      email,
      password,
      bio,
      location,
      tags
    } = req.body;

    if (name !== undefined) user.name = name.trim();
    if (email !== undefined) user.email = String(email).toLowerCase().trim();
    if (bio !== undefined) user.bio = bio;
    if (location !== undefined) user.location = location;

    if (tags !== undefined) {
      let tagArr = Array.isArray(tags) ? tags : String(tags).split(',');
      tagArr = tagArr.map(t => t.trim()).filter(Boolean);
      const seen = new Set();
      const deduped = [];
      for (const t of tagArr) {
        const k = t.toLowerCase();
        if (!seen.has(k)) { seen.add(k); deduped.push(t); }
      }
      user.tags = deduped.slice(0, 20);
    }

    if (password) {
      user.password = password;
    }

    let oldPublicId = null;
    if (req.file) {
      oldPublicId = user.profilePicPublicId || null;
      user.profilePic = req.file.path;
      user.profilePicPublicId = req.file.filename;
    }

    await user.save();
    if (oldPublicId && oldPublicId !== user.profilePicPublicId) {
      deleteCloudinaryImage(oldPublicId);
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profilePic: user.profilePic,
      bio: user.bio,
      location: user.location,
      tags: user.tags
    });
  } catch (error) {
    if (error.code === 11000 && error.keyPattern?.email) {
      return res.status(400).json({ message: 'Email already in use.' });
    }
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
