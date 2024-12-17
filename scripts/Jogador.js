class Jogador {
  constructor(cor, nome, tamanhoTabuleiro) {
    this.cor = cor;
    this.nome = nome;
    this.pecasRestantes = 3 * tamanhoTabuleiro; // Define o número de peças que o jogador possui
    this.pecasCapturadas = 0;
  }

  capturarPeca() {
    this.pecasCapturadas++;
  }

  posicionarPeca() {
    this.pecasRestantes--;
  }

}