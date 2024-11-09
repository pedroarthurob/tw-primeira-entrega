class Jogador {
  constructor(cor, nome, numPecas) {
    this.cor = cor;
    this.nome = nome;
    this.pecasRestantes = numPecas; // Número de peças a colocar no tabuleiro (3 * n)
    this.pecasEmJogo = 0; // Quantidade de peças atualmente no tabuleiro
  }

  colocarPeca() {
    if (this.pecasRestantes > 0) {
      this.pecasRestantes--;
      this.pecasEmJogo++;
    }
  }

  removerPeca() {
    if (this.pecasEmJogo > 0) {
      this.pecasEmJogo--;
    }
  }
}
