class GameState {
  constructor(tamanhoTabuleiro, primeiroJogador, dificuldade, tabuleiroElement, modoDeJogo) {
    this.tamanhoTabuleiro = tamanhoTabuleiro;
    this.fase = 'Colocação'; // Pode ser 'colocacao', 'movimentacao'
    this.jogador1 = new Jogador("blue", "Player 1", tamanhoTabuleiro);
    this.jogador2 = new Jogador("red", "Player 2", tamanhoTabuleiro);
    this.turnoAtual = primeiroJogador === "Player 1" ? this.jogador1 : this.jogador2; // Ou "Player 2 / AI"
    this.tabuleiro = new Tabuleiro(tamanhoTabuleiro); // Matriz representando o tabuleiro
    this.dificuldade = dificuldade;
    this.renderer = new Renderer(tabuleiroElement, tamanhoTabuleiro, this);
    this.inputHandler = new InputHandler(this.renderer, this);
    this.modoDeJogo = modoDeJogo;
    this.jogadasSemVitoria = 0;
  }

  iniciarJogo() {
    this.renderer.renderTabuleiro();
    this.renderer.renderizarPecas(this);
    document.getElementById("mensagem-superior").textContent = "Turno: " + this.turnoAtual.nome;
    document.getElementById("mensagem-inferior").textContent = "Fase: Colocação";
  }

  alternarTurno() {
    this.turnoAtual = this.turnoAtual === this.jogador1 ? this.jogador2 : this.jogador1;
    if (this.fase === 'Movimentação' && this.jogador1.pecasRestantes == 3 && this.jogador2.pecasRestantes == 3) {
      this.jogadasSemVitoria++;
    }
  }

  passarFase() {
    if (this.fase === 'Colocação' && this.jogador1.pecasRestantes === 0 && this.jogador2.pecasRestantes === 0) {
      this.fase = 'Movimentação';
    }
  }

  // Posicionar uma peça no tabuleiro
  posicionarPeca(jogador, i, j) {
    if (this.fase === 'Colocação') {
      if (jogador.nome === 'Player 1' && this.jogador1.pecasRestantes > 0) {
        this.jogador1.posicionarPeca();
        this.tabuleiro.posicionarPeca(this.jogador1, i, j);
      } else if (jogador.nome === 'Player 2' && this.jogador2.pecasRestantes > 0) {
        this.jogador2.posicionarPeca();
        this.tabuleiro.posicionarPeca(this.jogador2, i, j);
      }
    }
  }

  // Capturar uma peça adversária
  capturarPeca(jogador, i, j) {
    const pecaAdversaria = this.tabuleiro.matrix[i][j];
    const adversario = adversario === this.jogador1 ? this.jogador1 : this.jogador2;
    if (pecaAdversaria !== 0 && pecaAdversaria !== jogador.nome) {
      this.tabuleiro.retirarPeca(i, j); // Remove a peça adversária
      jogador.capturarPeca();
      adversario.pecasRestantes--;
      console.log(`${jogador.nome} capturou uma peça em (${i}, ${j})`);
    }
  }

  // Mover uma peça do jogador
  moverPeca(jogador, iOrigem, jOrigem, iDestino, jDestino) {
    const peca = this.tabuleiro.matrix[iOrigem][jOrigem];
    if (peca === jogador.nome) {
      if (this.estaEmMovimentoLivre(jogador)) {
        if (this.matrix[iDestino][jDestino] !== (this.turnoAtual.nome === "Player 1" ? "Player 2" : "Player 1")) { // Verifica se o destino é uma casa livre
          // Move a peça para a nova casa
          console.log(`${jogador.nome} moveu sua peça para ${iDestino, jDestino}`);
          this.matrix[iDestino][jDestino] = jogador.nome;
          return true;
        }
      } else {
        if (this.tabuleiro.validarMovimento(jogador, iOrigem, jOrigem, iDestino, jDestino)) {
          this.tabuleiro.moverPeca(iOrigem, jOrigem, iDestino, jDestino);
          console.log(`${jogador.nome} moveu a peça de (${iOrigem}, ${jOrigem}) para (${iDestino}, ${jDestino})`);
        }
      }
    }

  }

  isDestinoValido(peçaSelecionada, linha, coluna) {
    // Aqui você chama o método validarMovimento da classe Tabuleiro
    const { linha: i, coluna: j } = peçaSelecionada;
    return this.tabuleiro.validarMovimento(this.turnoAtual, i, j, linha, coluna);
  }

  estaEmMovimentoLivre(jogador) {
    return jogador.pecasRestantes === 3;
  }

  // Função que verifica se um jogador perdeu (ficou com 2 peças)
  verificarDerrota() {
    console.log("calc. derrota", this.turnoAtual.pecasRestantes, this.fase);
    const adversario = this.turnoAtual === this.jogador1 ? this.jogador2 : this.jogador1;
    if ((this.turnoAtual.pecasRestantes === 2 || adversario.pecasRestantes === 2) && this.fase === 'Movimentação') {
      console.log(`${this.turnoAtual.nome} perdeu o jogo!`);
      return true; // Jogo terminou com derrota
    }
    return false;
  }

  // Função que verifica se o jogo terminou por empate
  verificarEmpate() {
    // Empate ocorre se ambos tiverem 3 peças e não houver jogada válida por 10 turnos
    console.log("calc. empate", this.jogador1.pecasRestantes, this.jogador2.pecasRestantes, this.jogadasSemVitoria);
    if (this.jogador1.pecasRestantes === 3 && this.jogador2.pecasRestantes === 3 && this.jogadasSemVitoria >= 10) {
      console.log("Empate! Nenhum vencedor após 10 jogadas.");
      return true; // Jogo terminou com empate
    }
    return false;
  }

}
