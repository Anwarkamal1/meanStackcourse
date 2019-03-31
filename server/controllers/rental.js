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
exports.deleteRental = async (req, res, next) => {
  const _id = req.params._id;
  const user = res.locals.user;
  const err = new Error();
  try {
    const rental = await Rental.findOne({ _id })
      .populate('user', '_id')
      .populate({
        path: 'bookings',
        select: 'startAt',
        match: {
          startAt: { $gt: new Date().toISOString() }
        }
      })
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
    if (user._id.toString() !== rental.user._id.toString()) {
      err.errors = [
        {
          title: `Invalid User`,
          detail: `You're not rental owner!`,
          status: 401
        }
      ];
      throw err.errors;
    }
    // console.log(rental);
    if (rental.bookings.length > 0) {
      err.errors = [
        {
          title: `Active Bookings`,
          detail: `Cannot delete rental with active bookings!`,
          status: 403
        }
      ];
      throw err.errors;
    }
    let userRentals = user.rentals;
    const index = userRentals.indexOf(_id);
    if (index >= 0) {
      userRentals.splice(index, 1);
    }
    user.rentals = userRentals;
    await user.save();

    await Rental.deleteOne({
      _id: rental._id
    }).exec();

    res.status(200).json({ deleted: 'ok' });
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
  } catch (err) {}
};
exports.getUserRentals = async (req, res, next) => {
  const user = res.locals.user;
  const err = new Error();
  try {
    const rentals = await Rental.where({ user })
      .populate('bookings')
      .exec();
    if (!rentals) {
      err.errors = [
        {
          title: `Not found`,
          detail: `You have no rentals! yet`,
          status: 404
        }
      ];
      throw err.errors;
    }
    res.status(200).json({ rentals: rentals });
  } catch (error) {
    if (err.errors) {
      err = MongooseHelper.normalizeErrors(err.errors);
    }
    next(err);
  }
};
