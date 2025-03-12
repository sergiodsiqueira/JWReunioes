module.exports = {
    secret: process.env.JWT_SECRET || 'jehovahs_witnesses_1914',
    expiresIn: '1h' // Token válido por 1 hora
  };