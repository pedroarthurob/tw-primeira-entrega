const express = require('express');
const router = express.Router();
const fs = require('fs-extra');
const path = require('path');

// Caminho do arquivo para persistência
const usersFile = path.join(__dirname, '../data/users.json');

// Função para carregar usuários
const loadUsers = async () => {
  try {
    return await fs.readJson(usersFile);
  } catch {
    return {};
  }
};

// Endpoint de ranking
router.post('/', async (req, res) => {
  const { group, size } = req.body;

  // Validação dos parâmetros
  if (!group || !size) {
    return res.status(400).json({ error: 'Os parâmetros group e size são obrigatórios.' });
  }

  if (typeof group !== 'number' || group <= 0) {
    return res.status(400).json({ error: 'O parâmetro group deve ser um número válido.' });
  }

  if (typeof size !== 'number' || size <= 0) {
    return res.status(400).json({ error: 'O parâmetro size deve ser um número válido.' });
  }

  const users = await loadUsers();

  // Filtra jogadores que pertencem ao mesmo group e size
  const ranking = Object.entries(users)
    .filter(([_, data]) => data.group === group && data.sizes?.[size])
    .map(([nick, data]) => ({
      nick,
      victories: data.sizes[size] // Pega vitórias específicas para o size
    }))
    .sort((a, b) => b.victories - a.victories) // Ordena por vitórias (decrescente)
    .slice(0, 10); // Limita a 10 jogadores

  res.status(200).json({ ranking });
});

module.exports = router;

