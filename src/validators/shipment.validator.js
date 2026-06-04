const Joi = require('joi');

const createShipmentSchema = Joi.object({
    origin: Joi.string().trim().required().messages({
        'string.empty': 'Origin cannot be empty',
        'any.required': 'Origin is required'
    }),
    destination: Joi.string().trim().required().messages({
        'string.empty': 'Destination cannot be empty',
        'any.required': 'Destination is required'
    }),
    weight: Joi.number().positive().required().messages({
        'number.base': 'Weight must be a number',
        'number.positive': 'Weight must be greater than zero',
        'any.required': 'Weight is required'
    }),
    carrier: Joi.string().trim().required().messages({
        'string.empty': 'Carrier cannot be empty',
        'any.required': 'Carrier is required'
    })
});

const updateShipmentStatusSchema = Joi.object({
    status: Joi.string().valid('pending', 'in-progress', 'delivered', 'cancelled').required().messages({
        'any.only': 'Status must be one of: pending, in-progress, delivered, cancelled',
        'any.required': 'Status is required'
    })
});

module.exports = {
    createShipmentSchema,
    updateShipmentStatusSchema
};
