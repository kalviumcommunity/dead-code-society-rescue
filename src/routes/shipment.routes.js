const { Router } = require('express');
const shipmentController = require('../controllers/shipment.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = Router();

// All shipment routes require authentication
router.use(authMiddleware);

/**
 * @route   GET /api/shipments
 * @desc    List all shipments for authenticated user
 * @auth    Required
 * @returns {200} Array of shipments
 */
router.get('/', shipmentController.listShipments);

/**
 * @route   GET /api/shipments/:id
 * @desc    Get a single shipment by ID
 * @auth    Required
 * @params  {string} id - Shipment ID
 * @returns {200} Shipment document
 */
router.get('/:id', shipmentController.getShipment);

/**
 * @route   POST /api/shipments
 * @desc    Create a new shipment
 * @auth    Required
 * @body    {string} destination, {string} carrier, {number} weight, {string} origin
 * @returns {201} Created shipment
 */
router.post('/', shipmentController.createShipment);

/**
 * @route   PATCH /api/shipments/:id/status
 * @desc    Update shipment status (admins only for 'delivered')
 * @auth    Required
 * @params  {string} id - Shipment ID
 * @body    {string} status
 * @returns {200} Updated shipment
 */
router.patch('/:id/status', shipmentController.updateStatus);

/**
 * @route   DELETE /api/shipments/:id
 * @desc    Delete a shipment (owner or admin only)
 * @auth    Required
 * @params  {string} id - Shipment ID
 * @returns {200} Success message
 */
router.delete('/:id', shipmentController.deleteShipment);

module.exports = router;
