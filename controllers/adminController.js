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



const notifyTicketUsers = async (req, res) => {
  try {
    const { meetLink, subject, message } = req.body;

    const tickets = await Ticket.find().populate("userId", "email name");

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
      message: `Emails sent to ${uniqueUsers.size} users.`,
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