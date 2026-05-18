const User = require('../models/User');
const jwt = require('jsonwebtoken');

class AuthService {
  
  // 1. Business Logic for Registration
  async registerUser(userData) {
    const { username, email, password, role } = userData;

    const userExists = await User.findOne({ email });
    if (userExists) {
      const error = new Error('User already exists with this email');
      error.statusCode = 400;
      throw error;
    }

    // Rely on your Mongoose pre-save middleware to hash the password automatically!
    const user = await User.create({
      username,
      email,
      password,
      role
    });

    return {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      token: this.generateToken(user._id, user.role)
    };
  }

  // 2. Business Logic for Login
  async loginUser(email, password) {
    // Explicitly select password since it's hidden by default in your schema
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

   
    const isMatch = await user.matchPasswords(password);
    if (!isMatch) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    return {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      token: this.generateToken(user._id, user.role)
    };
  }

  // Helper method: Kept completely private within the service layer
  generateToken(id, role) {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
      expiresIn: '30d'
    });
  }
}

module.exports = new AuthService();