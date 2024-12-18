const express = require("express");
const router = express.Router();
const fs = require("fs-extra");
const path = require("path");
const crypto = require("crypto"); // Importando o módulo crypto
const waitingPlayers = {}; // Para armazenar jogadores à espera, organizado por tamanho do tabuleiro
const usersFilePath = path.join(__dirname, "../data/users.json"); // Caminho para o arquivo users.json

// Função para carregar os dados dos usuários
async function loadUsers() {
    try {
      return await fs.readJson(usersFilePath); // Carrega os dados do arquivo JSON
    } catch (error) {
      console.error("Erro ao carregar os usuários:", error);
      return {}; // Retorna um objeto vazio em caso de erro
    }
  }

// Função para gerar um identificador único para o jogo
function generateGameId(nick, size) {
    const value = `${nick}-${size}-${Date.now()}`; // Combina nick, size e o tempo atual
    const hash = crypto
                 .createHash('md5')
                 .update(value)
                 .digest('hex'); // Gera o hash MD5 em formato hexadecimal
    return hash; // Retorna o identificador único
  }

router.post("/", async (req, res) => {
  const { group, nick, password, size } = req.body;

  // 1. Validação básica
  if (!group || !nick || !password || !size) {
    return res.status(400).json({ error: "Faltam argumentos obrigatórios." });
  }

  if (typeof size !== "number" || size <= 0) {
    return res.status(400).json({ error: "Tamanho do tabuleiro inválido." });
  }

  // 2. Verificar autenticação
  const users = await loadUsers(); // Carrega os dados dos usuários
  const user = users[nick];

  // Verifica se o usuário existe
  if (!user) {
    return res.status(401).json({ error: "Usuário não encontrado." });
  }

  /// Criptografa a senha fornecida e compara com a senha armazenada
  const hashedPassword = crypto.createHash("md5").update(password).digest("hex");

  if (hashedPassword !== user.password) {
    return res.status(401).json({ error: "Autenticação falhou." });
  }

  // 3. Emparelhamento
  if (!waitingPlayers[size]) {
    waitingPlayers[size] = []; // Inicializa lista de espera para este tamanho de tabuleiro
  }

  const waitingList = waitingPlayers[size];
  const existingPlayer = waitingList.find((player) => player.nick !== nick);

  if (existingPlayer) {
    // Se houver um jogador à espera, cria um jogo
    const gameId = generateGameId(nick, size); // Gerar o ID do jogo usando a função
    //games[gameId] = {
      //size,
      //players: [nick, existingPlayer.nick],
      //board: initializeBoard(size), // Função para criar o tabuleiro
      //state: "in-progress",
    //};

    // Remove o jogador da lista de espera
    waitingPlayers[size] = waitingList.filter((player) => player.nick !== existingPlayer.nick);

    // Retorna os detalhes do jogo
    return res.json({ game: gameId, message: "Emparelhado com sucesso." });
  }

  // 4. Se não houver jogadores disponíveis, coloca na lista de espera
  waitingPlayers[size].push({ nick, group });
  return res.json({ message: "Aguardando emparelhamento." });
});

module.exports=router

