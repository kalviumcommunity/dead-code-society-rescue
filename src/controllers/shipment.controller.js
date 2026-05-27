const { getUserShipments, getShipmentById, createShipment, updateShipmentStatus, deleteShipment } = require('../services/shipment.service');

/**
 * Get all shipments for the current user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getAllShipments = async (req, res) => {
    try {
        const shipments = await getUserShipments(req.userId);
        res.json({
            status: 'success',
            results: shipments.length,
            data: shipments
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Fetch failed' });
    }
};

/**
 * Get a single shipment by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getShipment = async (req, res) => {
    try {
        const shipment = await getShipmentById(req.params.id);
        
        // Check permissions
        if (shipment.userId.toString() !== req.userId && req.userRole !== 'admin') {
            return res.status(403).json({ error: 'No access to this shipment' });
        }
        
        res.json(shipment);
    } catch (err) {
        if (err.message === 'Not found') {
            res.status(404).json({ error: err.message });
        } else {
            res.status(500).json({ error: 'Error on findById' });
        }
    }
};

/**
 * Create a new shipment
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const create = async (req, res) => {
    try {
        const shipment = await createShipment(req.body, req.userId);
        res.status(201).json(shipment);
    } catch (err) {
        console.log('Error saving shipment');
        res.status(500).json({ error: err.message });
    }
};

/**
 * Update shipment status
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updateStatus = async (req, res) => {
    try {
        // Only admins can mark as delivered
        if (req.body.status === 'delivered') {
            if (req.userRole !== 'admin') {
                return res.status(403).json({ error: 'Admins only can deliver' });
            }
        }
        
        const shipment = await updateShipmentStatus(req.params.id, req.body.status);
        res.json(shipment);
    } catch (err) {
        res.status(500).json({ error: 'Update failed' });
    }
};

/**
 * Delete a shipment
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const remove = async (req, res) => {
    try {
        await deleteShipment(req.params.id);
        res.json({ message: 'Deleted ' + req.params.id });
    } catch (err) {
        res.status(500).json({ error: 'Delete error' });
    }
};

module.exports = {
    getAllShipments,
    getShipment,
    create,
    updateStatus,
    remove
};
