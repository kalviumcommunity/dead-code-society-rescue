const userService = require('../services/user.service');

/**
 * Controller action for registering a new user.
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next function
 * @returns {Promise<void>}
 */
async function register(req, res, next) {
    try {
        const user = await userService.registerUser(req.body);
        console.log('Registered user: ' + user.email);
        res.status(201).json({
            success: true,
            message: 'Account created!',
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
}

/**
 * Controller action for user login. Returns a JWT token on success.
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next function
 * @returns {Promise<void>}
 */
async function login(req, res, next) {
    try {
        const result = await userService.loginUser(req.body.email, req.body.password);
        res.json({
            msg: 'Login OK',
            token: result.token,
            data: result.user
        });
    } catch (err) {
        next(err);
    }
}

/**
 * Controller action for fetching the current user's profile.
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next function
 * @returns {Promise<void>}
 */
async function getProfile(req, res, next) {
    try {
        const user = await userService.getUserById(req.userId);
        res.json(user);
    } catch (err) {
        next(err);
    }
}

module.exports = {
    register,
    login,
    getProfile
};
