const Joi = require('joi');

const VALID_STATUSES = ['pending', 'in-progress', 'delivered', 'cancelled'];

/**
 * Joi schema for POST /shipments.
 * trackingId and userId are generated server-side and must not come from the client.
 */
const createShipmentSchema = Joi.object({
    origin: Joi.string().min(2).max(200).required(),
    destination: Joi.string().min(2).max(200).required(),
    weight: Joi.number().positive().required(),
    carrier: Joi.string().min(2).max(100).required(),
});

/**
 * Joi schema for PATCH /shipments/:id/status.
 */
const updateStatusSchema = Joi.object({
    status: Joi.string()
        .valid(...VALID_STATUSES)
        .required(),
});

module.exports = { createShipmentSchema, updateStatusSchema };
