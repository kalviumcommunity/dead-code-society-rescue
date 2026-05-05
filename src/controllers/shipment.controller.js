const shipmentService = require('../services/shipment.service');

/**
 * Lists all shipments for the authenticated user
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
const listShipments = async (req, res) => {
  try {
    const shipments = await shipmentService.listShipments(req.userId);
    res.status(200).json({
      status: 'success',
      results: shipments.length,
      data: shipments
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ 
      success: false,
      error: 'Fetch failed' 
    });
  }
};

/**
 * Gets a single shipment by ID
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
const getShipment = async (req, res) => {
  try {
    const shipment = await shipmentService.getShipment(
      req.params.id,
      req.userId,
      req.userRole
    );
    res.status(200).json(shipment);
  } catch (err) {
    console.log(err);
    res.status(err.message.includes('No access') ? 403 : 404).json({ 
      success: false,
      error: err.message 
    });
  }
};

/**
 * Creates a new shipment
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
const createShipment = async (req, res) => {
  try {
    const shipment = await shipmentService.createShipment(req.body, req.userId);
    res.status(201).json(shipment);
  } catch (err) {
    console.log('Error saving shipment: ' + err);
    res.status(400).json({ 
      success: false,
      error: 'Cannot create shipment' 
    });
  }
};

/**
 * Updates shipment status
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
const updateStatus = async (req, res) => {
  try {
    const shipment = await shipmentService.updateShipmentStatus(
      req.params.id,
      req.body.status,
      req.userRole
    );
    res.status(200).json(shipment);
  } catch (err) {
    console.log(err);
    res.status(err.message.includes('Admins only') ? 403 : 400).json({ 
      success: false,
      error: err.message 
    });
  }
};

/**
 * Deletes a shipment
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
const deleteShipment = async (req, res) => {
  try {
    await shipmentService.deleteShipment(
      req.params.id,
      req.userId,
      req.userRole
    );
    res.status(200).json({ 
      success: true,
      message: 'Deleted ' + req.params.id 
    });
  } catch (err) {
    console.log(err);
    res.status(err.message.includes('No permission') ? 403 : 404).json({ 
      success: false,
      error: err.message 
    });
  }
};

module.exports = {
  listShipments,
  getShipment,
  createShipment,
  updateStatus,
  deleteShipment
};
