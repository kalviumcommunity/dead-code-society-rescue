const router = require('express').Router();

const authMiddleware =
require('../middlewares/auth.middleware');

const userController =
require('../controllers/user.controller');

router.get(
    '/profile',
    authMiddleware,
    userController.profile
);

module.exports = router;