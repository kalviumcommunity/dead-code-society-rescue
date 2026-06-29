/**
 * Middleware generator that validates the request body against a given Joi schema.
 * If validation fails, it returns a 422 error response.
 * If validation succeeds, it overwrites req.body with the sanitized and stripped value.
 * @param {import('joi').Schema} schema - The Joi schema to validate the request body against
 * @returns {function(import('express').Request, import('express').Response, import('express').NextFunction): void} Express middleware function
 */
function validate(schema) {
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
}

module.exports = validate;
