const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authenticate, requireAdmin } = require('../middlewares/auth.middleware');

// All user routes require authentication
router.use(authenticate);

// GET /api/users - Admin only
router.get('/', requireAdmin, userController.getAllUsers);

// GET /api/users/:id
router.get('/:id', userController.getUser);

// PATCH /api/users/:id
router.patch('/:id', userController.updateUser);

// DELETE /api/users/:id - Admin only
router.delete('/:id', requireAdmin, userController.deleteUser);

module.exports = router;