const { Pool } = require('pg');
const dotenv = require("dotenv");

dotenv.config();

// Criar Pool de conex�o com o banco de dados
const pool = new Pool({
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  username: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  port: 5432,
  ssl: {
    require: true,
  },
});

// Testar conex�o ao inicializar
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados PostgreSQL:', err);
  } else {
    console.log('Conectado ao PostgreSQL hospedado na Neon em:', res.rows[0].now);

    // Criar a tabela de usu�rios se n�o existir
    pool.query(`CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      nome TEXT NOT NULL,
      senha TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
      if (err) {
        console.error('Erro ao criar tabela users:', err);
      } else {
        console.log('Tabela users verificada/criada com sucesso');
      }
    });
  }
});

// Gerenciar o encerramento da conex�o quando a aplica��o for encerrada
process.on('SIGINT', async () => {
  try {
    await pool.end();
    console.log('Conex�o com o banco de dados fechada');
    process.exit(0);
  } catch (err) {
    console.error('Erro ao fechar conex�o com o banco:', err.message);
    process.exit(1);
  }
});

// Exportar fun��es para interagir com o banco de dados
module.exports = {
  // Executar consultas parametrizadas
  query: (text, params) => pool.query(text, params),

  // Obter uma conex�o do pool
  getClient: () => pool.connect(),

  // Executar consultas em transa��es
  async transaction(callback) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  }
};