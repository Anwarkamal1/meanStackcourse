const Rental = require('./models/rental');
const User = require('./models/user');
class FakeDb {
  constructor() {
    this.rental = [
      {
        title: 'Central Apartment',
        city: 'New York',
        street: 'Times Square',
        category: 'apartment',
        image:
          'https://cdn.houseplans.com/product/q5qkhirat4bcjrr4rpg9fk3q94/w800x533.jpg',
        bedrooms: 3,
        description: 'Very nice apartment',
        dailyRate: 34,
        shared: false
      },
      {
        title: 'Central Apartment 2',
        city: 'sen Francisco',
        street: 'Main Street',
        category: 'condo',
        image:
          'https://cdn.houseplans.com/product/q5qkhirat4bcjrr4rpg9fk3q94/w800x533.jpg',
        bedrooms: 2,
        description: 'Very nice apartment',
        dailyRate: 12,
        shared: true
      },
      {
        title: 'Central Apartment 3',
        city: 'New York',
        street: 'Times Square',
        category: 'apartment',
        image:
          'https://cdn.houseplans.com/product/q5qkhirat4bcjrr4rpg9fk3q94/w800x533.jpg',
        bedrooms: 3,
        description: 'Very nice apartment',
        dailyRate: 34,
        shared: false
      }
    ];
    this.users = [
      {
        username: 'Test User',
        email: 'test@gmail.com',
        password: '$2a$12$tyM7j0TJm8toNxAeUUgH7uywEl7deJFdrJVfjfUY4gQWr.UJcEAcG'
      },
      {
        username: 'Test User1',
        email: 'test1@gmail.com',
        password: '$2a$12$tyM7j0TJm8toNxAeUUgH7uywEl7deJFdrJVfjfUY4gQWr.UJcEAcG'
      }
    ];
  }
  async clearDb() {
    await User.deleteMany({});
    await Rental.deleteMany({});
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
