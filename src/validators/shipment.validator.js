const Joi = require('joi');

const shipmentCreateSchema = Joi.object({
    origin: Joi.string().trim().min(2).max(120).required(),
    destination: Joi.string().trim().min(2).max(120).required(),
    weight: Joi.number().positive().required(),
    carrier: Joi.string().trim().min(2).max(120).required(),
});

const shipmentStatusSchema = Joi.object({
    status: Joi.string().valid('pending', 'in-progress', 'delivered', 'cancelled').required(),
});

module.exports = {
    shipmentCreateSchema,
    shipmentStatusSchema,
};