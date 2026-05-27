const { registerUser, loginUser, getUserProfile } = require('../services/auth.service');
const { NotFoundError, UnauthorizedError } = require('../utils/errors.util');

/**
 * Register a new user
 * @param {Object} req - Express request object with user data in body
 * @param {Object} req.body - Request body containing user registration data
 * @param {string} req.body.name - User's full name
 * @param {string} req.body.email - User's email address
 * @param {string} req.body.password - User's password
 * @param {string} [req.body.role] - User's role (optional)
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void} Sends 201 status with created user data on success
 * @throws {Error} Passes errors to error handling middleware
 */
const register = async (req, res, next) => {
    try {
        const user = await registerUser(req.body);
        console.log('Registered user: ' + user.email);
        res.status(201).json({
            success: true,
            message: 'Account created!',
            user: user
        });
    } catch (err) {
        next(err);
    }
};

/**
 * Login a user
 * @param {Object} req - Express request object with login credentials
 * @param {Object} req.body - Request body containing login credentials
 * @param {string} req.body.email - User's email address
 * @param {string} req.body.password - User's password
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void} Sends JWT token and user data on success
 * @throws {NotFoundError} If user not found with given email
 * @throws {UnauthorizedError} If password doesn't match
 * @throws {Error} Passes other errors to error handling middleware
 */
const login = async (req, res, next) => {
    try {
        const result = await loginUser(req.body.email, req.body.password);
        res.json(result);
    } catch (err) {
        if (err.message === 'No user found with that email') {
            next(new NotFoundError(err.message));
        } else if (err.message === 'Password does not match') {
            next(new UnauthorizedError(err.message));
        } else {
            next(err);
        }
    }
};

/**
 * Get current user profile
 * @param {Object} req - Express request object with authenticated user ID
 * @param {string} req.userId - MongoDB ObjectId of authenticated user
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void} Sends user profile data on success
 * @throws {Error} Passes errors to error handling middleware
 */
const getProfile = async (req, res, next) => {
    try {
        const user = await getUserProfile(req.userId);
        res.json(user);
    } catch (err) {
        next(err);
    }
};

module.exports = {
    register,
    login,
    getProfile
};
