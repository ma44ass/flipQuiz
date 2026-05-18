const authService = require('../services/authService');

// @desc    Register new user
// @route   POST /api/auth/register
exports.register = async (req, res) => {
  const userWithToken = await authService.registerUser(req.body);
  res.status(201).json(userWithToken);
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  const userWithToken = await authService.loginUser(email, password);
  res.status(200).json(userWithToken);
};