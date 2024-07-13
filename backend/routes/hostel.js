const multer = require('multer');
const router = require('express').Router();
const storage = require('../firebase-config');
const { ref, uploadBytes, getDownloadURL } = require('firebase/storage');

const Room = require('../models/room.model');
const Rating = require('../models/rating.model');
const Hostel = require('../models/hostel.model');
const { Entry } = require('../models/entry.model');
const { User, roles } = require('../models/user.model');
const { Reservation } = require('../models/reservation.model');

const upload = multer();

/* Multipart key information */
const { USER_PAYLOAD_KEY, HOSTEL_IMAGE_KEY } = require('../constants');

/* get hostels */
router.route('/').get(async (req, res) => {
  try {
    const page = Number(req.query['page']);
    const limit = Number(req.query['limit']);
    let hostels;

    if (isNaN(page) || isNaN(limit)) {
      hostels = await Hostel.find().populate('rooms');
    } else {
      hostels = await Hostel.paginate({}, { page, limit });
    }

    res.status(200).json(hostels);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

/* get hostel */
router.route('/:id').get(async (req, res) => {
  const { id } = req.params;
  try {
    const hostel = await Hostel.findById(id).populate('rooms');
    res.status(200).json(hostel);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

/* create hostel */
router.route('/').post(upload.any(), async (req, res) => {
  try {
    const userPayload = JSON.parse(
      req.files.find(({ fieldname }) => fieldname === USER_PAYLOAD_KEY).buffer
    );
    const { floors, name, userID } = userPayload;

    const user = await User.findById(userID);
    const isUser = !user || user.role === roles.USER;
    if (isUser) {
      return res.status(401).send('You are not authorized to carry out this operation');
    }

    const newHostel = new Hostel({ floors, name });
    const hostelImageFile = req.files.find(({ fieldname }) => fieldname === HOSTEL_IMAGE_KEY);
    const hostelImage = hostelImageFile?.buffer;
    if (hostelImage) {
      const imageRef = ref(storage, `hostels/${newHostel._id}/${newHostel._id}_0`);
      const snapshot = await uploadBytes(imageRef, hostelImage);
      const url = await getDownloadURL(snapshot.ref);
      newHostel.hostelImageUrl = url;
    }

    await newHostel.save();

    let hostels;
    const page = Number(req.query['page']);
    const limit = Number(req.query['limit']);

    if (isNaN(page) || isNaN(limit)) {
      hostels = await Hostel.find();
    } else {
      hostels = await Hostel.paginate({}, { page, limit });
    }
    res.status(201).json(hostels);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

/* update hostel */
router.route('/:id').patch(upload.any(), async (req, res) => {
  try {
    const { id } = req.params;
    const userPayload = JSON.parse(
      req.files.find(({ fieldname }) => fieldname === USER_PAYLOAD_KEY).buffer
    );
    const { floors, name, userID } = userPayload;

    const user = await User.findById(userID);
    const isUser = !user || user.role === roles.USER;
    if (isUser) {
      return res.status(401).send('You are not authorized to carry out this operation');
    }

    const hostel = await Hostel.findById(id);

    if (name) hostel.name = name;
    if (floors) hostel.floors = floors;

    const hostelImageFile = req.files.find(({ fieldname }) => fieldname === HOSTEL_IMAGE_KEY);
    const hostelImage = hostelImageFile?.buffer;
    if (hostelImage) {
      const imageRef = ref(storage, `hostels/${hostel._id}/${hostel._id}_0`);
      const snapshot = await uploadBytes(imageRef, hostelImage);
      const url = await getDownloadURL(snapshot.ref);
      hostel.hostelImageUrl = url;
    }

    await hostel.save();

    res.status(200).json(hostel);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

/* delete hostel */
router.route('/:id').delete(async (req, res) => {
  const { id } = req.params;
  const { userID } = req.body;
  const page = Number(req.query['page']);
  const limit = Number(req.query['limit']);

  try {
    const user = await User.findById(userID);
    const isUser = !user || user.role === roles.USER;
    if (isUser) {
      return res.status(401).send('You are not authorized to carry out this operation');
    }

    await Hostel.findByIdAndDelete(id);

    const rooms = await Room.find({ hostelID: id });

    rooms.forEach(async ({ _id: roomID }) => {
      await User.updateMany(
        { roomID },
        { $set: { roomID: null, checkedIn: false, lastCheckedOut: new Date().toISOString() } }
      );
    });
    await Rating.deleteMany({ hostelID: id });

    await Entry.deleteMany({ hostelID: id });

    const reservations = await Reservation.find({ hostelID: id });

    reservations.forEach(async ({ _id: reservationID }) => {
      await User.updateOne({ reservationID }, { $set: { reservationID: '' } });
    });

    await Reservation.deleteMany({ hostelID: id });

    await Room.deleteMany({ hostelID: id });

    let hostels;
    if (isNaN(page) || isNaN(limit)) {
      hostels = await Hostel.find();
    } else {
      hostels = await Hostel.paginate({}, { page, limit });
    }

    res.status(200).json(hostels);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = router;
