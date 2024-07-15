const multer = require('multer');
const router = require('express').Router();

const {
  getHostel,
  getHostels,
  createHostel,
  updateHostel,
  deleteHostel
} = require('../controllers/hostel.controller');

const upload = multer();

router.route('/').get(getHostels);

router.route('/:id').get(getHostel);

router.route('/').post(upload.any(), createHostel);

router.route('/:id').patch(upload.any(), updateHostel);

router.route('/:id').delete(deleteHostel);

module.exports = router;
