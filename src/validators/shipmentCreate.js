const Joi = require('joi');

const shipmentCreateSchema = Joi.object({
    origin: Joi.string().trim().min(1).required(),
    destination: Joi.string().trim().min(1).required(),
    weight: Joi.number().positive().required(),
    carrier: Joi.string().trim().min(1).required()
});

module.exports = shipmentCreateSchema;
