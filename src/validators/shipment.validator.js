const Joi = require('joi')

exports.createShipmentSchema = Joi.object({
  item: Joi.string().required(),
  destination: Joi.string().required()
})

exports.updateStatusSchema = Joi.object({
  status: Joi.string().valid('pending', 'shipped', 'delivered').required()
})