const authService = require('./authService');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// 1. Mock the entire Mongoose User model and jsonwebtoken
jest.mock('../models/User');
jest.mock('jsonwebtoken');

describe('AuthService Unit Tests', () => {
  
  beforeEach(() => {
    jest.clearAllMocks(); // Clear call histories between tests
  });

  // ==========================================
  // REGISTRATION TESTS
  // ==========================================
  describe('registerUser', () => {
    it('should successfully register a new user and return user data with a token', async () => {
      const mockUserData = {
        username: 'Assma',
        email: 'assma@example.com',
        password: 'securepassword123',
        role: 'student'
      };

      const mockSavedUser = {
        _id: 'mockUserId123',
        username: 'Assma',
        email: 'assma@example.com',
        role: 'student'
      };

      // Simulate: User does NOT exist in DB yet
      User.findOne.mockResolvedValue(null);
      // Simulate: User is successfully created and returned
      User.create.mockResolvedValue(mockSavedUser);
      // Simulate: JWT signs and returns a fake token string
      jwt.sign.mockReturnValue('fake-jwt-token');

      const result = await authService.registerUser(mockUserData);

      expect(User.findOne).toHaveBeenCalledWith({ email: 'assma@example.com' });
      expect(User.create).toHaveBeenCalledWith(mockUserData);
      expect(result).toHaveProperty('token', 'fake-jwt-token');
      expect(result.username).toBe('Assma');
    });

    it('should throw a 400 error if the user email already exists', async () => {
      const mockUserData = { username: 'Assma', email: 'duplicate@example.com', password: '123' };
      
      // Simulate: User IS found in the database
      User.findOne.mockResolvedValue({ email: 'duplicate@example.com' });

      await expect(authService.registerUser(mockUserData)).rejects.toThrow(
        'User already exists with this email'
      );
      
      // Verify our service snapped the pipeline shut and didn't call User.create
      expect(User.create).not.toHaveBeenCalled();
    });
  });

  // ==========================================
  //  LOGIN TESTS
  // ==========================================
  describe('loginUser', () => {
    it('should successfully authenticate user with valid credentials', async () => {
      const mockUserInstance = {
        _id: 'mockUserId123',
        username: 'Assma',
        email: 'assma@example.com',
        role: 'student',
        matchPasswords: jest.fn().mockResolvedValue(true) // Simulates password match passing
      };

      //  Clean chain mock: findOne returns an object with select, select resolves to our user
      User.findOne.mockImplementation(() => ({
        select: jest.fn().mockResolvedValue(mockUserInstance)
      }));
      
      jwt.sign.mockReturnValue('fake-jwt-token');

      const result = await authService.loginUser('assma@example.com', 'securepassword123');

      expect(mockUserInstance.matchPasswords).toHaveBeenCalledWith('securepassword123');
      expect(result).toHaveProperty('token', 'fake-jwt-token');
      expect(result.username).toBe('Assma');
    });

    it('should throw a 401 error if email is not registered', async () => {
      // Simulate chain resolving to null (no user found in DB)
      User.findOne.mockImplementation(() => ({
        select: jest.fn().mockResolvedValue(null)
      }));

      await expect(authService.loginUser('wrong@example.com', '123456')).rejects.toThrow(
        'Invalid email or password'
      );
    });

    it('should throw a 401 error if the password does not match', async () => {
      const mockUserInstance = {
        email: 'assma@example.com',
        matchPasswords: jest.fn().mockResolvedValue(false) // Simulates password failure!
      };

      // Simulate chain resolving to the user document
      User.findOne.mockImplementation(() => ({
        select: jest.fn().mockResolvedValue(mockUserInstance)
      }));

      await expect(authService.loginUser('assma@example.com', 'wrongpassword')).rejects.toThrow(
        'Invalid email or password'
      );
    });
  });
});