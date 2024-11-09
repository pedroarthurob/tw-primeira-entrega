document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('iniciarJogo').addEventListener('click', () => {
    const tamanhoTabuleiro = parseInt(document.getElementById('tamanhoTabuleiro').value);
    const jogoTrilha = new JogoTrilha(tamanhoTabuleiro);
    jogoTrilha.iniciarJogo();
  });

  document.getElementById('verClassificacoes').addEventListener('click', () => {
    alert("Classificações: Em breve...");
  });

  document.getElementById('verInstrucoes').addEventListener('click', () => {
    alert("Regras do jogo Trilha:\n\n1. Cada jogador tem 9 peças.\n2. O objetivo é formar trilhas (linhas de 3 peças).\n3. Você pode remover uma peça do adversário quando formar uma trilha.\n4. O jogo termina quando um jogador tiver menos de 3 peças ou não puder se mover.");
  });
});

class JogoTrilha {
  constructor(tamanhoTabuleiro) {
    this.tamanhoTabuleiro = tamanhoTabuleiro;
    this.baseSize = 100;
    this.tabuleiro = document.getElementById('tabuleiro');
    const numPecas = tamanhoTabuleiro * 3;
    this.jogadores = [
      new Jogador('red', 'Jogador Vermelho', numPecas),
      new Jogador('green', 'Jogador Verde', numPecas)
    ];
    this.jogadorAtualIndex = 0;
    this.fase = 'colocar';
  }

  iniciarJogo() {
    this.tabuleiro.innerHTML = '';
    this.tabuleiro.style.position = 'relative';
    this.tabuleiro.style.width = `${this.baseSize * this.tamanhoTabuleiro}px`;
    this.tabuleiro.style.height = `${this.baseSize * this.tamanhoTabuleiro}px`;
    document.getElementById("pecasVermelhasRestantes").style.display = "grid";
    document.getElementById("pecasVerdesRestantes").style.display = "grid";
    let innerSquareSize = this.baseSize;
    for (let i = 0; i < this.tamanhoTabuleiro; i++) {
      const size = this.baseSize * (this.tamanhoTabuleiro - i);
      this.createSquare(size, i);
      if (i === this.tamanhoTabuleiro - 1) innerSquareSize = size;
    }

    this.createCenterLines(this.baseSize * this.tamanhoTabuleiro, innerSquareSize);
    this.atualizarPecasRestantes();
    this.exibirMensagemJogador();
  }

  createSquare(size, layerIndex) {
    const offset = 50 * layerIndex;
    const circlePositions = [
      { top: offset, left: offset },
      { top: offset, left: offset + size / 2 },
      { top: offset, left: offset + size },
      { top: offset + size / 2, left: offset + size },
      { top: offset + size, left: offset + size },
      { top: offset + size, left: offset + size / 2 },
      { top: offset + size, left: offset },
      { top: offset + size / 2, left: offset }
    ];

    circlePositions.forEach((pos, index) => {
      const fundo = document.createElement('div');
      fundo.className = 'circle_background';
      fundo.style.top = `${pos.top}px`;
      fundo.style.left = `${pos.left}px`;
      fundo.style.zIndex = '1';

      const casa = document.createElement('div');
      casa.className = 'circle';
      casa.dataset.index = `${layerIndex}-${index}`;
      casa.style.top = `${pos.top}px`;
      casa.style.left = `${pos.left}px`;
      casa.style.backgroundColor = 'transparent';
      casa.style.zIndex = '2';
      casa.addEventListener('click', () => this.colocarPeca(casa));

      this.tabuleiro.appendChild(fundo);
      this.tabuleiro.appendChild(casa);
    });

    for (let i = 0; i < circlePositions.length; i++) {
      const pos1 = circlePositions[i];
      const pos2 = circlePositions[(i + 1) % circlePositions.length];
      this.createLine(pos1, pos2);
    }
  }

  createLine(pos1, pos2) {
    const line = document.createElement('div');
    line.className = 'line';

    const dx = pos2.left - pos1.left;
    const dy = pos2.top - pos1.top;
    const length = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);

    line.style.width = `${length}px`;
    line.style.left = `${pos1.left}px`;
    line.style.top = `${pos1.top}px`;
    line.style.transform = `rotate(${angle}deg)`;
    line.style.position = 'absolute';
    line.style.zIndex = '0';

