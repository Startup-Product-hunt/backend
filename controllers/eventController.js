const Event = require("../models/eventModel");
const Ticket = require("../models/ticketModel");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");

exports.createEvent = async (req, res) => {
  try {
    const { title, description, location, dateTime } = req.body;
    const event = await Event.create({
      title,
      description,
      location,
      dateTime,
      createdBy: req.user.id,
    });
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTicket = async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    const existing = await Ticket.findOne({
      user: req.user.id,
      event: eventId,
    });
    if (existing) {
      return res.status(400).json({
        message: "Ticket already issued for this event",
        ticket: existing,
      });
    }

    const ticketNumber =
      "TKT-" + crypto.randomBytes(4).toString("hex").toUpperCase();

    const ticket = await Ticket.create({
      user: req.user.id,
      event: eventId,
      ticketNumber,
    });

    await sendEmail({
      to: req.user.email,
      subject: `Your ticket for: ${event.title}`,
      text: `Your ticket number: ${ticketNumber}`,
      html: `
        <h2>${event.title}</h2>
        <p>Location: ${event.location}</p>
        <p>Date & Time: ${event.dateTime.toISOString()}</p>
        <p>Your ticket number: <strong>${ticketNumber}</strong></p>
      `,
    });

    res.status(201).json({ message: "Ticket issued", ticket });
  } catch (error) {
    console.error("getTicket error:", error);
    res.status(500).json({ message: error.message });
  }
};
