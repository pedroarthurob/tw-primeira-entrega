class Jogador {
  constructor(cor, nome, numPecas) {
    this.cor = cor;
    this.nome = nome;
    this.pecasRestantes = numPecas; 
    this.pecasEmJogo = 0; 
    this.pecaSelecionada = null; // Adiciona uma referência para a peça atualmente selecionada
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
  
  selecionarPeca(posicao) {
    this.pecaSelecionada = posicao; // Seleciona a peça para o movimento
  }
}
