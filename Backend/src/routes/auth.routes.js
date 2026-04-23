const express = require('express');
const { validate } = require('../middleware/validate');
const { signup, login, logout, refresh, signupValidators, loginValidators } = require('../controllers/auth.controller');

const router = express.Router();

router.post('/signup', signupValidators, validate, signup);
router.post('/login', loginValidators, validate, login);
router.post('/logout', logout);
router.post('/refresh', refresh);

module.exports = router;

