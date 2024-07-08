const router = require('express').Router();
const { Reservation, reservationStatuses } = require('../models/reservation.model');

/* get reservations */
router.route('/').get(async (req, res) => {
  try {
    const page = Number(req.query['page']);
    const limit = Number(req.query['limit']);
    const status = Number(req.query['status']);
    let reservations;

    if (isNaN(page) || isNaN(limit)) {
      reservations = status ? await Reservation.find({ status }) : await Reservation.find({});
    } else {
      reservations = status
        ? await Reservation.paginate({ status }, { page, limit })
        : await Reservation.paginate({}, { page, limit });
    }

    res.status(200).json(reservations);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

/* get reservations length */
router.route('/length').get(async (req, res) => {
  try {
    let reservations = await Reservation.find({});

    res.status(200).json(reservations.length);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = router;
