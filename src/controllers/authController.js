const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/appError');
const asyncHandler = require('../utils/asyncHandler');

const JWT_SECRET = process.env.JWT_SECRET;
const BCRYPT_SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || '12', 10);

/**
 * Register a new user.
 */
const register = asyncHandler(async (req, res) => {
  if (!JWT_SECRET) {
    throw new AppError('JWT secret not configured', 500);
  }

  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError('Email already registered', 409);
  }

  const passwordHash = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);

  const user = await User.create({
    name,
    email,
    password: passwordHash,
  });

  return res.status(201).json({
    success: true,
    message: 'Account created',
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

/**
 * Login and issue a JWT.
 */
const login = asyncHandler(async (req, res) => {
  if (!JWT_SECRET) {
    throw new AppError('JWT secret not configured', 500);
  }

  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    throw new AppError('Invalid email or password', 401);
  }

  const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
    expiresIn: '12h',
  });

  return res.json({
    msg: 'Login OK',
    token,
    data: {
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

module.exports = {
  register,
  login,
};
