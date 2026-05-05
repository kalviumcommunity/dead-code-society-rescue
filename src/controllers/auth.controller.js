// Auth controller stub
const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { AppError, ConflictError, UnauthorizedError, NotFoundError } = require('../utils/errors.util');
const JWT_SECRET = process.env.JWT_SECRET || 'secret123';



/**
 * Register a new user
 * @route POST /register
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
// POST /register
const register = async (req, res, next) => {
  try {
    const userData = { ...req.body };
    // Hash password with bcrypt (12 rounds)
    userData.password = await bcrypt.hash(userData.password, 12);
    const newUser = new User(userData);
    const user = await newUser.save();
    console.log('Registered user: ' + user.email);
    res.json({
      success: true,
      message: 'Account created!',
      user: user
    });
  } catch (err) {
    if (err.code === 11000) {
      // Duplicate key error (email already exists)
      return next(new ConflictError('Email already registered'));
    }
    next(new AppError('Cannot register', 500));
  }
};


/**
 * Login a user
 * @route POST /login
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
// POST /login
const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return next(new NotFoundError('No user found with that email'));
    }
    // Compare password with bcrypt
    const isValid = await bcrypt.compare(req.body.password, user.password);
    if (isValid) {
      const token = jwt.sign(
        { id: user._id, role: user.role },
        JWT_SECRET,
        { expiresIn: '12h' }
      );
      res.json({
        msg: 'Login OK',
        token: token,
        data: {
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } else {
      return next(new UnauthorizedError('Password does not match'));
    }
  } catch (err) {
    next(new AppError('Server error', 500));
  }
};

module.exports = { register, login };
