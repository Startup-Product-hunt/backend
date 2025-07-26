const express = require("express");
const { getAllProduct, getProductById } = require("../controllers/productController");
const { getAllEvents } = require("../controllers/eventController");
const router = express.Router();

router.get("/products",getAllProduct);
router.get("/products/:id", getProductById);
router.get("/events",getAllEvents)

module.exports = router;
