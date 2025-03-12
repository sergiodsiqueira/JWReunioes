const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');
const UserModel = require('../models/userModel');

const verifyToken = (req, res, next) => {
  // Obter o token do cabe�alho Authorization
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ error: 'Token n�o fornecido' });
  }
  
  // Formato esperado: "Bearer TOKEN"
  const parts = authHeader.split(' ');
  
  if (parts.length !== 2) {
    return res.status(401).json({ error: 'Erro no formato do token' });
  }
  
  const [scheme, token] = parts;
  
  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).json({ error: 'Token mal formatado' });
  }
  
  // Verificar a validade do token
  jwt.verify(token, jwtConfig.secret, (err, decoded) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token expirado' });
      }
      
      return res.status(401).json({ error: 'Token inv�lido' });
    }
    
    // Verificar se o usu�rio ainda existe
    UserModel.findById(decoded.id, (err, user) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      if (!user) {
        return res.status(401).json({ error: 'Usu�rio n�o encontrado' });
      }
      
      // Guardar informa��es do usu�rio para uso nas rotas protegidas
      req.user = user;
      return next();
    });
  });
};

module.exports = verifyToken;