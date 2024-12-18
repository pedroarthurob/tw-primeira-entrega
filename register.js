const express = require('express');
const router = express.Router();
const fs = require('fs-extra');
const path = require('path');
const crypto = require('crypto');

// Caminho do arquivo para persistência
const usersFile = path.join(__dirname, '../data/users.json');

// Garantir que o arquivo existe
fs.ensureFileSync(usersFile);

// Função para carregar usuários
const loadUsers = async () => {
  try {
    return await fs.readJson(usersFile);
  } catch {
    return {};
  }
};

// Função para salvar usuários
const saveUsers = async (users) => {
  await fs.writeJson(usersFile, users, { spaces: 2 });
};

// Endpoint de registro
router.post('/', async (req, res) => {
  const { nick, password } = req.body;

  if (!nick || !password) {
    return res.status(400).json({ error: 'Nick e senha são obrigatórios' });
  }

  const users = await loadUsers();

  if (users[nick]) {
    return res.status(400).json({ error: 'Nick já registrado' });
  }

  // Criptografar senha
  const hashedPassword = crypto.createHash('md5').update(password).digest('hex');
  users[nick] = { password: hashedPassword, victories: 0 };

  await saveUsers(users);

  res.status(200).json({ success: 'Registrado com sucesso' });
});

module.exports = router;
