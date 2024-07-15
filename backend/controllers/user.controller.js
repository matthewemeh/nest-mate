const storage = require('../config/firebase.config');
const { ref, uploadBytes, getDownloadURL, deleteObject } = require('firebase/storage');

const Room = require('../models/room.model');
const Rating = require('../models/rating.model');
const { User, roles } = require('../models/user.model');
const { Entry, entryStatuses } = require('../models/entry.model');
const { Reservation, reservationStatuses } = require('../models/reservation.model');

const { checkIfFileExists } = require('../utils/firebase.utils');

/* Multipart key information */
const { USER_PAYLOAD_KEY, PROFILE_IMAGE_KEY } = require('../constants');

const registerUser = async (req, res) => {
  try {
    const userPayload = JSON.parse(
      req.files.find(({ fieldname }) => fieldname === USER_PAYLOAD_KEY).buffer
    );
    const { name, email, password, role } = userPayload;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).send('This email has already been used');
    }
    const superAdminExists = await User.findOne({ role: roles.SUPER_ADMIN });
    const isInvalidRole = role !== undefined && !Object.values(roles).includes(role);
    if (isInvalidRole) {
      return res.status(400).send('Invalid role');
    } else if (role === roles.SUPER_ADMIN && superAdminExists) {
      return res.status(400).send('A SUPER ADMIN already exists');
    }

    const profileImageFile = req.files.find(({ fieldname }) => fieldname === PROFILE_IMAGE_KEY);
    const profileImage = profileImageFile?.buffer;
    const newUser = new User({ name, email, password, role });
    if (profileImage) {
      const imageRef = ref(storage, `users/${newUser._id}`);
      const snapshot = await uploadBytes(imageRef, profileImage);
      const url = await getDownloadURL(snapshot.ref);
      newUser.profileImageUrl = url;
    }

    const user = await newUser.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).send(err.message);
  }
};

const updateUser = async (req, res) => {
  try {
    const userPayload = JSON.parse(
      req.files.find(({ fieldname }) => fieldname === USER_PAYLOAD_KEY).buffer
    );
    const { id } = req.params;
    const { name, password, role, emailValidated, roomID, userID, checkedIn } = userPayload;

    const user = await User.findById(userID);
    const isOwner = user && user._id == id;
    const isAdmin = user && user.role !== roles.USER;
    if (!(isAdmin || isOwner)) {
      return res.status(401).send('You are not authorized to carry out this operation');
    }

    const userToBeUpdated = await User.findById(id);
    if (!userToBeUpdated) {
      return res.status(500).send('User does not exist');
    }

    if (isAdmin) {
      if (role) userToBeUpdated.role = role;
      if (roomID) userToBeUpdated.roomID = roomID;
      if (checkedIn) {
        userToBeUpdated.checkedIn = checkedIn;
        if (checkedIn) userToBeUpdated.lastCheckedIn = new Date().toISOString();
        else userToBeUpdated.lastCheckedOut = new Date().toISOString();
      }
    }
    if (isOwner) {
      if (name) userToBeUpdated.name = name;
      if (password) userToBeUpdated.password = password;

      const profileImageFile = req.files.find(({ fieldname }) => fieldname === PROFILE_IMAGE_KEY);
      const profileImage = profileImageFile?.buffer;
      if (profileImage) {
        const imageRef = ref(storage, `users/${userToBeUpdated._id}`);
        const snapshot = await uploadBytes(imageRef, profileImage);
        const url = await getDownloadURL(snapshot.ref);
        userToBeUpdated.profileImageUrl = url;
      }
    }

    if (emailValidated !== undefined) userToBeUpdated.emailValidated = emailValidated;

    const updatedUser = await userToBeUpdated.save();
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(400).send(err.message);
  }
};

