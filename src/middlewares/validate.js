/**
 * Validates req.body against a Joi schema and strips unknown fields.
 * @param {Object} schema - Joi schema used to validate the request body.
 * @returns {Function} Express middleware function.
 * @throws {void} Sends a 422 response when validation fails.
 */
function validateBody(schema) {
    return function(req, res, next) {
        const result = schema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true
        });

        if (result.error) {
            return res.status(422).json({
                errors: result.error.details.map(function(detail) {
                    return detail.message;
                })
            });
        }

        req.body = result.value;
        return next();
    };
}

module.exports = {
    validateBody: validateBody
};