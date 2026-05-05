const authService = require('../services/auth.service');

/**
 * Handles user registration
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
const register = async (req, res) => {
  try {
    const result = await authService.register(req.body);
    res.status(201).json(result);
  } catch (err) {
    console.log('Error in register: ' + err);
    res.status(400).json({ 
      success: false, 
      error: 'Cannot register' 
    });
  }
};

/**
 * Handles user login
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
const login = async (req, res) => {
  try {
    const result = await authService.login(req.body.email, req.body.password);
    res.status(200).json(result);
  } catch (err) {
    console.log('Login error: ' + err);
    res.status(401).json({ 
      success: false,
      error: err.message || 'Login failed' 
    });
  }
};

module.exports = {
  register,
  login
};
