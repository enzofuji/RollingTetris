// Desenho de uma peça
const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d',{ alpha: false });

const COLS = 10;
const ROWS = 20;
var TAMANHO_BROCO = setTamanhoBROCO(ROWS);
const corPadrao = "#111" // cor das células
const bordaPadrao = "#rgba(255, 255, 255, 0.1)" // cor das bordinhas

let board = []

for (let linhaAtual = 0; linhaAtual < ROWS; linhaAtual++)
{
    board[linhaAtual] = []
    for (let colunaAtual = 0; colunaAtual < COLS; colunaAtual++)
    {
        board[linhaAtual][colunaAtual] = corPadrao // preenche as cores do board
    }
}

resize();

let inicial_x = canvas.width / 2;
let inicial_y = 0;

const dx = 0;
const dy = 1;

context.fillStyle = '#000';
context.fillRect(0, 0, canvas.width, canvas.height);
let peca = new Peca();
// peca = peca.tipo;

// Variaveis para o teclado
var upPressed, rightPressed, leftPressed, downPressed = false;

function desenha()
{
    // context.canvas.width = window.innerWidth;
    // context.canvas.height = window.innerHeight;
    clear();
    desenhaBoard();
    peca.valueOf().forEach((row, y) =>{
        row.forEach((value, x) => {
            if (value != 0){
                context.fillStyle = 'red';
                context.fillRect(x + inicial_x, y+inicial_y, 1, 1);
            }
        });
    });

    inicial_x += dx;
    inicial_y += dy;

    // Permite gerar uma nova peça ao sair do tabuleiro
    if (inicial_y > canvas.height) {
        inicial_y = 0;
        inicial_x = canvas.width/2;
        peca = new Peca();        
    }
}

function gerenciarTeclas() {
    //Comando relacionado às teclas
    if(rightPressed) //Tecla direita
    {
        console.log(peca.valueOf());
        inicial_x = inicial_x + 10;
        if(inicial_x + 4 > canvas.width) //Checagem do limite direito
        {
            inicial_x = canvas.width - 4;
        }
    }
    if(leftPressed) //Tecla esquerda
    {
        inicial_x = inicial_x - 10;
        if(inicial_x < 0)   //Checagem do limite esquerdo
        {
            inicial_x = 0;
        }
    }
    if(downPressed) //Tecla inferior
    {
        inicial_y = inicial_y + 3;
    }
    if(upPressed) //Tecla Superior
        peca.rotacionar()
}


//Verificação dos botões pressionados
function keyDownHandler(e){
    if(e.key == 'Right' || e.key == 'ArrowRight')
    {
        rightPressed = true;
    }
    else if(e.key == 'Left' || e.key == 'ArrowLeft')
    {
        leftPressed = true;
    }
    else if(e.key == 'Down' || e.key == 'ArrowDown')
    {
        downPressed = true;
    }
    else if(e.key == 'Up' || e.key == 'ArrowUp')
    {
        upPressed = true;
    }
    gerenciarTeclas();
}

//verificação dos botões soltos 
function keyUpHandler(e){
    if(e.key == 'Right' || e.key == 'ArrowRight')
    {
        rightPressed = false;
    }
    else if(e.key == 'Left' || e.key == 'ArrowLeft')
    {
        leftPressed = false;
    }
    else if(e.key == 'Down' || e.key == 'ArrowDown')
    {
        downPressed = false;
    }
    else if(e.key == 'Up' || e.key == 'ArrowUp')
    {
        upPressed = false;
    }
    gerenciarTeclas();
}

desenhaBoard();
var test = setInterval(desenha, 200);

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);