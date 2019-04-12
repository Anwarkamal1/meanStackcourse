module.exports = {
  DB_URI: process.env.DB_URI,
  SECRET: process.env.SECRET,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET
};

/**
 * create mongodb database and secret for jwt and take its uri and create horoku config values and pass it there in value field
 * then here specify it here with env veriables;
 */
