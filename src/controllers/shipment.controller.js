const { getUserShipments, getShipmentById, createShipment, updateShipmentStatus, deleteShipment } = require('../services/shipment.service');
const { NotFoundError, ForbiddenError } = require('../utils/errors.util');

/**
 * Get all shipments for the current user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const getAllShipments = async (req, res, next) => {
    try {
        const shipments = await getUserShipments(req.userId);
        res.json({
            status: 'success',
            results: shipments.length,
            data: shipments
        });
    } catch (err) {
        next(err);
    }
};

/**
 * Get a single shipment by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const getShipment = async (req, res, next) => {
    try {
        const shipment = await getShipmentById(req.params.id);
        
        // Check permissions
        if (shipment.userId.toString() !== req.userId && req.userRole !== 'admin') {
            return next(new ForbiddenError('No access to this shipment'));
        }
        
        res.json(shipment);
    } catch (err) {
        if (err.message === 'Not found') {
            next(new NotFoundError(err.message));
        } else {
            next(err);
        }
    }
};

/**
 * Create a new shipment
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const create = async (req, res, next) => {
    try {
        const shipment = await createShipment(req.body, req.userId);
        res.status(201).json(shipment);
    } catch (err) {
        next(err);
    }
};

/**
 * Update shipment status
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const updateStatus = async (req, res, next) => {
    try {
        // Only admins can mark as delivered
        if (req.body.status === 'delivered') {
            if (req.userRole !== 'admin') {
                return next(new ForbiddenError('Admins only can deliver'));
            }
        }
        
        const shipment = await updateShipmentStatus(req.params.id, req.body.status);
        res.json(shipment);
    } catch (err) {
        next(err);
    }
};

/**
 * Delete a shipment
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const remove = async (req, res, next) => {
    try {
        await deleteShipment(req.params.id);
        res.json({ message: 'Deleted ' + req.params.id });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getAllShipments,
    getShipment,
    create,
    updateStatus,
    remove
};
