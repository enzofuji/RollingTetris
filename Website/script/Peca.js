'use strict';

const qtdTipos = 7;
const cores = gerarCores();
const CORESPECIAL = cores.ESPECIAL;

// define os tipos de peças que caem 
const tipos = {
    LINHA: [
        [
            [1],
            [1],
            [1],
            [1]
        ],
        [
            [1, 1, 1, 1]
        ]
    ],
    T: [
        [
            [0, 1, 0],
            [1, 1, 1]
        ],
        [
            [1, 0],
            [1, 1],
            [1, 0]
        ],
        [
            [1, 1, 1],
            [0, 1, 0]
        ],
        [
            [0, 1],
            [1, 1],
            [0, 1]
        ]
    ],
    L_INFERIOR: [
        [
            [1, 0],
            [1, 0],
            [1, 1]
        ],
        [
            [1, 1, 1],
            [1, 0, 0]
        ],
        [
            [1, 1],
            [0, 1],
            [0, 1]
        ],
        [
            [0, 0, 1],
            [1, 1, 1]
        ]
    ],
    L_SUPERIOR: [
        [
            [0, 1],
            [0, 1],
            [1, 1]
        ],
        [
            [1, 0, 0],
            [1, 1, 1]
        ],
        [
            [1, 1],
            [1, 0],
            [1, 0]
        ],
        [
            [1, 1, 1],
            [0, 0, 1]
        ]
    ],
    U: [
        [
            [1, 0, 1],
            [1, 1, 1]
        ],
        [
            [1, 1],
            [1, 0],
            [1, 1]
        ],
        [
            [1, 1, 1],
            [1, 0, 1]
        ],
        [
            [1, 1],
            [0, 1],
            [1, 1]
        ]
    ],
    CUBO: [
        [
            [1, 1],
            [1, 1]
        ]
    ],
    ESPECIAL: [
        [
            [1]
        ]
    ]
}

class Peca {
    constructor(col) {
        this._arrayTipo = this.gerarTipo();
        this._estado = 0;
        this._tipo = this._arrayTipo[this.estado];
        this.x = parseInt(col / 2) - 1;
        this.y = (-1 * this.altura) - 1;  // Permite que a peça seja gerada antes do tabuleiro visual
        this._cor = this.escolherCor();
    }

    get tipo() { return this._tipo; }

    set tipo(value) { this._tipo = value; }

    // Retorna a largura da peça atual
    get largura() { return this._tipo[0].length; }

    // Retorna a altura da peça atual
    get altura() { return this._tipo.length; }

    get cor() { return this._cor; }

    set x(x) { this._x = x; }

    get x() { return this._x; }

    set y(y) { this._y = y; }

    get y() { return this._y; }

    get estado() { return this._estado; }

    gerarTipo() {
        let index = 0;
        const limite = this.gerarRandom(0, qtdTipos);
        for (let item in tipos) {
            if (index++ === limite) {
                return tipos[item];
            }
        }
    }

    escolherCor() {
        if (this.tipo == tipos.ESPECIAL[0]) {
            // Peça causa a rotação
            return CORESPECIAL;
        }
        let index = 0;
        const limite = this.gerarRandom(0, 7);  // CASO NOVAS CORES SEJAM ADICIONADAS DEVE SER ALTERADO AQUI
        for (let item in cores) {
            if (index++ === limite) {
                return cores[item];
            }
        }
    }

    gerarRandom(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    rotacionar() {
        let max = this._arrayTipo.length - 1;
        this._estado++;
        if (this._estado > max) {
            this._estado = 0;
        }
        this.tipo = this._arrayTipo[this.estado];

        // Verificar se ultrapassou o tabuleiro
        while (this.x + this.largura > COLS) {
            this.x--;
        }

    }

    descerPeca() {
        // Verifica antes de desenhar se é possiver avançar
        if (!this.colisorInferior(board)) {
            // Peça colide com a inferior e é printada na tela
            this.pintaPecaBoard(board);
            resetPecas();
        } else {
            // Consegue descer
            this.y += 1;
            desenha();
        }
    }

    // COLISÃO
    colisorInferior(board) {
        if (this.y + this.altura < -1) {
            // Ignora o início - peça ainda não está no board
            return true;
        }
        if (this.y + this.altura == ROWS) {
            // Chegou no fim
            return false;
        }
        // Verificar na matriz com peças fixas se é possível descer
        // Os pontos de colisão de cada peça devem ser o primeiro elemento com 1 de cada coluna da matriz da peça, começando de baixo
        try {
            for (let col = 0; col < this.largura; col++) {
                for (var row = this.altura - 1; row >= 0; row--) {
                    // Encontar o ponto mais baixo
                    if (this.valueOf()[row][col] == 1) {
                        break;
                    }
                }
                // Verificar se é possivel avançar
                let corBaixo = board[this.y + row + 1][this.x + col];
                if (corBaixo != corPadrao) {
                    // COLISÃO
                    return false;
                }
            }
            // Não houve colisão
            return true;
        } catch (error) {
            if (this.y + this.altura == ROWS) {
                // Chegou no fim
                return false;
            }
            return true; // Peça fora do board
        }
    }

    colisorLateral(board, movingToRight) {
        if (this.y < -this.altura || this.y < 0) {
            // Ignora o início
            return true;
        }
        if (movingToRight) {
            // Para o movimento a direita, verificar toda a última coluna
            for (let lin = 0; lin < this.altura; lin++) {
                let corDifeita = board[this.y + lin][this.x + this.largura];  // Não é necessário incrementar 1, pois largura já está com incremento
                if (corDifeita != corPadrao) {
                    // COLISÃO
                    return false;
                }
            }
            return true;

        } else {
            // Para o movimento a esquerda, verificar toda coluna 0
            for (let lin = 0; lin < this.altura; lin++) {
                let corEsquerda = board[this.y + lin][this.x - 1];
                if (corEsquerda != corPadrao) {
                    // COLISÃO
                    return false;
                }
            }
            return true;
        }
    }

    pintaPecaBoard(board) {
        // Desenha peça no fundo do tabuleiro
        try {
            this.valueOf().forEach((row, y) => {
                row.forEach((value, x) => {
                    if (value != 0) {
                        board[y + this.y][x + this.x] = this.cor;
                    }
                });
            });
            // Verificar posição máxima se excede o tabuleiro
            if (this.y <= 0) {
                gameOver();
            }
        } catch (e) {
            if (this.y <= 0) {
                gameOver();
            }
            // this.y--;
        }
    }

    desenhanNoCanvas(context, xMargem = 0, yMargem = 0) {
        const id = context.canvas.id;
        const bloco = id == 'tetris' ? TAMANHO_BLOCO : 30;  // Usado para definir o tamanho do canvas principal ou next
        this.valueOf().forEach((row, y) => {
            row.forEach((value, x) => {
                if (value != 0) {
                    context.fillStyle = this.cor;
                    context.fillRect(blocoParaCoordenada(x + this.x + xMargem, bloco), blocoParaCoordenada(y + this.y + yMargem, bloco), bloco, bloco);
                }
            });
        });
    }

}

Peca.prototype.valueOf = function () {
    return this._tipo;
};