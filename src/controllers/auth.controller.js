const { registerUser, loginUser, getUserProfile } = require('../services/auth.service');
const { NotFoundError, UnauthorizedError } = require('../utils/errors.util');

/**
 * Register a new user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
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
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
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
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
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
