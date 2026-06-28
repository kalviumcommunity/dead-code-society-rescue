const authService = require("../services/auth.service");

/**
 * Register a new user.
 */
const register = async (req, res, next) => {
    try {
        const user = await authService.register(req.body);

        res.status(201).json({
            success: true,
            data: user
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Login user.
 */
const login = async (req, res, next) => {
    try {
        const result = await authService.login(
            req.body.email,
            req.body.password
        );

        res.json({
            success: true,
            token: result.token,
            user: result.user
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    register,
    login
};