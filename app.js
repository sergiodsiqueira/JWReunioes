const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const routes = require('./routes/index');

// Inicializar o app Express
const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Inicializar o banco de dados (a importação carrega o arquivo)
require('./config/database');

// Rotas
app.use('/api', routes);

module.exports = app;