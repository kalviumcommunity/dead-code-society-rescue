const shipmentService = require('../services/shipment.service');

/**
 * Fetch all shipments for the authenticated user.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const getAll = async (req, res, next) => {
    try {
        const shipments = await shipmentService.getUserShipments(req.userId);
        res.status(200).json({
            status: 'success',
            results: shipments.length,
            data: shipments
        });
    } catch (err) {
        next(err);
    }
};

/**
 * Fetch a single shipment by ID.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const getOne = async (req, res, next) => {
    try {
        const shipment = await shipmentService.getShipmentById(req.params.id);
        
        if (!shipment) {
            return res.status(404).json({ error: 'Not found' });
        }

        // permission check
        if (shipment.userId.toString() !== req.userId && req.userRole !== 'admin') {
            return res.status(403).json({ error: 'No access to this shipment' });
        }

        res.status(200).json(shipment);
    } catch (err) {
        next(err);
    }
};

/**
 * Create a new shipment.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const create = async (req, res, next) => {
    try {
        const shipment = await shipmentService.createShipment(req.body, req.userId);
        res.status(201).json(shipment);
    } catch (err) {
        next(err);
    }
};

/**
 * Update the status of a shipment.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const updateStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        
        // logic: only admins can mark as delivered
        if (status === 'delivered' && req.userRole !== 'admin') {
            return res.status(403).json({ error: 'Admins only can deliver' });
        }

        const updated = await shipmentService.updateShipmentStatus(req.params.id, status);
        if (!updated) {
            return res.status(404).json({ error: 'Shipment not found' });
        }
        
        res.status(200).json(updated);
    } catch (err) {
        next(err);
    }
};

/**
 * Delete a shipment with ownership verification.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const remove = async (req, res, next) => {
    try {
        // Fix security vulnerability: check if user owns the shipment before deleting
        const shipment = await shipmentService.getShipmentById(req.params.id);
        if (!shipment) {
            return res.status(404).json({ error: 'Shipment not found' });
        }

        if (shipment.userId.toString() !== req.userId && req.userRole !== 'admin') {
            return res.status(403).json({ error: 'Forbidden: You do not own this shipment' });
        }

        await shipmentService.deleteShipment(req.params.id);
        res.status(200).json({ message: 'Deleted ' + req.params.id });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getAll,
    getOne,
    create,
    updateStatus,
    remove
};
