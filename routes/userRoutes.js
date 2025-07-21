const express = require("express");
const { getProfile, updateProfile } = require("../controllers/userController");
const { getMyCourses } = require("../controllers/userController");
const checkForAuthenticationCookie = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/profile", getProfile);
router.patch("/profile",upload.single('profilePic'),updateProfile);
router.get("/me/courses", getMyCourses);

module.exports = router;
