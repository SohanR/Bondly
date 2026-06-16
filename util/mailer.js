const nodemailer = require("nodemailer");

const isMailConfigured = () => {
  return Boolean(
    process.env.SMTP_HOST &&
      process.env.SMTP_PORT &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS
  );
};

const sendOtpEmail = async ({ to, username, otp }) => {
  if (!isMailConfigured()) {
    console.log(`Email OTP for ${to}: ${otp}`);
    return { devFallback: true };
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    subject: "Your DevSpace verification code",
    text: `Hi ${username}, your DevSpace verification code is ${otp}. It expires in 10 minutes.`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Verify your DevSpace email</h2>
        <p>Hi ${username}, use this code to verify your email:</p>
        <p style="font-size: 28px; font-weight: 800; letter-spacing: 4px;">${otp}</p>
        <p>This code expires in 10 minutes. If you did not request this, you can ignore this email.</p>
      </div>
    `,
  });

  return { sent: true };
};

module.exports = {
  sendOtpEmail,
};
