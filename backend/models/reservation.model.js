const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const mongoosePaginate = require('mongoose-paginate');

const reservationStatuses = { PENDING: 'PENDING', DECLINED: 'DECLINED', CONFIRMED: 'CONFIRMED' };

const ReservationSchema = new Schema(
  {
    status: { type: String, default: reservationStatuses.PENDING },
    roomID: { type: Schema.Types.ObjectId, ref: 'Room', required: true },
    hostelID: { type: Schema.Types.ObjectId, ref: 'Hostel', required: true },
    userID: { type: Schema.Types.ObjectId, ref: 'User', required: [true, 'is required'] }
  },
  { minimize: false, timestamps: true, versionKey: false, collection: 'reservations' }
);
ReservationSchema.plugin(mongoosePaginate);

/* Before deleting a reservation, set reservationID of User who made reservation to null */
// ReservationSchema.pre('remove', function (next) {
//   this.model('User').updateOne(
//     { reservationID: this._id },
//     { $set: { reservationID: null } },
//     next
//   );
// });

/* Before deleting a reservation, remove the reservation id from rooms reservations */
// ReservationSchema.pre('remove', function (next) {
//   this.model('Room').updateOne(
//     { reservations: this._id },
//     { $pull: { reservations: this._id } },
//     next
//   );
// });

const Reservation = model('Reservation', ReservationSchema);

module.exports = { Reservation, reservationStatuses };
