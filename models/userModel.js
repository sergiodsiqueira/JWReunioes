const db = require('../config/database');
const bcrypt = require('bcrypt');
const saltRounds = 10;

class UserModel {
  // Obter todos os usuários
  static async findAll() {
    try {
      const result = await db.query(
        'SELECT id, email, nome, created_at FROM users'
      );
      return result.rows;
    } catch (err) {
      throw err;
    }
  }

  // Obter um usuário pelo ID
  static async findById(id) {
    try {
      const result = await db.query(
        'SELECT id, email, nome, created_at FROM users WHERE id = $1',
        [id]
      );
      return result.rows[0];
    } catch (err) {
      throw err;
    }
  }

  // Encontrar usuário pelo email (incluindo a senha para autenticação)
  static async findByEmail(email) {
    try {
      const result = await db.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
      );
      return result.rows[0];
    } catch (err) {
      throw err;
    }
  }

  // Criar um novo usuário com senha hash
  static async create(userData) {
    const { email, nome, senha } = userData;
    
    try {
      // Hash da senha
      const hash = await bcrypt.hash(senha, saltRounds);
      
      const result = await db.query(
        'INSERT INTO users (email, nome, senha) VALUES ($1, $2, $3) RETURNING id, email, nome',
        [email, nome, hash]
      );
      
      return result.rows[0];
    } catch (err) {
      throw err;
    }
  }

  // Verificar credenciais para login
  static async verifyCredentials(email, senha) {
    try {
      const user = await this.findByEmail(email);
      
      if (!user) {
        return false;
      }
      
      // Verificar senha
      const match = await bcrypt.compare(senha, user.senha);
      
      if (match) {
        // Credenciais válidas - retornar usuário sem a senha
        return {
          id: user.id,
          email: user.email,
          nome: user.nome,
          created_at: user.created_at
        };
      } else {
        // Senha incorreta
        return false;
      }
    } catch (err) {
      throw err;
    }
  }

  // Atualizar um usuário
  static async update(id, userData) {
    try {
      const { email, nome, senha } = userData;
      
      // Verificar se a senha foi fornecida
      if (senha) {
        // Usar uma transação para garantir consistência
        return await db.transaction(async (client) => {
          // Hash da nova senha
          const hash = await bcrypt.hash(senha, saltRounds);
          
          const result = await client.query(
            'UPDATE users SET email = $1, nome = $2, senha = $3 WHERE id = $4 RETURNING id, email, nome',
            [email, nome, hash, id]
          );
          
          if (result.rows.length === 0) {
            return { changes: 0 };
          }
          
          return {
            ...result.rows[0],
            changes: result.rowCount
          };
        });
      } else {
        // Apenas atualizar email e nome
        const result = await db.query(
          'UPDATE users SET email = $1, nome = $2 WHERE id = $3 RETURNING id, email, nome',
          [email, nome, id]
        );
        
        if (result.rows.length === 0) {
          return { changes: 0 };
        }
        
        return {
          ...result.rows[0],
          changes: result.rowCount
        };
      }
    } catch (err) {
      throw err;
    }
  }

  // Remover um usuário
  static async delete(id) {
    try {
      const result = await db.query(
        'DELETE FROM users WHERE id = $1',
        [id]
      );
      
      return {
        changes: result.rowCount
      };
    } catch (err) {
      throw err;
    }
  }
}

module.exports = UserModel;