/**
 * Validators Module
 * 
 * Central export point for all validation functions and schemas.
 * Usage in routes:
 *   const { validate, registerSchema } = require('../validators');
 *   router.post('/register', validate(registerSchema), handler);
 */

const validate = require('./validate');
const {
    registerSchema,
    loginSchema,
    createShipmentSchema,
    updateShipmentStatusSchema
} = require('./schemas');

module.exports = {
    validate,
    registerSchema,
    loginSchema,
    createShipmentSchema,
    updateShipmentStatusSchema
};
