const Product = require("../models/productModel");
const User = require("../models/userModel");

const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const { name,bio,location,phone,tags } = req.body|| {};
    const profilePic = req.file ? req.file.path : undefined;

    const updateData = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (profilePic) updateData.profilePic = profilePic;
     if (location) updateData.location = location;
     if (bio) updateData.bio = bio;
     if (tags) updateData.tags = tags;

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      select: "-password",
    });

    if (!updatedUser) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.status(200).json({
      msg: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ msg: "Server error while updating profile" });
  }
};


const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    .select('-password')

    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getMyProduct = async (req, res) => {
  try {
    const userId = req.user.id;
    const product = await Product.find({ userId }).populate('userId');
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProfile,
  updateUserProfile,
  getMyProduct
}
