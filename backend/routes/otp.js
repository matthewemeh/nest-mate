const router = require('express').Router();
const { sendOTP, verifyOTP } = require('../controllers/otp.controller');

router.post('/send', sendOTP);

router.post('/verify', verifyOTP);

module.exports = router;
