/**
 * @file user.validator.js
 * @description Joi validation schemas for user profile routes
 */

const Joi = require('joi');

const updateProfileSchema = Joi.object({
  name: Joi.string().min(2).max(100).messages({
    'string.base': 'Name must be a string',
    'string.empty': 'Name cannot be empty',
  }),
  email: Joi.string().email().messages({
    'string.email': 'Please provide a valid email address',
  }),
}).min(1); // At least one field must be provided for update

module.exports = {
  updateProfileSchema,
};
