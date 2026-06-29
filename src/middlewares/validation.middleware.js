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

module.exports = {
    validateBody
};
