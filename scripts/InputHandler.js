class InputHandler {
    constructor(renderer, gameState) {
        this.renderer = renderer;
        this.gameState = gameState;
        this.peçaSelecionada = null;

        // Registrar eventos de interação
        this.renderer.tabuleiroElement.addEventListener('mouseover', this.handleHover.bind(this));
        this.renderer.tabuleiroElement.addEventListener('mouseout', this.handleMouseOut.bind(this));
        this.renderer.tabuleiroElement.addEventListener('click', this.handleClick.bind(this));
    }

    // Função para gerenciar hover (mouseover)
    handleHover(event) {
        const target = event.target;
        if (target.classList.contains('circle')) {
            this.configurarHover(target);
        }
    }

    // Função para remover hover (mouseout)
    handleMouseOut(event) {
        const target = event.target;
        if (target.classList.contains('circle')) {
            this.configurarMouseOut(target);
        }
    }

    // Função de hover
    configurarHover(circle) {
        // Só adiciona o efeito de hover se a peça ainda não foi colocada
        if (!circle.classList.contains('Player 1') && !circle.classList.contains('Player 2')) {
            circle.classList.add('hover');
        }
    }

    // Função para remover o efeito de hover
    configurarMouseOut(circle) {
        circle.classList.remove('hover');
    }

    // Função de clique
    handleClick(event) {
        const target = event.target;
        if (target.classList.contains('circle')) {
            this.configurarClique(target);
        }
    }

    configurarClique(circle) {
        const linha = parseInt(circle.dataset.linha, 10);
        const coluna = parseInt(circle.dataset.coluna, 10);
    
        // Se o jogador está na fase de movimentação e já selecionou uma peça
        if (this.peçaSelecionada) {
            // Verifica se o clique é em uma casa válida para movimento
            if (this.gameState.isDestinoValido(this.peçaSelecionada, linha, coluna)) {
                // Move a peça para o destino
                this.gameState.moverPeca(this.peçaSelecionada, linha, coluna);
                this.peçaSelecionada = null; // Reseta a peça selecionada
    
                // Verifica se o jogador formou um moinho após o movimento
                if (this.gameState.verificarMoinho(this.peçaSelecionada.jogador)) {
                    this.gameState.permissaoCaptura = true; // Permite captura de peça adversária
                }
            }
        } else {
            // Colocação de peça na fase de colocação
            if (!circle.classList.contains('Player 1') && !circle.classList.contains('Player 2') && this.gameState.fase === 'colocacao') {
                // Só permite colocar a peça se for a vez do jogador e ainda houver peças restantes
                if (this.gameState.turnoAtual === "Player 1" && this.gameState.jogador1.pecasRestantes > 0) {
                    circle.classList.add('Player 1'); // Marca o círculo com a cor do Player 1
                    this.gameState.posicionarPeca(this.gameState.jogador1, linha, coluna);
                } else if (this.gameState.turnoAtual === "Player 2" && this.gameState.jogador2.pecasRestantes > 0) {
                    circle.classList.add('Player 2'); // Marca o círculo com a cor do Player 2
                    this.gameState.posicionarPeca(this.gameState.jogador2, linha, coluna);
                }
    
                // Passar para a próxima fase após posicionar uma peça
                this.gameState.passarFase();
                this.gameState.alternarTurno();
    
                // Atualiza o contador de peças restantes para os jogadores
                atualizarPecasContainers(this.gameState);
    
                // Remove o efeito de hover imediatamente após o clique
                circle.classList.remove('hover');
    
                // Garantir que o hover não ocorra mais neste círculo
                circle.classList.add('no-hover');
            }
        }
    
        // Se a captura for permitida, o jogador pode clicar para capturar
        if (this.gameState.permissaoCaptura) {
            if (this.gameState.turnoAtual === "Player 1" && circle.classList.contains('Player 2')) {
                this.gameState.capturarPeca(linha, coluna); // Captura a peça adversária
                this.gameState.permissaoCaptura = false; // Desabilita a captura até o próximo moinho
            } else if (this.gameState.turnoAtual === "Player 2" && circle.classList.contains('Player 1')) {
                this.gameState.capturarPeca(linha, coluna); // Captura a peça adversária
                this.gameState.permissaoCaptura = false; // Desabilita a captura até o próximo moinho
            }
        }
    
        // Atualiza o estado do jogo e a tela
        this.gameState.atualizarEstadoTabuleiro();
    }
    
}
