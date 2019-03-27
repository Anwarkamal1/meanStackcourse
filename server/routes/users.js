const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const check_auth = require('../middlewares/check-auth');
router.post('/authj', check_auth, userController.auth);
router.post('/auth', userController.auth);
router.post('/register', userController.register);
module.exports = router;
