const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const verifyToken = require('../middlewares/authMiddleware');

// Rotas p�blicas
router.post('/', UserController.createUser); // Registro de usu�rio

// Rotas protegidas (requerem autentica��o)
router.get('/', verifyToken, UserController.getAllUsers);
router.get('/:id', verifyToken, UserController.getUserById);
router.put('/:id', verifyToken, UserController.updateUser);
router.delete('/:id', verifyToken, UserController.deleteUser);

module.exports = router;