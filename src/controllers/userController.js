var userService = require('../services/userService');
var auth = require('../utils/auth');
var response = require('../utils/response');

/**
 * POST /register
 * Create a new user account
 */
exports.register = function(req, res) {
    userService.registerUser(req.body, function(err, user) {
        if (err) {
            console.log('Error in register: ' + err);
            return response.error(res, 'Cannot register');
        }

        response.success(res, {
            message: 'Account created!',
            user: user
        }, 201);
    });
};

/**
 * POST /login
 * Authenticate user and return JWT token
 */
exports.login = function(req, res) {
    userService.loginUser(req.body.email, req.body.password, function(err, user) {
        if (err) {
            console.log('Login error: ' + err);
            return response.error(res, err.message);
        }

        var token = auth.generateToken(user._id, user.role);

        response.success(res, {
            message: 'Login successful',
            token: token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    });
};

/**
 * GET /profile
 * Get current user's profile
 */
exports.getProfile = function(req, res) {
    userService.getUserProfile(req.userId, function(err, user) {
        if (err) {
            console.log('Error fetching profile: ' + err);
            return response.error(res, 'Cannot fetch profile');
        }

        response.success(res, user);
    });
};
