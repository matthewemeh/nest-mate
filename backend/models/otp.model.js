const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const OTPSchema = new Schema(
  {
    otp: String,
    createdAt: Date,
    expiresAt: Date,
    email: {
      type: String,
      trim: true,
      index: true,
      unique: true,
      required: [true, 'is required'],
      validate: {
        validator: str => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(str),
        message: props => `${props.value} is not a valid email`
      }
    }
  },
  { minimize: false, timestamps: false, versionKey: false, collection: 'otps' }
);

const OTP = model('OTP', OTPSchema);

module.exports = OTP;
