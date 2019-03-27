const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MongooseHelpers = require('../helpers/mongoose');

const userSchema = new Schema(
  {
    username: {
      type: String,
      lowercase: true,
      minlength: [4, 'username is short minimum 4 characters!'],
      maxlength: [32, 'username is long, maximum is 32 characters!']
    },
    email: {
      type: String,
      minlength: [4, 'email is short, minimum is 4 characters!'],
      maxlength: [32, 'email is long, maximum is 32 characters!'],
      unique: true,
      lowercase: true,
      required: 'Email is required',
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/]
    },
    password: {
      type: String,
      // minlength: [4, 'password is short, minimum is 4 characters!'],
      // maxlength: [32, 'password is long, maximum is 32 characters!'],
      required: 'Password is required'
    },
    rentals: [{ type: Schema.Types.ObjectId, ref: 'Rental' }],
    bookings: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Booking'
      }
    ]
  },
  { versionKey: false }
);
userSchema.pre('save', async function(next) {
  const err = new Error();
  try {
    const user = this;
    if (!user.password || !user.email) {
      err.errors = [
        {
          title: 'Data missing',
          detail: 'Provide email and password!',
          status: 204
        }
      ];

      throw err.errors;
    }
  } catch (err) {
    console.log(err);
    if (err.errors) {
      err = MongooseHelpers.normalizeErrors(err.errors);
    }
    next(err);
  }
});
module.exports = mongoose.model('User', userSchema);
