const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const setTokenCookie = require('../authService/setTokenCookie');
const clearTokenCookie = require('../authService/clearCookie');
const { createToken } = require('../authService/authService');




const normalizeEmail = (email) => (email || '').trim().toLowerCase();

// -------- Register --------
exports.register = async (req, res) => {
  try {
    let { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: 'Name, email, password required' });
    email = normalizeEmail(email);
    if (password.length < 6)
      return res.status(400).json({ message: 'Password must be at least 6 characters' });

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ name, email, password });

    return res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email already registered' });
    }
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// -------- Login --------
exports.login = async (req, res) => {
  try {
    let { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'Email and password required' });

    email = normalizeEmail(email);
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

// -------- Logout --------
exports.logout = (req, res) => {
  try {
    clearTokenCookie(res);
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: `Server error: ${error}` });
  }
};
