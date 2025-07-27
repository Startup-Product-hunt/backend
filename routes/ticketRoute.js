const express = require("express");
const { notifyTicketUsers } = require("../controllers/adminController");
const router = express.Router();


router.post("/send-event-link" ,notifyTicketUsers);

module.exports = router;
