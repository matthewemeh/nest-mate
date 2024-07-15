const Room = require('../models/room.model');
const Rating = require('../models/rating.model');
const { User } = require('../models/user.model');

const updateRoomRating = async (req, res) => {
  try {
    const { value, roomID, userID, hostelID } = req.body;

    const rating = await Rating.findOne({ roomID, userID });

    if (rating) {
      rating.value = value;
      await rating.save();
    } else {
      const newRating = new Rating({ roomID, userID, value, hostelID });
      await newRating.save();

      await User.updateOne({ _id: userID }, { $push: { ratings: newRating._id } });

      await Room.updateOne({ _id: roomID }, { $push: { ratings: newRating._id } });
    }

    res.status(200).send('Rating updated!');
  } catch (err) {
    res.status(400).send(err.message);
  }
};

const getUserRoomRating = async (req, res) => {
  try {
    const { userID, roomID } = req.params;

    const rating = await Rating.findOne({ roomID, userID }).populate('userID');

    if (rating) {
      res.status(200).json(rating);
    } else {
      res.status(200).send('No user rating for this room');
    }
  } catch (err) {
    res.status(400).send(err.message);
  }
};

module.exports = { updateRoomRating, getUserRoomRating };
