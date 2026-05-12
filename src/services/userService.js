/**
 * User business logic and database operations.
 * Handles user registration, authentication, profile queries.
 */

const User = require("../models/User");
const { hashPassword, comparePassword } = require("../utils/hash");

/**
 * Register a new user.
 * Hashes password and saves to database.
 * @param {object} userData - {name, email, password}
 * @returns {Promise<object>} - Saved user document
 * @throws {Error} - If email already exists or save fails
 */
async function registerUser(userData) {
  const { name, email, password } = userData;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const error = new Error("Email already registered");
    error.statusCode = 409; // Conflict
    throw error;
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Create and save user
  const user = new User({
    name,
    email,
    password: hashedPassword,
    role: "user", // Default role
  });

  return await user.save();
}

/**
 * Authenticate user by email and password.
 * @param {string} email - User email
 * @param {string} password - Plain text password
 * @returns {Promise<object>} - User document if authenticated
 * @throws {Error} - If user not found or password incorrect
 */
async function authenticateUser(email, password) {
  const user = await User.findOne({ email });

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 401;
    throw error;
  }

  const isPasswordValid = await comparePassword(password, user.password);

  if (!isPasswordValid) {
    const error = new Error("Invalid password");
    error.statusCode = 401;
    throw error;
  }

  return user;
}

/**
 * Get user profile by ID.
 * @param {string} userId - User ID (MongoDB ObjectId)
 * @returns {Promise<object>} - User document
 * @throws {Error} - If user not found
 */
async function getUserProfile(userId) {
  const user = await User.findById(userId).select("-password"); // Exclude password

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  return user;
}

module.exports = {
  registerUser,
  authenticateUser,
  getUserProfile,
};
