class Tabuleiro {
    constructor(n) {
        this.n = n;
        this.matrix = this.criarMatriz(n);
        this.adj = this.precomputarVizinhos(this.matrix);
    }

    verificaMoinho(i, j) {

        // Caso onde i,j é a célula central de um moinho vertical
        if (
            this.auxVerificaMoinho(this.vizinhoNorte(i,j), this.vizinhoSul(i,j), i,j)
        ) {
            return true;
        }
    
        // Caso onde i,j é a célula central de um moinho horizontal
        if (
            this.auxVerificaMoinho(this.vizinhoLeste(i,j), this.vizinhoOeste(i,j), i, j)
        ) {
            return true;
        }
    
        // Caso onde i,j é a célula da esquerda de um moinho horizontal
        const vizinhoDireita = this.vizinhoLeste(i, j);
        if (vizinhoDireita) {
            const vizinhoDireita2 = this.vizinhoLeste(vizinhoDireita[0], vizinhoDireita[1]);
            if (
                this.auxVerificaMoinho(vizinhoDireita, vizinhoDireita2, i, j)
            ) {
                return true;
            }
        }
    
        // Caso onde i,j é a célula da direita de um moinho horizontal
        const vizinhoEsquerda = this.vizinhoOeste(i, j);
        if (vizinhoEsquerda) {
            const vizinhoEsquerda2 = this.vizinhoOeste(vizinhoEsquerda[0], vizinhoEsquerda[1]);
            if (
                this.auxVerificaMoinho(vizinhoEsquerda, vizinhoEsquerda2, i, j)
            ) {
                return true;
            }
        }
    
        // Caso onde i,j é a célula de cima de um moinho vertical
        const vizinhoSul = this.vizinhoSul(i, j);
        if (vizinhoSul) {
            const vizinhoSul2 = this.vizinhoSul(vizinhoSul[0], vizinhoSul[1]);
            if (
                this.auxVerificaMoinho(vizinhoSul, vizinhoSul2, i, j)
            ) {
                return true;
            }
        }
    
        // Caso onde i,j é a célula de baixo de um moinho vertical
        const vizinhoNorte = this.vizinhoNorte(i, j);
        if (vizinhoNorte) {
            const vizinhoNorte2 = this.vizinhoNorte(vizinhoNorte[0], vizinhoNorte[1]);
            if (
                this.auxVerificaMoinho(vizinhoNorte, vizinhoNorte2, i, j)
            ) {
                return true;
            }
        }
    
        return false;
    }

    posicionarPeca(jogador, i, j) {
        this.matrix[i][j] = jogador.nome === "Player 1" ? 1 : 2;
    }

    // preciso de jogador aqui? incremento decremento aqui?
    // R: Não, responsabilidade fica pra GameState
    retirarPeca(i, j) {
        this.matrix[i][j] = 0;
    }

    moverPeca(i, j, novoI, novoJ) {
        this.matrix[novoI][novoJ] = this.matrix[i][j];
        this.matrix[i][j] = null;
    }

    validarMovimento(i, j, novoI, novoJ) {
        // Exemplo: Checar se o movimento é válido (dentro dos limites e célula vazia)
        return this.matrix[i][j] !== 0 && this.matrix[novoI][novoJ] === 0;
    }

    validarPosicao(i, j) {
        return this.matrix[i][j] === 0;
    }

    criarMatriz(n) {
        const tamanho = 2 * n + 1;
        const meio = Math.floor(n);

        const matrix = Array.from({ length: tamanho }, () => Array(tamanho).fill(-1));

        for (let i = 0; i < tamanho; ++i) {
            for (let j = 0; j < tamanho; ++j) {
                if (
                    i === meio ||       // Linha média horizontal
                    j === meio ||       // Linha média vertical
                    i === j ||          // Diagonal principal 
                    i + j === tamanho - 1 // Diagonal secundária
                ) {
                    matrix[i][j] = 0;
                }
            }
        }

        matrix[n][n] = -1;

        return matrix;
    }

