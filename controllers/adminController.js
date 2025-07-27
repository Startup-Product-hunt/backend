const { sendEventInviteEmail } = require("../emailService/passwordResetOTP");
const Ticket = require("../models/ticketModel");
const User = require("../models/userModel");


const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); 
    res.status(200).json(users);
  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).json({ message: error.message });
  }
};



// const notifyTicketUsers = async (req, res) => {
//   try {
//     const { meetLink, subject, message } = req.body;

//     const tickets = await Ticket.find().populate("userId", "email name");

//     const uniqueUsers = new Map();
//     tickets.forEach((ticket) => {
//       if (ticket.userId && ticket.userId.email) {
//         const email = ticket.userId.email;
//         const name = ticket.userId.name || "Participant";
//         uniqueUsers.set(email, name);
//       }
//     });

//     const sendResults = await Promise.all(
//       Array.from(uniqueUsers.entries()).map(async ([email, name]) => {
//         return sendEventInviteEmail(name, email, meetLink, subject, message);
//       })
//     );

//     res.status(200).json({
//       message: `Emails sent to ${uniqueUsers.size} users.`,
//       results: sendResults.length,
//     });
//   } catch (error) {
//     console.error("Notify ticket users error:", error);
//     res.status(500).json({ message: "Failed to send emails", error });
//   }
// };


// const notifyTicketUsers = async (req, res) => {
//   try {
//     const { eventId, meetLink, subject, message } = req.body;

//     if (!eventId || !meetLink || !subject || !message) {
//       return res.status(400).json({ message: "All fields are required (eventId, meetLink, subject, message)" });
//     }

//     const tickets = await Ticket.find({ eventId }).populate("userId", "email name");

//     const uniqueUsers = new Map();
//     tickets.forEach((ticket) => {
//       if (ticket.userId && ticket.userId.email) {
//         const email = ticket.userId.email;
//         const name = ticket.userId.name || "Participant";
//         uniqueUsers.set(email, name);
//       }
//     });

//     const sendResults = await Promise.all(
//       Array.from(uniqueUsers.entries()).map(async ([email, name]) => {
//         return sendEventInviteEmail(name, email, meetLink, subject, message);
//       })
//     );

//     res.status(200).json({
//       message: `Emails sent to ${uniqueUsers.size} users for event ${eventId}.`,
//       results: sendResults.length,
//     });
//   } catch (error) {
//     console.error("Notify ticket users error:", error);
//     res.status(500).json({ message: "Failed to send emails", error });
//   }
// };


const notifyTicketUsers = async (req, res) => {
  try {
    const { eventId, meetLink } = req.body;

    if (!eventId || !meetLink) {
      return res.status(400).json({ message: "eventId and meetLink are required." });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found." });
    }

    const subject = `Invitation for ${event.title}`;
    const message = `You're invited to join the event "${event.title}"!\n\nDetails:\n- Description: ${event.description}\n- Location: ${event.location}\n- Date & Time: ${new Date(event.dateTime).toLocaleString()}\n\nJoin Meet Link: ${meetLink}`;

    const tickets = await Ticket.find({ eventId }).populate("userId", "email name");

    const uniqueUsers = new Map();
    tickets.forEach((ticket) => {
      if (ticket.userId && ticket.userId.email) {
        const email = ticket.userId.email;
        const name = ticket.userId.name || "Participant";
        uniqueUsers.set(email, name);
      }
    });

    const sendResults = await Promise.all(
      Array.from(uniqueUsers.entries()).map(async ([email, name]) => {
        return sendEventInviteEmail(name, email, meetLink, subject, message);
      })
    );

    res.status(200).json({
      message: `Emails sent to ${uniqueUsers.size} users for event "${event.title}".`,
      results: sendResults.length,
    });
  } catch (error) {
    console.error("Notify ticket users error:", error);
    res.status(500).json({ message: "Failed to send emails", error });
  }
};



module.exports = {
    getAllUsers,
    notifyTicketUsers
    
}