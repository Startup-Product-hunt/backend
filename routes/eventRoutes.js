const express = require("express");
const { createEvent, getTicket } = require("../controllers/eventController");

const router = express.Router();

router.post("/", createEvent);
router.post("/:eventId/ticket", getTicket);

module.exports = router;
