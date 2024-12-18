const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

// Importa os routers
const registerRouter = require('./routes/register');
const gameRouter = require('./routes/join');
const rankingRouter = require('./routes/ranking');

const app = express();
const PORT = 8120;

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Endpoints principais
app.use('/register', registerRouter); // Endpoint de registro
app.use('/join', gameRouter);         // Endpoint de emparelhamento
app.use('/ranking', rankingRouter);   // Endpoint de ranking

// Middleware para erros de rota não encontrada
app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
