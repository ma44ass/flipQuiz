const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // 1. Check if the incoming request header has a Bearer Token attached
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract token string out of: "Bearer eyJhbGciOi..."
      token = req.headers.authorization.split(' ')[1];

      // 2. Decode and verify the signature using your secret environment key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3. Fetch the user from the database (minus the password hash) and attach to 'req'
      req.user = await User.findById(decoded.id).select('-password');

      // 4. Everything matches! Pass control to the quiz controller
      return next();

    } catch (error) {
      console.error('❌ Token Verification Failed:', error.message);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  // If no token was provided at all
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no security token provided' });
  }
};

module.exports = { protect };