const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const mongoosePaginate = require('mongoose-paginate');

const HostelSchema = new Schema(
  {
    floors: { type: Number, default: 0 },
    hostelImageUrl: { type: String, default: '' },
    rooms: [{ type: Schema.Types.ObjectId, ref: 'Room' }],
    name: { type: String, required: [true, 'is required'], trim: true }
  },
  { minimize: false, timestamps: true, versionKey: false, collection: 'hostels' }
);
HostelSchema.plugin(mongoosePaginate);

/* Before deleting a hostel, remove all rooms in that hostel */
// HostelSchema.pre('findOneAndDelete', function (next) {
// Room.deleteMany({ hostelID: this._id }, next);
// console.log(this._id);
// this.model('Room').deleteMany({ hostelID: this._id }, next);
// });

const Hostel = model('Hostel', HostelSchema);

module.exports = Hostel;
