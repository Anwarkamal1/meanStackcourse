const Booking = require('../models/booking');
const Rental = require('../models/rental');
const User = require('../models/user');
const MongooseHelpers = require('../helpers/mongoose');
exports.createBooking = async (req, res, next) => {
  let { startAt, endAt, totalPrice, guests, days, rental } = req.body;
  try {
    let startd = req.body.startAt.split('/');
    let endd = req.body.endAt.split('/');
    let start = req.body.startAt.split('-');
    let end = req.body.endAt.split('-');
    var sfirstDay = new Date(+startd[0], +startd[1], 1).getDate();
    var slastDay = new Date(+startd[0], +startd[1], 0).getDate();
    var efirstDay = new Date(+endd[0], +endd[1], 1).getDate();
    var elastDay = new Date(+endd[0], +endd[1], 0).getDate();
    if (startd.length > 1) {
      const dates = populateDate(
        startd,
        endd,
        sfirstDay,
        slastDay,
        efirstDay,
        elastDay
      );
      startAt = dates.startAt;
      endAt = dates.endAt;
    }
    if (start.length > 1) {
      const dates = populateDate(
        start,
        end,
        sfirstDay,
        slastDay,
        efirstDay,
        elastDay
      );
      startAt = dates.startAt;
      endAt = dates.endAt;
    }

    const user = res.locals.user;
    const err = new Error();
    const booking = new Booking({
      startAt,
      endAt,
      totalPrice,
      guests,
      days
    });
    const foundrental = await Rental.findOne({ _id: rental._id })
      .populate('bookings')
      .populate('user')
      .exec();
    if (foundrental.user._id.toString() === user._id.toString()) {
      err.errors = [
        {
          title: 'Invalid User!',
          detail: 'Cannot create booking on your Rental!',
          status: 403
        }
      ];
      throw err.errors;
    }
    if (!isValidBooking(booking, foundrental)) {
      err.errors = [
        {
          title: 'Invalid Booking!',
          detail: 'Choosen dates are already taken!',
          status: 403
        }
      ];
      throw err.errors;
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
    await User.updateOne({ _id: user._id }, { $push: { bookings: booking } });
    res.status(201).json({ startAt: booking.startAt, endAt: booking.endAt });
  } catch (err) {
    console.log(err);
    if (err.errors) {
      err = MongooseHelpers.normalizeErrors(err.errors);
    }
    next(err);
  }
};

function isValidBooking(proposedBooking, rental) {
  let isValid = true;
  if (rental.bookings && rental.bookings.length > 0) {
    let startp = proposedBooking.startAt.split('-');
    let smonth = startp[1];
    if (+startp[1] > 11) {
      smonth = +startp[1] - 1;
    }
    startp[1] = smonth;
    let endp = proposedBooking.endAt.split('-');
    let emonth = endp[1];
    if (+endp[1] > 11) {
      emonth = +endp[1] - 1;
    }
    endp[1] = emonth;
    const proposedStart = +new Date(startp);
    const proposedEnd = +new Date(endp);
    console.log(new Date(startp), new Date(endp));
    isValid = rental.bookings.every(booking => {
      let startd = booking.startAt.split('-');
      let endd = booking.endAt.split('-');
      let actualStart = -1;
      let actualEnd = -1;
      if (+startd[1] === 12) {
        start12 = false;
        actualStart = +new Date(`${+startd[0]}-12-${+startd[2]}`);
      } else if (+endd[1] === 01) {
        actualStart = +new Date(`${+startd[0]}-01-${+startd[2]}`);
      } else {
        actualStart = +new Date(
          `${+startd[0]}-${startd[1] - 1}-${+startd[2] + 1}`
        );
      }
      if (+endd[1] === 12) {
        end12 = false;
        actualEnd = +new Date(`${+endd[0]}-12-${+endd[2]}`);
      } else if (+endd[1] === 01) {
        actualEnd = +new Date(`${+endd[0]}-01-${+endd[2]}`);
      } else {
        actualEnd = +new Date(`${+endd[0]}-${+endd[1] - 1}-${+endd[2] + 1}`);
      }
      return (
        (actualStart < proposedStart && actualEnd < proposedEnd) ||
        (proposedEnd < actualEnd && proposedEnd < actualStart)
      );
    });
  }
  return isValid;
}
exports.getUserBookings = async (req, res, next) => {
  const user = res.locals.user;
  const err = new Error();
  try {
    const bookings = await Booking.where({ user })
      .populate('rental')
      .exec();
    if (bookings.length <= 0) {
      err.errors = [
        {
          title: `Not found`,
          detail: `You have no Bookings yet!`,
          status: 404
        }
      ];
      throw err.errors;
    }
    res.status(200).json({ bookings: bookings });
  } catch (err) {
    if (err.errors) {
      err = MongooseHelpers.normalizeErrors(err.errors);
    }
    next(err);
  }
};
function populateDate(start, end, sfirstDay, sendDay, efirstDay, eendDay) {
  let startAt, endAt;
  if (+start[1] < 10 && +start[2] < 10) {
    startAt = `${+start[0]}-0${+start[1]}-0${+start[2]}`;
  } else if (+start[1] < 10) {
    startAt = `${+start[0]}-0${+start[1]}-${+start[2]}`;
  } else if (+start[2] < 10) {
    startAt = `${+start[0]}-${+start[1]}-0${+start[2]}`;
  } else {
    startAt = `${+start[0]}-${+start[1]}-${+start[2]}`;
  }
  if (+end[1] < 10 && +end[2] < 10) {
    endAt = `${+end[0]}-0${+end[1]}-0${+end[2]}`;
  } else if (+end[1] < 10) {
    endAt = `${+end[0]}-0${+end[1]}-${+end[2]}`;
  } else if (+end[2] < 10) {
    endAt = `${+end[0]}-${+end[1]}-0${+end[2]}`;
  } else {
    endAt = `${+end[0]}-${+end[1]}-${+end[2]}`;
  }
  console.log(startAt, endAt);
  return {
    startAt,
    endAt
  };
}
