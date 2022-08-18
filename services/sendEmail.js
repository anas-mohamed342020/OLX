const nodemailer = require("nodemailer");

const sendEmail = async (subject, text, to, html) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 465,
    secure: true, // true for 465, false for other ports
    service: "gmail",
    auth: {
      user: process.env.senderMail,
      pass: process.env.senderPass,
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    // from, // sender address
    to, // list of receivers
    subject, // Subject line
    text, // plain text body
    html, // html body
  });
};

module.exports = { sendEmail };
