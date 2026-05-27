const Joi = require('joi');

/**
 * Validation middleware factory
 * @param {Object} schema - Joi validation schema
 * @returns {Function} Express middleware function
 */
const validate = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, { 
            abortEarly: false, 
            stripUnknown: true 
        });
        
        if (error) {
            const errors = error.details.map(detail => detail.message);
            return res.status(422).json({ 
                success: false, 
                errors 
            });
        }
        
        req.body = value;
        next();
    };
};

module.exports = validate;
