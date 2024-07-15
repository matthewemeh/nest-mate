const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.AUTH_TRANSPORT_USERNAME,
    pass: process.env.AUTH_TRANSPORT_PASSWORD
  }
});

module.exports = { transporter };
