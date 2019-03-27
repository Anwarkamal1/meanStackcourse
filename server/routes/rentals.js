const express = require('express');
const router = express.Router();
const rentalController = require('../controllers/rental');
const check_auth = require('../middlewares/check-auth');
router.get('/:_id', rentalController.getRental);
router.get('', rentalController.getRentals);
router.post('', check_auth, rentalController.createRental);
module.exports = router;
