const router = require('express').Router();
const { sendEmail } = require('../controllers/email.controller');

router.route('/send').post(sendEmail);

module.exports = router;
