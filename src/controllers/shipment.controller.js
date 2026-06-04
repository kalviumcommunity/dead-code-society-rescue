const shipmentService = require('../services/shipment.service');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'secret123';

const getShipments = async (req, res) => {
    // --- AUTH BLOCK START ---
    // SMELL: [MEDIUM] Duplicate auth logic. Extract into a centralized middleware.
    const token = req.headers['authorization'];
    if (!token) return res.json({ error: 'Unauthorized: missing token' });
    
    jwt.verify(token, JWT_SECRET, async (err, decoded) => {
        if (err) return res.json({ error: 'Unauthorized: invalid token' });
        req.userId = decoded.id;
        req.userRole = decoded.role;
        // --- AUTH BLOCK END ---

        try {
            const result = await shipmentService.getShipments(req.userId);
            res.json(result);
        } catch (err) {
            console.log(err);
            res.json({ error: 'Fetch failed' });
        }
    });
};

const getShipmentById = async (req, res) => {
    // --- AUTH BLOCK START ---
    // SMELL: [MEDIUM] Duplicate auth logic. Extract into a centralized middleware.
    const token = req.headers['authorization'];
    if (!token) return res.json({ error: 'Unauthorized: missing token' });
    
    jwt.verify(token, JWT_SECRET, async (err, decoded) => {
        if (err) return res.json({ error: 'Unauthorized: invalid token' });
        req.userId = decoded.id;
        req.userRole = decoded.role;
        // --- AUTH BLOCK END ---

        try {
            const shipment = await shipmentService.getShipmentById(req.params.id);
            if (!shipment) return res.json({ error: 'Not found' });
            if (shipment.userId.toString() !== req.userId && req.userRole !== 'admin') {
                return res.json({ error: 'No access to this shipment' });
            }
            res.json(shipment);
        } catch (err) {
            res.json({ error: 'Error on findById' });
        }
    });
};

const createShipment = async (req, res) => {
    // --- AUTH BLOCK START ---
    // SMELL: [MEDIUM] Duplicate auth logic. Extract into a centralized middleware.
    const token = req.headers['authorization'];
    if (!token) return res.json({ error: 'Unauthorized: missing token' });
    
    jwt.verify(token, JWT_SECRET, async (err, decoded) => {
        if (err) return res.json({ error: 'Unauthorized: invalid token' });
        req.userId = decoded.id;
        req.userRole = decoded.role;
        // --- AUTH BLOCK END ---

        try {
            const saved = await shipmentService.createShipment(req.body, req.userId);
            res.json(saved);
        } catch (err) {
            console.log('Error saving shipment');
            res.json({ error: err });
        }
    });
};

const updateStatus = async (req, res) => {
    // --- AUTH BLOCK START ---
    // SMELL: [MEDIUM] Duplicate auth logic. Extract into a centralized middleware.
    const token = req.headers['authorization'];
    if (!token) return res.json({ error: 'Unauthorized: missing token' });
    
    jwt.verify(token, JWT_SECRET, async (err, decoded) => {
        if (err) return res.json({ error: 'Unauthorized: invalid token' });
        req.userId = decoded.id;
        req.userRole = decoded.role;
        // --- AUTH BLOCK END ---

        // SMELL: [MEDIUM] Magic string 'delivered' used for status.
        if (req.body.status === 'delivered') {
            if (req.userRole !== 'admin') return res.json({ error: 'Admins only can deliver' });
        }

        try {
            const doc = await shipmentService.updateStatus(req.params.id, req.body.status);
            res.json(doc);
        } catch (err) {
            res.json({ error: 'Update failed' });
        }
    });
};

const deleteShipment = async (req, res) => {
    // --- AUTH BLOCK START ---
    // SMELL: [MEDIUM] Duplicate auth logic. Extract into a centralized middleware.
    const token = req.headers['authorization'];
    if (!token) return res.json({ error: 'Unauthorized: missing token' });
    
    jwt.verify(token, JWT_SECRET, async (err, decoded) => {
        if (err) return res.json({ error: 'Unauthorized: invalid token' });
        req.userId = decoded.id;
        req.userRole = decoded.role;
        // --- AUTH BLOCK END ---

        try {
            await shipmentService.deleteShipment(req.params.id);
            res.json({ message: 'Deleted ' + req.params.id });
        } catch (e) {
            res.json({ error: 'Delete error' });
        }
    });
};

module.exports = { getShipments, getShipmentById, createShipment, updateStatus, deleteShipment };
