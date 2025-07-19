// src/controllers/authController.js
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const generateToken = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '7d' });

const buildCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production', // true only over HTTPS in prod
  sameSite: process.env.COOKIE_SAMESITE || 'strict', // 'lax' if you need it
  maxAge: 7 * 24 * 60 * 60 * 1000,
  // domain: process.env.COOKIE_DOMAIN, // e.g. '.yourdomain.com' if needed
  // path: '/', // default
});

const normalizeEmail = (email) => (email || '').trim().toLowerCase();

// -------- Register --------
exports.register = async (req, res) => {
  try {
    let { name, email, password } = req.body;

    // Basic validation (expand as needed)
    if (!name || !email || !password)
      return res.status(400).json({ message: 'Name, email, password required' });
    email = normalizeEmail(email);
    if (password.length < 6)
      return res.status(400).json({ message: 'Password must be at least 6 characters' });

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'User already exists' });
      // For stealth mode, you could respond: res.status(200).json({ message: 'If that email is unused, account will be created' });
    }

    const user = await User.create({ name, email, password });

    // Auto-login: set cookie
    const token = generateToken(user._id, user.role);
    res.cookie('token', token, buildCookieOptions());

    return res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
      // Decide whether to also send token: token
    });
  } catch (error) {
    // Handle duplicate key (unique index violation)
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

    const token = generateToken(user._id, user.role);
    res.cookie('token', token, buildCookieOptions());

    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
      // token  (omit if cookie-only strategy)
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// -------- Logout --------
exports.logout = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: false,
    sameSite: 'lax'
  });
  res.json({ message: 'Logged out successfully' });
};
