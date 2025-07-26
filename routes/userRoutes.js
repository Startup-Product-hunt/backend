const express = require("express");
const upload = require('../middlewares/cloudinaryUpload');
const { getProfile, updateUserProfile, getMyProduct } = require("../controllers/userController");
const { createTicket, getUserTickets } = require("../controllers/eventController");

const router = express.Router();

router.get("/profile", getProfile);
router.patch("/profile",upload.single('profilePic'),updateUserProfile);
router.get("/profile/products", getMyProduct);
router.post("/add-ticket",createTicket);
router.get("/tickets",getUserTickets);


module.exports = router;
