const Joi = require('joi');

const createShipmentSchema = Joi.object({
    origin: Joi.string().required().messages({
        'any.required': 'Origin is required',
        'string.empty': 'Origin cannot be empty'
    }),
    destination: Joi.string().required().messages({
        'any.required': 'Destination is required',
        'string.empty': 'Destination cannot be empty'
    }),
    weight: Joi.number().positive().required().messages({
        'any.required': 'Weight is required',
        'number.positive': 'Weight must be a positive number'
    }),
    carrier: Joi.string().required().messages({
        'any.required': 'Carrier is required',
        'string.empty': 'Carrier cannot be empty'
    }),
    status: Joi.string().valid('pending', 'in-progress', 'delivered', 'cancelled').default('pending').messages({
        'any.only': 'Invalid status'
    })
});

const updateStatusSchema = Joi.object({
    status: Joi.string().valid('pending', 'in-progress', 'delivered', 'cancelled').required().messages({
        'any.required': 'Status is required',
        'any.only': 'Status must be pending, in-progress, delivered, or cancelled'
    })
});

module.exports = {
    createShipmentSchema,
    updateStatusSchema
};
