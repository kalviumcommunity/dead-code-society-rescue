const Joi = require('joi');

const createShipmentSchema = Joi.object({
    origin: Joi.string().required(),
    destination: Joi.string().required(),
    weight: Joi.number().positive().required(),
    carrier: Joi.string().required()
});

const updateShipmentStatusSchema = Joi.object({
    status: Joi.string().valid('pending', 'in-progress', 'delivered', 'cancelled').required()
});

module.exports = { createShipmentSchema, updateShipmentStatusSchema };
