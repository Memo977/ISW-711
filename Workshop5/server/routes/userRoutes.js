const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Rutas públicas
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);

// Rutas protegidas
router.get('/profile', authMiddleware, userController.getUserProfile);

module.exports = router;