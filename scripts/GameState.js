class GameState {
  constructor(tamanhoTabuleiro) {
    this.tamanhoTabuleiro = tamanhoTabuleiro;
    this.fase = 'colocacao'; // Pode ser 'colocacao', 'movimentacao' ou 'captura'
    this.turnoAtual = "Player 1"; // Ou "Player 2 / AI"
    this.pecasJogador1 = 9; // Número inicial de peças
    this.pecasJogador2 = 9; // Número inicial de peças
    this.pecasCapturadasJogador1 = 0;
    this.pecasCapturadasJogador2 = 0;
    this.tabuleiro = this.inicializarTabuleiro(tamanhoTabuleiro); // Matriz representando o tabuleiro
  }

  inicializarTabuleiro(tamanho) {
    const tabuleiro = Array(tamanho).fill(null).map(() => Array(8).fill(null));
    return tabuleiro;
  }

  alternarTurno() {
    this.turnoAtual = this.turnoAtual === "Player 1" ? "Player 2" : "Player 1";
  }

  passarFase() {
    if (this.fase === 'colocacao' && this.pecasJogador1 === 0 && this.pecasJogador2 === 0) {
      this.fase = 'movimentacao';
    } else if (this.fase === 'movimentacao' && (this.pecasJogador1 < 3 || this.pecasJogador2 < 3)) {
      this.fase = 'captura';
    }
  }
}
