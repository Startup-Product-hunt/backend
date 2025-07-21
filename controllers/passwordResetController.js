const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const passwordResetOTPTemplate = require("../templates/passwordResetOTP");
const sendEmail = require("../utils/sendEmail");
const generateOTP = require("../utils/otpGenerator");

const sanitizeEmail = (email) => (email || "").trim().toLowerCase();

async function setUserOTP(userDoc) {
  const otp = generateOTP();
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(otp, salt);

  userDoc.resetPasswordOTPHash = hash;
  userDoc.resetPasswordOTPExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 min
  userDoc.resetPasswordAttempts = 0;

  return otp;
}

function clearOTPState(userDoc) {
  userDoc.resetPasswordOTPHash = undefined;
  userDoc.resetPasswordOTPExpires = undefined;
  userDoc.resetPasswordAttempts = 0;
  userDoc.resetPasswordOTPverified = false;
}

exports.requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email required." });

    const user = await User.findOne({ email: sanitizeEmail(email) });
    if (!user) {
      return res.json({ message: "If that email exists, an OTP has been sent." });
    }

    const otp = await setUserOTP(user);
    await user.save();

    const html = passwordResetOTPTemplate(user.name, otp, process.env.APP_NAME);

    await sendEmail({
      to: user.email,
      subject: "Password Reset OTP",
      html,
      text: `Your password reset OTP is ${otp}. It expires in 10 minutes.`,
    });

    res.json({ message: "If that email exists, an OTP has been sent." });
  } catch (err) {
    console.error("requestPasswordReset error:", err);
    res.status(500).json({ message: "Server error." });
  }
};

exports.resetPasswordVerifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required." });
    }

    const user = await User.findOne({ email: sanitizeEmail(email) });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or OTP." });
    }

    if ((user.resetPasswordAttempts || 0) >= 5) {
      return res
        .status(429)
        .json({ message: "Too many attempts. Request a new OTP." });
    }

    if (
      !user.resetPasswordOTPHash ||
      !user.resetPasswordOTPExpires ||
      Date.now() > user.resetPasswordOTPExpires.getTime()
    ) {
      user.resetPasswordAttempts = (user.resetPasswordAttempts || 0) + 1;
      await user.save();
      return res.status(400).json({ message: "Invalid or expired OTP." });
    }

    const isMatch = await bcrypt.compare(otp, user.resetPasswordOTPHash);

    user.resetPasswordAttempts = (user.resetPasswordAttempts || 0) + 1;

    if (!isMatch) {
      await user.save();
      return res.status(400).json({ message: "Invalid or expired OTP." });
    }

    user.resetPasswordOTPverified = true;
    await user.save();

    return res.status(200).json({ message: "OTP verified." });
  } catch (err) {
    console.error("resetPasswordVerifyOTP error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};

exports.resetPasswordUpdateWithVerifiedOTP = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({ message: "Email and newPassword are required." });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters." });
    }

    const user = await User.findOne({ email: sanitizeEmail(email) });
    if (!user) {
      return res.status(400).json({ message: "Invalid request." });
    }

    if (!user.resetPasswordOTPverified) {
      return res.status(400).json({ message: "OTP not verified." });
    }

    if (
      !user.resetPasswordOTPExpires ||
      Date.now() > user.resetPasswordOTPExpires.getTime()
    ) {
      clearOTPState(user);
      await user.save();
      return res.status(400).json({ message: "OTP session expired. Request a new OTP." });
    }

    user.password = newPassword;

    clearOTPState(user);

    await user.save();
    return res.json({ message: "Password reset successful. You can log in now." });
  } catch (err) {
    console.error("resetPasswordUpdateWithVerifiedOTP error:", err);
    res.status(500).json({ message: "Server error." });
  }
};