const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const verifyToken = require('../middlewares/authMiddleware');

// Rota de login
router.post('/login', AuthController.login);

// Rota protegida - perfil do usuário
router.get('/profile', verifyToken, AuthController.getUserProfile);

module.exports = router;