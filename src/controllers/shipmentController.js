const shipmentService = require('../services/shipmentService');
const response = require('../utils/response');

/**
 * POST /shipments
 * Create a new shipment for authenticated user
 * @param {Object} req - Express request object
 * @param {Object} req.body - Validated shipment data (origin, destination, weight, carrier)
 * @param {string} req.userId - Authenticated user's MongoDB ObjectId
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function for error handling
 * @returns {void} Sends 201 JSON response with created shipment or error via next()
 * @throws {Error} Passed to next() for centralized error handling
 */
exports.createShipment = async (req, res, next) => {
    try {
        const shipment = await shipmentService.createShipment(req.body, req.userId);
        response.success(res, shipment, 201);
    } catch (err) {
        next(err);
    }
};

/**
 * GET /shipments
 * Get all shipments for the authenticated user
 * @param {Object} req - Express request object
 * @param {string} req.userId - Authenticated user's MongoDB ObjectId
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function for error handling
 * @returns {void} Sends 200 JSON response with shipment array and count or error via next()
 * @throws {Error} Passed to next() for centralized error handling
 */
exports.getShipments = async (req, res, next) => {
    try {
        const shipments = await shipmentService.getUserShipments(req.userId);
        response.success(res, {
            count: shipments.length,
            shipments
        });
    } catch (err) {
        next(err);
    }
};

/**
 * GET /shipments/:id
 * Get a specific shipment by ID with permission verification
 * @param {Object} req - Express request object
 * @param {string} req.params.id - Shipment's MongoDB ObjectId
 * @param {string} req.userId - Authenticated user's MongoDB ObjectId
 * @param {string} req.userRole - Authenticated user's role
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function for error handling
 * @returns {void} Sends 200 JSON response with shipment data or error via next()
 * @throws {Error} Passed to next() for centralized error handling
 */
exports.getShipmentById = async (req, res, next) => {
    try {
        const shipment = await shipmentService.getShipmentById(req.params.id, req.userId, req.userRole);
        response.success(res, shipment);
    } catch (err) {
        next(err);
    }
};

/**
 * PATCH /shipments/:id/status
 * Update shipment status with validation
 * @param {Object} req - Express request object
 * @param {string} req.params.id - Shipment's MongoDB ObjectId
 * @param {Object} req.body - Validated body with status field
 * @param {string} req.userId - Authenticated user's MongoDB ObjectId
 * @param {string} req.userRole - Authenticated user's role
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function for error handling
 * @returns {void} Sends 200 JSON response with updated shipment or error via next()
 * @throws {Error} Passed to next() for centralized error handling
 */
exports.updateStatus = async (req, res, next) => {
    try {
        if (!req.body.status) {
            return response.error(res, 'Status is required');
        }

        const shipment = await shipmentService.updateShipmentStatus(req.params.id, req.body.status, req.userId, req.userRole);
        response.success(res, shipment);
    } catch (err) {
        next(err);
    }
};

/**
 * DELETE /shipments/:id
 * Delete a shipment with permission verification
 * @param {Object} req - Express request object
 * @param {string} req.params.id - Shipment's MongoDB ObjectId
 * @param {string} req.userId - Authenticated user's MongoDB ObjectId
 * @param {string} req.userRole - Authenticated user's role
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function for error handling
 * @returns {void} Sends 200 JSON response with success message or error via next()
 * @throws {Error} Passed to next() for centralized error handling
 */
exports.deleteShipment = async (req, res, next) => {
    try {
        await shipmentService.deleteShipment(req.params.id, req.userId, req.userRole);
        response.success(res, { message: 'Shipment deleted successfully' });
    } catch (err) {
        next(err);
    }
};
