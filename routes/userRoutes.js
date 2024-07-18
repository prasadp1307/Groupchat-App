const express = require('express');
const router = express.Router();
const { signupController } = require('../controllers/signupController');
const { loginController } = require('../controllers/loginController')


router.post('/signup', signupController);
router.post('/login',loginController)

module.exports = router;
