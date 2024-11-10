document.addEventListener('DOMContentLoaded', () => {
  // Referencia o elemento do tabuleiro
  const tabuleiroElement = document.getElementById('tabuleiro');

  document.getElementById('iniciarJogo').addEventListener('click', () => {
    // Obtém o tamanho do tabuleiro do elemento selecionado
    const tamanhoTabuleiro = parseInt(document.getElementById('tamanhoTabuleiro').value);

    // Inicializa o estado do jogo
    const gameState = new GameState(tamanhoTabuleiro);

    // Inicializa o jogo da trilha com o tabuleiro, o estado do jogo, e possíveis configurações adicionais
    const jogoTrilha = new JogoTrilha(tabuleiroElement, gameState, {}); // {} pode ser substituído por configurações se necessário

    // Inicia o jogo
    jogoTrilha.iniciarJogo();
  });

  document.getElementById('verClassificacoes').addEventListener('click', () => {
    alert("Classificações: Em breve...");
  });

  document.getElementById('verInstrucoes').addEventListener('click', () => {
    alert("Regras do jogo Trilha:\n\n1. Cada jogador tem 9 peças.\n2. O objetivo é formar trilhas (linhas de 3 peças).\n3. Você pode remover uma peça do adversário quando formar uma trilha.\n4. O jogo termina quando um jogador tiver menos de 3 peças ou não puder se mover.");
  });
});
