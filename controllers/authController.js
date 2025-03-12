const UserModel = require('../models/userModel');
const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');

class AuthController {
  // Login de usuário
  static login(req, res) {
    const { email, senha } = req.body;
    
    // Validar entradas
    if (!email || !senha) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }
    
    // Verificar credenciais
    UserModel.verifyCredentials(email, senha, (err, user) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      if (!user) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }
      
      // Gerar token JWT válido por 1 hora
      const token = jwt.sign(
        { id: user.id, email: user.email }, 
        jwtConfig.secret, 
        { expiresIn: jwtConfig.expiresIn }
      );
      
      res.json({
        message: 'Login realizado com sucesso',
        token,
        user: {
          id: user.id,
          email: user.email,
          nome: user.nome
        }
      });
    });
  }
  
  // Obter informações do usuário autenticado
  static getUserProfile(req, res) {
    // req.user é preenchido pelo middleware de autenticação
    res.json({
      message: 'Perfil do usuário',
      data: req.user
    });
  }
}

module.exports = AuthController;