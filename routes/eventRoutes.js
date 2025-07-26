const express = require("express");
const { createEvent } = require("../controllers/eventController");
const router = express.Router();

router.post("/events/create", createEvent);
module.exports = router;
