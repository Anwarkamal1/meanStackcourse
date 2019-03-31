module.exports = {
  DB_URI: process.env.DB_URI,
  SECRET: process.env.SECRET
};

// mongodb+srv://Anwar_kamal:<password>@cluster0-4d39x.mongodb.net/test?retryWrites=true

/**
 * create mongodb database and secret for jwt and take its uri and create horoku config values and pass it there in value field
 * then here specify it here with env veriables;
 */
