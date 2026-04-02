/**
 * @file shipment.routes.js
 * @description Routes for shipment operations
 */

const express = require('express');
const shipmentController = require('../controllers/shipment.controller');
const auth = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { createShipmentSchema, updateShipmentSchema } = require('../validators/shipment.validator');

const router = express.Router();

/**
 * @route GET /api/shipments
 * @desc Get all shipments (populated with user data)
 * @access Protected
 */
router.get('/', auth, shipmentController.list);

/**
 * @route POST /api/shipments
 * @desc Create a new shipment
 * @access Protected
 */
router.post('/', auth, validate(createShipmentSchema), shipmentController.create);

/**
 * @route GET /api/shipments/:trackingNumber
 * @desc Get a single shipment by tracking number
 * @access Protected
 */
router.get('/:trackingNumber', auth, shipmentController.getShipment);

/**
 * @route PATCH /api/shipments/:trackingNumber
 * @desc Update shipment details/status
 * @access Protected
 */
router.patch('/:trackingNumber', auth, validate(updateShipmentSchema), shipmentController.updateStatus);

/**
 * @route DELETE /api/shipments/:trackingNumber
 * @desc Delete a shipment
 * @access Protected (Admin typically)
 */
router.delete('/:trackingNumber', auth, shipmentController.remove);

module.exports = router;
