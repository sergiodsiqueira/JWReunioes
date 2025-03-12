const UserModel = require('../models/userModel');
const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');

class AuthController {
  // Login de usu�rio
  static login(req, res) {
    const { email, senha } = req.body;
    
    // Validar entradas
    if (!email || !senha) {
      return res.status(400).json({ error: 'Email e senha s�o obrigat�rios' });
    }
    
    // Verificar credenciais
    UserModel.verifyCredentials(email, senha, (err, user) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      if (!user) {
        return res.status(401).json({ error: 'Credenciais inv�lidas' });
      }
      
      // Gerar token JWT v�lido por 1 hora
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
  
  // Obter informa��es do usu�rio autenticado
  static getUserProfile(req, res) {
    // req.user � preenchido pelo middleware de autentica��o
    res.json({
      message: 'Perfil do usu�rio',
      data: req.user
    });
  }
}

module.exports = AuthController;