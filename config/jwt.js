const dotenv = require("dotenv");

dotenv.config();

module.exports = {
    secret: process.env.JWT_SECRET,
    expiresIn: '1h' // Token válido por 1 hora
  };