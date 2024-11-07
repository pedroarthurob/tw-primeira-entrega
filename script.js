document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('verInstrucoes').addEventListener('click', () => {
      alert("Regras do jogo Trilha...");
    });
  
    document.getElementById('iniciarJogoComando').addEventListener('click', () => {
      iniciarJogo();
    });
  
    document.getElementById('desistirJogo').addEventListener('click', () => {
      alert("Você desistiu do jogo.");
      // Lógica adicional para finalizar o jogo
    });
  
    document.getElementById('verClassificacoes').addEventListener('click', () => {
      alert("Classificações: ...");
      // Código para mostrar as classificações
    });
  });
  
  function iniciarJogo() {
    const tamanhoTabuleiro = document.getElementById('tamanhoTabuleiro').value;
    const primeiroJogador = document.getElementById('primeiroJogador').value;
    const nivelIA = document.getElementById('nivelIA').value;
  
    const configuracoes = {
      tamanhoTabuleiro,
      primeiroJogador,
      nivelIA
    };
  
    console.log("Iniciando o jogo com as configurações:", configuracoes);
    // Lógica para iniciar o jogo com essas configurações
  }
  