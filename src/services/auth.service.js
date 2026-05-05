const User = require('../models/User');
const { hashPassword, comparePassword } = require('../utils/hash.util');
const { signToken } = require('../utils/jwt.util');

/**
 * Registers a new user with email and password
 * @param {Object} userData - User data {email, password, name}
 * @returns {Promise<Object>} Created user document
 */
const register = async (userData) => {
  const hashedPassword = hashPassword(userData.password);
  
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
 */
const login = async (email, password) => {
  const user = await User.findOne({ email });
  
  if (!user) {
    throw new Error('No user found with that email');
  }

  const isPasswordValid = comparePassword(password, user.password);
  
  if (!isPasswordValid) {
    throw new Error('Password does not match');
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
