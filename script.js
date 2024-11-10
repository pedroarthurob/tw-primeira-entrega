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
    this.selectedPieceIndex = null;
    this.capturaEmAndamento = false;
    const numPecas = tamanhoTabuleiro * 3;
    this.jogadores = [
      new Jogador('red', 'Jogador Vermelho', numPecas),
      new Jogador('green', 'Jogador Verde', numPecas)
    ];
    this.jogadorAtualIndex = 0;
    this.fase = 'colocar';
    this.adjacencias = this.gerarAdjacencias();
    this.moinhos = this.definirMoinhos();
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

  definirMoinhos() {
    const moinhos = [];
    const numCasasPorQuadrado = 8;

    for (let i = 0; i < this.tamanhoTabuleiro; i++) {
      const baseIndex = i * numCasasPorQuadrado;
      
      moinhos.push([baseIndex, baseIndex + 1, baseIndex + 2]); // Linha superior horizontal
      moinhos.push([baseIndex + 2, baseIndex + 3, baseIndex + 4]); // Lado direito vertical
      moinhos.push([baseIndex + 4, baseIndex + 5, baseIndex + 6]); // Linha inferior horizontal
      moinhos.push([baseIndex, baseIndex + 7, baseIndex + 6]); // Lado esquerdo vertical
      
      if (i < this.tamanhoTabuleiro - 1) {
        // Linhas verticais conectando quadrados
        moinhos.push([baseIndex + 1, baseIndex + 9, baseIndex + 17]);
        moinhos.push([baseIndex + 3, baseIndex + 11, baseIndex + 19]);
        moinhos.push([baseIndex + 5, baseIndex + 13, baseIndex + 21]);
        moinhos.push([baseIndex + 7, baseIndex + 15, baseIndex + 23]);
      }
    }
    return moinhos;
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

  jogar(posicao, casa) {
    const jogadorAtual = this.jogadores[this.jogadorAtualIndex];
    
    if (this.capturaEmAndamento) {
        return; // Impede ações adicionais até que a captura seja concluída
    }

    if (this.verificarFimDeJogo()) {
      return; // Termina o jogo se as condições de fim foram atendidas
    }

    if (this.fase === 'colocar' && this.matrizTabuleiro[posicao] === 0 && jogadorAtual.pecasRestantes > 0) {
        casa.style.backgroundColor = jogadorAtual.cor;
        this.matrizTabuleiro[posicao] = this.jogadorAtualIndex + 1;
        jogadorAtual.colocarPeca();

        // Verifica se um moinho foi formado e marca a necessidade de captura
        if (this.verificarMoinho(posicao)) {
            this.jogadorDoMoinhoIndex = this.jogadorAtualIndex; // Fixa o jogador atual para captura
            this.capturarPeca();
        } else {
            this.alternarJogador(); // Só alterna a vez se nenhum moinho foi formado
        }

        if (this.jogadores.every(jogador => jogador.pecasRestantes === 0)) {
            this.fase = 'mover';
        }

        this.atualizarPecasRestantes();
        this.exibirMensagemJogador();

    } else if (this.fase === 'mover') {
        if (this.matrizTabuleiro[posicao] === this.jogadorAtualIndex + 1) {
            this.selecionarPeca(posicao, casa);
        } else if (this.selectedPieceIndex !== null && this.matrizTabuleiro[posicao] === 0) {
            if (this.isMovimentoLivre() || this.isAdjacente(this.selectedPieceIndex, posicao)) {
                this.moverPeca(posicao, casa);
                
                if (this.verificarMoinho(posicao)) {
                    this.jogadorDoMoinhoIndex = this.jogadorAtualIndex; // Fixa o jogador atual para captura
                    this.capturarPeca();
                } else {
                    this.alternarJogador(); // Só alterna a vez se nenhum moinho foi formado
                }

                this.exibirMensagemJogador();
            } else {
                alert("Você só pode mover para uma casa adjacente!");
            }
        } else {
            alert("Seleciona uma peça da sua cor");
        }
    } else {
        alert("Seleciona uma peça primeiro");
    }
    if (this.verificarFimDeJogo()) {
      return; // Termina o jogo se as condições de fim foram atendidas
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
  }

  verificarMoinho(posicao, jogador) {
    jogador = jogador || this.jogadorAtualIndex + 1; // Usa o jogador atual por padrão
    
    for (const moinho of this.moinhos) {
      if (moinho.includes(posicao) &&
          moinho.every(index => this.matrizTabuleiro[index] === jogador)) {
        return true;
      }
    }
    return false;
  }  

  capturarPeca() {
    const jogadorQueFormouMoinho = this.jogadores[this.jogadorAtualIndex]; // Jogador atual que formou o moinho
    const adversarioIndex = 1 - this.jogadorAtualIndex; // Índice do adversário

    alert(`${jogadorQueFormouMoinho.nome} formou um moinho! Selecione uma peça do adversário para capturar.`);

    this.capturaEmAndamento = true; // Marca captura como ativa

    const casas = document.querySelectorAll('.circle');

    casas.forEach(casa => {
        const posicao = parseInt(casa.dataset.index, 10);

        // Permite captura apenas de peças do adversário que não estão em um moinho
        if (this.matrizTabuleiro[posicao] === adversarioIndex + 1) {
            casa.addEventListener('click', () => {
                if (this.capturaEmAndamento && this.matrizTabuleiro[posicao] === adversarioIndex + 1) {
                    console.log(`Capturando peça adversária na posição ${posicao} pelo jogador ${jogadorQueFormouMoinho.nome}`);

                    // Atualiza o estado do tabuleiro e o estilo visual
                    this.matrizTabuleiro[posicao] = 0;
                    casa.style.backgroundColor = 'transparent';

                    // Atualiza o número de peças do adversário
                    this.jogadores[adversarioIndex].removerPeca();

                    this.capturaEmAndamento = false; // Finaliza a fase de captura
                    this.selectedPieceIndex = null;

                    // Alterna para o próximo jogador após a captura
                    this.alternarJogador();
                    this.exibirMensagemJogador();
                }
            }, { once: true });
        }
    });
  }

  verificarFimDeJogo() {
    // Só verifica o fim de jogo se estivermos na fase "mover"
    if (this.fase !== 'mover') {
        return false; // Continua o jogo se ainda estivermos na fase "colocar"
    }

    const jogadorAtual = this.jogadores[this.jogadorAtualIndex];
    const adversarioIndex = 1 - this.jogadorAtualIndex;
    const jogadorAdversario = this.jogadores[adversarioIndex];

    // Condição 1: Derrota se um jogador tiver menos de 3 peças
    if (jogadorAtual.pecasEmJogo < 3) {
        this.exibirMensagemFimDeJogo(`${jogadorAdversario.nome} venceu!`);
        return true;
    } else if (jogadorAdversario.pecasEmJogo < 3) {
        this.exibirMensagemFimDeJogo(`${jogadorAtual.nome} venceu!`);
        return true;
    }

    // Condição 2: Empate se ambos os jogadores têm 3 peças e o limite de 10 jogadas foi atingido
    if (jogadorAtual.pecasEmJogo === 3 && jogadorAdversario.pecasEmJogo === 3 && this.contadorJogadas >= 10) {
        this.exibirMensagemFimDeJogo("Empate: Ambos os jogadores têm apenas 3 peças e não houve vencedor em 10 jogadas.");
        return true;
    }

    // Condição 3: Empate se não houver jogadas válidas possíveis
    const jogadasValidas = this.verificarJogadasValidas(jogadorAtual) || this.verificarJogadasValidas(jogadorAdversario);
    if (!jogadasValidas) {
        this.exibirMensagemFimDeJogo("Empate: Não há jogadas válidas disponíveis.");
        return true;
    }

    return false; // Continua o jogo
  }

  verificarJogadasValidas(jogador) {
    // Percorre o tabuleiro para encontrar peças do jogador
    for (let i = 0; i < this.matrizTabuleiro.length; i++) {
        if (this.matrizTabuleiro[i] === this.jogadores.indexOf(jogador) + 1) {
            // Verifica se há movimentos válidos adjacentes para a peça do jogador
            for (const adjacente of this.adjacencias[i]) {
                if (this.matrizTabuleiro[adjacente] === 0) {
                    return true; // Há pelo menos uma jogada válida disponível
                }
            }
        }
    }
    return false; // Nenhuma jogada válida disponível
  }

  exibirMensagemFimDeJogo(mensagem) {
    const mensagemJogador = document.getElementById('mensagemJogador');
    mensagemJogador.textContent = mensagem;

    // Desativa o tabuleiro para impedir jogadas adicionais
    const casas = document.querySelectorAll('.circle');
    casas.forEach(casa => {
        casa.onclick = null; // Remove eventos de clique das casas
    });
  }

  isAdjacente(pos1, pos2) {
    return this.adjacencias[pos1] && this.adjacencias[pos1].includes(pos2);
  }

  contarPecasNoTabuleiro(jogadorIndex) {
    return this.matrizTabuleiro.filter(posicao => posicao === jogadorIndex + 1).length;
  }

  isMovimentoLivre() {
    // Retorna true se o jogador atual tiver apenas 3 peças no tabuleiro
    return this.contarPecasNoTabuleiro(this.jogadorAtualIndex) === 3;
  }

  alternarJogador() {
    // Só alterna se não houver uma captura pendente
    if (!this.capturaEmAndamento) {
        this.jogadorAtualIndex = 1 - this.jogadorAtualIndex;
    }
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
