const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

// 1. Map the Registration Logic
router.post('/register', register);

// 2. Map the Login Logic
router.post('/login', login);


module.exports = router;