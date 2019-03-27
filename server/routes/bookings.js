const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/booking');
const check_auth = require('../middlewares/check-auth');
router.post('', check_auth, bookingController.createBooking);

module.exports = router;
