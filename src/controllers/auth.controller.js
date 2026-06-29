const authService = require('../services/auth.service');
const asyncWrapper = require('../utils/asyncWrapper');
const { UnauthorizedError } = require('../utils/errors.util');

const register = asyncWrapper(async (req, res) => {
    const user = await authService.registerUser(req.body);
    console.log('Registered user: ' + user.email);
    res.status(201).json({
        success: true,
        message: 'Account created!',
        user: user
    });
});

const login = asyncWrapper(async (req, res) => {
    const result = await authService.loginUser(req.body.email, req.body.password);
    if (result.error) {
        throw new UnauthorizedError(result.error);
    }
    res.json(result);
});

module.exports = {
    register,
    login
};
