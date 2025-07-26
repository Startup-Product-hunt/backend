const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'event',
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

const Ticket = mongoose.model('ticket', ticketSchema);
module.exports =Ticket;
