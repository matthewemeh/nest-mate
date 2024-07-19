const OTP = require('../models/otp.model');
const { User } = require('../models/user.model');

const { sendEmail } = require('../controllers/email.controller');

const { generateOTP } = require('../utils/otp.utils');
const { hashData, verifyHashedData } = require('../utils/hashUtils');

const sendOTP = async (req, res) => {
  try {
    const { to, duration = 5 } = req.body;

    if (!to) {
      return res.status(400).json("Provide values for 'to'");
    }

    // clear any old record
    await OTP.deleteOne({ email: to });

    const generatedOTP = await generateOTP();

    req.body.html = `<p>Hello from Nest Mate! To complete your ongoing authentication process, please enter the OTP below.</p>
    <strong style="font-size:25px;letter-spacing:2px">${generatedOTP}</strong>
    <p>This code expires in ${duration} minute(s).</p>
    <p>If you did not initiate the process that sent this email, please disregard this email. Your privacy is important to us.</p>
    <p>Best regards,<span style="display:block;">Nest Mate.</span><span>Your #1 Hostel Management Platform.</span></p>
    `;

    // send email
    await sendEmail(req, res);

    // save otp record
    const hashedOTP = await hashData(generatedOTP);
    const newOTP = new OTP({
      email: to,
      otp: hashedOTP,
      createdAt: Date.now(),
      expiresAt: Date.now() + 60_000 * +duration
    });

    const newOtpRecord = await newOTP.save();

    return res.status(200).json(newOtpRecord);
  } catch (err) {
    res.status(400).json(err.message);
  }
};

const verifyOTP = async (req, res) => {
  const { otp, email } = req.body;

  const otpRecord = await OTP.findOne({ email });

  if (!otpRecord) {
    return res.status(404).json('No OTP available');
  }

  const otpExpired = new Date(otpRecord.expiresAt).getTime() < Date.now();

  if (otpExpired) {
    return res.status(400).json('OTP has expired');
  }

  const otpMatches = await verifyHashedData(otp, otpRecord.otp);

  if (otpMatches) {
    res.status(200).json('OTP Verification successful');
  } else {
    res.status(400).json('Wrong OTP provided!');
  }
};

module.exports = { sendOTP, verifyOTP };
