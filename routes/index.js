const express = require('express');
const router = express.Router();
const userRoutes = require('./userRoutes');
const authRoutes = require('./authRoutes');

// Rota base da API
router.get('/', (req, res) => {
  res.json({ message: 'API REST de Gerenciamento de Reuniões JW' });
});

// Usar rotas de usuários
router.use('/users', userRoutes);

// Usar rotas de autenticação
router.use('/auth', authRoutes);

module.exports = router;