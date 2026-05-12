const userService = require('../services/userService');
const auth = require('../utils/auth');
const response = require('../utils/response');

/**
 * POST /register
 * Create a new user account
 */
exports.register = async (req, res) => {
    try {
        const user = await userService.registerUser(req.body);
        response.success(res, {
            message: 'Account created!',
            user
        }, 201);
    } catch (err) {
        console.log('Error in register: ' + err);
        response.error(res, 'Cannot register');
    }
};

/**
 * POST /login
 * Authenticate user and return JWT token
 */
exports.login = async (req, res) => {
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
        console.log('Login error: ' + err);
        response.error(res, err.message);
    }
};

/**
 * GET /profile
 * Get current user's profile
 */
exports.getProfile = async (req, res) => {
    try {
        const user = await userService.getUserProfile(req.userId);
        response.success(res, user);
    } catch (err) {
        console.log('Error fetching profile: ' + err);
        response.error(res, 'Cannot fetch profile');
    }
};
