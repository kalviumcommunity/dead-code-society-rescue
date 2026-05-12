const response = require('../utils/response');

/**
 * Validation middleware factory
 * Creates middleware that validates req.body against Joi schema
 * On success, replaces req.body with cleaned/validated data and calls next()
 * On failure, returns 422 with detailed validation errors
 * @param {Object} schema - Joi schema object for validation
 * @returns {Function} Express middleware function for route validation
 * @throws {Error} Sends 422 response with validation errors array if validation fails
 */
exports.validate = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true
        });

        if (error) {
            const errors = error.details.map(detail => detail.message);
            return response.error(res, {
                message: 'Validation failed',
                errors
            }, 422);
        }

        // Replace req.body with cleaned, validated value
        req.body = value;
        next();
    };
};
