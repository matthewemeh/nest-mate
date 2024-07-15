const multer = require('multer');
const router = require('express').Router();

const upload = multer();

const {
  getRoom,
  getRooms,
  createRoom,
  updateRoom,
  deleteRoom
} = require('../controllers/room.controller');

router.route('/').get(getRooms);

router.route('/:id').get(getRoom);

router.route('/').post(upload.any(), createRoom);

router.route('/:id').patch(upload.any(), updateRoom);

router.route('/:id').delete(deleteRoom);

module.exports = router;
