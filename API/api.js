const API_BASE_URL = "http://twserver.alunos.dcc.fc.up.pt:8008";

// Função para registrar um jogador
export async function registerPlayer(nick, password) {
  const response = await fetch(`${API_BASE_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nick, password }),
  });
  return response.json(); // Retorna os dados da resposta
}

// Função para entrar em um jogo
export async function joinGame(nick, password, size, game) {
  const response = await fetch(`${API_BASE_URL}/join`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nick, password, size, game }),
  });
  return response.json();
}

// Função para sair de um jogo
export async function leaveGame(nick, password) {
  const response = await fetch(`${API_BASE_URL}/leave`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nick, password }),
  });
  return response.json();
}

// Função para notificar uma jogada
export async function notifyMove(nick, password, game, cell) {
  const response = await fetch(`${API_BASE_URL}/notify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nick, password, game, cell }),
  });
  return response.json();
}

// Função para obter atualizações do jogo
export function updateGameState(nick, game, onUpdate, onError) {
  const url = `${API_BASE_URL}/update?nick=${encodeURIComponent(nick)}&game=${encodeURIComponent(game)}`;
  const eventSource = new EventSource(url);

  eventSource.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.error) {
      onError(data.error);
      eventSource.close();
    } else {
      onUpdate(data);
    }
  };

  eventSource.onerror = () => {
    onError("Erro de conexão com o servidor.");
    eventSource.close();
  };
}

// Função para obter o ranking
export async function getRanking(game) {
  const response = await fetch(`${API_BASE_URL}/ranking`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ game }),
  });
  return response.json();
}
