const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const shipmentController = require('../controllers/shipmentController');
const systemController = require('../controllers/systemController');
const userController = require('../controllers/userController');

const auth = require('../middlewares/auth');
const validate = require('../middlewares/validate');

router.get('/', systemController.home);
router.get('/status', systemController.status);
router.get('/ping', systemController.ping);

router.post('/register', validate.validateRegister, authController.register);
router.post('/login', validate.validateLogin, authController.login);

router.get('/profile', auth, userController.profile);
router.get('/shipments', auth, shipmentController.listShipments);
router.get('/shipments/:id', auth, shipmentController.getShipment);
router.post('/shipments', auth, validate.validateShipmentCreate, shipmentController.createShipment);
router.patch('/shipments/:id/status', auth, validate.validateShipmentStatus, shipmentController.updateShipmentStatus);
router.delete('/shipments/:id', auth, shipmentController.deleteShipment);

module.exports = router;
