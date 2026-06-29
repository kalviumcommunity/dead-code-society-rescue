const Joi = require('joi');

const createShipmentSchema = Joi.object({
    origin: Joi.string()
        .trim()
        .required()
        .messages({
            'any.required': 'Origin is required'
        }),
    destination: Joi.string()
        .trim()
        .required()
        .messages({
            'any.required': 'Destination is required'
        }),
    weight: Joi.number()
        .positive()
        .required()
        .messages({
            'number.positive': 'Weight must be a positive number',
            'any.required': 'Weight is required'
        }),
    carrier: Joi.string()
        .trim()
        .required()
        .messages({
            'any.required': 'Carrier is required'
        })
});

const updateShipmentStatusSchema = Joi.object({
    status: Joi.string()
        .valid('pending', 'in-progress', 'delivered', 'cancelled')
        .required()
        .messages({
            'any.only': 'Status must be one of pending, in-progress, delivered, cancelled',
            'any.required': 'Status is required'
        })
});

module.exports = {
    createShipmentSchema,
    updateShipmentStatusSchema
};
