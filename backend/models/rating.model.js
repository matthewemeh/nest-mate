const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const mongoosePaginate = require('mongoose-paginate');

const RatingSchema = new Schema(
  {
    roomID: { type: Schema.Types.ObjectId, ref: 'Room', required: true },
    userID: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    value: { type: Number, required: [true, 'is required'], min: 0, max: 5 }
  },
  { minimize: false, timestamps: true, versionKey: false, collection: 'ratings' }
);
RatingSchema.plugin(mongoosePaginate);

const Rating = model('Rating', RatingSchema);

module.exports = Rating;
