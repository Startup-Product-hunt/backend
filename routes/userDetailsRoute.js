const express = require("express");
const { getAllUsers } = require("../controllers/adminController");
const { getAllUsersWithTickets } = require("../controllers/eventController");
const router = express.Router();


router.get("/all-tickets" ,getAllUsersWithTickets);
router.get("/all-users" ,getAllUsers);

module.exports = router;
