const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: { type: String, enum: ["user", "admin"], default: "user" },

    profilePic: {
      type: String,
      default: "",
    },
    profilePicPublicId: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      default: "",
    },
    tags: [
      {
        type: String,
      },
    ],

    resetPasswordOTPHash: { type: String },
    resetPasswordOTPExpires: { type: Date },
    resetPasswordAttempts: { type: Number, default: 0 },
    resetPasswordVerified: { type: Boolean, default: false },
    resetPasswordTokenHash: { type: String },
    resetPasswordTokenExpires: { type: Date },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.setPasswordResetOTP = function () {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const hash = crypto.createHash("sha256").update(otp).digest("hex");
  this.resetPasswordOTPHash = hash;
  this.resetPasswordOTPExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins
  this.resetPasswordAttempts = 0;
  this.resetPasswordVerified = false;

  this.resetPasswordTokenHash = undefined;
  this.resetPasswordTokenExpires = undefined;
  return otp;
};

userSchema.methods.verifyPasswordResetOTP = function (otp) {
  if (!this.resetPasswordOTPHash || !this.resetPasswordOTPExpires) return false;
  if (Date.now() > this.resetPasswordOTPExpires.getTime()) return false;
  const hash = crypto.createHash("sha256").update(otp).digest("hex");
  return hash === this.resetPasswordOTPHash;
};

userSchema.methods.generateResetToken = function () {
  const raw = crypto.randomBytes(32).toString("hex");
  const hash = crypto.createHash("sha256").update(raw).digest("hex");
  this.resetPasswordTokenHash = hash;
  this.resetPasswordTokenExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 mins
  return raw;
};

module.exports = mongoose.model("User", userSchema);
