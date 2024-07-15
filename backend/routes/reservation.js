const router = require('express').Router();

const { getReservations, getReservationsLength } = require('../controllers/reservation.controller');

router.route('/').get(getReservations);

router.route('/length').get(getReservationsLength);

module.exports = router;
