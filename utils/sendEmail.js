require('dotenv').config()
const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === 'true', // true for 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});


async function sendEmail({ to, subject, html, text }) {
  console.log(to)
  const info = await transporter.sendMail({
    to,
    subject,
    text,
    html
  });

  return info;
}

module.exports = sendEmail;
