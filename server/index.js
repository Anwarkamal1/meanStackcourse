const express = require('express');
const mongoose = require('mongoose');
const config = require('./config');
const http = require('http');
const path = require('path');
const bodyParser = require('body-parser');
const rentalRoutes = require('./routes/rentals');
const userRoutes = require('./routes/users');
const bookingRoutes = require('./routes/bookings');
const rootDir = require('./utils/rootdir');
const FakeDb = require('./fake-db');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/api/v1/rentals', rentalRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/bookings', bookingRoutes);
if (process.env.NODE_ENV === 'production') {
  const appPath = path.join(rootDir, '..', 'dist');
  app.use(express.static(appPath));

  app.get('*', function(req, res, next) {
    res.sendFile(path.resolve(appPath, 'index.html'));
  });
}
const PORT = process.env.PORT || 3000;
app.use((error, req, res, next) => {
  if (error.length > 0) {
    if (error[0].hasOwnProperty('status') !== true) {
      error[0].status = 500;
    }
    return res.status(error[0].status).send(error);
  }
  res
    .status(500)
    .send({ title: 'Server Error', detail: 'Server is not responding!' });
});
// mongoose.connect(config.DB_URI, { useNewUrlParser: true }).then(data => {
//   console.log('DataBase Connected Successfully...');
// });

const server = http.createServer(app);
const ser = server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}...`);
  console.log(new Date().toLocaleString());
  console.log(new Date(2019 + '-' + 12 + '-' + 13).toISOString());
  console.log(new Date(2019 + '/' + 4 + '/' + 12).toDateString());
  console.log(new Date(2019, 11, 8));
  // mongoose.set('useCreateIndex', true);
  mongoose
    .connect(config.DB_URI, {
      useNewUrlParser: true,
      useCreateIndex: true
    })

    .then(db => {
      console.log('Database Connected Successfully..');
      if (process.env.NODE_ENV !== 'production') {
        // const fakedb = new FakeDb();
        // fakedb.seedDb();
      }
    })
    .catch(err => {
      console.log('not connected');
    });
});
