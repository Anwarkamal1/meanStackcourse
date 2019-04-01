const Booking = require('../models/booking');
const Rental = require('../models/rental');
const User = require('../models/user');
const MongooseHelpers = require('../helpers/mongoose');
exports.createBooking = async (req, res, next) => {
  let { startAt, endAt, totalPrice, guests, days, rental } = req.body;
  try {
    // console.log(req.body);
    let start = req.body.startAt.split('/');
    let end = req.body.endAt.split('/');
    let startd = req.body.startAt.split('-');
    let endd = req.body.endAt.split('-');
    var sfirstDay = new Date(+start[0], +start[1], 1).getDate();
    var slastDay = new Date(+start[0], +start[1], 0).getDate();
    var efirstDay = new Date(+end[0], +end[1], 1).getDate();
    var elastDay = new Date(+end[0], +end[1], 0).getDate();

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
      // console.log(foundrental);
      err.errors = [
        {
          title: 'Invalid User!',
          detail: 'Cannot create booking on your Rental!',
          status: 403
        }
      ];
      throw err.errors;
    }
    // console.log(foundrental.user);
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
    if (err.errors) {
      err = MongooseHelpers.normalizeErrors(err.errors);
    }
    next(err);
  }
};

function isValidBooking(proposedBooking, rental) {
  let isValid = true;
  if (rental.bookings && rental.bookings.length > 0) {
    // const proposedStart = +new Date(proposedBooking.startAt);
    // const proposedEnd = new Date(proposedBooking.endAt);
    // console.log(proposedBooking.startAt);
    // console.log(proposedBooking.endAt);
    let startp = proposedBooking.startAt.split('T')[0].split('-');
    let smonth = startp[1];
    if (startp[1] > 0) {
      smonth = +startp[1] - 1;
    }
    startp[1] = smonth;
    let endp = proposedBooking.endAt.split('T')[0].split('-');
    let emonth = endp[1];
    if (endp[1] > 0) {
      emonth = +endp[1] - 1;
    }
    endp[1] = emonth;
    const proposedStart = +new Date(startp);
    const proposedEnd = +new Date(endp);
    console.log(proposedBooking.endAt);
    isValid = rental.bookings.every(booking => {
      let startd = booking.startAt.split('T')[0].split('-');

      let endd = booking.endAt.split('T')[0].split('-');
      // console.log(startd);
      // console.log(endd);
      let actualStart = -1;
      let actualEnd = -1;
      if (+startd[1] === 12) {
        start12 = false;
        actualStart = +new Date(`${+startd[0]}-12-${+startd[2]}`);
        // console.log(new Date(`${+startd[0]}-12-${+startd[2]}`));
        // console.log('in st 12');
      } else if (+endd[1] === 01) {
        // console.log('in st 1');
        actualStart = +new Date(`${+startd[0]}-01-${+startd[2]}`);
      } else {
        // console.log('in st ');
        actualStart = +new Date(
          `${+startd[0]}-${startd[1] - 1}-${+startd[2] + 1}`
        );
        // console.log(
        //   new Date(`${+startd[0]}-${startd[1] - 1}-${+startd[2] + 1}`)
        // );
      }
      if (+endd[1] === 12) {
        // console.log('in et 12');
        // console.log(new Date(`${+endd[0]}-01-${+endd[2]}`));
        end12 = false;
        actualEnd = +new Date(`${+endd[0]}-12-${+endd[2]}`);
      } else if (+endd[1] === 01) {
        // console.log('in et 1');
        // console.log(new Date(`${+endd[0]}-01-${+endd[2]}`));
        actualEnd = +new Date(`${+endd[0]}-01-${+endd[2]}`);
      } else {
        // console.log('in et ');
        // console.log(new Date(`${+endd[0]}-${+endd[1] - 1}-${+endd[2] + 1}`));
        actualEnd = +new Date(`${+endd[0]}-${+endd[1] - 1}-${+endd[2] + 1}`);
      }
      // console.log(proposedEnd);
      // console.log(proposedStart);
      // console.log(actualStart);
      // console.log(actualEnd);
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
  let start12 = true,
    end12 = true;
  let startAt, endAt;
  // console.log(start, end, sendDay, eendDay, efirstDay, efirstDay);
  if (+start[1] < 11 && +start[2] < 10) {
    startAt = `${+start[0]}-0${+start[1]}-0${+start[2]}T19:00:00.000Z`;
  } else if (+start[1] < 12) {
    startAt = `${+start[0]}-0${+start[1]}-${+start[2]}T19:00:00.000Z`;
  } else if (+start[2] < 10) {
    startAt = `${+start[0]}-${+start[1]}-0${+start[2]}T19:00:00.000Z`;
  } else {
    startAt = `${+start[0]}-${+start[1]}-${+start[2]}T19:00:00.000Z`;
  }
  if (+end[1] < 11 && +end[2] < 10) {
    endAt = `${+end[0]}-0${+end[1]}-0${+end[2]}T19:00:00.000Z`;
  } else if (+end[1] < 12) {
    endAt = `${+end[0]}-0${+end[1]}-${+end[2]}T19:00:00.000Z`;
  } else if (+end[2] < 10) {
    endAt = `${+end[0]}-${+end[1]}-0${+end[2]}T19:00:00.000Z`;
  } else {
    endAt = `${+end[0]}-${+end[1]}-${+end[2]}T19:00:00.000Z`;
  }

  // if (start[1] === '12') {
  //   if (start[2] > -1 && start[2] < 10) {
  //     startAt = `${+start[0]}-12-0${+start[2]}T19:00:00.000Z`;
  //   } else {
  //     startAt = `${+start[0]}-12-${+start[2]}T19:00:00.000Z`;
  //   }
  //   start12 = false;
  // }
  // if (end[1] === '12') {
  //   end12 = false;
  //   if (end[2] > -1 && end[2] < 10) {
  //     endAt = `${+end[0]}-12-0${+end[2]}T19:00:00.000Z`;
  //   } else {
  //     endAt = `${+end[0]}-12-${+end[2]}T19:00:00.000Z`;
  //   }
  // }

  // isstartTrue = false;
  // isend = false;
  // if (start12) {
  //   if (+start[2] === sfirstDay) {
  //     start[2] = 1 + '';
  //     isstartTrue = true;
  //     console.log('in firsts');
  //   }
  //   if (+start[2] === sendDay) {
  //     start[2] = sendDay + '';
  //     start[1] = (+start[1] + 1).toString();
  //     isstartTrue = true;
  //   }
  // }
  // if (end12) {
  //   if (+end[2] === efirstDay) {
  //     end[2] = 2 + '';
  //     isend = true;
  //   }
  //   if (+end[2] === eendDay) {
  //     end[2] = 1 + '';
  //     end[1] = (+end[1] + 1).toString();
  //     isend = true;
  //   }
  // }
  // if (isstartTrue) {
  //   // start[2] = +start[2] + 1;
  //   startAt = `${+start[0]}-12-0${+start[2]}T19:00:00.000Z`;
  // } else if (start12) {
  //   startAt = new Date(
  //     start[0] + '-' + start[1] + '-' + +start[2]
  //   ).toISOString();
  // }
  // if (isend) {
  //   end[2] = +end[2] + 1;
  //   endAt = new Date(end[0] + '-' + end[1] + '-' + (+end[2] - 1)).toISOString();
  // } else if (end12) {
  //   endAt = new Date(end[0] + '-' + end[1] + '-' + +end[2]).toISOString();
  // }
  console.log(startAt, endAt);
  return {
    startAt,
    endAt
  };
}
