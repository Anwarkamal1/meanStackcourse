const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/user');
module.exports = async (req, res, next) => {
  const err = new Error();
  let token = req.headers.authorization;
  try {
    if (!token) {
      throw err;
    }
    token = token.split(' ')[1];
    const user = await jwt.verify(token, config.SECRET);
    if (user) {
      const getuser = await User.findOne({ _id: user._id }).exec();
      if (getuser) {
        res.locals.user = getuser;
        next();
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  } catch (error) {
    err.error = [
      {
        title: 'Not Authorize',
        detail: 'Log In to get access!.',
        status: 401
      }
    ];
    next(err.error);
    // return res.status(401).json(err.error);
  }
};
