const Joi = require('joi');

const shipmentStatusSchema = Joi.object({
    status: Joi.string().valid('pending', 'in-progress', 'delivered', 'cancelled').required()
});

module.exports = shipmentStatusSchema;
