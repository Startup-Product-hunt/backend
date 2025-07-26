const express = require("express");
const router = express.Router();
const upload = require('../middlewares/cloudinaryUpload');
const { createProduct, updateProduct, deleteProduct } = require("../controllers/productController");

router.post("/product/create", upload.single('coverImage'), createProduct);
router.put("/product/:id", upload.single('coverImage'), updateProduct);
router.delete("/product/:id", deleteProduct);

module.exports = router;
