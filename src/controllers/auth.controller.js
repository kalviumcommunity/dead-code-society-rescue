const { registerUser, loginUser, getUserProfile } = require('../services/auth.service');

/**
 * Register a new user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const register = async (req, res) => {
    try {
        const user = await registerUser(req.body);
        console.log('Registered user: ' + user.email);
        res.status(201).json({
            success: true,
            message: 'Account created!',
            user: user
        });
    } catch (err) {
        console.log('Error in register: ' + err);
        res.status(500).json({ success: false, error: 'Cannot register' });
    }
};

/**
 * Login a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const login = async (req, res) => {
    try {
        const result = await loginUser(req.body.email, req.body.password);
        res.json(result);
    } catch (err) {
        console.log('Login crash: ' + err);
        if (err.message === 'No user found with that email') {
            res.status(404).json({ error: err.message });
        } else if (err.message === 'Password does not match') {
            res.status(401).json({ error: err.message });
        } else {
            res.status(500).json({ error: 'Server error' });
        }
    }
};

/**
 * Get current user profile
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getProfile = async (req, res) => {
    try {
        const user = await getUserProfile(req.userId);
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
};

module.exports = {
    register,
    login,
    getProfile
};
