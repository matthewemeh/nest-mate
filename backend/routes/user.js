const multer = require('multer');
const router = require('express').Router();

const {
  login,
  getUser,
  checkIn,
  getUsers,
  checkOut,
  deleteUser,
  updateUser,
  registerUser,
  reserveSpace,
  confirmReservation,
  declineReservation,
  deleteProfileImage
} = require('../controllers/user.controller');

const upload = multer();

router.route('/register').post(upload.any(), registerUser);

router.route('/:id').patch(upload.any(), updateUser);

router.route('/reserve-space/:roomID').post(reserveSpace);

router.route('/confirm-reservation/:reservationID').post(confirmReservation);

router.route('/decline-reservation/:reservationID').post(declineReservation);

router.route('/check-in/:id').post(checkIn);

router.route('/check-out/:id').post(checkOut);

router.route('/delete-profile-image/:id').patch(deleteProfileImage);

router.route('/login').post(login);

router.route('/fetch/:userID').get(getUsers);

router.route('/:id').get(getUser);

router.route('/:id').delete(deleteUser);

module.exports = router;
