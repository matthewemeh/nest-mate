const router = require('express').Router();

const { updateRoomRating, getUserRoomRating } = require('../controllers/rating.controller');

router.route('/').post(updateRoomRating);

router.route('/:userID/:roomID').get(getUserRoomRating);

module.exports = router;
