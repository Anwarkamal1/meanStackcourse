const Rental = require('./models/rental');
const User = require('./models/user');
const fakeDbData = require('./data.json');
const Booking = require('./models/booking');
class FakeDb {
  constructor() {
    this.rental = fakeDbData.rentals;
    this.users = fakeDbData.users;
  }
  async clearDb() {
    await User.deleteMany({});
    await Rental.deleteMany({});
    await Booking.deleteMany({});
  }
  pushDataToDb() {
    const user = new User(this.users[0]);
    const user1 = new User(this.users[1]);
    this.rental.forEach(rental => {
      const newRental = new Rental(rental);
      newRental.user = user;
      user.rentals.push(newRental);
      newRental.save();
    });
    user.save();
    user1.save();
  }
  async seedDb() {
    await this.clearDb();
    this.pushDataToDb();
  }
  getRentals() {
    return this.rental;
  }
}
module.exports = FakeDb;
