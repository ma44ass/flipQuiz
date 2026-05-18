const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const {validateBody} = require('../middleware/validateMiddleware');
const { registerSchema, loginSchema } = require('../validations/authValidation');

// 1. Map the Registration Logic with Zod Safety
router.post('/register', validateBody(registerSchema), register);

// 2. Map the Login Logic with Zod Safety
router.post('/login', validateBody(loginSchema), login);

module.exports = router;