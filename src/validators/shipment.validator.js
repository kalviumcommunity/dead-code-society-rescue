const Joi = require('joi');

const createShipmentSchema = Joi.object({
  destination: Joi.string().required(),
  carrier: Joi.string().valid('FedEx', 'UPS', 'DHL', 'USPS').required(),
  weight: Joi.number().positive().required()
});

module.exports = { createShipmentSchema };
