// src/routes/passwordResetRoutes.js
const express = require('express');
const {
  requestPasswordReset,
  verifyPasswordResetOTP,
  resetPassword
} = require('../controllers/passwordResetController');

const router = express.Router();

router.post('/forgot-password', requestPasswordReset);
router.post('/verify-otp', verifyPasswordResetOTP);
router.post('/reset-password', resetPassword);

module.exports = router;
