const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MongooseHelpers = require('../helpers/mongoose');

const bookingSchema = new Schema(
  {
    startAt: {
      type: String,
      required: 'Starting date is required'
    },
    endAt: {
      type: String,
      required: 'Ending date is required'
    },
    totalPrice: Number,
    days: Number,
    guests: Number,
    createdAt: {
      type: Date,
      default: Date.now
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    rental: {
      type: Schema.Types.ObjectId,
      ref: 'Rental'
    }
  },
  { versionKey: false }
);
module.exports = mongoose.model('Booking', bookingSchema);
