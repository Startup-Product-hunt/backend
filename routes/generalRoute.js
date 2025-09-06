const express = require("express");
const { getAllProduct, getProductById, searchProducts, getAllProductByUserId } = require("../controllers/productController");
const { getAllEvents } = require("../controllers/eventController");
const { getProfileById } = require("../controllers/userController");
const router = express.Router();
router.get("/profile/:id", getProfileById);  
router.get("/products",getAllProduct);
router.get("/products/:id", getProductById);
router.get("/events",getAllEvents);
//  api/products/search?title=shirt&category=clothing
router.get("/search", searchProducts);
router.get("/productByUserId/:userId",getAllProductByUserId)


module.exports = router;
