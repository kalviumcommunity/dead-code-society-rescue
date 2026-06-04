const Joi = require('joi');

const registerSchema = Joi.object({
    name: Joi.string().trim().min(1).required(),
    email: Joi.string().trim().email().required(),
    password: Joi.string().min(8).required()
});

module.exports = registerSchema;
