const express = require('express');
const router = express.Router();
const rentalController = require('../controllers/rental');
router.get('', rentalController.getRentals);
router.get('/:_id', rentalController.getRental);
module.exports = router;
