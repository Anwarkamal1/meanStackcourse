const express = require('express');
const router = express.Router();
const rentalController = require('../controllers/rental');
const check_auth = require('../middlewares/check-auth');
router.get('/manage', check_auth, rentalController.getUserRentals);
router.get('/:_id/verify-user', check_auth, rentalController.verifyUser);
router.get('/:_id', rentalController.getRental);
router.patch('/:_id', check_auth, rentalController.updateRental);

router.delete('/:_id', check_auth, rentalController.deleteRental);
router.get('', rentalController.getRentals);
router.post('', check_auth, rentalController.createRental);
module.exports = router;
