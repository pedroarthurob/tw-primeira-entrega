class InputHandler {
    constructor(renderer, gameState) {
        this.renderer = renderer;
        this.gameState = gameState;
        this.peçaSelecionada = null;

        // Flag para saber se a fase de captura foi ativada após um moinho ser formado
        this.capturaAtiva = false;

        // Registrar eventos de interação
        this.renderer.tabuleiroElement.addEventListener('mouseover', this.handleHover.bind(this));
        this.renderer.tabuleiroElement.addEventListener('mouseout', this.handleMouseOut.bind(this));
        this.renderer.tabuleiroElement.addEventListener('click', this.handleClick.bind(this));
        // this.renderer.tabuleiroElement.querySelectorAll(".circle").forEach(circle => {
        //     circle.addEventListener('click', this.configurarClique.bind(this));
        //     console.log("Evento registrado para:", circle);
        // });
        document.addEventListener("DOMContentLoaded", () => {
            this.renderer.tabuleiroElement.querySelectorAll(".circle").forEach(circle => {
                circle.addEventListener('click', this.configurarClique.bind(this));
                console.log("Evento registrado para:", circle);
            });
        });

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
        if (!circle.classList.contains(this.gameState.jogador1.cor) && !circle.classList.contains(this.gameState.jogador2.cor)) {
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
        const index = circle.dataset.index;
        const [linha, coluna] = index.slice(1, -1).split(',').map(Number);
    
        // Colocação de peça na fase de colocação
        if (!circle.classList.contains(this.gameState.jogador1.cor) && !circle.classList.contains(this.gameState.jogador2.cor) && this.gameState.fase === 'Colocação') {
            // Só permite colocar a peça se for a vez do jogador e ainda houver peças restantes
            if (this.gameState.turnoAtual.nome === "Player 1" && this.gameState.jogador1.pecasRestantes > 0) {
                circle.classList.add(this.gameState.jogador1.cor); // Marca o círculo com a cor do Player 1
                this.gameState.posicionarPeca(this.gameState.jogador1, linha, coluna);
            } else if (this.gameState.turnoAtual.nome === "Player 2" && this.gameState.jogador2.pecasRestantes > 0) {
                circle.classList.add(this.gameState.jogador2.cor); // Marca o círculo com a cor do Player 2
                this.gameState.posicionarPeca(this.gameState.jogador2, linha, coluna);
            }
            // Atualiza o contador de peças restantes para os jogadores
            this.renderer.renderizarPecas(this.gameState);
            
            // Passar para a próxima fase após posicionar uma peça
            this.gameState.passarFase();
            this.gameState.alternarTurno();
    
            if (this.gameState.fase === "Movimentação") {
                this.gameState.jogador1.pecasRestantes = this.gameState.tamanhoTabuleiro * 3;
                this.gameState.jogador1.pecasRestantes = this.gameState.tamanhoTabuleiro * 3;
            }
            
        } else if (this.gameState.fase === 'Movimentação') {
            // Verificar se o jogador tem movimentos válidos antes de continuar
            const existemMovimentosValidos = this.gameState.tabuleiro.movimentosValidos(this.gameState.turnoAtual);
    
            if (!existemMovimentosValidos) {
                console.log("Não há movimentos válidos para o jogador " + this.gameState.turnoAtual.nome);
                document.getElementById("mensagem-superior").textContent = "Turno: " + this.gameState.turnoAtual.nome + "\n" + "Você não tem movimentos válidos!";
                this.gameState.alternarTurno();
            }
    
            if (!this.peçaSelecionada) {
                // SELEÇÃO DA PEÇA
                // Verifica se o jogador clicou em uma peça do turno atual
                if (circle.classList.contains(this.gameState.turnoAtual.cor)) {
                    this.peçaSelecionada = { linha, coluna, circle }; // Armazena a peça selecionada, incluindo o elemento DOM (circle)
                    circle.classList.add('selecionada'); // Adiciona um destaque visual
                }
            } else {
                // MOVIMENTAÇÃO DA PEÇA
                if (this.peçaSelecionada.circle === circle) {
                    // Se a peça clicada for a mesma já selecionada, desmarque ela
                    this.peçaSelecionada.circle.classList.remove('selecionada'); // Remove a classe 'selecionada'
                    this.peçaSelecionada = null; // Reseta a peça selecionada
                } else {
                    // Verifica se a casa é válida para movimento
                    if (this.gameState.isDestinoValido(this.peçaSelecionada, linha, coluna)) {
                        const { linha: i, coluna: j } = this.peçaSelecionada;
                        this.gameState.moverPeca(this.gameState.turnoAtual, i, j, linha, coluna); // Move a peça
                        circle.classList.add(this.gameState.turnoAtual.cor);
                        this.peçaSelecionada.circle.classList.remove(this.gameState.turnoAtual.cor);
                        this.peçaSelecionada.circle.classList.remove('selecionada'); // Remove o destaque visual da peça anterior
                        this.peçaSelecionada = null; // Reseta a seleção
    
                        if (this.gameState.tabuleiro.verificaMoinho(linha, coluna)) {
                            console.log(this.gameState.turnoAtual.nome + " formou um moinho");
                            document.getElementById("mensagem-superior").textContent = "Turno: " + this.gameState.turnoAtual.nome + "\n" + "Você formou um Moinho";
                            document.getElementById("mensagem-inferior").textContent = "Fase: Captura";
    
                            // Captura de peça adversária
                            this.capturaAtiva = true;
                            this.destacarPecasAdversarias();
                        } else {
                            this.gameState.alternarTurno();
                        }
                    } else {
                        console.log("Movimento inválido!");
                    }
                }
            }
        }
    
        if (this.gameState.verificarEmpate()) {
            document.getElementById("mensagem-superior").textContent = "Fim de Jogo! \n Empate";
        } else if (this.gameState.verificarDerrota()) {
            const ganhador = this.gameState.turnoAtual === this.gameState.jogador1 ? this.gameState.jogador2.nome : this.gameState.jogador1.nome
            document.getElementById("mensagem-superior").textContent = "Fim de Jogo! \n" + ganhador + " ganhou";
        } else {
            document.getElementById("mensagem-superior").textContent = "Turno: " + this.gameState.turnoAtual.nome;
            document.getElementById("mensagem-inferior").textContent = "Fase: " + this.gameState.fase;
            console.log(this.gameState.jogador1.pecasRestantes);
            console.log(this.gameState.jogador2.pecasRestantes);
        }
    }
    

    // Função para destacar as peças adversárias
    destacarPecasAdversarias() {
        // Seleciona todos os círculos (peças) no DOM
        const circles = document.querySelectorAll('.circle');

        // Destaca as peças adversárias
        circles.forEach(circle => {
            if (circle.classList.contains(this.gameState.turnoAtual === this.gameState.jogador1 ? this.gameState.jogador2.cor : this.gameState.jogador1.cor)) {
                circle.classList.add('capturável');
                const capturaCallback = () => this.capturarPeca(circle);
                circle.dataset.capturaCallback = capturaCallback.toString();
                circle.addEventListener('click', capturaCallback);
            }
        });
    }

    capturarPeca(circle) {
        // Se a fase de captura não estiver ativa, não faz nada
        if (!this.capturaAtiva) {
            return;
        }

        // Remove a cor da peça adversária (não a remove do tabuleiro)
        const corAdversaria = this.gameState.turnoAtual === this.gameState.jogador1 ? this.gameState.jogador2.cor : this.gameState.jogador1.cor;
        circle.classList.remove(corAdversaria);
        
        const player = this.gameState.turnoAtual === this.gameState.jogador1 ? this.gameState.jogador1 : this.gameState.jogador2;
        player.capturarPeca();

        // Marca que a captura foi realizada
        this.capturaAtiva = false; // Desativa a captura após uma peça ser capturada

        // Remove a classe 'capturável' de todas as peças adversárias
        document.querySelectorAll('.capturável').forEach(capturável => {
            capturável.classList.remove('capturável');
            const capturaCallbackStr = capturável.dataset.capturaCallback;
            if (capturaCallbackStr) {
                const capturaCallback = new Function('return ' + capturaCallbackStr)();
                capturável.removeEventListener('click', capturaCallback);
                delete capturável.dataset.capturaCallback;
            }
        });

        // Alterna para o próximo turno
        console.log("Peça adversária capturada!");
        const index = circle.dataset.index;
        const [linha, coluna] = index.slice(1, -1).split(',').map(Number);
        this.gameState.tabuleiro.retirarPeca(linha, coluna);
        this.gameState.alternarTurno();
    }

    async handleInput(linha, coluna) {
        if (this.gameState.modoDeJogo === 'multiplayer') {
            // Chame a API quando for no modo multiplayer
            const { nick, password } = this.gameState;
            const response = await notifyMove(nick, password, this.peçaSelecionada.posicao, { linha, coluna });
            if (response) {
                console.log('Jogada notificada no servidor.');
            }
        }

        if (this.peçaSelecionada) {
            this.gameState.moverPeca(this.peçaSelecionada, linha, coluna);
        }
    }    

}

