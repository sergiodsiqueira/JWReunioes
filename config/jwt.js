module.exports = {
    secret: process.env.JWT_SECRET || 'jehovahs_witnesses_1914',
    expiresIn: '1h' // Token v�lido por 1 hora
  };