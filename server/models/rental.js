const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const rentalSchema = new Schema(
  {
    title: {
      type: String,
      required: 'Title is Required',
      max: [128, 'Too long, max is 128 characters']
    },
    city: { type: String, required: true, lowercase: true },
    street: {
      type: String,
      required: 'Street is Required',
      lowercase: true,
      min: [4, 'Too short, min is 4 charaters']
    },
    category: {
      type: String,
      required: 'Category is Required',
      lowercase: true
    },
    image: { type: String, required: 'Image is Required' },
    bedrooms: Number,
    shared: Boolean,
    description: { type: String, required: 'Description is Required' },
    dailyRate: Number,
    createdAt: { type: Date, default: Date.now },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    bookings: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Booking'
      }
    ]
  },
  { versionKey: false }
);
module.exports = mongoose.model('Rental', rentalSchema);
