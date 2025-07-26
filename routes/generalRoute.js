const express = require("express");
const { getAllProduct, getProductById, searchProducts } = require("../controllers/productController");
const { getAllEvents } = require("../controllers/eventController");
const router = express.Router();

router.get("/products",getAllProduct);
router.get("/products/:id", getProductById);
router.get("/events",getAllEvents);
//  api/products/search?title=shirt&category=clothing
router.get("/search", searchProducts);


module.exports = router;
