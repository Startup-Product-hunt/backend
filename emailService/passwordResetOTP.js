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


module.exports = {
  sendResetPassword
}