const userService = require('../services/userService');
const auth = require('../utils/auth');
const response = require('../utils/response');

/**
 * POST /register
 * Create a new user account
 */
exports.register = async (req, res, next) => {
    try {
        const user = await userService.registerUser(req.body);
        response.success(res, {
            message: 'Account created!',
            user
        }, 201);
    } catch (err) {
        next(err);
    }
};

/**
 * POST /login
 * Authenticate user and return JWT token
 */
exports.login = async (req, res, next) => {
    try {
        const user = await userService.loginUser(req.body.email, req.body.password);
        const token = auth.generateToken(user._id, user.role);

        response.success(res, {
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        next(err);
    }
};

/**
 * GET /profile
 * Get current user's profile
 */
exports.getProfile = async (req, res, next) => {
    try {
        const user = await userService.getUserProfile(req.userId);
        response.success(res, user);
    } catch (err) {
        next(err);
    }
};
