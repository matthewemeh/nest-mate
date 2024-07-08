const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const mongoosePaginate = require('mongoose-paginate');

const reservationStatuses = { PENDING: 'PENDING', DECLINED: 'DECLINED', CONFIRMED: 'CONFIRMED' };

const ReservationSchema = new Schema(
  {
    userID: { type: String, required: [true, 'is required'] },
    status: { type: String, default: reservationStatuses.PENDING },
    roomID: { type: Schema.Types.ObjectId, ref: 'Room', required: true }
  },
  { minimize: false, timestamps: true, versionKey: false, collection: 'reservations' }
);
ReservationSchema.plugin(mongoosePaginate);

const Reservation = model('Reservation', ReservationSchema);

module.exports = { Reservation, reservationStatuses };
