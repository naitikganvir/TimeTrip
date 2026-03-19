const { createTransport } = require("nodemailer");

const transport = createTransport({
  host: "smtp.gmail.com",
  port: 465,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

const sendMail = async (to, subject, html) => {
  try {
    const info = await transport.sendMail({
      from: process.env.MAIL_USER,
      to,
      subject,
      html,
    });
    console.log("Email sent:", info);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = {
  sendMail,
};
