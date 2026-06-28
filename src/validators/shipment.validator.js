const Joi = require("joi");

exports.createShipmentSchema = Joi.object({

    origin: Joi.string().required(),

    destination: Joi.string().required(),

    weight: Joi.number().positive().required(),

    carrier: Joi.string().required()

});

exports.updateShipmentSchema = Joi.object({

    status: Joi.string()
        .valid(
            "pending",
            "in_transit",
            "delivered"
        )
        .required()

});