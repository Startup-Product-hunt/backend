const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
     googleId: {
      type: String,
    },
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    
    password: {
      type: String,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user"
    },
      phone: {
      type: String,
       default: null,
    },
    profilePic: {
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
     tags: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

const User = mongoose.model("user", userSchema);
module.exports = User;

