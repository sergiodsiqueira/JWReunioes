const dotenv = require("dotenv");

dotenv.config();

module.exports = {
    secret: process.env.JWT_SECRET,
    expiresIn: '1h' // Token v�lido por 1 hora
  };