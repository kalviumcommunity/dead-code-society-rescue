const response = require('../utils/response');

/**
 * Validation middleware factory
 * Usage: router.post('/route', validate(schema), controller.action)
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
