/**
 * Factory that returns an Express middleware which validates req.body
 * against the provided Joi schema.
 *
 * - abortEarly: false  → collects ALL validation errors, not just the first
 * - stripUnknown: true → removes any fields not declared in the schema,
 *   preventing mass-assignment / privilege-escalation attacks
 *
 * @param {import('joi').Schema} schema - Joi schema to validate against
 * @returns {import('express').RequestHandler} Express middleware
 */
const validate = (schema) => (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
    });

    if (error) {
        const messages = error.details.map((d) => d.message);
        return res.status(422).json({
            error: 'ValidationError',
            details: messages,
        });
    }

    req.body = value; // replace with sanitised, stripped value
    next();
};

module.exports = validate;
