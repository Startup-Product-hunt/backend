const express = require("express");
const { getProfile, updateProfile, getMyCourses } = require("../controllers/userController");
const upload = require('../middlewares/cloudinaryUpload')

const router = express.Router();

router.get("/profile", getProfile);
router.patch("/profile",upload.single('profilePic'),updateProfile);
router.get("/me/courses", getMyCourses);

module.exports = router;
