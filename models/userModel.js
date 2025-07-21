const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user"
    },

    profilePic: {
      type: String,
      default: ""
    },
    profilePicPublicId: {
      type: String,
      default: ""
    },
    bio: {
      type: String,
      default: ""
    },
    location: {
      type: String,
      default: ""
    },
    tags: [{
      type: String
    }],

    resetPasswordOTPHash: { type: String },
    resetPasswordOTPExpires: { type: Date },
    resetPasswordAttempts: { type: Number, default: 0 },
    resetPasswordOTPverified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model("User", userSchema);
