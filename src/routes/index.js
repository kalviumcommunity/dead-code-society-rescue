var express = require('express');
var router = express.Router();

var authController = require('../controllers/authController');
var shipmentController = require('../controllers/shipmentController');
var systemController = require('../controllers/systemController');
var userController = require('../controllers/userController');

var auth = require('../middlewares/auth');
var validate = require('../middlewares/validate');

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
