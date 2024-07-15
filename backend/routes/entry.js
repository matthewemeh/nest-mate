const router = require('express').Router();
const { getEntries } = require('../controllers/entry.controller');

router.route('/').get(getEntries);

module.exports = router;
