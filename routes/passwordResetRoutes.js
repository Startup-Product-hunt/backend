const express = require('express');
const {
  requestPasswordReset,
  resetPasswordVerifyOTP,
  resetPasswordUpdateWithVerifiedOTP,
} = require('../controllers/passwordResetController');

const router = express.Router();

router.post('/forgot-password', requestPasswordReset);
router.post('/verify-otp', resetPasswordVerifyOTP);
router.post('/reset-password', resetPasswordUpdateWithVerifiedOTP);

module.exports = router;