    precomputarVizinhos(matriz) {
        const n = matriz.length;
        const vizinhos = Array.from({ length: n }, () =>
            Array.from({ length: n }, () => [])
        );

        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                if (matriz[i][j] === 0) {
                    // Verificar vizinho ao norte
                    for (let k = i - 1; k >= 0; k--) {
                        if (matriz[k][j] === 0) {
                            vizinhos[i][j].push([k, j]);
                            break;
                        }
                    }

                    // Verificar vizinho ao sul
                    for (let k = i + 1; k < n; k++) {
                        if (matriz[k][j] === 0) {
                            vizinhos[i][j].push([k, j]);
                            break;
                        }
                    }

                    // Verificar vizinho ao oeste
                    for (let k = j - 1; k >= 0; k--) {
                        if (matriz[i][k] === 0) {
                            vizinhos[i][j].push([i, k]);
                            break;
                        }
                    }

                    // Verificar vizinho ao leste
                    for (let k = j + 1; k < n; k++) {
                        if (matriz[i][k] === 0) {
                            vizinhos[i][j].push([i, k]);
                            break;
                        }
                    }
                }
            }
        }

        // Retirar vizinhos extras do quadrado central
        const meio = Math.floor(n / 2);

        // Remover relação horizontal
        vizinhos[meio][meio - 1] = vizinhos[meio][meio - 1].filter(
            ([vi, vj]) => !(vi === meio && vj === meio + 1)
        );
        vizinhos[meio][meio + 1] = vizinhos[meio][meio + 1].filter(
            ([vi, vj]) => !(vi === meio && vj === meio - 1)
        );

        // Remover relação vertical
        vizinhos[meio - 1][meio] = vizinhos[meio - 1][meio].filter(
            ([vi, vj]) => !(vi === meio + 1 && vj === meio)
        );
        vizinhos[meio + 1][meio] = vizinhos[meio + 1][meio].filter(
            ([vi, vj]) => !(vi === meio - 1 && vj === meio)
        );

        return vizinhos;
    }

    vizinhoNorte(i, j) {
        const vizinho = this.adj[i][j].filter(([x, y]) => x === i && y < j);  // Filtra vizinho ao norte
        return vizinho.length > 0 ? vizinho[0] : false;
    }
    
    vizinhoSul(i, j) {
        const vizinho = this.adj[i][j].filter(([x, y]) => x === i && y > j);  // Filtra vizinho ao sul
        return vizinho.length > 0 ? vizinho[0] : false;
    }
    
    vizinhoLeste(i, j) {
        const vizinho = this.adj[i][j].filter(([x, y]) => x > i && y === j);  // Filtra vizinho ao leste
        return vizinho.length > 0 ? vizinho[0] : false;
    }
    
    vizinhoOeste(i, j) {
        const vizinho = this.adj[i][j].filter(([x, y]) => x < i && y === j);  // Filtra vizinho ao oeste
        return vizinho.length > 0 ? vizinho[0] : false;
    }
    
    auxVerificaMoinho(vizinho1, vizinho2, i, j) {
        return vizinho1 && vizinho2 && 
               this.matrix[vizinho1[0]][vizinho1[1]] === 
               this.matrix[vizinho2[0]][vizinho2[1]] &&
               this.matrix[vizinho2[0]][vizinho2[1]] ===
               this.matrix[i][j] &&
               this.matrix[vizinho1[0]][vizinho1[1]] ===
               this.matrix[i][j] && 
               this.matrix[i][j] > 0;
    }


}

// const Jogador = require('./Jogador');

// const test = new Tabuleiro(6);
// console.table(test.matrix);
// const jogador1 = new Jogador("blue", "Player 1", 6);
// const jogador2 = new Jogador("yellow", "Player 2", 6);
// console.log(jogador1.nome);
// console.log(jogador2.nome);
// test.posicionarPeca(jogador1, 0, 0);
// test.posicionarPeca(jogador2, 0, 6);
// test.posicionarPeca(jogador1, 0, 12);
// test.posicionarPeca(jogador2, 1, 6);
// test.posicionarPeca(jogador1, 6, 0);
// test.posicionarPeca(jogador2, 2, 6);
// test.posicionarPeca(jogador1, 12, 0);
// test.posicionarPeca(jogador2, 5, 6);

// console.table(test.matrix);

// // Criar uma nova matriz com o mesmo tamanho de `matrix`
// const novaMatriz = Array.from({ length: test.matrix.length }, () =>
//     Array(test.matrix.length).fill(false)
// );

// // Preencher a nova matriz com o resultado da função `formaMoinho`
// for (let i = 0; i < test.matrix.length; i++) {
//     for (let j = 0; j < test.matrix.length; j++) {
//         novaMatriz[i][j] = test.verificaMoinho(i, j);
//     }
// }

// // Imprimir a nova matriz para verificar os resultados
// console.table(novaMatriz);