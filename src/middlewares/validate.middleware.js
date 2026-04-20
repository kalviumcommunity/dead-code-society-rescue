/**
 * Higher-order middleware factory that creates a Joi validation interceptor for incoming requests.
 * @param {Object} schema - Joi validation schema object
 * @returns {Function} Express middleware function
 * @throws {Error} Returns 422 Unprocessable Entity response if payload fails validation
 */
const validate = (schema) => (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true
    });

    if (error) {
        const errors = error.details.map(err => err.message);
        return res.status(422).json({ success: false, errors });
    }

    req.body = value;
    next();
};

module.exports = validate;
