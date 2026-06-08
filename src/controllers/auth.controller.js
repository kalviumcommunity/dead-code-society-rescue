const authService = require('../services/auth.service');
const asyncHandler = require('../middlewares/async-handler.middleware');

/**
 * Register a new user account.
 * POST /api/auth/register
 */
const register = asyncHandler(async (req, res) => {
    const result = await authService.register(req.body);
    res.status(201).json({
        success: true,
        message: 'Account created successfully',
        data: result
    });
});

/**
 * Login with email and password.
 * POST /api/auth/login
 */
const login = asyncHandler(async (req, res) => {
    const result = await authService.login(req.body.email, req.body.password);
    res.status(200).json({
        success: true,
        message: 'Login successful',
        data: result
    });
});

module.exports = {
    register,
    login
};
