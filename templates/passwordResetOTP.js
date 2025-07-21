const passwordResetOTPTemplate = (userName, otp, appName = "our platform") => `
  <p>Hi ${userName || ""},</p>
  <p>Your password reset OTP for <b>${appName}</b> is:</p>
  <h2 style="letter-spacing:4px;">${otp}</h2>
  <p>This code will expire in 10 minutes. If you did not request this, please ignore this email.</p>
  <p>— ${appName} Team</p>
`;

module.exports = passwordResetOTPTemplate;