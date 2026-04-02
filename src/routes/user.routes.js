/**
 * @file user.routes.js
 * @description Routes for user profile operations
 */

const express = require('express');
const userController = require('../controllers/user.controller');
const auth = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { updateProfileSchema } = require('../validators/user.validator');

const router = express.Router();

// Apply auth middleware to all routes below
router.use(auth);

/**
 * @route GET /api/users/profile
 * @desc Get current user profile
 * @access Protected
 */
router.get('/profile', userController.getProfile);

/**
 * @route PATCH /api/users/profile
 * @desc Update current user profile
 * @access Protected
 */
router.patch('/profile', validate(updateProfileSchema), userController.updateProfile);

module.exports = router;
