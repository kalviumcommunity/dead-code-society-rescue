const Joi = require('joi');

const SUPPORTED_CARRIERS = ['FedEx', 'UPS', 'DHL', 'USPS'];
const VALID_STATUSES = ['pending', 'in-progress', 'delivered', 'cancelled'];

const createShipmentSchema = Joi.object({
    origin: Joi.string().trim().min(2).max(200).required().messages({
        'any.required': 'Origin is required',
    }),
    destination: Joi.string().trim().min(2).max(200).required().messages({
        'any.required': 'Destination is required',
    }),
    weight: Joi.number().positive().required().messages({
        'number.positive': 'Weight must be a positive number',
        'any.required': 'Weight is required',
    }),
    carrier: Joi.string()
        .valid(...SUPPORTED_CARRIERS)
        .required()
        .messages({
            'any.only': `Carrier must be one of: ${SUPPORTED_CARRIERS.join(', ')}`,
            'any.required': 'Carrier is required',
        }),
});

const updateStatusSchema = Joi.object({
    status: Joi.string()
        .valid(...VALID_STATUSES)
        .required()
        .messages({
            'any.only': `Status must be one of: ${VALID_STATUSES.join(', ')}`,
            'any.required': 'Status is required',
        }),
});

module.exports = { createShipmentSchema, updateStatusSchema, SUPPORTED_CARRIERS, VALID_STATUSES };
