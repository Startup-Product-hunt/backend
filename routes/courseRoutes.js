const express = require("express");
const {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/courseController");
const router = express.Router();

router.get("/", getCourses);
router.get("/:id", getCourse);
router.post("/",upload.single('thumbnail'), createCourse);
router.put("/:id",upload.single('thumbnail'), updateCourse);
router.delete("/:id",  deleteCourse);

module.exports = router;
