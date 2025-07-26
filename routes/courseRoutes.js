const express = require("express");
const {
  createCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/productController");
const router = express.Router();
const upload = require('../middlewares/cloudinaryUpload')

router.post("/", upload.single('thumbnail'), createCourse);
router.put("/:id", upload.single('thumbnail'), updateCourse);
router.delete("/:id", deleteCourse);

module.exports = router;
