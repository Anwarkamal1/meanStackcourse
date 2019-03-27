const Booking = require('../models/booking');
const Rental = require('../models/rental');
const User = require('../models/user');
const MongooseHelpers = require('../helpers/mongoose');
exports.createBooking = async (req, res, next) => {
  let { startAt, endAt, totalPrice, guests, days, rental } = req.body;
  try {
    const user = res.locals.user;
    const err = new Error();
    const booking = new Booking({
      startAt: new Date(
        new Date(startAt).getFullYear() +
          ' ' +
          (new Date(startAt).getMonth() + 1) +
          ' ' +
          new Date(startAt).getDate()
      ).toLocaleDateString(),
      endAt: new Date(
        new Date(endAt).getFullYear() +
          ' ' +
          (new Date(endAt).getMonth() + 1) +
          ' ' +
          new Date(endAt).getDate()
      ).toLocaleDateString(),
      totalPrice,
      guests,
      days
    });
    const foundrental = await Rental.findOne({ _id: rental._id })
      .populate('bookings')
      .populate('user')
      .exec();
    if (foundrental.user._id.toString() === user._id.toString()) {
      // console.log(foundrental);
      err.error = [
        {
          title: 'Invalid User!',
          detail: 'Cannot create booking on your Rental!',
          status: 403
        }
      ];
      throw err.error;
    }
    // console.log(foundrental.user);
    if (!isValidBooking(booking, foundrental)) {
      err.error = [
        {
          title: 'Invalid Booking!',
          detail: 'Choosen dates are already taken!',
          status: 403
        }
      ];
      throw err.error;
    }
    booking.user = user;
    booking.rental = foundrental;
    foundrental.bookings.push(booking);
    const updateRental = await foundrental.save();
    if (!updateRental) {
      err.errors = [
        {
          title: `Saving Fail`,
          detail: `Booking is not saved in Database!`
        }
      ];
      throw err.errors;
    }
    await booking.save();
    await User.update({ _id: user._id }, { $push: { bookings: booking } });
    res.status(201).json({ startAt: booking.startAt, endAt: booking.endAt });
  } catch (err) {
    if (err.errors) {
      err = MongooseHelpers.normalizeErrors(err.errors);
    }
    next(err);
  }
};

function isValidBooking(proposedBooking, rental) {
  let isValid = true;
  if (rental.bookings && rental.bookings.length > 0) {
    const proposedStart = +new Date(proposedBooking.startAt);
    const proposedEnd = +new Date(proposedBooking.endAt);
    isValid = rental.bookings.every(booking => {
      const actualStart = +new Date(booking.startAt);
      const actualEnd = +new Date(booking.endAt);
      return (
        (actualStart < proposedStart && actualEnd < proposedEnd) ||
        (proposedEnd < actualEnd && proposedEnd < actualStart)
      );
    });
  }
  return isValid;
}
