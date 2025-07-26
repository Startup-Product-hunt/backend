const { transporter } = require("../config/nodemailerConfig");

const sendResetPassword = async (name, toEmail, resetPasswordLink) => {
  try {
    const mailOptions = {
      from: `"Product-Hunt" <${process.env.ADMIN_EMAIL}>`,
      to: toEmail,
      subject: "Reset Your Password - Product-Hunt",
      html: `
<div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 30px;">
  <div style="max-width: 600px; margin: auto; background: #fff; padding: 20px; border-radius: 8px;">
  
<div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">


          <h2 style="color: #0056b3;">Hello ${name},</h2>
          <p>You recently requested to reset your password for your Product-Hunt account.</p>
          <p>Please click the button below to reset your password:</p>
          <a href="${resetPasswordLink}" style="
              display: inline-block;
              padding: 10px 20px;
              margin: 10px 0;
              font-size: 16px;
              color: white;
              background-color: #007bff;
              text-decoration: none;
              border-radius: 5px;
          ">Reset Password</a>
          <p>If you didn’t request this, you can safely ignore this email.</p>
          <p style="margin-top: 20px;">Thanks,<br/>The Product-Hunt Team</p>
        </div>
  </div>
</div>


        
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Password reset email sent:", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending password reset email:", error);
    return false;
  }
};

const sendEventInviteEmail = async (
  name,
  toEmail,
  meetLink,
  subject,
  customMessage
) => {
  try {
    const mailOptions = {
      from: `"Product-Hunt" <${process.env.ADMIN_EMAIL}>`,
      to: toEmail,
      subject: subject || "You're Invited - Join the Event on Google Meet",
      html: `
<div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 30px;">
  <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.05);">
    <h2 style="color: #333;">Hi ${name},</h2>
    <p style="font-size: 16px; color: #555;">
      ${
        customMessage ||
        "Thank you for registering! You are invited to join the upcoming event."
      }
    </p>
    <p style="font-size: 16px; color: #555;">Click the button below to join the event on Google Meet:</p>
    <a href="${meetLink}" target="_blank" style="
      display: inline-block;
      padding: 12px 24px;
      margin: 20px 0;
      font-size: 16px;
      color: white;
      background-color: #28a745;
      text-decoration: none;
      border-radius: 5px;
    ">Join Meet</a>
    <p style="font-size: 14px; color: #888;">If the button doesn't work, you can also join by clicking this link:</p>
    <p><a href="${meetLink}" target="_blank" style="color: #007bff;">${meetLink}</a></p>
    <hr style="margin: 30px 0;">
    <p style="font-size: 14px; color: #888;">Looking forward to your participation!</p>
    <p style="font-size: 14px; color: #888;">— The Product-Hunt Events Team</p>
  </div>
</div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Event invite email sent:", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending event invite email:", error);
    return false;
  }
};

module.exports = {
  sendResetPassword,
  sendEventInviteEmail,
};
