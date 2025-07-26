const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const setTokenCookie = require('../authService/setTokenCookie');
const clearTokenCookie = require('../authService/clearCookie');
const { createToken } = require('../authService/authService');
const { sendResetPassword } = require('../emailService/passwordResetOTP');


const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    return res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'Email and password required' });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: 'Invalid email or password' });

    const token = createToken(user);
     setTokenCookie(res, token);

    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


const logout = (req, res) => {
  try {
    clearTokenCookie(res);
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: `Server error: ${error}` });
  }
};


const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const resetToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const resetLink = `${process.env.CLIENT_URL}/profile/${resetToken}`;

    const emailSent = await sendResetPassword(
      user.name,
      user.email,
      resetLink
    );

    if (!emailSent) {
      return res.status(500).json({ msg: "Failed to send reset email" });
    }

    return res.status(200).json({
      resetLink,
      msg: "Reset link sent to your email successfully",
    });
  } catch (error) {
    return res.status(500).json({
      msg: `Server error from forgot password: ${error.message}`,
    });
  }
};

const handleResetPassword = async (req, res) => {
  const { resetToken } = req.params;
  const { newPassword } = req.body;

  try {
    if (!resetToken) {
      return res.status(400).json({ message: "Reset token is required" });
    }

    const decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

  
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();

    return res.status(200).json({ msg: "Password reset successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ msg: `Server error from handleResetPassword: ${error}` });
  }
};


module.exports = {
  register,
  handleResetPassword,
  forgotPassword,
  login,
  logout
}

