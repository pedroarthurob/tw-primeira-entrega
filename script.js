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
    this.matrizTabuleiro = Array(tamanhoTabuleiro * 8).fill(0); // Cria uma matriz para o estado do tabuleiro com base no número de quadrados
    this.currentIndex = 0; // Certifique-se de que currentIndex está definido como 0
    const numPecas = tamanhoTabuleiro * 3;
    this.jogadores = [
      new Jogador('red', 'Jogador Vermelho', numPecas),
      new Jogador('green', 'Jogador Verde', numPecas)
    ];
    this.jogadorAtualIndex = 0;
    this.fase = 'colocar';
    this.adjacencias = this.gerarAdjacencias();
  }

  // Função para criar adjacências com base no tamanho do tabuleiro
  gerarAdjacencias() {
    const adjacencias = [];
    const numCasasPorQuadrado = 8;
    const totalCasas = this.tamanhoTabuleiro * numCasasPorQuadrado;
  
    for (let i = 0; i < totalCasas; i++) {
      const quadrado = Math.floor(i / numCasasPorQuadrado);
      const posicaoQuadrado = i % numCasasPorQuadrado;
  
      // Inicializa a lista de adjacências para a posição se ela ainda nao tiver sido inicializada numa posição anterior
      if (!adjacencias[i]) {
          adjacencias[i] = [];
        };
      
      // Conexões internas dentro do mesmo quadrado
      const casaAnterior = quadrado * numCasasPorQuadrado + (posicaoQuadrado + 7) % numCasasPorQuadrado;
      const casaProxima = quadrado * numCasasPorQuadrado + (posicaoQuadrado + 1) % numCasasPorQuadrado;
      
      adjacencias[i].push(casaAnterior);
      adjacencias[i].push(casaProxima);
  
      // Conexões entre quadrados nos centros dos lados
      if (posicaoQuadrado % 2 === 1 && quadrado < this.tamanhoTabuleiro - 1) {
        const proximoQuadradoIndex = (quadrado + 1) * numCasasPorQuadrado + posicaoQuadrado;
        
        // Conecta bidirecionalmente entre quadrados
        adjacencias[i].push(proximoQuadradoIndex);
        
        // Garante que a conexão também seja registrada do próximo quadrado para o atual
        if (!adjacencias[proximoQuadradoIndex]) {
          adjacencias[proximoQuadradoIndex] = [];
        }
        adjacencias[proximoQuadradoIndex].push(i);
  
        // Log para verificar conexões entre quadrados
        console.log(`Conexão criada: ${i} <--> ${proximoQuadradoIndex}`);
      }
    }
  
    // Verifica o array de adjacências completo para garantir que todos os links estão bidirecionais
    console.log("Adjacências finais:", adjacencias);
  
    return adjacencias;
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

  // Função para lidar com uma jogada
  jogar(posicao, casa) {
    const jogadorAtual = this.jogadores[this.jogadorAtualIndex];

    if (this.fase === 'colocar' && this.matrizTabuleiro[posicao] === 0 && jogadorAtual.pecasRestantes > 0) {
      casa.style.backgroundColor = jogadorAtual.cor;
      this.matrizTabuleiro[posicao] = this.jogadorAtualIndex + 1;
        // Debug para confirmar o índice numérico
      console.log(`Tentando colocar peça em posição: ${posicao}`);
      console.log(`Estado da matriz antes da jogada:`, this.matrizTabuleiro);
      jogadorAtual.colocarPeca();

      if (this.jogadores.every(jogador => jogador.pecasRestantes === 0)) {
        this.fase = 'mover';
        console.log("Mudando para a fase de mover");
      }

      this.atualizarPecasRestantes();
      this.alternarJogador();
      this.exibirMensagemJogador();
    } else if (this.fase === 'mover' && this.matrizTabuleiro[posicao] === this.jogadorAtualIndex + 1) {
      // Seleciona a peça para mover
      this.selecionarPeca(posicao, casa);
    } else if (this.fase === 'mover' && this.selectedPieceIndex !== null && this.matrizTabuleiro[posicao] === 0) {
      // Move a peça para a nova posição se for adjacente
      if (this.isAdjacente(this.selectedPieceIndex, posicao)) {
        this.moverPeca(posicao, casa);
      } else {
        alert("Você só pode mover para uma casa adjacente!");
      }
    } else if (this.matrizTabuleiro[posicao] !== 0) {
      alert("Espaço já está ocupado por outra peça!");
    }
  }

  selecionarPeca(posicao, casa) {
    console.log(`Selecionando peça na posição ${posicao}`);
    if (this.selectedPieceIndex !== null) {
      const previousCasa = document.querySelector(`[data-index="${this.selectedPieceIndex}"]`);
      if (previousCasa) previousCasa.style.outline = ''; // Remove o destaque da peça anteriormente selecionada
    }
    this.selectedPieceIndex = posicao;
    casa.style.outline = '2px solid yellow'; // Destaca a peça selecionada
  }

  // Função para mover a peça selecionada para uma nova posição
  moverPeca(posicao, casa) {
    const jogadorAtual = this.jogadores[this.jogadorAtualIndex];
    const previousCasa = document.querySelector(`[data-index="${this.selectedPieceIndex}"]`);
    previousCasa.style.backgroundColor = 'transparent'; // Remove a cor da posição anterior
    previousCasa.style.outline = ''; // Remove o destaque

    this.matrizTabuleiro[this.selectedPieceIndex] = 0; // Libera a posição anterior
    this.matrizTabuleiro[posicao] = this.jogadorAtualIndex + 1; // Atualiza para o novo índice
    casa.style.backgroundColor = jogadorAtual.cor;

    this.selectedPieceIndex = null; // Limpa a seleção
    this.alternarJogador();
    this.exibirMensagemJogador();
  }

  isAdjacente(pos1, pos2) {
    return this.adjacencias[pos1] && this.adjacencias[pos1].includes(pos2);
  }

  alternarJogador() {
    this.jogadorAtualIndex = 1 - this.jogadorAtualIndex;
  }

  exibirMensagemJogador() {
    const mensagemJogador = document.getElementById('mensagemJogador');
    const jogadorAtual = this.jogadores[this.jogadorAtualIndex];
    mensagemJogador.textContent = `Vez do ${jogadorAtual.nome}`;
  }

 // Cria um quadrado no tabuleiro e adiciona as casas (círculos)
  createSquare(size, layerIndex) {
    const offset = 50 * layerIndex;
    const circlePositions = [
      { top: offset, left: offset },                  // Canto superior esquerdo
      { top: offset, left: offset + size / 2 },       // Meio superior
      { top: offset, left: offset + size },           // Canto superior direito
      { top: offset + size / 2, left: offset + size },// Meio direito
      { top: offset + size, left: offset + size },    // Canto inferior direito
      { top: offset + size, left: offset + size / 2 },// Meio inferior
      { top: offset + size, left: offset },           // Canto inferior esquerdo
      { top: offset + size / 2, left: offset }        // Meio esquerdo
    ];

    circlePositions.forEach((pos) => {
      const fundo = document.createElement('div');
      fundo.className = 'circle_background';
      fundo.style.top = `${pos.top}px`;
      fundo.style.left = `${pos.left}px`;
      fundo.style.zIndex = '1';

      // Cada casa tem um índice exclusivo, independente do quadrado
      const casa = document.createElement('div');
      casa.className = 'circle';
      
      // Verificação extra para garantir que currentIndex é um número
      if (typeof this.currentIndex !== 'number') this.currentIndex = 0;
      casa.dataset.index = this.currentIndex.toString(); // Define o índice como string no dataset
      this.currentIndex += 1; // Incrementa o índice para o próximo círculo
      casa.style.top = `${pos.top}px`;
      casa.style.left = `${pos.left}px`;
      casa.style.zIndex = '2';
      
      casa.addEventListener('click', () => {
        const posicao = parseInt(casa.dataset.index, 10);
        this.jogar(posicao, casa);
      });
      this.tabuleiro.appendChild(fundo);
      this.tabuleiro.appendChild(casa);
    });

    // Adiciona linhas entre os círculos dentro do quadrado
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
}
