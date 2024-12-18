document.addEventListener('DOMContentLoaded', () => {
  // Referencia o elemento do tabuleiro
  const tabuleiroElement = document.getElementById('tabuleiro');

  // document.getElementById('iniciarJogo').addEventListener('click', () => {
  //   // Obtém o tamanho do tabuleiro do elemento selecionado
  //   const tamanhoTabuleiro = parseInt(document.getElementById('tamanhoTabuleiro').value);

  //   const primeiroJogador = document.getElementById('primeiroJogador').value === "jogador" ? "Player 1" : "Player 2";

  //   // Inicializa o estado do jogo
  //   const gameState = new GameState(tamanhoTabuleiro, primeiroJogador);

  //   // Inicializa o jogo da trilha com o tabuleiro, o estado do jogo, e possíveis configurações adicionais
  //   const jogoTrilha = new JogoTrilha(tabuleiroElement, gameState, {}); // {} pode ser substituído por configurações se necessário

  //   // Inicia o jogo
  //   jogoTrilha.iniciarJogo();
  // });
  
  document.getElementById('iniciarJogo').addEventListener('click', () => {
    const tamanhoTabuleiro = parseInt(document.getElementById('tamanhoTabuleiro').value);
    const primeiroJogador = document.getElementById('primeiroJogador').value === "Você" ? "Player 1" : "Player 2";
    const dificuldade = document.getElementById('nivelIA').value; // nova opção para escolher dificuldade

    const gameState = new GameState(tamanhoTabuleiro, primeiroJogador, dificuldade, tabuleiroElement);

    gameState.iniciarJogo();
    
  });

  document.getElementById('verClassificacoes').addEventListener('click', () => {
    alert("Classificações: Em breve...");
  });

  const instrucoes = document.getElementById('modal-instrucoes');
  const botaoVerInstrucoes = document.getElementById('verInstrucoes'); // Supondo que você tenha um botão com id 'verInstrucoes'
  const botaoFecharInstrucoes = document.querySelector('.close'); // O botão de fechar no modal

  // Exibe o modal
  botaoVerInstrucoes.addEventListener('click', () => {
    instrucoes.style.display = 'flex'; // Usa flex para centralizar o modal
  });

  // Fecha o modal quando clicar no botão de fechar
  botaoFecharInstrucoes.addEventListener('click', () => {
    instrucoes.style.display = 'none';
  });

  // Fecha o modal quando clicar fora do conteúdo
  instrucoes.addEventListener('click', (event) => {
    // Verifica se o clique foi na área de fundo, ou seja, fora do conteúdo do modal
    if (event.target === instrucoes) {
      instrucoes.style.display = 'none';
    }
  });

  // Impede o clique no conteúdo do modal de fechar o modal
  const modalContent = document.querySelector('.modal-content'); // A classe que envolve o conteúdo do modal
  modalContent.addEventListener('click', (event) => {
    event.stopPropagation(); // Impede a propagação do clique para a área do fundo
  });

});
