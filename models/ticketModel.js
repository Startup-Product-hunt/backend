const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    UserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    EventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
    ticketNumber: {
        type: String,
        required: true,
    },
    issuedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Ticket', ticketSchema);
