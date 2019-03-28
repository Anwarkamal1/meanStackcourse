const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/booking');
const check_auth = require('../middlewares/check-auth');
router.get('/manage', check_auth, bookingController.getUserBookings);
router.post('', check_auth, bookingController.createBooking);

module.exports = router;
