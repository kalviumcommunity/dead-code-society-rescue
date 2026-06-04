const router = require('express').Router();

const shipmentController =
require('../controllers/shipment.controller');

const authMiddleware =
require('../middlewares/auth.middleware');

router.get(
    '/',
    authMiddleware,
    shipmentController.getAll
);

router.get(
    '/:id',
    authMiddleware,
    shipmentController.getOne
);

router.post(
    '/',
    authMiddleware,
    shipmentController.create
);

router.patch(
    '/:id/status',
    authMiddleware,
    shipmentController.updateStatus
);

router.delete(
    '/:id',
    authMiddleware,
    shipmentController.remove
);

module.exports = router;