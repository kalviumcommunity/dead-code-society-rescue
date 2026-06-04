/**
 * Middleware factory that generates validation middleware for a given Joi schema.
 * Validates request body and strips unknown fields. Returns 422 if validation fails.
 *
 * @param {import('joi').Schema} schema - Joi validation schema
 * @returns {function(import('express').Request, import('express').Response, import('express').NextFunction): void} Express middleware function
 */
const validateBody = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
        if (error) {
            const errorMessages = error.details.map(detail => detail.message);
            return res.status(422).json({
                success: false,
                errors: errorMessages
            });
        }
        req.body = value;
        next();
    };
};

module.exports = validateBody;
