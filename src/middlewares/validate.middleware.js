/**
 * Validate and sanitize request bodies using a Joi schema.
 * @param {import('joi').Schema} schema - Joi schema to validate.
 * @returns {import('express').RequestHandler} Validation middleware.
 * @throws {Error} When validation throws unexpectedly.
 */
const validateBody = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true
        });

        if (error) {
            return res.status(422).json({
                errors: error.details.map((detail) => detail.message)
            });
        }

        req.body = value;
        return next();
    };
};

module.exports = {
    validateBody
};
