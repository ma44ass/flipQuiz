const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // 1. Check if the incoming request header has a Bearer Token attached
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    // Extract token string out of: "Bearer eyJhbGciOi..."
    token = req.headers.authorization.split(' ')[1];

    // 2. Decode and verify the signature (jwt.verify throws automatically if expired/invalid)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Fetch the user from the database (minus the password hash)
    const user = await User.findById(decoded.id);

    if (!user) {
      const error = new Error('Not authorized, user not found');
      error.statusCode = 401;
      throw error;
    }

    // Attach user to req object for controllers to use
    req.user = user;
    return next();
  }

  // 4. If no token was provided at all
  if (!token) {
    const error = new Error('Not authorized, no security token provided');
    error.statusCode = 401;
    throw error;
  }
};

module.exports = { protect };