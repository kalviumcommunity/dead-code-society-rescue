var shipmentService = require('../services/shipment.service');
var jwt = require('jsonwebtoken');
var JWT_SECRET = process.env.JWT_SECRET || 'secret123';

var getShipments = function(req, res) {
    // --- AUTH BLOCK START ---
    // SMELL: [MEDIUM] Duplicate auth logic. Extract into a centralized middleware.
    var token = req.headers['authorization'];
    if (!token) return res.json({ error: 'Unauthorized: missing token' });
    
    jwt.verify(token, JWT_SECRET, function(err, decoded) {
        if (err) return res.json({ error: 'Unauthorized: invalid token' });
        req.userId = decoded.id;
        req.userRole = decoded.role;
        // --- AUTH BLOCK END ---

        shipmentService.getShipments(req.userId)
            .then(function(result) {
                res.json(result);
            })
            .catch(function(err) {
                console.log(err);
                res.json({ error: 'Fetch failed' });
            });
    });
};

var getShipmentById = function(req, res) {
    // --- AUTH BLOCK START ---
    // SMELL: [MEDIUM] Duplicate auth logic. Extract into a centralized middleware.
    var token = req.headers['authorization'];
    if (!token) return res.json({ error: 'Unauthorized: missing token' });
    
    jwt.verify(token, JWT_SECRET, function(err, decoded) {
        if (err) return res.json({ error: 'Unauthorized: invalid token' });
        req.userId = decoded.id;
        req.userRole = decoded.role;
        // --- AUTH BLOCK END ---

        shipmentService.getShipmentById(req.params.id)
            .then(function(shipment) {
                if (!shipment) return res.json({ error: 'Not found' });
                if (shipment.userId.toString() !== req.userId && req.userRole !== 'admin') {
                    return res.json({ error: 'No access to this shipment' });
                }
                res.json(shipment);
            })
            .catch(function(err) {
                res.json({ error: 'Error on findById' });
            });
    });
};

var createShipment = function(req, res) {
    // --- AUTH BLOCK START ---
    // SMELL: [MEDIUM] Duplicate auth logic. Extract into a centralized middleware.
    var token = req.headers['authorization'];
    if (!token) return res.json({ error: 'Unauthorized: missing token' });
    
    jwt.verify(token, JWT_SECRET, function(err, decoded) {
        if (err) return res.json({ error: 'Unauthorized: invalid token' });
        req.userId = decoded.id;
        req.userRole = decoded.role;
        // --- AUTH BLOCK END ---

        shipmentService.createShipment(req.body, req.userId)
            .then(function(saved) { res.json(saved); })
            .catch(function(err) { console.log('Error saving shipment'); res.json({ error: err }); });
    });
};

var updateStatus = function(req, res) {
    // --- AUTH BLOCK START ---
    // SMELL: [MEDIUM] Duplicate auth logic. Extract into a centralized middleware.
    var token = req.headers['authorization'];
    if (!token) return res.json({ error: 'Unauthorized: missing token' });
    
    jwt.verify(token, JWT_SECRET, function(err, decoded) {
        if (err) return res.json({ error: 'Unauthorized: invalid token' });
        req.userId = decoded.id;
        req.userRole = decoded.role;
        // --- AUTH BLOCK END ---

        // SMELL: [MEDIUM] Magic string 'delivered' used for status.
        if (req.body.status === 'delivered') {
            if (req.userRole !== 'admin') return res.json({ error: 'Admins only can deliver' });
        }

        shipmentService.updateStatus(req.params.id, req.body.status)
            .then(function(doc) { res.json(doc); })
            .catch(function(err) { res.json({ error: 'Update failed' }); });
    });
};

var deleteShipment = function(req, res) {
    // --- AUTH BLOCK START ---
    // SMELL: [MEDIUM] Duplicate auth logic. Extract into a centralized middleware.
    var token = req.headers['authorization'];
    if (!token) return res.json({ error: 'Unauthorized: missing token' });
    
    jwt.verify(token, JWT_SECRET, function(err, decoded) {
        if (err) return res.json({ error: 'Unauthorized: invalid token' });
        req.userId = decoded.id;
        req.userRole = decoded.role;
        // --- AUTH BLOCK END ---

        shipmentService.deleteShipment(req.params.id)
            .then(function() { res.json({ message: 'Deleted ' + req.params.id }); })
            .catch(function(e) { res.json({ error: 'Delete error' }); });
    });
};

module.exports = { getShipments, getShipmentById, createShipment, updateStatus, deleteShipment };
