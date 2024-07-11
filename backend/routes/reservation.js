const router = require('express').Router();
const { Reservation } = require('../models/reservation.model');

/* get reservations */
router.route('/').get(async (req, res) => {
  try {
    const page = Number(req.query['page']);
    const limit = Number(req.query['limit']);
    const status = Number(req.query['status']);
    let reservations;

    const populateFields = ['userID', 'roomID', 'hostelID'];

    if (isNaN(page) || isNaN(limit)) {
      reservations = status
        ? await Reservation.find({ status }).populate(populateFields)
        : await Reservation.find().populate(populateFields);
    } else {
      reservations = status
        ? await Reservation.paginate({ status }, { page, limit, populate: populateFields })
        : await Reservation.paginate({}, { page, limit, populate: populateFields });
    }

    res.status(200).json(reservations);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

/* get reservations length */
router.route('/length').get(async (req, res) => {
  try {
    const status = req.query['status'];

    let reservations = status ? await Reservation.find({ status }) : await Reservation.find();

    res.status(200).json(reservations.length);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = router;
