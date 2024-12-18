const API_BASE_URL = "http://twserver.alunos.dcc.fc.up.pt:8008";
const group = 20;
let game = 0;
let game_board = [];

// Função genérica para fazer chamadas ao servidor
async function callServer(request_name, info) {
  try {
    const response = await fetch(`${API_BASE_URL}/${request_name}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(info),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro na chamada ao servidor:", error);
    return { error: "Erro na conexão com o servidor." };
  }
}

// Função para registrar um jogador
export async function registerPlayer(nick, password) {
  const data = await callServer("register", { nick, password });
  if (data.error) {
    console.log(data.error);
    return null;
  }
  return data;
}

// Função para entrar em um jogo
export async function joinGame(nick, password, rows, columns) {
  const data = await callServer("join", { group, nick, password, size: { rows, columns } });
  if (data.error) {
    console.log(data.error);
    return null;
  }
  game = data.game;
  return data;
}

// Função para sair de um jogo
export async function leaveGame(nick, password) {
  const data = await callServer("leave", { nick, password, game });
  if (data.error) {
    console.log(data.error);
    return null;
  }
  return data;
}

// Função para notificar uma jogada
export async function notifyMove(nick, password, row, column) {
  const data = await callServer("notify", { nick, password, game, cell: { row, column } });
  if (data.error) {
    console.log(data.error);
    return null;
  }
  return data;
}

// Função para obter atualizações do jogo (Server-Sent Events)
export function updateGameState(nick, onUpdate, onError) {
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
export async function getRanking() {
  const data = await callServer("ranking", { group });
  if (data.error) {
    console.log(data.error);
    return null;
  }
  return data.ranking;
}
