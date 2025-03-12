const db = require('../config/database');
const bcrypt = require('bcrypt');
const saltRounds = 10;

class UserModel {
  // Obter todos os usuários
  static findAll(callback) {
    const sql = 'SELECT id, email, nome, created_at FROM users';
    
    db.all(sql, [], (err, rows) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, rows);
    });
  }

  // Obter um usuário pelo ID
  static findById(id, callback) {
    const sql = 'SELECT id, email, nome, created_at FROM users WHERE id = ?';
    
    db.get(sql, [id], (err, row) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, row);
    });
  }

  // Encontrar usuário pelo email (incluindo a senha para autenticação)
  static findByEmail(email, callback) {
    const sql = 'SELECT * FROM users WHERE email = ?';
    
    db.get(sql, [email], (err, row) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, row);
    });
  }

  // Criar um novo usuário com senha hash
  static create(userData, callback) {
    const { email, nome, senha } = userData;
    
    // Hash da senha antes de salvar
    bcrypt.hash(senha, saltRounds, (err, hash) => {
      if (err) {
        return callback(err, null);
      }
      
      const sql = 'INSERT INTO users (email, nome, senha) VALUES (?, ?, ?)';
      
      db.run(sql, [email, nome, hash], function(err) {
        if (err) {
          return callback(err, null);
        }
        
        callback(null, {
          id: this.lastID,
          email,
          nome
        });
      });
    });
  }

  // Verificar credenciais para login
  static verifyCredentials(email, senha, callback) {
    this.findByEmail(email, (err, user) => {
      if (err) {
        return callback(err, null);
      }
      
      if (!user) {
        return callback(null, false);
      }
      
      // Verificar se a senha corresponde ao hash armazenado
      bcrypt.compare(senha, user.senha, (err, result) => {
        if (err) {
          return callback(err, null);
        }
        
        if (result) {
          // Credenciais válidas
          const userWithoutPassword = {
            id: user.id,
            email: user.email,
            nome: user.nome
          };
          callback(null, userWithoutPassword);
        } else {
          // Senha incorreta
          callback(null, false);
        }
      });
    });
  }

  // Atualizar um usuário
  static update(id, userData, callback) {
    const { email, nome, senha } = userData;
    
    // Verificar se a senha foi fornecida para atualização
    if (senha) {
      // Hash da nova senha
      bcrypt.hash(senha, saltRounds, (err, hash) => {
        if (err) {
          return callback(err, null);
        }
        
        const sql = 'UPDATE users SET email = ?, nome = ?, senha = ? WHERE id = ?';
        
        db.run(sql, [email, nome, hash, id], function(err) {
          if (err) {
            return callback(err, null);
          }
          
          callback(null, {
            changes: this.changes,
            id,
            email,
            nome
          });
        });
      });
    } else {
      // Atualizar apenas email e nome
      const sql = 'UPDATE users SET email = ?, nome = ? WHERE id = ?';
      
      db.run(sql, [email, nome, id], function(err) {
        if (err) {
          return callback(err, null);
        }
        
        callback(null, {
          changes: this.changes,
          id,
          email,
          nome
        });
      });
    }
  }

  // Remover um usuário
  static delete(id, callback) {
    const sql = 'DELETE FROM users WHERE id = ?';
    
    db.run(sql, [id], function(err) {
      if (err) {
        return callback(err, null);
      }
      
      callback(null, {
        changes: this.changes
      });
    });
  }
}

module.exports = UserModel;