    this.tabuleiro.appendChild(line);
  }

  createCenterLines(boardSize, innerSquareSize) {
    const center = boardSize / 2;
    const lineLength = (boardSize - innerSquareSize) / 2;

    const hLineLeft = document.createElement('div');
    hLineLeft.className = 'line center-line horizontal';
    hLineLeft.style.width = `${lineLength}px`;
    hLineLeft.style.left = '0px';
    hLineLeft.style.top = `${center}px`;
    hLineLeft.style.zIndex = '0'; // Colocar linha atrás das peças e do fundo
    this.tabuleiro.appendChild(hLineLeft);

    const hLineRight = document.createElement('div');
    hLineRight.className = 'line center-line horizontal';
    hLineRight.style.width = `${lineLength}px`;
    hLineRight.style.left = `${center + innerSquareSize / 2}px`;
    hLineRight.style.top = `${center}px`;
    hLineRight.style.zIndex = '0';
    this.tabuleiro.appendChild(hLineRight);

    const vLineTop = document.createElement('div');
    vLineTop.className = 'line center-line vertical';
    vLineTop.style.height = `${lineLength}px`;
    vLineTop.style.top = '0px';
    vLineTop.style.left = `${center}px`;
    vLineTop.style.zIndex = '0';
    this.tabuleiro.appendChild(vLineTop);

    const vLineBottom = document.createElement('div');
    vLineBottom.className = 'line center-line vertical';
    vLineBottom.style.height = `${lineLength}px`;
    vLineBottom.style.top = `${center + innerSquareSize / 2}px`;
    vLineBottom.style.left = `${center}px`;
    vLineBottom.style.zIndex = '0';
    this.tabuleiro.appendChild(vLineBottom);
  }


  colocarPeca(casa) {
    const jogadorAtual = this.jogadores[this.jogadorAtualIndex];

    if (this.fase === 'colocar' && casa.style.backgroundColor === 'transparent' && jogadorAtual.pecasRestantes > 0) {
      casa.style.backgroundColor = jogadorAtual.cor;
      jogadorAtual.colocarPeca();
      this.alternarJogador();
      this.atualizarPecasRestantes();
      this.exibirMensagemJogador();
    } else {
      if(jogadorAtual.pecasRestantes == 0){
        alert("Acabaram as peças para colocar")
      }
      else{
      alert("Espaço já está ocupado por outra peça!");
      }
    }
  }

  alternarJogador() {
    this.jogadorAtualIndex = 1 - this.jogadorAtualIndex;
  }

  atualizarPecasRestantes() {
    const pecasVermelhasRestantes = document.getElementById('pecasVermelhasRestantes');
    const pecasVerdesRestantes = document.getElementById('pecasVerdesRestantes');

    pecasVermelhasRestantes.innerHTML = '';
    pecasVerdesRestantes.innerHTML = '';

    // Renderizar peças restantes para o Jogador Vermelho
    for (let i = 0; i < this.jogadores[0].pecasRestantes; i++) {
      const peca = document.createElement('div');
      peca.className = 'pecaRestante';
      peca.style.backgroundColor = this.jogadores[0].cor;
      pecasVermelhasRestantes.appendChild(peca);
    }
    if (this.jogadores[0].pecasRestantes==0){
      pecasVermelhasRestantes.style.backgroundColor="transparent";
    }

    // Renderizar peças restantes para o Jogador Verde
    for (let i = 0; i < this.jogadores[1].pecasRestantes; i++) {
      const peca = document.createElement('div');
      peca.className = 'pecaRestante';
      peca.style.backgroundColor = this.jogadores[1].cor;
      pecasVerdesRestantes.appendChild(peca);
    }  
    if (this.jogadores[1].pecasRestantes==0){
      pecasVerdesRestantes.style.backgroundColor="transparent";
    }
  }


  exibirMensagemJogador() {
    const mensagemJogador = document.getElementById('mensagemJogador');
    const jogadorAtual = this.jogadores[this.jogadorAtualIndex];
    mensagemJogador.textContent = `Vez do ${jogadorAtual.nome}`;
  }
}
