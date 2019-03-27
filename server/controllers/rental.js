const Rental = require('../models/rental');
const mongoose = require('mongoose');
const fakeDb = require('../fake-db');

const ObjectId = mongoose.Types.ObjectId;
exports.getRentals = async (req, res, next) => {
  const err = new Error();
  try {
    const rentals = await Rental.find({})
      .select('-bookings')
      .exec();
    res.status(200).json({ rentals: rentals, ok: true });
  } catch (error) {
    err.errors = [
      {
        title: `Saving failed`,
        detail: `User is not saved in database!`,
        status: 404
      }
    ];

    next(err.errors);
  }
};
exports.getRental = async (req, res, next) => {
  const _id = req.params._id;
  const err = new Error();
  try {
    const rental = await Rental.findOne({ _id })
      .populate('user', 'username -_id')
      .populate('bookings', 'startAt endAt -_id')
      .exec();

    res.status(200).json({ rental: rental });
  } catch (error) {
    err.errors = [
      {
        title: `Not found`,
        detail: `Rental not found!`,
        status: 404
      }
    ];
    next(err.errors);
  }
};
