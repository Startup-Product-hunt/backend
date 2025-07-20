const express = require('express');
const { createEvent, getTicket } = require('../controllers/eventController');
const { protect, adminOnly } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', protect, (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Only admins can create events.' });
    }
    next();
},
    createEvent
);
router.post('/:eventId/ticket', protect, getTicket);

module.exports = router;
