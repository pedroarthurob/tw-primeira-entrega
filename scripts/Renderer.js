class Renderer {
  constructor(tabuleiroElement, tamanhoTabuleiro, gameState) {
    this.tabuleiroElement = tabuleiroElement;
    this.tamanhoTabuleiro = tamanhoTabuleiro;
    this.baseSize = 100;
    this.gameState = this.gameState;
  }
  
  renderTabuleiro() {
    // Limpar o conteúdo do tabuleiro antes de renderizar novamente
    this.tabuleiroElement.innerHTML = '';
    this.tabuleiroElement.style.width = `${this.baseSize * this.tamanhoTabuleiro}px`;
    this.tabuleiroElement.style.height = `${this.baseSize * this.tamanhoTabuleiro}px`;
    let innerSquareSize;
    // Para cada camada do tabuleiro, recriar os quadrados e círculos.
    for (let camada = 0; camada < this.tamanhoTabuleiro; camada++) {
      const size = this.baseSize * (this.tamanhoTabuleiro - camada);
      const tamanho = 2*this.tamanhoTabuleiro;//2*n+1 mas o tamanho aq já é +1
      const meio = Math.floor(tamanho/2);
      this.createSquare(size, camada, tamanho, meio);
      if (camada === this.tamanhoTabuleiro - 1) innerSquareSize = size;
    }

    // Criar as linhas centrais do tabuleiro
    this.createCenterLines(this.baseSize * this.tamanhoTabuleiro, innerSquareSize);
  }

  // Método para adicionar as peças na visualização
  renderizarPecas(gameState) {
    document.getElementById('jogador1Pecas').style.display = 'flex';
    document.getElementById('jogador2Pecas').style.display = 'flex';

    const container = document.getElementById('jogador1Pecas');
    container.innerHTML = ''; // Limpa o container para renderizar as novas peças
    
    // Adiciona uma div para cada peça restante
    for (let i = 0; i < gameState.jogador1.pecasRestantes ; i++) {
      const pecaDiv = document.createElement('div');
      pecaDiv.classList.add('peca');
      pecaDiv.style.backgroundColor = this.cor; // Cor da peça do jogador
      container.appendChild(pecaDiv);
    }

    const container2 = document.getElementById('jogador2Pecas');
    container2.innerHTML = ''; // Limpa o container para renderizar as novas peças
    
    // Adiciona uma div para cada peça restante
    for (let i = 0; i < gameState.jogador2.pecasRestantes ; i++) {
      const pecaDiv = document.createElement('div');
      pecaDiv.classList.add('peca');
      pecaDiv.style.backgroundColor = this.cor; // Cor da peça do jogador
      container2.appendChild(pecaDiv);
    }

  }

  createSquare(size, camada, n, meio) {
    const offset = 50 * camada;

    const circlePositions = [
      { linha: camada, coluna: camada, top: offset, left: offset },
      { linha: camada, coluna: meio, top: offset, left: offset + size / 2 },
      { linha: camada, coluna: n, top: offset, left: offset + size },
      { linha: meio, coluna: n, top: offset + size / 2, left: offset + size },
      { linha: n, coluna: n, top: offset + size, left: offset + size },
      { linha: n, coluna: meio, top: offset + size, left: offset + size / 2 },
      { linha: n, coluna: camada, top: offset + size, left: offset },
      { linha: meio, coluna: camada, top: offset + size / 2, left: offset }
    ];

    circlePositions.forEach((pos) => {
      const circle = document.createElement('div');
      circle.className = 'circle';
      circle.dataset.index = `(${pos.linha}, ${pos.coluna})`;
      circle.style.top = `${pos.top}px`;
      circle.style.left = `${pos.left}px`;
      circle.style.zIndex = `2`;

      // this.configurarHover(circle);
      // this.configurarClique(circle);
      this.tabuleiroElement.appendChild(circle);
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

    this.tabuleiroElement.appendChild(line);
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
    this.tabuleiroElement.appendChild(hLineLeft);

    const hLineRight = document.createElement('div');
    hLineRight.className = 'line center-line horizontal';
    hLineRight.style.position = 'absolute';
    hLineRight.style.width = `${lineLength}px`;
    hLineRight.style.height = '2px';
    hLineRight.style.top = `${center - 1}px`;
    hLineRight.style.left = `${boardSize - lineLength}px`;
    this.tabuleiroElement.appendChild(hLineRight);

    const vLineTop = document.createElement('div');
    vLineTop.className = 'line center-line vertical';
    vLineTop.style.position = 'absolute';
    vLineTop.style.height = `${lineLength}px`;
    vLineTop.style.width = '2px';
    vLineTop.style.top = '0px';
    vLineTop.style.left = `${center - 1}px`;
    this.tabuleiroElement.appendChild(vLineTop);

    const vLineBottom = document.createElement('div');
    vLineBottom.className = 'line center-line vertical';
    vLineBottom.style.position = 'absolute';
    vLineBottom.style.height = `${lineLength}px`;
    vLineBottom.style.width = '2px';
    vLineBottom.style.top = `${boardSize - lineLength}px`;
    vLineBottom.style.left = `${center - 1}px`;
    this.tabuleiroElement.appendChild(vLineBottom);
  }
  
  limparTabuleiro() {
    this.tabuleiroElement.innerHTML = '';  // Limpa o tabuleiro antes de renderizar
  }
}
  