// src/controllers/passwordResetController.js
const User = require('../models/userModel');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');
const bcrypt = require('bcrypt');

const sanitizeEmail = (email) => (email || '').trim().toLowerCase();

/**
 * Step 1: Request password reset (generate & email OTP)
 * POST /api/auth/forgot-password
 * Body: { email }
 */
exports.requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    console.log(email);
    if (!email) return res.status(400).json({ message: 'Email required' });

    const user = await User.findOne({ email: sanitizeEmail(email) });
    // Respond generically to avoid user enumeration
    if (!user) {
      return res.json({ message: 'If that email exists, an OTP has been sent' });
    }

    const otp = user.setPasswordResetOTP();
    console.log(otp)
    await user.save();

    const html = `
      <p>Hi ${user.name || ''},</p>
      <p>Your password reset OTP for <b>${process.env.APP_NAME || 'our platform'}</b> is:</p>
      <h2 style="letter-spacing:4px;">${otp}</h2>
      <p>This code will expire in 10 minutes. If you did not request this, you can ignore this email.</p>
      <p>— ${process.env.APP_NAME || 'Team'}</p>
    `;

    await sendEmail({
      to: user.email,
      subject: 'Password Reset OTP',
      html,
      text: `Your password reset OTP is ${otp}. It expires in 10 minutes.`
    });

    res.json({ message: 'If that email exists, an OTP has been sent' });
  } catch (err) {
    console.error('requestPasswordReset error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Step 2: Verify OTP
 * POST /api/auth/verify-otp
 * Body: { email, otp }
 */
exports.verifyPasswordResetOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp)
      return res.status(400).json({ message: 'Email and OTP required' });

    const user = await User.findOne({ email: sanitizeEmail(email) });
    if (!user) return res.status(400).json({ message: 'Invalid email or OTP' });

    // Check attempts lock (optional logic)
    if (user.resetPasswordAttempts >= 5)
      return res.status(429).json({ message: 'Too many attempts. Request a new OTP.' });

    const valid = user.verifyPasswordResetOTP(otp);
    user.resetPasswordAttempts = (user.resetPasswordAttempts || 0) + 1;

    if (!valid) {
      await user.save();
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Mark verified; issue a second-stage token
    user.resetPasswordVerified = true;

    const resetToken = user.generateResetToken();
    // Clear OTP fields to prevent reuse
    user.resetPasswordOTPHash = undefined;
    user.resetPasswordOTPExpires = undefined;
    user.resetPasswordAttempts = 0;

    await user.save();

    res.json({
      message: 'OTP verified. Use resetToken to set new password.',
      resetToken
    });
  } catch (err) {
    console.error('verifyPasswordResetOTP error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Step 3: Reset password
 * POST /api/auth/reset-password
 * Body: { email, resetToken, newPassword }
 */
exports.resetPassword = async (req, res) => {
  try {
    const { email, resetToken, newPassword } = req.body;

    if (!email || !resetToken || !newPassword) {
      return res.status(400).json({ message: 'Email, resetToken, and newPassword required' });
    }

    if (newPassword.length < 6)
      return res.status(400).json({ message: 'Password must be at least 6 characters' });

    const user = await User.findOne({ email: sanitizeEmail(email) });
    if (!user || !user.resetPasswordTokenHash)
      return res.status(400).json({ message: 'Invalid reset token' });

    if (Date.now() > new Date(user.resetPasswordTokenExpires).getTime())
      return res.status(400).json({ message: 'Reset token expired' });

    const tokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
    if (tokenHash !== user.resetPasswordTokenHash)
      return res.status(400).json({ message: 'Invalid reset token' });

    // Set new password
    user.password = newPassword;
    // Clear reset fields
    user.resetPasswordTokenHash = undefined;
    user.resetPasswordTokenExpires = undefined;
    user.resetPasswordVerified = false;

    await user.save();

    res.json({ message: 'Password reset successful. You can log in now.' });
  } catch (err) {
    console.error('resetPassword error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * OPTIONAL 2-STEP VARIANT:
 * If you want to allow resetting with the OTP directly (skip verify route),
 * create an endpoint that:
 *  - checks otp with user.verifyPasswordResetOTP(otp)
 *  - if valid, set new password, clear fields, respond success
 * BUT: less secure because OTP replays are easier.
 */
