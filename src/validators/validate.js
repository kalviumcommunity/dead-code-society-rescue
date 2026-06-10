/**
 * Joi Validation Middleware
 * 
 * Reusable middleware factory for validating request bodies.
 * Returns 422 (Unprocessable Entity) for validation errors.
 * Sanitizes request body using stripUnknown: true.
 */

const Joi = require('joi');

/**
 * Factory function to create validation middleware
 * 
 * Usage in routes:
 *   router.post('/register', validate(registerSchema), authController.register);
 * 
 * @param {Joi.Schema} schema - Joi validation schema
 * @returns {Function} Express middleware function
 */
const validate = (schema) => {
    return (req, res, next) => {
        // Validate request body against schema
        const { error, value } = schema.validate(req.body, {
            abortEarly: false,      // Get all errors, not just first
            stripUnknown: true      // Remove fields not defined in schema
        });

        // If validation fails, return 422 with all error details
        if (error) {
            const errors = error.details.map(detail => ({
                field: detail.path.join('.'),
                message: detail.message
            }));

            return res.status(422).json({
                status: 'error',
                code: 'VALIDATION_ERROR',
                message: 'Request validation failed',
                errors: errors
            });
        }

        // Validation successful - replace req.body with sanitized value
        // This ensures:
        // 1. Only whitelisted fields are present
        // 2. All fields have been trimmed/normalized
        // 3. No unexpected data can be injected
        req.body = value;

        // Proceed to next middleware/route handler
        next();
    };
};

module.exports = validate;
