class AI {
  constructor(dificuldade) {
    this.dificuldade = dificuldade;
  }

  calcularProximoMovimento(tabuleiro) {
    // Lógica para calcular o próximo movimento com base na dificuldade
    if (this.dificuldade === "Fácil") {
      return this.movimentoFacil(tabuleiro);
    } else if (this.dificuldade === "Médio") {
      return this.movimentoMedio(tabuleiro);
    } else if (this.dificuldade === "Difícil") {
      return this.movimentoDificil(tabuleiro);
    }
  }

  movimentoFacil(tabuleiro) {
    // Implementação da lógica fácil
  }

  movimentoMedio(tabuleiro) {
    // Implementação da lógica média
  }

  movimentoDificil(tabuleiro) {
    // Implementação da lógica difícil
  }
}

