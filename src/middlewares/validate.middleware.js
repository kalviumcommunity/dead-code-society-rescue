/**
 * Factory middleware that validates the Express request body against a Joi schema.
 * Returns a 422 error response with validation details if check fails.
 * Sanitizes and strips unknown keys from req.body on success.
 * @param {Object} schema - Joi schema object to validate.
 * @returns {Function} Express middleware function: (req, res, next) => void.
 */
const validateBody = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
        if (error) {
            const errorMessages = error.details.map(detail => detail.message);
            return res.status(422).json({ errors: errorMessages });
        }
        req.body = value;
        next();
    };
};

module.exports = {
    validateBody
};
