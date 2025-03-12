const UserModel = require('../models/userModel');

class UserController {
  // Listar todos os usu�rios
  static getAllUsers(req, res) {
    UserModel.findAll((err, users) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      res.json({
        message: 'Lista de usu�rios',
        data: users
      });
    });
  }

  // Obter um usu�rio espec�fico
  static getUserById(req, res) {
    const id = req.params.id;
    
    UserModel.findById(id, (err, user) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      if (!user) {
        return res.status(404).json({ message: 'Usu�rio n�o encontrado' });
      }
      
      res.json({
        message: 'Usu�rio encontrado',
        data: user
      });
    });
  }

  // Criar um novo usu�rio
  static createUser(req, res) {
    const { email, nome, senha } = req.body;
    
    // Validar os dados
    if (!email || !nome || !senha) {
      return res.status(400).json({ error: 'Email, nome e senha s�o obrigat�rios' });
    }
    
    // Verificar se o email j� est� em uso
    UserModel.findByEmail(email, (err, existingUser) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      if (existingUser) {
        return res.status(409).json({ error: 'Email j� est� em uso' });
      }
      
      // Criar o usu�rio
      UserModel.create({ email, nome, senha }, (err, user) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        
        res.status(201).json({
          message: 'Usu�rio criado com sucesso',
          data: user
        });
      });
    });
  }

  // Atualizar um usu�rio
  static updateUser(req, res) {
    const id = req.params.id;
    const { email, nome, senha } = req.body;
    
    // Validar os dados
    if (!email || !nome) {
      return res.status(400).json({ error: 'Email e nome s�o obrigat�rios' });
    }
    
    // Verificar se o usu�rio existe
    UserModel.findById(id, (err, existingUser) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      if (!existingUser) {
        return res.status(404).json({ message: 'Usu�rio n�o encontrado' });
      }
      
      // Verificar se o novo email j� est� em uso (se for diferente do atual)
      if (email !== existingUser.email) {
        UserModel.findByEmail(email, (err, userWithEmail) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          
          if (userWithEmail && userWithEmail.id !== parseInt(id)) {
            return res.status(409).json({ error: 'Email j� est� em uso por outro usu�rio' });
          }
          
          // Email dispon�vel, prosseguir com a atualiza��o
          proceedWithUpdate();
        });
      } else {
        // Email n�o mudou, prosseguir com a atualiza��o
        proceedWithUpdate();
      }
      
      function proceedWithUpdate() {
        UserModel.update(id, { email, nome, senha }, (err, result) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          
          res.json({
            message: 'Usu�rio atualizado com sucesso',
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

  // Remover um usu�rio
  static deleteUser(req, res) {
    const id = req.params.id;
    
    UserModel.delete(id, (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      if (result.changes === 0) {
        return res.status(404).json({ message: 'Usu�rio n�o encontrado' });
      }
      
      res.json({
        message: 'Usu�rio removido com sucesso',
        changes: result.changes
      });
    });
  }
}

module.exports = UserController;