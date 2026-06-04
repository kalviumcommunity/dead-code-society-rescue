const bcrypt = require("bcrypt");
const {
  generateToken,
} = require("../utils/jwt.util");

const User = require("../../models/User");

const {
  ConflictError,
  UnauthorizedError,
} = require("../utils/errors.util");

/**
 * Register new user
 * @param {Object} userData
 * @returns {Promise<Object>}
 */
const register = async (userData) => {
  const existingUser = await User.findOne({
    email: userData.email,
  });

  if (existingUser) {
    throw new ConflictError(
      "Email already registered"
    );
  }

  const hashedPassword = await bcrypt.hash(
    userData.password,
    12
  );

  const user = await User.create({
    name: userData.name,
    email: userData.email,
    password: hashedPassword,
  });

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
};

/**
 * Login user
 * @param {Object} credentials
 * @returns {Promise<Object>}
 */
const login = async (credentials) => {
  const user = await User.findOne({
    email: credentials.email,
  });

  if (!user) {
    throw new UnauthorizedError(
      "Invalid credentials"
    );
  }

  const isValid = await bcrypt.compare(
    credentials.password,
    user.password
  );

  if (!isValid) {
    throw new UnauthorizedError(
      "Invalid credentials"
    );
  }

  const token =
  generateToken({
    id: user._id,
    role: user.role,
  });

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

module.exports = {
  register,
  login,
};