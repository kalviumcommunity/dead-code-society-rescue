const Joi = require('joi');

/**
 * Shipment creation schema
 */
exports.createShipmentSchema = Joi.object({
    origin: Joi.string().required().messages({
        'string.empty': 'Origin is required',
        'any.required': 'Origin is required'
    }),
    destination: Joi.string().required().messages({
        'string.empty': 'Destination is required',
        'any.required': 'Destination is required'
    }),
    weight: Joi.number().positive().required().messages({
        'number.positive': 'Weight must be a positive number',
        'number.base': 'Weight must be a number',
        'any.required': 'Weight is required'
    }),
    carrier: Joi.string().required().messages({
        'string.empty': 'Carrier is required',
        'any.required': 'Carrier is required'
    })
});

/**
 * Shipment status update schema
 */
exports.updateStatusSchema = Joi.object({
    status: Joi.string()
        .valid('pending', 'in-progress', 'delivered', 'cancelled')
        .required()
        .messages({
            'any.only': 'Status must be one of: pending, in-progress, delivered, cancelled',
            'string.empty': 'Status is required',
            'any.required': 'Status is required'
        })
});
