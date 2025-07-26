const express = require("express");
const upload = require('../middlewares/cloudinaryUpload');
const { getProfile, updateUserProfile, getMyProduct } = require("../controllers/userController");
const { getTicket, getUserTickets } = require("../controllers/eventController");

const router = express.Router();

router.get("/profile", getProfile);
router.patch("/profile",upload.single('profilePic'),updateUserProfile);
router.get("/profile/products", getMyProduct);
router.post("/add-ticket",getTicket);
router.get("/tickets",getUserTickets);


module.exports = router;
