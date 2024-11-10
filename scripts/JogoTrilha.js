class JogoTrilha {
  constructor(tabuleiro, gameState) {
    this.tabuleiro = tabuleiro;
    this.gameState = gameState;
    this.tamanhoTabuleiro = gameState.tamanhoTabuleiro || 3; // Defina um tamanho padrão se não for fornecido
    this.baseSize = 100; // Tamanho base para o tabuleiro
    this.criarTabuleiro();
  }

  criarTabuleiro() {
    this.tabuleiro.innerHTML = '';
    this.tabuleiro.style.position = 'relative';
    this.tabuleiro.style.width = `${this.baseSize * this.tamanhoTabuleiro}px`;
    this.tabuleiro.style.height = `${this.baseSize * this.tamanhoTabuleiro}px`;

    let innerSquareSize = this.baseSize;
    for (let camada = 0; camada < this.tamanhoTabuleiro; camada++) {
      const size = this.baseSize * (this.tamanhoTabuleiro - camada);
      this.createSquare(size, camada);
      if (camada === this.tamanhoTabuleiro - 1) innerSquareSize = size;
    }

    this.createCenterLines(this.baseSize * this.tamanhoTabuleiro, innerSquareSize);
  }

  createSquare(size, camada) {
    const offset = 50 * camada;

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

    circlePositions.forEach((pos) => {
      const circle = document.createElement('div');
      circle.className = 'circle';
      circle.style.top = `${pos.top}px`;
      circle.style.left = `${pos.left}px`;
      this.configurarHover(circle);
      this.configurarClique(circle);
      this.tabuleiro.appendChild(circle);
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

    this.tabuleiro.appendChild(line);
  }

  createCenterLines(boardSize, innerSquareSize) {
    const center = boardSize / 2;
    const lineLength = (boardSize - innerSquareSize) / 2;

    const hLineLeft = document.createElement('div');
    hLineLeft.className = 'line center-line horizontal';
    hLineLeft.style.position = 'absolute';
    hLineLeft.style.width = `${lineLength}px`;
    hLineLeft.style.height = '2px';
    hLineLeft.style.top = `${center - 1}px`;
    hLineLeft.style.left = '0px';
    this.tabuleiro.appendChild(hLineLeft);

    const hLineRight = document.createElement('div');
    hLineRight.className = 'line center-line horizontal';
    hLineRight.style.position = 'absolute';
    hLineRight.style.width = `${lineLength}px`;
    hLineRight.style.height = '2px';
    hLineRight.style.top = `${center - 1}px`;
    hLineRight.style.left = `${boardSize - lineLength}px`;
    this.tabuleiro.appendChild(hLineRight);

    const vLineTop = document.createElement('div');
    vLineTop.className = 'line center-line vertical';
    vLineTop.style.position = 'absolute';
    vLineTop.style.height = `${lineLength}px`;
    vLineTop.style.width = '2px';
    vLineTop.style.top = '0px';
    vLineTop.style.left = `${center - 1}px`;
    this.tabuleiro.appendChild(vLineTop);

    const vLineBottom = document.createElement('div');
    vLineBottom.className = 'line center-line vertical';
    vLineBottom.style.position = 'absolute';
    vLineBottom.style.height = `${lineLength}px`;
    vLineBottom.style.width = '2px';
    vLineBottom.style.top = `${boardSize - lineLength}px`;
    vLineBottom.style.left = `${center - 1}px`;
    this.tabuleiro.appendChild(vLineBottom);
  }

  configurarHover(circle) {
    // Adiciona o efeito de hover, mas só se a peça ainda não tiver sido colocada
    circle.addEventListener('mouseover', () => {
      if (!circle.classList.contains('jogador-X') && !circle.classList.contains('jogador-O')) {
        circle.classList.add('hover');
      }
    });
  
    circle.addEventListener('mouseout', () => {
      circle.classList.remove('hover');
    });
  }
  
  configurarClique(circle) {
    circle.addEventListener('click', () => {
      if (!circle.classList.contains('jogador-X') && !circle.classList.contains('jogador-O') && this.gameState.fase === 'colocacao') {
        if (this.gameState.turnoAtual === "Player 1" && this.gameState.pecasJogador1 > 0) {
          circle.classList.add('jogador-X');
          this.gameState.pecasJogador1--;
        } else if (this.gameState.turnoAtual === "Player 2" && this.gameState.pecasJogador2 > 0) {
          circle.classList.add('jogador-O');
          this.gameState.pecasJogador2--;
        }
  
        this.gameState.passarFase();
        this.gameState.alternarTurno();
  
        // Remover o efeito de hover imediatamente após o clique
        circle.classList.remove('hover');
        
        // Remover os eventos de hover para garantir que o efeito não ocorra mais
        circle.removeEventListener('mouseover', () => {});
        circle.removeEventListener('mouseout', () => {});
        
        // Garantir que o hover não ocorra mais, pode adicionar a classe no-hover aqui
        circle.classList.add('no-hover');
      }
    });
  }
    
}
