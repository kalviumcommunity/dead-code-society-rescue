const Joi = require('joi');

const objectIdParamSchema = Joi.object({
    id: Joi.string().length(24).hex().required()
});

module.exports = {
    objectIdParamSchema
};