const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const MongooseHelpers = require('../helpers/mongoose');
const config = require('../config/dev');
const ObjectId = mongoose.Types.ObjectId;
exports.auth = async (req, res, next) => {
  try {
    // console.log(res.locals.user);
    const err = new Error();
    const email = req.body.email;
    // console.log(req.body.email);
    const user = await User.findOne({ email });
    if (!user) {
      err.error = [
        {
          title: 'Login failed',
          detail: 'User with that email does not exist in database!',
          status: 401
        }
      ];
      throw err.error;
    } else {
      const hashedpassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (hashedpassword) {
        const token = jwt.sign(
          { _id: user._id, username: user.username },
          config.SECRET,
          {
            expiresIn: '1h'
          }
        );
        return res.json({ token: token });
        // res.status(200).json({ user: user, ok: true });
      } else {
        err.error = [
          {
            title: 'Login failed',
            detail: 'Password is Not Correct!',
            status: 401
          }
        ];

        throw err.error;
      }
    }
  } catch (err) {
    console.log(err);
    if (err.errors) {
      err = MongooseHelpers.normalizeErrors(err.errors);
    }
    next(err);
  }
};

exports.register = async (req, res, next) => {
  // const username = req.body.username;
  // const email = req.body.email;
  // const password = req.body.password;
  // const passwordConfirmation = req.body.passwordConfirmation;
  let err = new Error();
  try {
    const { username, email, password, passwordConfirmation } = req.body;
    if (password !== passwordConfirmation) {
      err.errors = [
        {
          title: `Invalid password`,
          detail: `Password didn't match!`,
          status: 400
          // 409
        }
      ];
      throw err.errors;
    } else if (password.length <= 3) {
      err.errors = [
        {
          title: `Invalid password`,
          detail: `Password is short minimum is 4 characters!`,
          status: 400
          // 409
        }
      ];
      throw err.errors;
    } else if (password.length >= 33) {
      err.errors = [
        {
          title: `Invalid password`,
          detail: `Password is short maximum is 32 characters!`,
          status: 400
          // 409
        }
      ];
      throw err.errors;
    }

    const user = await User.findOne({ email });
    if (user) {
      err.errors = [
        {
          title: `User exists`,
          detail: `User with this email already exists in database!`,
          status: 409
        }
      ];
      throw err.errors;
    }

    const hashedpassword = await bcrypt.hash(password, 12);
    if (hashedpassword) {
      const userObj = new User({
        username,
        email,
        password: hashedpassword
      });

      const user1 = await userObj.save();
      if (!user1) {
        err.errors = [
          {
            title: `Saving failed`,
            detail: `User is not saved in database!`
          }
        ];
        throw err.errors;
      }
      res.status(201).json({ register: true });
    }
  } catch (err) {
    if (err.errors) {
      err = MongooseHelpers.normalizeErrors(err.errors);
    }
    next(err);
  }
};
