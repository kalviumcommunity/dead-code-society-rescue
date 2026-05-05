const User = require('../models/User');
const { hashPassword, comparePassword } = require('../utils/hash.util');
const { signToken } = require('../utils/jwt.util');
const { UnauthorizedError } = require('../utils/errors.util');

/**
 * Registers a new user with email and password
 * @param {Object} userData - User data {email, password, name}
 * @returns {Promise<Object>} Created user document
 * @throws {Error} If registration fails
 */
const register = async (userData) => {
  const hashedPassword = await hashPassword(userData.password);
  
  const newUser = new User({
    email: userData.email,
    password: hashedPassword,
    name: userData.name
  });
  
  const user = await newUser.save();
  console.log('Registered user: ' + user.email);
  
  return {
    success: true,
    message: 'Account created!',
    user: {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role
    }
  };
};

/**
 * Authenticates a user and returns JWT token
 * @param {string} email - User's email
 * @param {string} password - User's plain text password
 * @returns {Promise<Object>} Authenticated user data and JWT token
 * @throws {Error} If user not found or password is invalid
 */
const login = async (email, password) => {
  const user = await User.findOne({ email });
  
  if (!user) {
    throw new UnauthorizedError('No user found with that email');
  }

  const isPasswordValid = await comparePassword(password, user.password);
  
  if (!isPasswordValid) {
    throw new UnauthorizedError('Password does not match');
  }

  const token = signToken(
    { id: user._id, role: user.role }, 
    '12h'
  );

  return {
    msg: 'Login OK',
    token,
    data: {
      name: user.name,
      email: user.email,
      role: user.role
    }
  };
};

module.exports = {
  register,
  login
};
