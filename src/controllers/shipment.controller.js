const { getUserShipments, getShipmentById, createShipment, updateShipmentStatus, deleteShipment } = require('../services/shipment.service');
const { NotFoundError, ForbiddenError } = require('../utils/errors.util');

/**
 * Get all shipments for the current user
 * @param {Object} req - Express request object with authenticated user ID
 * @param {string} req.userId - MongoDB ObjectId of authenticated user
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void} Sends array of shipments with user details populated
 * @throws {Error} Passes errors to error handling middleware
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
 * @param {Object} req - Express request object with shipment ID and user info
 * @param {string} req.params.id - MongoDB ObjectId of shipment to retrieve
 * @param {string} req.userId - MongoDB ObjectId of authenticated user
 * @param {string} req.userRole - Role of authenticated user ('user' or 'admin')
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void} Sends shipment data on success
 * @throws {NotFoundError} If shipment not found
 * @throws {ForbiddenError} If user doesn't have access to the shipment
 * @throws {Error} Passes other errors to error handling middleware
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
 * @param {Object} req - Express request object with shipment data and user ID
 * @param {Object} req.body - Request body containing shipment data
 * @param {string} req.body.origin - Origin location
 * @param {string} req.body.destination - Destination location
 * @param {number} req.body.weight - Weight of shipment
 * @param {string} req.body.carrier - Carrier name
 * @param {string} req.userId - MongoDB ObjectId of authenticated user
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void} Sends 201 status with created shipment data
 * @throws {Error} Passes errors to error handling middleware
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
 * @param {Object} req - Express request object with shipment ID, status, and user role
 * @param {string} req.params.id - MongoDB ObjectId of shipment to update
 * @param {Object} req.body - Request body containing new status
 * @param {string} req.body.status - New status value
 * @param {string} req.userRole - Role of authenticated user ('user' or 'admin')
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void} Sends updated shipment data on success
 * @throws {ForbiddenError} If non-admin tries to mark as delivered
 * @throws {Error} Passes other errors to error handling middleware
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
 * @param {Object} req - Express request object with shipment ID
 * @param {string} req.params.id - MongoDB ObjectId of shipment to delete
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void} Sends deletion confirmation on success
 * @throws {Error} Passes errors to error handling middleware
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
