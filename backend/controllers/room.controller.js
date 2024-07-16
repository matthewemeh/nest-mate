const storage = require('../config/firebase.config');
const { ref, uploadBytes, getDownloadURL } = require('firebase/storage');

const Room = require('../models/room.model');
const Rating = require('../models/rating.model');
const Hostel = require('../models/hostel.model');
const { Entry } = require('../models/entry.model');
const { User, roles } = require('../models/user.model');
const { Reservation } = require('../models/reservation.model');

/* Multipart key information */
const { USER_PAYLOAD_KEY, ROOM_IMAGE_KEY } = require('../constants');

const getRooms = async (req, res) => {
  try {
    const page = Number(req.query['page']);
    const limit = Number(req.query['limit']);
    const hostelID = req.query['hostelID'];
    let rooms;

    if (!hostelID) {
      return res.status(400).json('No hostelID query specified');
    } else if (isNaN(page) || isNaN(limit)) {
      rooms = await Room.find({ hostelID });
    } else {
      rooms = await Room.paginate({ hostelID }, { page, limit });
    }

    res.status(200).json(rooms);
  } catch (err) {
    res.status(400).json(err.message);
  }
};

const getRoom = async (req, res) => {
  const { id } = req.params;
  try {
    const room = await Room.findById(id).populate([
      'occupants',
      { path: 'ratings', populate: ['userID', 'roomID', 'hostelID'] }
    ]);

    res.status(200).json(room);
  } catch (err) {
    res.status(400).json(err.message);
  }
};

const createRoom = async (req, res) => {
  try {
    const userPayload = JSON.parse(
      req.files.find(({ fieldname }) => fieldname === USER_PAYLOAD_KEY).buffer
    );
    const { floor, maxOccupants, roomNumber, hostelID, userID } = userPayload;

    const user = await User.findById(userID);
    const isUser = !user || user.role === roles.USER;
    if (isUser) {
      return res.status(401).json('You are not authorized to carry out this operation');
    }

    const hostel = await Hostel.findById(hostelID);
    if (!hostel) {
      return res.status(404).json('Hostel not found');
    }

    const newRoom = new Room({ floor, maxOccupants, roomNumber, hostelID });
    const roomImageFile = req.files.find(({ fieldname }) => fieldname === ROOM_IMAGE_KEY);
    const roomImage = roomImageFile?.buffer;
    if (roomImage) {
      const imageRef = ref(storage, `rooms/${newRoom._id}/${newRoom._id}_0`);
      const snapshot = await uploadBytes(imageRef, roomImage);
      const url = await getDownloadURL(snapshot.ref);
      newRoom.roomImageUrl = url;
    }

    await newRoom.save();

    hostel.rooms.push(newRoom._id);
    await hostel.save();

    let rooms;
    const page = Number(req.query['page']);
    const limit = Number(req.query['limit']);

    if (isNaN(page) || isNaN(limit)) {
      rooms = await Room.find({ hostelID });
    } else {
      rooms = await Room.paginate({ hostelID }, { page, limit });
    }
    res.status(201).json(rooms);
  } catch (err) {
    res.status(400).json(err.message);
  }
};

const updateRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const userPayload = JSON.parse(
      req.files.find(({ fieldname }) => fieldname === USER_PAYLOAD_KEY).buffer
    );
    const { floor, maxOccupants, roomNumber, newHostelID, userID, occupantID } = userPayload;

    const user = await User.findById(userID);
    const isUser = !user || user.role === roles.USER;
    if (isUser) {
      return res.status(401).json('You are not authorized to carry out this operation');
    }

    const room = await Room.findById(id);

    if (floor) room.floor = floor;
    if (newHostelID) room.hostelID = newHostelID;
    if (roomNumber) room.roomNumber = roomNumber;
    if (maxOccupants) room.maxOccupants = maxOccupants;
    if (occupantID) {
      const { occupants } = room;
      const occupantExists = occupants.find(occupant => occupant == occupantID);

      const userToBeMoved = await User.findById(occupantID);
      if (occupantExists) {
        userToBeMoved.roomID = null;
        room.occupants = occupants.filter(occupant => occupant != occupantID);
      } else {
        userToBeMoved.roomID = room._id;
        room.occupants.push(occupantID);
      }
      await userToBeMoved.save();
    }

    const roomImageFile = req.files.find(({ fieldname }) => fieldname === ROOM_IMAGE_KEY);
    const roomImage = roomImageFile?.buffer;
    if (roomImage) {
      const imageRef = ref(storage, `rooms/${room._id}/${room._id}_0`);
      const snapshot = await uploadBytes(imageRef, roomImage);
      const url = await getDownloadURL(snapshot.ref);
      room.roomImageUrl = url;
    }

    await room.save();

    res.status(200).json(room);
  } catch (err) {
    res.status(400).json(err.message);
  }
};

const deleteRoom = async (req, res) => {
  const { id } = req.params;
  const { userID, hostelID } = req.body;
  const page = Number(req.query['page']);
  const limit = Number(req.query['limit']);

  try {
    const user = await User.findById(userID);
    const isUser = !user || user.role === roles.USER;
    if (isUser) {
      return res.status(401).json('You are not authorized to carry out this operation');
    }

    const hostel = await Hostel.findById(hostelID);
    if (!hostel) {
      return res.status(404).json('Hostel not found');
    }

    await Room.findByIdAndDelete(id);

    await User.updateMany(
      { roomID: id },
      { $set: { roomID: null, checkedIn: false, lastCheckedOut: new Date().toISOString() } }
    );

    const reservations = await Reservation.find({ roomID: id });

    reservations.forEach(async ({ _id: reservationID }) => {
      await User.updateOne({ reservationID }, { $set: { reservationID: '' } });
    });

    const ratings = await Rating.find({ roomID: id });

    ratings.forEach(async ({ _id: ratingID }) => {
      await User.updateOne({ ratings: ratingID }, { $pull: { ratings: ratingID } });
    });

    await Entry.deleteMany({ roomID: id });

    await Rating.deleteMany({ roomID: id });

    await Reservation.deleteMany({ roomID: id });

    await Hostel.updateOne({ rooms: id }, { $pull: { rooms: id } });

    let rooms;
    if (isNaN(page) || isNaN(limit)) {
      rooms = await Room.find({ hostelID });
    } else {
      rooms = await Room.paginate({ hostelID }, { page, limit });
    }

    res.status(200).json(rooms);
  } catch (err) {
    res.status(400).json(err.message);
  }
};

module.exports = { getRooms, getRoom, createRoom, updateRoom, deleteRoom };
