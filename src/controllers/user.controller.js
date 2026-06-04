/**
 * User Controller - Handles user-related HTTP requests
 */

const userService = require('../services/user.service');
const { formatSuccessResponse } = require('../utils/response.util');

/**
 * Register a new user account
 * POST /auth/register
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body containing name, email, password
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void} Returns 201 with created user on success
 * @throws {ConflictError} If email already registered
 * @throws {ValidationError} If input validation fails
 */
const register = async (req, res, next) => {
  try {
    const user = await userService.registerUser(req.body);
    res.status(201).json(formatSuccessResponse(user, 'User registered successfully'));
  } catch (err) {
    next(err);
  }
};

/**
 * Authenticate user and return JWT token
 * POST /auth/login
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body containing email, password
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void} Returns 200 with user data and JWT token on success
 * @throws {NotFoundError} If user not found
 * @throws {UnauthorizedError} If password invalid
 * @throws {ValidationError} If input validation fails
 */
const login = async (req, res, next) => {
  try {
    const { user, token } = await userService.loginUser(req.body.email, req.body.password);
    res.status(200).json(formatSuccessResponse(
      { user, token },
      'Login successful'
    ));
  } catch (err) {
    next(err);
  }
};

/**
 * Retrieve authenticated user's profile
 * GET /auth/profile
 * @param {Object} req - Express request object (must have req.userId from auth middleware)
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void} Returns 200 with user profile (no password)
 * @throws {NotFoundError} If user not found
 * @throws {UnauthorizedError} If token missing or invalid
 */
const getProfile = async (req, res, next) => {
  try {
    const user = await userService.getUserProfile(req.userId);
    res.status(200).json(formatSuccessResponse(user, 'Profile retrieved'));
  } catch (err) {
    next(err);
  }
};

module.exports = {
  register,
  login,
  getProfile
};
