// src/utils/sendEmail.js
require('dotenv').config()
const nodemailer = require('nodemailer');


console.log(process.env.SMTP_HOST)
console.log(process.env.SMTP_USER)
console.log(process.env.SMTP_SECURE)
console.log(process.env.SMTP_PORT)
console.log(process.env.SMTP_PASS)
console.log("Hello...")

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === 'true', // true for 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

/**
 * sendEmail
 * @param {Object} options
 * @param {string} options.to
 * @param {string} options.subject
 * @param {string} options.html
 * @param {string} [options.text]
 */
async function sendEmail({ to, subject, html, text }) {
  const info = await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    text,
    html
  });
  // You may log info.messageId in development (avoid logging OTP itself in production)
  return info;
}

module.exports = sendEmail;
