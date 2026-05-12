const User = require("../models/User");
const { ConflictError, UnauthorizedError } = require("../utils/errors.util");
const { comparePassword, hashPassword } = require("../utils/hash.util");
const { signToken } = require("../utils/jwt.util");
const { serializeUser } = require("../utils/response.util");

/**
 * Registers a new user and returns the public user payload.
 * @param {{name: string, email: string, password: string}} input - Registration payload.
 * @returns {Promise<{user: Object}>} Created user payload.
 * @throws {ConflictError} If the email already exists.
 */
async function registerUser(input) {
  const existingUser = await User.findOne({ email: input.email });

  if (existingUser) {
    throw new ConflictError("Email already registered");
  }

  const password = await hashPassword(input.password);
  const user = await User.create({
    name: input.name,
    email: input.email,
    password,
  });

  return {
    user: serializeUser(user),
  };
}

/**
 * Authenticates a user and returns a signed JWT.
 * @param {string} email - User email address.
 * @param {string} password - Plaintext password.
 * @returns {Promise<{user: Object, token: string}>} Authenticated user and token.
 * @throws {UnauthorizedError} If the email is unknown or the password is invalid.
 */
async function loginUser(email, password) {
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new UnauthorizedError("Invalid credentials");
  }

  const isValid = await comparePassword(password, user.password);

  if (!isValid) {
    throw new UnauthorizedError("Invalid credentials");
  }

  return {
    user: serializeUser(user),
    token: signToken({ id: user._id.toString(), role: user.role }),
  };
}

module.exports = {
  registerUser,
  loginUser,
};
