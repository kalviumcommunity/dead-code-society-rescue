const shipmentService = require('../services/shipment.service');

/**
 * List shipments for the authenticated user.
 * @param {import('express').Request} req - Express request.
 * @param {import('express').Response} res - Express response.
 * @param {import('express').NextFunction} next - Express next handler.
 * @returns {Promise<void>} Sends a JSON response.
 * @throws {Error} Propagates unexpected service errors.
 */
const list = async (req, res, next) => {
    try {
        const result = await shipmentService.listShipments(req.userId);
        if (result.empty) {
            return res.json({ shipments: [] });
        }

        res.json({
            status: 'success',
            results: result.shipments.length,
            data: result.shipments
        });
    } catch (err) {
        next(err);
    }
};

/**
 * Get a shipment by id with access checks.
 * @param {import('express').Request} req - Express request.
 * @param {import('express').Response} res - Express response.
 * @param {import('express').NextFunction} next - Express next handler.
 * @returns {Promise<void>} Sends a JSON response.
 * @throws {Error} Propagates unexpected service errors.
 */
const getById = async (req, res, next) => {
    try {
        const shipment = await shipmentService.getShipmentById(req.params.id);
        if (!shipment) {
            return res.json({ error: 'Not found' });
        }

        if (shipment.userId.toString() !== req.userId && req.userRole !== 'admin') {
            return res.json({ error: 'No access to this shipment' });
        }

        res.json(shipment);
    } catch (err) {
        next(err);
    }
};

/**
 * Create a new shipment for the authenticated user.
 * @param {import('express').Request} req - Express request.
 * @param {import('express').Response} res - Express response.
 * @param {import('express').NextFunction} next - Express next handler.
 * @returns {Promise<void>} Sends a JSON response.
 * @throws {Error} Propagates unexpected service errors.
 */
const create = async (req, res, next) => {
    try {
        const saved = await shipmentService.createShipment(req.body, req.userId);
        res.json(saved);
    } catch (err) {
        next(err);
    }
};

/**
 * Update a shipment status.
 * @param {import('express').Request} req - Express request.
 * @param {import('express').Response} res - Express response.
 * @param {import('express').NextFunction} next - Express next handler.
 * @returns {Promise<void>} Sends a JSON response.
 * @throws {Error} Propagates unexpected service errors.
 */
const updateStatus = async (req, res, next) => {
    if (req.body.status === 'delivered') {
        if (req.userRole !== 'admin') {
            return res.json({ error: 'Admins only can deliver' });
        }
    }

    try {
        const doc = await shipmentService.updateShipmentStatus(req.params.id, req.body.status);
        res.json(doc);
    } catch (err) {
        next(err);
    }
};

/**
 * Delete a shipment by id.
 * @param {import('express').Request} req - Express request.
 * @param {import('express').Response} res - Express response.
 * @param {import('express').NextFunction} next - Express next handler.
 * @returns {Promise<void>} Sends a JSON response.
 * @throws {Error} Propagates unexpected service errors.
 */
const remove = async (req, res, next) => {
    // SMELL: [HIGH] Missing authorization checks allow any user to delete any shipment.
    try {
        await shipmentService.deleteShipment(req.params.id);
        res.json({ message: 'Deleted ' + req.params.id });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    list,
    getById,
    create,
    updateStatus,
    remove
};
