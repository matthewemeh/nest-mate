const router = require('express').Router();
const Rating = require('../models/rating.model');
const { User } = require('../models/user.model');
const Room = require('../models/room.model');

/* update room rating */
router.route('/').post(async (req, res) => {
  try {
    const { value, roomID, userID } = req.body;

    const rating = await Rating.findOne({ roomID, userID });

    if (rating) {
      rating.value = value;
      await rating.save();
    } else {
      const newRating = new Rating({ roomID, userID, value });
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

module.exports = router;
