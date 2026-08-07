const { Resend } = require('resend');
const router = require('express').Router();

const resend = new Resend(process.env.RESEND_API_KEY);

router.route('/send').post(async (req, res) => {
  const { to, subject, text, html } = req.body;

  try {
    if (!to) return res.status(400).send("Could not find 'to' field");

    await resend.emails.send({
      from: 'Nest Mate <nest-mate@resend.dev>', // replace with your verified domain later e.g. hello@nest-mate.com
      to,
      subject: subject || 'Nest Mate Update',
      text,
      html
    });

    res.status(200).json('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).send('Error sending email');
  }
});

module.exports = router;
