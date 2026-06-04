/**
 * Shipment Controller - Handles shipment-related HTTP requests
 */

const shipmentService = require('../services/shipment.service');
const { formatSuccessResponse } = require('../utils/response.util');

/**
 * Create a new shipment
 * POST /api/shipments
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body with origin, destination, weight, carrier
 * @param {string} req.userId - Current user ID (from auth middleware)
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void} Returns 201 with created shipment
 * @throws {ValidationError} If input validation fails
 */
const createShipment = async (req, res, next) => {
  try {
    const shipment = await shipmentService.createShipment(req.body, req.userId);
    res.status(201).json(formatSuccessResponse(shipment, 'Shipment created successfully'));
  } catch (err) {
    next(err);
  }
};

/**
 * Retrieve all shipments for authenticated user
 * GET /api/shipments
 * @param {Object} req - Express request object (must have req.userId from auth middleware)
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void} Returns 200 with array of shipments and count
 * @throws {UnauthorizedError} If token missing or invalid
 */
const getUserShipments = async (req, res, next) => {
  try {
    const shipments = await shipmentService.getUserShipments(req.userId);
    res.status(200).json(formatSuccessResponse(
      { shipments, count: shipments.length },
      'Shipments retrieved'
    ));
  } catch (err) {
    next(err);
  }
};

/**
 * Retrieve a specific shipment by ID
 * GET /api/shipments/:id
 * @param {Object} req - Express request object
 * @param {string} req.params.id - Shipment ID
 * @param {string} req.userId - Current user ID (from auth middleware)
 * @param {string} req.userRole - Current user role (from auth middleware)
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void} Returns 200 with shipment data (owner or admin only)
 * @throws {NotFoundError} If shipment not found
 * @throws {UnauthorizedError} If user lacks access permission
 */
const getShipmentById = async (req, res, next) => {
  try {
    const shipment = await shipmentService.getShipmentById(
      req.params.id,
      req.userId,
      req.userRole
    );
    res.status(200).json(formatSuccessResponse(shipment, 'Shipment retrieved'));
  } catch (err) {
    next(err);
  }
};

/**
 * Update shipment status
 * PATCH /api/shipments/:id/status
 * @param {Object} req - Express request object
 * @param {string} req.params.id - Shipment ID
 * @param {Object} req.body - Request body with new status
 * @param {string} req.userId - Current user ID (from auth middleware)
 * @param {string} req.userRole - Current user role (from auth middleware)
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void} Returns 200 with updated shipment
 * @throws {NotFoundError} If shipment not found
 * @throws {UnauthorizedError} If user lacks permission or role requirements
 * @throws {ValidationError} If status invalid
 */
const updateShipmentStatus = async (req, res, next) => {
  try {
    const shipment = await shipmentService.updateShipmentStatus(
      req.params.id,
      req.body.status,
      req.userId,
      req.userRole
    );
    res.status(200).json(formatSuccessResponse(shipment, 'Shipment status updated'));
  } catch (err) {
    next(err);
  }
};

/**
 * Delete a shipment
 * DELETE /api/shipments/:id
 * @param {Object} req - Express request object
 * @param {string} req.params.id - Shipment ID
 * @param {string} req.userId - Current user ID (from auth middleware)
 * @param {string} req.userRole - Current user role (from auth middleware)
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void} Returns 200 on successful deletion (owner or admin only)
 * @throws {NotFoundError} If shipment not found
 * @throws {UnauthorizedError} If user lacks deletion permission
 */
const deleteShipment = async (req, res, next) => {
  try {
    await shipmentService.deleteShipment(req.params.id, req.userId, req.userRole);
    res.status(200).json(formatSuccessResponse(
      null,
      'Shipment deleted successfully'
    ));
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createShipment,
  getUserShipments,
  getShipmentById,
  updateShipmentStatus,
  deleteShipment
};