const reserveSpace = async (req, res) => {
  try {
    const { roomID } = req.params;
    const { userID, hostelID } = req.body;

    const user = await User.findOne({ _id: userID });

    if (!user) {
      return res.status(500).send('User not found');
    }

    if (user.reservationID) {
      return res.status(400).send('You have already made a reservation');
    } else if (user.roomID) {
      return res.status(400).send('You already have a room');
    } else {
      const newReservation = new Reservation({ roomID, userID, hostelID });
      await newReservation.save();

      const room = await Room.findById(roomID);
      room.reservations.push(newReservation._id);
      await room.save();

      user.reservationID = newReservation._id;
      const updatedUser = await user.save();

      return res.status(200).json(updatedUser);
    }
  } catch (err) {
    res.status(400).send(err.message);
  }
};

const confirmReservation = async (req, res) => {
  const { adminID } = req.body;
  const { reservationID } = req.params;
  const reservation = await Reservation.findById(reservationID);
  const { userID, roomID, status } = reservation;

  try {
    const user = await User.findById(adminID);
    const isUser = !user || user.role === roles.USER;
    if (isUser) {
      return res.status(401).send('You are not authorized to carry out this operation');
    }

    if (status === reservationStatuses.PENDING) {
      reservation.status = reservationStatuses.CONFIRMED;
      await reservation.save();

      const userToBeUpdated = await User.findById(userID);
      userToBeUpdated.roomID = roomID;
      userToBeUpdated.reservationID = '';
      await userToBeUpdated.save();

      const room = await Room.findById(roomID);
      room.occupants.push(userID);
      await room.save();
      return res.status(200).send('Room reservation confirmed');
    } else if (status === reservationStatuses.DECLINED) {
      return res.status(400).send('Room reservation already declined');
    } else if (status === reservationStatuses.CONFIRMED) {
      return res.status(400).send('Room reservation already confirmed');
    }
  } catch (err) {
    res.status(400).send(err.message);
  }
};

const declineReservation = async (req, res) => {
  const { adminID } = req.body;
  const { reservationID } = req.params;
  const reservation = await Reservation.findById(reservationID);
  const { userID, status } = reservation;

  try {
    const user = await User.findById(adminID);
    const isUser = !user || user.role === roles.USER;
    if (isUser) {
      return res.status(401).send('You are not authorized to carry out this operation');
    }

    if (status === reservationStatuses.PENDING) {
      reservation.status = reservationStatuses.DECLINED;
      await reservation.save();

      const userToBeUpdated = await User.findById(userID);
      userToBeUpdated.reservationID = '';
      await userToBeUpdated.save();
      return res.status(200).send('Room reservation declined');
    } else if (status === reservationStatuses.DECLINED) {
      return res.status(400).send('Room reservation already declined');
    } else if (status === reservationStatuses.CONFIRMED) {
      return res.status(400).send('Room reservation already confirmed');
    }
  } catch (err) {
    res.status(400).send(err.message);
  }
};

const checkIn = async (req, res) => {
  try {
    const { id } = req.params;
    const { roomID, userID, hostelID } = req.body;

    const user = await User.findById(userID);
    const isUser = !user || user.role === roles.USER;
    if (isUser) {
      return res.status(401).send('You are not authorized to carry out this operation');
    }

    const userToBeCheckedIn = await User.findById(id);
    userToBeCheckedIn.checkedIn = true;
    userToBeCheckedIn.lastCheckedIn = new Date().toISOString();
    await userToBeCheckedIn.save();

    const newEntry = new Entry({ hostelID, roomID, type: entryStatuses.CHECK_IN, userID: id });
    await newEntry.save();

    return res.status(200).send('Check in successful');
  } catch (err) {
    res.status(400).send(err.message);
  }
};

