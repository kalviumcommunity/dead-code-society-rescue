const shipmentService = require('../services/shipment.service');
const mongoose = require('mongoose');

const getAll = async (req, res) => {
    try {
        const data = await shipmentService.getUserShipments(req.userId);
        res.status(200).json({ count: data.length, data });
    } catch (err) {
        res.status(500).json({ error: 'Fetch failed' });
    }
};

const getOne = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: 'Invalid ID' });
        }

        const shipment = await shipmentService.getShipmentById(req.params.id);

        if (!shipment) {
            return res.status(404).json({ error: 'Not found' });
        }

        if (
            shipment.userId.toString() !== req.userId &&
            req.userRole !== 'admin'
        ) {
            return res.status(403).json({ error: 'No access' });
        }

        res.status(200).json(shipment);

    } catch (err) {
        res.status(500).json({ error: 'Error fetching shipment' });
    }
};

const create = async (req, res) => {
    try {
        const { origin, destination, weight, carrier } = req.body;

        if (!origin || !destination || !weight || !carrier) {
            return res.status(400).json({ error: 'All fields required' });
        }

        const shipment = await shipmentService.createShipment(req.body, req.userId);

        res.status(201).json(shipment);

    } catch (err) {
        res.status(500).json({ error: 'Error saving shipment' });
    }
};

const updateStatus = async (req, res) => {
    try {
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({ error: 'Status required' });
        }

        if (status === 'delivered' && req.userRole !== 'admin') {
            return res.status(403).json({ error: 'Admins only' });
        }

        const updated = await shipmentService.updateShipmentStatus(req.params.id, status);

        if (!updated) {
            return res.status(404).json({ error: 'Not found' });
        }

        res.status(200).json(updated);

    } catch (err) {
        res.status(500).json({ error: 'Update failed' });
    }
};

const remove = async (req, res) => {
    try {
        const shipment = await shipmentService.getShipmentById(req.params.id);

        if (!shipment) {
            return res.status(404).json({ error: 'Not found' });
        }

        if (
            shipment.userId.toString() !== req.userId &&
            req.userRole !== 'admin'
        ) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        await shipmentService.deleteShipment(req.params.id);

        res.status(200).json({ message: 'Deleted successfully' });

    } catch (err) {
        res.status(500).json({ error: 'Delete error' });
    }
};

module.exports = {
    getAll,
    getOne,
    create,
    updateStatus,
    remove
};