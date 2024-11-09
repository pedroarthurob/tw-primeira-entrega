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
    this.baseSize = 100; // Tamanho base para o tabuleiro
    this.tabuleiro = document.getElementById('tabuleiro');
  }

  iniciarJogo() {
    this.tabuleiro.innerHTML = ''; // Limpa o tabuleiro anterior
    this.tabuleiro.style.position = 'relative';
    this.tabuleiro.style.width = `${this.baseSize * this.tamanhoTabuleiro}px`;
    this.tabuleiro.style.height = `${this.baseSize * this.tamanhoTabuleiro}px`;

    let innerSquareSize = this.baseSize; // Define o tamanho do quadrado mais interno
    for (let i = 0; i < this.tamanhoTabuleiro; i++) {
      const size = this.baseSize * (this.tamanhoTabuleiro - i); // Ajuste o tamanho de cada quadrado
      this.createSquare(size, i);
      if (i === this.tamanhoTabuleiro - 1) innerSquareSize = size; // Define o menor quadrado como limite
    }

    // Adicionar as linhas centrais, parando antes do quadrado interno
    this.createCenterLines(this.baseSize * this.tamanhoTabuleiro, innerSquareSize);
    console.log(`Tabuleiro de tamanho ${this.tamanhoTabuleiro} criado.`);
  }

  createSquare(size, layerIndex) {
    const offset = 50 * layerIndex; // Espaço entre os quadrados

    const circlePositions = [
      { top: offset, left: offset }, // Canto superior esquerdo
      { top: offset, left: offset + size / 2 }, // Meio superior
      { top: offset, left: offset + size }, // Canto superior direito
      { top: offset + size / 2, left: offset + size }, // Meio direito
      { top: offset + size, left: offset + size }, // Canto inferior direito
      { top: offset + size, left: offset + size / 2 }, // Meio inferior
      { top: offset + size, left: offset }, // Canto inferior esquerdo
      { top: offset + size / 2, left: offset } // Meio esquerdo
    ];

    circlePositions.forEach(pos => {
      const circle = document.createElement('div');
      circle.className = 'circle';
      circle.style.top = `${pos.top}px`;
      circle.style.left = `${pos.left}px`;
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
    hLineLeft.style.width = `${lineLength}px`;
    hLineLeft.style.left = '0px';
    hLineLeft.style.top = `${center}px`;
    this.tabuleiro.appendChild(hLineLeft);

    const hLineRight = document.createElement('div');
    hLineRight.className = 'line center-line horizontal';
    hLineRight.style.width = `${lineLength}px`;
    hLineRight.style.left = `${center + innerSquareSize / 2}px`;
    hLineRight.style.top = `${center}px`;
    this.tabuleiro.appendChild(hLineRight);

    const vLineTop = document.createElement('div');
    vLineTop.className = 'line center-line vertical';
    vLineTop.style.height = `${lineLength}px`;
    vLineTop.style.top = '0px';
    vLineTop.style.left = `${center}px`;
    this.tabuleiro.appendChild(vLineTop);

    const vLineBottom = document.createElement('div');
    vLineBottom.className = 'line center-line vertical';
    vLineBottom.style.height = `${lineLength}px`;
    vLineBottom.style.top = `${center + innerSquareSize / 2}px`;
    vLineBottom.style.left = `${center}px`;
    this.tabuleiro.appendChild(vLineBottom);
  }
}
