const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const mongoosePaginate = require('mongoose-paginate');

const entryStatuses = { CHECK_IN: 'CHECK_IN', CHECK_OUT: 'CHECK_OUT' };

const EntrySchema = new Schema(
  {
    type: { type: String, required: true },
    roomID: { type: Schema.Types.ObjectId, ref: 'Room', required: true },
    userID: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    hostelID: { type: Schema.Types.ObjectId, ref: 'Hostel', required: true }
  },
  { minimize: false, timestamps: true, versionKey: false, collection: 'entries' }
);
EntrySchema.plugin(mongoosePaginate);

const Entry = model('Entry', EntrySchema);

module.exports = { Entry, entryStatuses };
