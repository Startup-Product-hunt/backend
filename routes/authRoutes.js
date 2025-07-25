const express = require('express');
const { register, login, logout, forgotPassword, handleResetPassword } = require('../controllers/authController');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout',  logout);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:resetToken',handleResetPassword);

module.exports = router;