const checkOut = async (req, res) => {
  try {
    const { id } = req.params;
    const { roomID, userID, hostelID } = req.body;

    const user = await User.findById(userID);
    const isUser = !user || user.role === roles.USER;
    if (isUser) {
      return res.status(401).send('You are not authorized to carry out this operation');
    }

    await User.updateOne(
      { _id: id },
      { $set: { checkedIn: false, lastCheckedOut: new Date().toISOString(), roomID: null } }
    );

    const newEntry = new Entry({ hostelID, roomID, type: entryStatuses.CHECK_OUT, userID: id });
    await newEntry.save();

    const room = await Room.findById(roomID);
    room.occupants = room.occupants.filter(occupant => occupant != id);
    await room.save();

    return res.status(200).send('Check out successful');
  } catch (err) {
    res.status(400).send(err.message);
  }
};

const deleteProfileImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { userID } = req.body;

    const user = await User.findById(userID);
    const isOwner = user && user._id == id;
    if (!isOwner) {
      return res.status(401).send('You are not authorized to carry out this operation');
    }

    const userToBeUpdated = await User.findById(id);
    if (!userToBeUpdated) {
      return res.status(500).send('User does not exist');
    }

    /* delete user image */
    const filePath = `users/${userToBeUpdated._id}`;
    const fileExists = await checkIfFileExists(filePath);
    if (fileExists) {
      const fileRef = ref(storage, filePath);
      await deleteObject(fileRef);
      userToBeUpdated.profileImageUrl = '';
    }

    const updatedUser = await userToBeUpdated.save();
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(400).send(err.message);
  }
};

const login = (req, res) => {
  const { email, password } = req.body;

  User.findByCredentials(email, password)
    .then(user => res.json(user))
    .catch(err => res.status(400).send(err.message));
};

const getUsers = async (req, res) => {
  const { userID } = req.params;

  try {
    const user = await User.findById(userID);
    const isUser = !user || user.role === roles.USER;
    if (isUser) {
      return res.status(401).send('You are not authorized to carry out this operation');
    }

    const page = Number(req.query['page']);
    const limit = Number(req.query['limit']);
    let result;

    if (isNaN(page) || isNaN(limit)) {
      result = await User.find();
    } else {
      result = await User.paginate({}, { page, limit });
    }

    res.status(200).json(result);
  } catch (err) {
    res.status(400).send(err.message);
  }
};

const getUser = (req, res) => {
  const { id } = req.params;
  const email = req.query['email'];

  if (email) {
    return User.findOne({ email })
      .then(user => res.status(200).json(user))
      .catch(err => res.status(400).send(err.message));
  }

  User.findById(id)
    .then(user => res.status(200).json(user))
    .catch(err => res.status(400).send(err.message));
};

const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const { userID } = req.body;
    const user = await User.findById(userID);
    const isOwnerOrSuperAdmin = user && (user.role === roles.SUPER_ADMIN || user._id == id);
    if (!isOwnerOrSuperAdmin) {
      return res.status(401).send('You are not authorized to carry out this operation');
    }

    await User.findByIdAndDelete(id);

    await Entry.deleteMany({ userID: id });

    await Room.updateOne({ occupants: id }, { $pull: { occupants: id } });

    const ratings = await Rating.find({ userID: id });

    ratings.forEach(async ({ _id: ratingID }) => {
      await Room.updateMany({ ratings: ratingID }, { $pull: { ratings: ratingID } });
    });

    await Rating.deleteMany({ userID: id });

    await Reservation.deleteMany({ userID: id });

    /* delete user image */
    const filePath = `users/${id}`;
    const fileExists = await checkIfFileExists(filePath);
    if (fileExists) {
      const fileRef = ref(storage, filePath);
      await deleteObject(fileRef);
    }

    res.status(200).send('User removed');
  } catch (err) {
    res.status(400).send(err.message);
  }
};

module.exports = {
  login,
  getUser,
  checkIn,
  getUsers,
  checkOut,
  deleteUser,
  updateUser,
  registerUser,
  reserveSpace,
  deleteProfileImage,
  confirmReservation,
  declineReservation
};
