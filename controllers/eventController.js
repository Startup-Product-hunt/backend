const Event  = require('../models/eventModel')
const Ticket = require('../models/ticketModel')
const crypto = require('crypto');

const createEvent = async (req, res) => {
  try {
    const { title, description, location, dateTime } = req.body;
    const event = await Event.create({
      title,
      description,
      location,
      dateTime,
      userId: req.user.id,
    });
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getAllEvents = async (req, res) => {
  try {

    const event = await Event.find();
    if (!event) return res.status(404).json({ message: "Event not found" });

   res.status(200).json(event);
  } catch (error) {
    console.error("getTicket error:", error);
    res.status(500).json({ message: error.message });
  }
};

const createTicket = async (req, res) => {
  try {
    const { eventId } = req.body;
    const existing = await Ticket.findOne({ userId: req.user.id, eventId });

    if (existing) {
      return res.status(200).json({ message: 'Ticket already issued', ticket: existing });
    }

    const ticket = await Ticket.create({
      userId: req.user.id,
      eventId,
      ticketNumber: `TICKET-${crypto.randomBytes(4).toString('hex').toUpperCase()}`
    });

    res.status(201).json({ message: 'Ticket issued', ticket });
  } catch (error) {
    console.error('getTicket error:', error);
    res.status(500).json({ message: error.message });
  }
};

const getUserTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ userId: req.user.id })
      .populate('eventId');

    res.status(200).json(tickets);
  } catch (error) {
    console.error('getUserTickets error:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createEvent,
  getAllEvents,
  createTicket,
  getUserTickets
};

