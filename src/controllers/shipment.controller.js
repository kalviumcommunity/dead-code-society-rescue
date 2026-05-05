// Shipment controller stub
const Shipment = require('../../models/Shipment');
const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'secret123';

// GET /shipments
const listShipments = async (req, res) => {
  const token = req.headers['authorization'];
  if (!token) return res.json({ error: 'Unauthorized: missing token' });
  jwt.verify(token, JWT_SECRET, async (err, decoded) => {
    if (err) return res.json({ error: 'Unauthorized: invalid token' });
    req.userId = decoded.id;
    req.userRole = decoded.role;
    try {
      const shipments = await Shipment.find({ userId: req.userId });
      const finalData = [];
      if (shipments.length === 0) {
        return res.json({ shipments: [] });
      }
      for (let i = 0; i < shipments.length; i++) {
        const ship = shipments[i].toObject();
        const u = await User.findById(ship.userId);
        ship.user_details = u;
        finalData.push(ship);
      }
      res.json({
        status: 'success',
        results: finalData.length,
        data: finalData
      });
    } catch (err) {
      console.log(err);
      res.json({ error: 'Fetch failed' });
    }
  });
};

// GET /shipments/:id
const getShipment = async (req, res) => {
  const token = req.headers['authorization'];
  if (!token) return res.json({ error: 'Unauthorized: missing token' });
  jwt.verify(token, JWT_SECRET, async (err, decoded) => {
    if (err) return res.json({ error: 'Unauthorized: invalid token' });
    req.userId = decoded.id;
    req.userRole = decoded.role;
    try {
      const shipment = await Shipment.findById(req.params.id);
      if (!shipment) {
        return res.json({ error: 'Not found' });
      }
      if (shipment.userId.toString() !== req.userId && req.userRole !== 'admin') {
        return res.json({ error: 'No access to this shipment' });
      }
      res.json(shipment);
    } catch (err) {
      res.json({ error: 'Error on findById' });
    }
  });
};

// POST /shipments
const createShipment = async (req, res) => {
  const token = req.headers['authorization'];
  if (!token) return res.json({ error: 'Unauthorized: missing token' });
  jwt.verify(token, JWT_SECRET, async (err, decoded) => {
    if (err) return res.json({ error: 'Unauthorized: invalid token' });
    req.userId = decoded.id;
    req.userRole = decoded.role;
    try {
      const trackId = 'SHIP-' + Date.now() + '-' + Math.floor(Math.random() * 100);
      const newShipment = new Shipment({
        ...req.body,
        trackingId: trackId,
        userId: req.userId,
        status: 'pending'
      });
      const saved = await newShipment.save();
      res.json(saved);
    } catch (err) {
      console.log('Error saving shipment');
      res.json({ error: err });
    }
  });
};

// PATCH /shipments/:id/status
const updateShipmentStatus = async (req, res) => {
  const token = req.headers['authorization'];
  if (!token) return res.json({ error: 'Unauthorized: missing token' });
  jwt.verify(token, JWT_SECRET, async (err, decoded) => {
    if (err) return res.json({ error: 'Unauthorized: invalid token' });
    req.userId = decoded.id;
    req.userRole = decoded.role;
    if (req.body.status === 'delivered') {
      if (req.userRole !== 'admin') {
        return res.json({ error: 'Admins only can deliver' });
      }
    }
    try {
      const doc = await Shipment.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
      res.json(doc);
    } catch (err) {
      res.json({ error: 'Update failed' });
    }
  });
};

// DELETE /shipments/:id
const deleteShipment = async (req, res) => {
  const token = req.headers['authorization'];
  if (!token) return res.json({ error: 'Unauthorized: missing token' });
  jwt.verify(token, JWT_SECRET, async (err, decoded) => {
    if (err) return res.json({ error: 'Unauthorized: invalid token' });
    req.userId = decoded.id;
    req.userRole = decoded.role;
    try {
      await Shipment.findByIdAndDelete(req.params.id);
      res.json({ message: 'Deleted ' + req.params.id });
    } catch (e) {
      res.json({ error: 'Delete error' });
    }
  });
};

module.exports = {
  listShipments,
  getShipment,
  createShipment,
  updateShipmentStatus,
  deleteShipment
};
