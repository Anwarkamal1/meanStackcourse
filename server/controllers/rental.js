const Rental = require('../models/rental');
const mongoose = require('mongoose');
const fakeDb = require('../fake-db');
const MongooseHelper = require('../helpers/mongoose');
const User = require('../models/user');

const ObjectId = mongoose.Types.ObjectId;

exports.createRental = async (req, res, next) => {
  const err = new Error();

  const {
    title,
    city,
    street,
    category,
    image,
    shared,
    bedrooms,
    description,
    dailyRate
  } = req.body;
  try {
    const user = res.locals.user;
    const rental = new Rental({
      title,
      city,
      street,
      category,
      image,
      shared,
      bedrooms,
      description,
      dailyRate,
      user
    });
    const newRental = await Rental.create(rental);
    if (!newRental) {
      err.errors = [
        {
          title: `Not found`,
          detail: `There are no rentals found for the city ${city.toUpperCase()}!`,
          status: 404
        }
      ];
      throw err.errors;
    }
    await User.updateOne(
      { _id: user._id },
      { $push: { rentals: newRental } }
    ).exec();
    res.status(200).json({ rental: newRental });
  } catch (err) {
    if (err.errors) {
      err = MongooseHelper.normalizeErrors(err.errors);
    }
    next(err);
  }
};

exports.getRentals = async (req, res, next) => {
  const city = req.query.city;
  const query = city ? { city: city.toLowerCase() } : {};

  const err = new Error();
  try {
    const rentals = await Rental.find(query)
      .select('-bookings')
      .exec();
    if (rentals.length === 0 && city) {
      err.errors = [
        {
          title: `Not found`,
          detail: `There are no rentals found for the city ${city.toUpperCase()}!`,
          status: 404
        }
      ];
      throw err.errors;
    }
    if (rentals.length === 0) {
      err.errors = [
        {
          title: `No Data Exist`,
          detail: `No Rentals found in the database!`,
          status: 404
        }
      ];
      throw err.errors;
    }
    res.status(200).json({ rentals: rentals, ok: true });
  } catch (err) {
    if (err.errors) {
      err = MongooseHelper.normalizeErrors(err.errors);
    }
    next(err);
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
    if (!rental) {
      err.errors = [
        {
          title: `Not found`,
          detail: `Rental not found!`,
          status: 404
        }
      ];
      throw err.errors;
    }
    res.status(200).json({ rental: rental });
  } catch (err) {
    if (err.errors) {
      err = MongooseHelper.normalizeErrors(err.errors);
    }
    next(err);
  }
};
