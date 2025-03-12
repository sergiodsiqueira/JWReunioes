const express = require('express');
const router = express.Router();
const userRoutes = require('./userRoutes');
const authRoutes = require('./authRoutes');

// Rota base da API
router.get('/', (req, res) => {
  res.json({ message: 'API REST de Gerenciamento de Reuni�es JW' });
});

// Usar rotas de usu�rios
router.use('/users', userRoutes);

// Usar rotas de autentica��o
router.use('/auth', authRoutes);

module.exports = router;