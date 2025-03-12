const UserModel = require('../models/userModel');

class UserController {
  // Listar todos os usuários
  static getAllUsers(req, res) {
    UserModel.findAll((err, users) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      res.json({
        message: 'Lista de usuários',
        data: users
      });
    });
  }

  // Obter um usuário específico
  static getUserById(req, res) {
    const id = req.params.id;
    
    UserModel.findById(id, (err, user) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }
      
      res.json({
        message: 'Usuário encontrado',
        data: user
      });
    });
  }

  // Criar um novo usuário
  static createUser(req, res) {
    const { email, nome, senha } = req.body;
    
    // Validar os dados
    if (!email || !nome || !senha) {
      return res.status(400).json({ error: 'Email, nome e senha são obrigatórios' });
    }
    
    // Verificar se o email já está em uso
    UserModel.findByEmail(email, (err, existingUser) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      if (existingUser) {
        return res.status(409).json({ error: 'Email já está em uso' });
      }
      
      // Criar o usuário
      UserModel.create({ email, nome, senha }, (err, user) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        
        res.status(201).json({
          message: 'Usuário criado com sucesso',
          data: user
        });
      });
    });
  }

  // Atualizar um usuário
  static updateUser(req, res) {
    const id = req.params.id;
    const { email, nome, senha } = req.body;
    
    // Validar os dados
    if (!email || !nome) {
      return res.status(400).json({ error: 'Email e nome são obrigatórios' });
    }
    
    // Verificar se o usuário existe
    UserModel.findById(id, (err, existingUser) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      if (!existingUser) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }
      
      // Verificar se o novo email já está em uso (se for diferente do atual)
      if (email !== existingUser.email) {
        UserModel.findByEmail(email, (err, userWithEmail) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          
          if (userWithEmail && userWithEmail.id !== parseInt(id)) {
            return res.status(409).json({ error: 'Email já está em uso por outro usuário' });
          }
          
          // Email disponível, prosseguir com a atualização
          proceedWithUpdate();
        });
      } else {
        // Email não mudou, prosseguir com a atualização
        proceedWithUpdate();
      }
      
      function proceedWithUpdate() {
        UserModel.update(id, { email, nome, senha }, (err, result) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          
          res.json({
            message: 'Usuário atualizado com sucesso',
            data: {
              id,
              email,
              nome
            }
          });
        });
      }
    });
  }

  // Remover um usuário
  static deleteUser(req, res) {
    const id = req.params.id;
    
    UserModel.delete(id, (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      if (result.changes === 0) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }
      
      res.json({
        message: 'Usuário removido com sucesso',
        changes: result.changes
      });
    });
  }
}

module.exports = UserController;