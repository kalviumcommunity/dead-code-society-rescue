/**
 * Joi Validation Schemas
 * 
 * All request body schemas for POST, PUT, PATCH endpoints.
 * Uses Joi for comprehensive input validation.
 */

const Joi = require('joi');

/**
 * SCHEMA: registerSchema
 * ROUTE: POST /api/register
 * PURPOSE: Validate user registration request
 * 
 * Fields:
 * - name: string, required, 2-50 chars (user's full name)
 * - email: string, required, valid email format (must be unique in DB)
 * - password: string, required, minimum 6 chars (will be hashed with MD5)
 * 
 * Sanitization:
 * - stripUnknown: true - removes any extra fields
 * - Prevents NoSQL injection via field whitelisting
 */
const registerSchema = Joi.object({
    name: Joi.string()
        .trim()
        .min(2)
        .max(50)
        .required()
        .messages({
            'string.empty': 'Name is required',
            'string.min': 'Name must be at least 2 characters',
            'string.max': 'Name must not exceed 50 characters'
        }),
    
    email: Joi.string()
        .trim()
        .lowercase()
        .email()
        .required()
        .messages({
            'string.empty': 'Email is required',
            'string.email': 'Email must be valid',
            'any.required': 'Email is required'
        }),
    
    password: Joi.string()
        .min(6)
        .max(100)
        .required()
        .messages({
            'string.empty': 'Password is required',
            'string.min': 'Password must be at least 6 characters',
            'string.max': 'Password must not exceed 100 characters'
        })
}).unknown(false); // Strictly disallow unknown fields

/**
 * SCHEMA: loginSchema
 * ROUTE: POST /api/login
 * PURPOSE: Validate user login request
 * 
 * Fields:
 * - email: string, required, valid email format
 * - password: string, required, non-empty
 * 
 * Sanitization:
 * - stripUnknown: true - removes any extra fields
 * - Prevents attack vectors via unexpected fields
 */
const loginSchema = Joi.object({
    email: Joi.string()
        .trim()
        .lowercase()
        .email()
        .required()
        .messages({
            'string.empty': 'Email is required',
            'string.email': 'Email must be valid',
            'any.required': 'Email is required'
        }),
    
    password: Joi.string()
        .min(1)
        .max(100)
        .required()
        .messages({
            'string.empty': 'Password is required',
            'any.required': 'Password is required'
        })
}).unknown(false);

/**
 * SCHEMA: createShipmentSchema
 * ROUTE: POST /api/shipments
 * PURPOSE: Validate shipment creation request
 * 
 * Fields:
 * - origin: string, required, 2-100 chars (pickup location)
 * - destination: string, required, 2-100 chars (delivery location)
 * - weight: number, required, positive (shipment weight in kg)
 * - carrier: string, required, 2-50 chars (shipping company name)
 * 
 * Sanitization:
 * - stripUnknown: true - removes any extra fields
 * - Prevents NoSQL injection via spread operator
 * - Validates weight is positive number
 * 
 * Note: userId and status are set by server, not from request
 */
const createShipmentSchema = Joi.object({
    origin: Joi.string()
        .trim()
        .min(2)
        .max(100)
        .required()
        .messages({
            'string.empty': 'Origin is required',
            'string.min': 'Origin must be at least 2 characters',
            'string.max': 'Origin must not exceed 100 characters'
        }),
    
    destination: Joi.string()
        .trim()
        .min(2)
        .max(100)
        .required()
        .messages({
            'string.empty': 'Destination is required',
            'string.min': 'Destination must be at least 2 characters',
            'string.max': 'Destination must not exceed 100 characters'
        }),
    
    weight: Joi.number()
        .positive()
        .max(1000000) // reasonable max weight
        .required()
        .messages({
            'number.base': 'Weight must be a number',
            'number.positive': 'Weight must be a positive number',
            'number.max': 'Weight exceeds maximum allowed (1,000,000 kg)',
            'any.required': 'Weight is required'
        }),
    
    carrier: Joi.string()
        .trim()
        .min(2)
        .max(50)
        .required()
        .messages({
            'string.empty': 'Carrier is required',
            'string.min': 'Carrier must be at least 2 characters',
            'string.max': 'Carrier must not exceed 50 characters'
        })
}).unknown(false);

/**
 * SCHEMA: updateShipmentStatusSchema
 * ROUTE: PATCH /api/shipments/:id/status
 * PURPOSE: Validate shipment status update request
 * 
 * Fields:
 * - status: string, required, enum of valid statuses
 *   Valid values: 'pending', 'in-progress', 'delivered', 'cancelled'
 * 
 * Sanitization:
 * - stripUnknown: true - removes any extra fields
 * - Validates status is only valid enum value
 * - Prevents injection of invalid statuses
 */
const updateShipmentStatusSchema = Joi.object({
    status: Joi.string()
        .valid('pending', 'in-progress', 'delivered', 'cancelled')
        .required()
        .messages({
            'any.only': 'Status must be one of: pending, in-progress, delivered, cancelled',
            'string.empty': 'Status is required',
            'any.required': 'Status is required'
        })
}).unknown(false);

module.exports = {
    registerSchema,
    loginSchema,
    createShipmentSchema,
    updateShipmentStatusSchema
};
