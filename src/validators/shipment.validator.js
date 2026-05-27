const Joi = require('joi');

/**
 * Schema for creating a shipment
 */
const createShipmentSchema = Joi.object({
    origin: Joi.string().required(),
    destination: Joi.string().required(),
    weight: Joi.number().required().positive(),
    carrier: Joi.string().required()
});

/**
 * Schema for updating shipment status
 */
const updateStatusSchema = Joi.object({
    status: Joi.string().valid('pending', 'in-progress', 'delivered', 'cancelled').required()
});

module.exports = {
    createShipmentSchema,
    updateStatusSchema
};
