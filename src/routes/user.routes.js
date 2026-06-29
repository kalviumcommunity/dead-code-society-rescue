// ADDED: User router defining profile retrieve endpoint.
const { Router } = require('express');
const userController = require('../controllers/user.controller');
const auth = require('../middlewares/auth.middleware');

const router = Router();

router.get('/profile', auth, userController.getProfile);

module.exports = router;
