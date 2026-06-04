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