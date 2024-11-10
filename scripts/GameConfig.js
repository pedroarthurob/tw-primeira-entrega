class GameConfig {
  constructor(tamanhoTabuleiro, modoDeJogo, quemComeca, dificuldadeIA = null) {
    this.tamanhoTabuleiro = tamanhoTabuleiro;
    this.modoDeJogo = modoDeJogo; // "Player vs Player" ou "Player vs AI"
    this.quemComeca = quemComeca; // "Player 1" ou "Player 2 / AI"
    this.dificuldadeIA = dificuldadeIA; // "Fácil", "Médio", "Difícil" (se for contra IA)
  }
}

