const { Router } = require('express');
const shipmentController = require('../controllers/shipment.controller');
const authenticate = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { createShipmentSchema } = require('../validators/shipment.validator');

const router = Router();

router.use(authenticate); // Protected routes

router.get('/', shipmentController.list);
router.get('/:id', shipmentController.getOne);
router.post('/', validate(createShipmentSchema), shipmentController.create);

module.exports = router;
