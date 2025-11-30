const nodemailer = require("nodemailer");

async function sendEmail(to, subject, text) {
  // Create transporter using Gmail + app password
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Send mail
  await transporter.sendMail({
    from: `"CHECKPOINT" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
  });

  console.log("Email sent to:", to);
}

module.exports = sendEmail;
