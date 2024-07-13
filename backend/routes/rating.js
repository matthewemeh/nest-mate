const router = require('express').Router();
const Rating = require('../models/rating.model');
const { User } = require('../models/user.model');
const Room = require('../models/room.model');

/* update room rating */
router.route('/').post(async (req, res) => {
  try {
    const { value, roomID, userID, hostelID } = req.body;

    const rating = await Rating.findOne({ roomID, userID });

    if (rating) {
      rating.value = value;
      await rating.save();
    } else {
      const newRating = new Rating({ roomID, userID, value, hostelID });
      await newRating.save();

      const user = await User.findById(userID);
      user.ratings.push(newRating._id);
      await user.save();

      const room = await Room.findById(roomID);
      room.ratings.push(newRating._id);
      await room.save();
    }

    res.status(200).send('Rating updated!');
  } catch (err) {
    res.status(400).send(err.message);
  }
});

router.route('/:userID/:roomID').get(async (req, res) => {
  try {
    const { userID, roomID } = req.params;

    const rating = await Rating.findOne({ roomID, userID }).populate('userID');

    if (rating) {
      res.status(200).json(rating);
    } else {
      res.status(400).send('No user rating for this room');
    }
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = router;
