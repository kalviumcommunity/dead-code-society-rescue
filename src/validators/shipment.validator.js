/**
 * Joi validation schemas for shipment endpoints
 * Prevents NoSQL injection, ensures valid shipment data, and provides clear error messages
 */

const Joi = require('joi');

/**
 * Schema for creating a shipment (POST /api/shipments)
 * Validates destination, carrier, weight, and origin
 */
const createShipmentSchema = Joi.object({
    origin: Joi.string()
        .trim()
        .min(3)
        .max(200)
        .required()
        .messages({
            'string.min': 'Origin must be at least 3 characters',
            'string.max': 'Origin must not exceed 200 characters',
            'any.required': 'Origin is required'
        }),

    destination: Joi.string()
        .trim()
        .min(3)
        .max(200)
        .required()
        .messages({
            'string.min': 'Destination must be at least 3 characters',
            'string.max': 'Destination must not exceed 200 characters',
            'any.required': 'Destination is required'
        }),

    weight: Joi.number()
        .positive()
        .max(10000)
        .required()
        .messages({
            'number.positive': 'Weight must be a positive number',
            'number.max': 'Weight must not exceed 10,000 kg',
            'any.required': 'Weight is required'
        }),

    carrier: Joi.string()
        .trim()
        .valid('FedEx', 'UPS', 'DHL', 'USPS', 'Local')
        .required()
        .messages({
            'any.only': 'Carrier must be one of: FedEx, UPS, DHL, USPS, Local',
            'any.required': 'Carrier is required'
        })
});

/**
 * Schema for updating shipment status (PATCH /api/shipments/:id/status)
 * Validates status transitions
 */
const updateStatusSchema = Joi.object({
    status: Joi.string()
        .trim()
        .valid('pending', 'in-progress', 'delivered', 'cancelled')
        .required()
        .messages({
            'any.only': 'Status must be one of: pending, in-progress, delivered, cancelled',
            'any.required': 'Status is required'
        })
});

module.exports = {
    createShipmentSchema,
    updateStatusSchema
};
