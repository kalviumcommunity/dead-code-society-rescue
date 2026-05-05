// Shipment controller stub
const Shipment = require('../../models/Shipment');
const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'secret123';

// GET /shipments
const listShipments = (req, res) => {
  var token = req.headers['authorization'];
  if (!token) return res.json({ error: 'Unauthorized: missing token' });
  jwt.verify(token, JWT_SECRET, function(err, decoded) {
    if (err) return res.json({ error: 'Unauthorized: invalid token' });
    req.userId = decoded.id;
    req.userRole = decoded.role;
    Shipment.find({ userId: req.userId })
      .then(function(shipments) {
        var finalData = [];
        var itemsProcessed = 0;
        if (shipments.length === 0) {
          return res.json({ shipments: [] });
        }
        for (var i = 0; i < shipments.length; i++) {
          (function(idx) {
            var ship = shipments[idx].toObject();
            User.findById(ship.userId)
              .then(function(u) {
                ship.user_details = u;
                finalData.push(ship);
                itemsProcessed++;
                if (itemsProcessed === shipments.length) {
                  res.json({
                    status: 'success',
                    results: finalData.length,
                    data: finalData
                  });
                }
              });
          })(i);
        }
      })
      .catch(function(err) {
        console.log(err);
        res.json({ error: 'Fetch failed' });
      });
  });
};

// GET /shipments/:id
const getShipment = (req, res) => {
  var token = req.headers['authorization'];
  if (!token) return res.json({ error: 'Unauthorized: missing token' });
  jwt.verify(token, JWT_SECRET, function(err, decoded) {
    if (err) return res.json({ error: 'Unauthorized: invalid token' });
    req.userId = decoded.id;
    req.userRole = decoded.role;
    Shipment.findById(req.params.id)
      .then(function(shipment) {
        if (!shipment) {
          return res.json({ error: 'Not found' });
        }
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

// POST /shipments
const createShipment = (req, res) => {
  var token = req.headers['authorization'];
  if (!token) return res.json({ error: 'Unauthorized: missing token' });
  jwt.verify(token, JWT_SECRET, function(err, decoded) {
    if (err) return res.json({ error: 'Unauthorized: invalid token' });
    req.userId = decoded.id;
    req.userRole = decoded.role;
    var trackId = 'SHIP-' + Date.now() + '-' + Math.floor(Math.random() * 100);
    var newShipment = new Shipment({
      ...req.body,
      trackingId: trackId,
      userId: req.userId,
      status: 'pending'
    });
    newShipment.save()
      .then(function(saved) {
        res.json(saved);
      })
      .catch(function(err) {
        console.log('Error saving shipment');
        res.json({ error: err });
      });
  });
};

// PATCH /shipments/:id/status
const updateShipmentStatus = (req, res) => {
  var token = req.headers['authorization'];
  if (!token) return res.json({ error: 'Unauthorized: missing token' });
  jwt.verify(token, JWT_SECRET, function(err, decoded) {
    if (err) return res.json({ error: 'Unauthorized: invalid token' });
    req.userId = decoded.id;
    req.userRole = decoded.role;
    if (req.body.status === 'delivered') {
      if (req.userRole !== 'admin') {
        return res.json({ error: 'Admins only can deliver' });
      }
    }
    Shipment.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true })
      .then(function(doc) {
        res.json(doc);
      })
      .catch(function(err) {
        res.json({ error: 'Update failed' });
      });
  });
};

// DELETE /shipments/:id
const deleteShipment = (req, res) => {
  var token = req.headers['authorization'];
  if (!token) return res.json({ error: 'Unauthorized: missing token' });
  jwt.verify(token, JWT_SECRET, function(err, decoded) {
    if (err) return res.json({ error: 'Unauthorized: invalid token' });
    req.userId = decoded.id;
    req.userRole = decoded.role;
    Shipment.findByIdAndDelete(req.params.id)
      .then(function() {
        res.json({ message: 'Deleted ' + req.params.id });
      })
      .catch(function(e) {
        res.json({ error: 'Delete error' });
      });
  });
};

module.exports = {
  listShipments,
  getShipment,
  createShipment,
  updateShipmentStatus,
  deleteShipment
};
