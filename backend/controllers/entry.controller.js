const { Entry } = require('../models/entry.model');

const getEntries = async (req, res) => {
  try {
    const page = Number(req.query['page']);
    const limit = Number(req.query['limit']);
    const type = req.query['type'];

    const populateFields = ['userID', 'hostelID', 'roomID'];

    if (isNaN(page) || isNaN(limit)) {
      entries = type ? await Entry.find({ type }) : await Entry.find();
    } else {
      entries = type
        ? await Entry.paginate({ type }, { page, limit, populate: populateFields })
        : await Entry.paginate({}, { page, limit, populate: populateFields });
    }

    res.status(200).json(entries);
  } catch (err) {
    res.status(400).json(err.message);
  }
};

module.exports = { getEntries };
