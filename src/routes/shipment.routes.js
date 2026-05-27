const express = require('express');
const router = express.Router();
const { getAllShipments, getShipment, create, updateStatus, remove } = require('../controllers/shipment.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { createShipmentSchema, updateStatusSchema } = require('../validators/shipment.validator');

// GET /shipments - list all shipments for user
router.get('/shipments', authMiddleware, getAllShipments);

// GET /shipments/:id - get one shipment
router.get('/shipments/:id', authMiddleware, getShipment);

// POST /shipments - create shipment
router.post('/shipments', authMiddleware, validate(createShipmentSchema), create);

// PATCH /shipments/:id/status - change status
router.patch('/shipments/:id/status', authMiddleware, validate(updateStatusSchema), updateStatus);

// DELETE /shipments/:id - remove shipment
router.delete('/shipments/:id', authMiddleware, remove);

module.exports = router;
