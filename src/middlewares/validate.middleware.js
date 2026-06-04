/**
 * Generic Joi validation middleware.
 * @param {import('joi').ObjectSchema} schema - The Joi schema to validate against.
 */
const validate = (schema) => (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
        abortEarly: false, // collect all errors
        stripUnknown: true // remove fields not in schema
    });

    if (error) {
        const errorMessages = error.details.map(detail => detail.message);
        return res.status(422).json({
            error: 'Validation failed',
            details: errorMessages
        });
    }

    // Replace req.body with the sanitized value
    req.body = value;
    next();
};

module.exports = validate;
