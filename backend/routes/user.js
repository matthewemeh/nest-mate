const multer = require('multer');
const router = require('express').Router();

const { verifyToken } = require('../middleware/user');

const {
  login,
  getUser,
  checkIn,
  getUsers,
  checkOut,
  deleteUser,
  updateUser,
  verifyEmail,
  registerUser,
  reserveSpace,
  resetPassword,
  confirmReservation,
  declineReservation,
  deleteProfileImage
} = require('../controllers/user.controller');

const upload = multer();

router.route('/register').post(upload.any(), registerUser);

router.route('/:id').patch(upload.any(), verifyToken, updateUser);

router.route('/reset-password').patch(resetPassword);

router.route('/verify-email').patch(verifyEmail);

router.route('/reserve-space/:roomID').post(verifyToken, reserveSpace);

router.route('/confirm-reservation/:reservationID').post(verifyToken, confirmReservation);

router.route('/decline-reservation/:reservationID').post(verifyToken, declineReservation);

router.route('/check-in/:id').post(verifyToken, checkIn);

router.route('/check-out/:id').post(verifyToken, checkOut);

router.route('/delete-profile-image/:id').patch(verifyToken, deleteProfileImage);

router.route('/login').post(login);

router.route('/fetch').get(verifyToken, getUsers);

router.route('/:id').get(verifyToken, getUser);

router.route('/:id').delete(verifyToken, deleteUser);

module.exports = router;
