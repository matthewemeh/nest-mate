const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const mongoosePaginate = require('mongoose-paginate');

const RoomSchema = new Schema(
  {
    floor: { type: Number, default: 0 },
    maxOccupants: { type: Number, default: 6 },
    roomImageUrl: { type: String, default: '' },
    ratings: [{ type: Schema.Types.ObjectId, ref: 'Rating' }],
    occupants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    roomNumber: { type: Number, required: [true, 'is required'] },
    reservations: [{ type: Schema.Types.ObjectId, ref: 'Reservation' }],
    hostelID: { type: Schema.Types.ObjectId, ref: 'Hostel', required: true }
  },
  { minimize: false, timestamps: true, versionKey: false, collection: 'rooms' }
);
RoomSchema.plugin(mongoosePaginate);

/* Before deleting a room, remove all users from that room */
// RoomSchema.pre('remove', function (next) {
//   this.model('User').updateMany(
//     { roomID: this._id },
//     { $set: { roomID: null, checkedIn: false, lastCheckedOut: new Date().toISOString() } },
//     next
//   );
// });

/* Before deleting a room, remove all ratings for that room */
// RoomSchema.pre('remove', function (next) {
//   this.model('Rating').remove({ roomID: this._id }, next);
// });

/* Before deleting a room, remove all reservations for that room */
// RoomSchema.pre('remove', function (next) {
//   this.model('Reservation').remove({ roomID: this._id }, next);
// });

/* Before deleting a room, remove that room from the hostel's rooms */
// RoomSchema.pre('remove', function (next) {
//   this.model('Hostel').updateOne({ rooms: this._id }, { $pull: { rooms: this._id } }, next);
// });

const Room = model('Room', RoomSchema);

module.exports = Room;
