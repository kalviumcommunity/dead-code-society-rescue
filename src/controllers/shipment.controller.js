const shipmentService = require('../services/shipment.service')

/**
 * Controller: Create a new shipment.
 * Handles POST /api/shipments.
 * Body is already validated by Joi middleware.
 *
 * @param {Object} req - Express request object (body contains shipment data, userId set by authMiddleware)
 * @param {Object} res - Express response object
 * @param {Function} next - Express error handler
 */
const createShipment = async (req, res, next) => {
  try {
    const shipment = await shipmentService.createShipment(req.body, req.userId)
    res.status(201).json({
      success: true,
      message: 'Shipment created successfully',
      data: shipment
    })
  } catch (err) {
    next(err)
  }
}

/**
 * Controller: Get all shipments for the authenticated user.
 * Handles GET /api/shipments.
 * Requires valid JWT token (authMiddleware already verified).
 *
 * @param {Object} req - Express request object (req.userId set by authMiddleware)
 * @param {Object} res - Express response object
 * @param {Function} next - Express error handler
 */
const getShipments = async (req, res, next) => {
  try {
    const shipments = await shipmentService.getUserShipments(req.userId)
    res.status(200).json({
      success: true,
      count: shipments.length,
      data: shipments
    })
  } catch (err) {
    next(err)
  }
}

/**
 * Controller: Get a single shipment by ID.
 * Handles GET /api/shipments/:id.
 * Requires valid JWT token (authMiddleware already verified).
 *
 * @param {Object} req - Express request object (params.id is shipment ID, userId/userRole set by authMiddleware)
 * @param {Object} res - Express response object
 * @param {Function} next - Express error handler
 */
const getShipmentById = async (req, res, next) => {
  try {
    const shipment = await shipmentService.getShipmentById(req.params.id)

    // Check permissions - user can view only own shipments unless admin
    if (shipment.userId._id.toString() !== req.userId && req.userRole !== 'admin') {
      const { ForbiddenError } = require('../utils/errors.util')
      throw new ForbiddenError('You can only view your own shipments')
    }

    res.status(200).json({
      success: true,
      data: shipment
    })
  } catch (err) {
    next(err)
  }
}

/**
 * Controller: Update shipment status.
 * Handles PATCH /api/shipments/:id/status.
 * Body is already validated by Joi middleware.
 * Only admins can set status to 'delivered'.
 *
 * @param {Object} req - Express request object (params.id, body.status, userId/userRole set by authMiddleware)
 * @param {Object} res - Express response object
 * @param {Function} next - Express error handler
 */
const updateShipmentStatus = async (req, res, next) => {
  try {
    const shipment = await shipmentService.updateShipmentStatus(
      req.params.id,
      req.body.status,
      req.userId,
      req.userRole
    )
    res.status(200).json({
      success: true,
      message: 'Shipment status updated',
      data: shipment
    })
  } catch (err) {
    next(err)
  }
}

/**
 * Controller: Delete a shipment.
 * Handles DELETE /api/shipments/:id.
 * Users can only delete their own shipments; admins can delete any.
 *
 * @param {Object} req - Express request object (params.id, userId/userRole set by authMiddleware)
 * @param {Object} res - Express response object
 * @param {Function} next - Express error handler
 */
const deleteShipment = async (req, res, next) => {
  try {
    const shipment = await shipmentService.deleteShipment(
      req.params.id,
      req.userId,
      req.userRole
    )
    res.status(200).json({
      success: true,
      message: 'Shipment deleted successfully',
      data: shipment
    })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  createShipment,
  getShipments,
  getShipmentById,
  updateShipmentStatus,
  deleteShipment
}
