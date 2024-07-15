const { transporter } = require('../config/email.config');

const sendEmail = async (req, res) => {
  const { to, subject, text, html } = req.body;

  if (!to) {
    return res.status(400).send("Could not find 'to' field");
  }

  const mailOptions = { to, subject, from: process.env.AUTH_TRANSPORT_USERNAME };

  if (text) {
    mailOptions['text'] = text;
  } else if (html) {
    mailOptions['html'] = html;
  } else {
    return res.status(400).send("Could not find 'text' or 'html' field");
  }

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      res.status(400).send(error.message);
      console.log(error);
    } else {
      res.status(200).json('Email sent successfully');
    }
  });
};

module.exports = { sendEmail };
