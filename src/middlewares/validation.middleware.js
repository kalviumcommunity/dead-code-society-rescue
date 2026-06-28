/**
 * Express middleware factory that validates and sanitizes req.body against a Joi schema.
 * Unknown fields are stripped and all validation errors are collected (no early exit).
 * @param {import('joi').Schema} schema - Joi schema to validate the request body against
 * @returns {import('express').RequestHandler} Express middleware that validates req.body, replacing it with the cleaned value on success
 */
module.exports = (schema) => {
    /**
     * @param {import('express').Request} req - Express request; req.body is validated and replaced in place
     * @param {import('express').Response} res - Express response; used to send a 422 directly on validation failure
     * @param {import('express').NextFunction} next - Express next function, called only if validation passes
     * @returns {void}
     */
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true
        });

        if (error) {
            return res.status(422).json({
                success: false,
                errors: error.details.map((e) => e.message)
            });
        }

        req.body = value;

        next();
    };
};