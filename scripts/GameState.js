class GameState {
  constructor(tamanhoTabuleiro, primeiroJogador, dificuldade, tabuleiroElement) {
    this.tamanhoTabuleiro = tamanhoTabuleiro;
    this.fase = 'colocacao'; // Pode ser 'colocacao', 'movimentacao'
    this.turnoAtual = primeiroJogador; // Ou "Player 2 / AI"
    this.jogador1 = new Jogador("blue","Player 1",tamanhoTabuleiro);
    this.jogador2 = new Jogador("red", "Player 2",tamanhoTabuleiro);
    this.tabuleiro = new Tabuleiro(tamanhoTabuleiro); // Matriz representando o tabuleiro
    this.dificuldade = dificuldade;
    this.renderer = new Renderer(tabuleiroElement, tamanhoTabuleiro);
  }

  iniciarJogo() {
    this.renderer.renderTabuleiro();
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

  // Posicionar uma peça no tabuleiro
  posicionarPeca(jogador, i, j) {
    if (this.fase === 'colocacao') {
      if (jogador.name === 'Player 1' && this.jogador1.pecasRestantes > 0) {
        this.jogador1.posicionarPeca();
        this.tabuleiro.posicionarPeca(this.jogador1, i, j);
      } else if (jogador.name === 'Player 2' && this.jogador2.pecasRestantes > 0) {
        this.jogador2.posicionarPeca();
        this.tabuleiro.posicionarPeca(this.jogador2, i, j);
      }
    }
  }

  // Capturar uma peça adversária
  capturarPeca(jogador, i, j) {
    const pecaAdversaria = this.tabuleiro.matrix[i][j];
    if (pecaAdversaria !== 0 && pecaAdversaria !== jogador.nome) {
      this.tabuleiro.retirarPeca(i, j); // Remove a peça adversária
      jogador.capturarPeca();
      console.log(`${jogador.nome} capturou uma peça em (${i}, ${j})`);
    }
  }

  // Mover uma peça do jogador
  moverPeca(jogador, iOrigem, jOrigem, iDestino, jDestino) {
    const peca = this.tabuleiro.matrix[iOrigem][jOrigem];
    if (peca === jogador) {
      if (this.isDestinoValido(iDestino, jDestino)) {
        this.tabuleiro.moverPeca(iOrigem, jOrigem, iDestino, jDestino);
        console.log(`${jogador.nome} moveu a peça de (${iOrigem}, ${jOrigem}) para (${iDestino}, ${jDestino})`);
      }
    }
  }

  // Mover uma peça do jogador
  moverPeca(jogador, iOrigem, jOrigem, iDestino, jDestino) {
    const peca = this.tabuleiro.matrix[iOrigem][jOrigem];
    if (peca === jogador.nome) {
      if (this.tabuleiro.validarMovimento(jogador, iOrigem, jOrigem, iDestino, jDestino)) {
        this.tabuleiro.moverPeca(iOrigem, jOrigem, iDestino, jDestino);
        console.log(`${jogador.nome} moveu a peça de (${iOrigem}, ${jOrigem}) para (${iDestino}, ${jDestino})`);
      }
    }
  }

}
