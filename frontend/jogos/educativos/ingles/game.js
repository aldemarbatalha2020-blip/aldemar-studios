const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const TILE = 64;
const COLS = 15;
const ROWS = 10;

/*

# INTERFACE

*/

const scoreElement = document.getElementById("score");
const livesElement = document.getElementById("lives");
const timerElement = document.getElementById("timer");

const startScreen = document.getElementById("startScreen");
const questionScreen = document.getElementById("questionScreen");
const gameOverScreen = document.getElementById("gameOverScreen");

const startButton = document.getElementById("startButton");
const restartButton = document.getElementById("restartButton");

const questionElement = document.getElementById("question");
const answersElement = document.getElementById("answers");
const feedbackElement = document.getElementById("feedback");

const gameOverTitle = document.getElementById("gameOverTitle");
const gameOverText = document.getElementById("gameOverText");

/*

let checkpoint = 0;

function carregarCheckpoint() {

    const salvo =
        localStorage.getItem(
            "englishKingdomCheckpoint"
        );

    if (salvo !== null) {

        checkpoint =
            parseInt(salvo);

    } else {

        checkpoint = 0;

    }

}


# FASES

*/

const fases = [


{
    nome: "THE FIRST ARENA",
    tempo: 180,

    mapa: [
        "###############",
        "#P..........E.#",
        "#..####.......#",
        "#....B........#",
        "#.......####..#",
        "#.......B..E..#",
        "#..###.#......#",
        "#..........B..#",
        "#...........E.#",
        "###############"
    ]
},

{
    nome: "THE FORGOTTEN CASTLE",
    tempo: 150,

    mapa: [
        "###############",
        "#P...B......E.#",
        "#.###.........#",
        "#.....###.....#",
        "#........B....#",
        "#.....E...###.#",
        "#......B......#",
        "#..###........#",
        "#E........B...#",
        "###############"
    ]
},

{
    nome: "THE DARK FOREST",
    tempo: 150,

    mapa: [
        "###############",
        "#P......B.....#",
        "#...###.......#",
        "#..........E..#",
        "#.......###...#",
        "#...B.........#",
        "#..###........#",
        "#...E..#...B..#",
        "#..........E..#",
        "###############"
    ]
},

{
    nome: "THE LOST VILLAGE",
    tempo: 145,

    mapa: [
        "###############",
        "#P..B.......E.#",
        "#......###....#",
        "#.###.........#",
        "#.............#",
        "#....E..B.....#",
        "#.........###.#",
        "#..##.....B...#",
        "#..........E..#",
        "###############"
    ]
},

{
    nome: "THE ICE CITADEL",
    tempo: 140,

    mapa: [
        "###############",
        "#P.B........E.#",
        "#..###........#",
        "#.........B##.#",
        "#.............#",
        "#......###....#",
        "#.....B.......#",
        "#...##....E...#",
        "#......E......#",
        "###############"
    ]
},

{
    nome: "THE VOLCANIC CAVE",
    tempo: 135,

    mapa: [
        "###############",
        "#P....B....E..#",
        "#.....###.....#",
        "#.............#",
        "#.###.........#",
        "#....B.E......#",
        "#.........###.#",
        "#..##....B....#",
        "#...........E.#",
        "###############"
    ]
},

{
    nome: "THE HAUNTED RUINS",
    tempo: 130,

    mapa: [
        "###############",
        "#P..........E.#",
        "#..###........#",
        "#.....B.......#",
        "#.......###...#",
        "#..........B..#",
        "#.###.........#",
        "#....E.##.....#",
        "#..B.......E..#",
        "###############"
    ]
},

{
    nome: "THE KINGDOM OF SHADOWS",
    tempo: 125,

    mapa: [
        "###############",
        "#P...B......E.#",
        "#.........###.#",
        "#.###.........#",
        "#........B....#",
        "#.....###E....#",
        "#.......B.....#",
        "#...##........#",
        "#.E...........#",
        "###############"
    ]
},

{
    nome: "THE ANCIENT TEMPLE",
    tempo: 120,

    mapa: [
        "###############",
        "#P..B.......E.#",
        "#..###........#",
        "#.........B...#",
        "#......###....#",
        "#.........E...#",
        "#.....B....##.#",
        "#..##.........#",
        "#.E...........#",
        "###############"
    ]
},

/*
==================================================
FASE 10 — FINAL KINGDOM
==================================================
*/

{
    nome: "THE FINAL KINGDOM",
    tempo: 180,

    boss: true,

    mapa: [
        "###############",
        "#P............#",
        "#..###..###...#",
        "#.............#",
        "#..B......B...#",
        "#.....###.....#",
        "#.............#",
        "#...B......B..#",
        "#.........K...#",
        "###############"
    ]
}


];

 /*

# PERGUNTAS NORMAIS

*/

const perguntas = [


{
    pergunta: 'What does "DOG" mean?',
    respostas: [
        "Cachorro",
        "Gato",
        "Casa",
        "Livro"
    ],
    correta: 0
},

{
    pergunta: 'What does "APPLE" mean?',
    respostas: [
        "Laranja",
        "Maçã",
        "Banana",
        "Uva"
    ],
    correta: 1
},

{
    pergunta: 'What does "HOUSE" mean?',
    respostas: [
        "Escola",
        "Rua",
        "Casa",
        "Carro"
    ],
    correta: 2
},

{
    pergunta: 'What does "BOOK" mean?',
    respostas: [
        "Livro",
        "Mesa",
        "Cadeira",
        "Janela"
    ],
    correta: 0
},

{
    pergunta: 'What does "WATER" mean?',
    respostas: [
        "Fogo",
        "Água",
        "Terra",
        "Ar"
    ],
    correta: 1
},

{
    pergunta: 'What does "SCHOOL" mean?',
    respostas: [
        "Escola",
        "Igreja",
        "Hospital",
        "Mercado"
    ],
    correta: 0
},

{
    pergunta: 'What does "FRIEND" mean?',
    respostas: [
        "Inimigo",
        "Amigo",
        "Professor",
        "Irmão"
    ],
    correta: 1
},

{
    pergunta: 'What does "MORNING" mean?',
    respostas: [
        "Noite",
        "Tarde",
        "Manhã",
        "Semana"
    ],
    correta: 2
},

{
    pergunta: 'What does "FAMILY" mean?',
    respostas: [
        "Família",
        "Amigo",
        "Cidade",
        "Escola"
    ],
    correta: 0
},

{
    pergunta: 'What does "BEAUTIFUL" mean?',
    respostas: [
        "Pequeno",
        "Rápido",
        "Bonito",
        "Forte"
    ],
    correta: 2
}


];

/*

# PERGUNTAS DO BOSS

*/

const perguntasBoss = [


{
    pergunta: 'Choose the correct sentence:',
    respostas: [
        "She are happy.",
        "She is happy.",
        "She am happy.",
        "She be happy."
    ],
    correta: 1
},

{
    pergunta: 'What is the past of "GO"?',
    respostas: [
        "Goed",
        "Goes",
        "Went",
        "Going"
    ],
    correta: 2
},

{
    pergunta: 'Complete: "There ___ two books on the table."',
    respostas: [
        "is",
        "are",
        "am",
        "be"
    ],
    correta: 1
},

{
    pergunta: 'Choose the correct sentence:',
    respostas: [
        "I went to school yesterday.",
        "I go to school yesterday.",
        "I going to school yesterday.",
        "I goes to school yesterday."
    ],
    correta: 0
},

{
    pergunta: 'What does "WORRIED" mean?',
    respostas: [
        "Cansado",
        "Preocupado",
        "Feliz",
        "Faminto"
    ],
    correta: 1
}


];

 /*

# ESTADO DO JOGO

*/

let faseAtual = 0;

let mapa = [];

let jogador = null;

let bombas = [];

let explosoes = [];

let inimigos = [];

let boss = null;

let pontos = 0;

let vidas = 3;

let tempo = 180;

let jogoAtivo = false;

let perguntaAberta = false;

let bombaAtual = null;

let indicePergunta = 0;

let indicePerguntaBoss = 0;

let batalhaBoss = false;

let bossDerrotado = false;

let ultimoTempo = 0;

let acumuladorTempo = 0;

/*

# INICIAR FASE

*/

function iniciarFase() {


const fase = fases[faseAtual];

mapa = fase.mapa.map(
    linha => linha.split("")
);

bombas = [];
explosoes = [];
inimigos = [];

boss = null;

batalhaBoss = false;

bossDerrotado = false;

perguntaAberta = false;

bombaAtual = null;

tempo = fase.tempo;

jogador = null;

for (let y = 0; y < ROWS; y++) {

    for (let x = 0; x < COLS; x++) {

        const bloco = mapa[y][x];

        if (bloco === "P") {

            jogador = {
                x: x,
                y: y,
                invulneravel: 0,
                cooldown: 0
            };

            mapa[y][x] = ".";

        }

        if (bloco === "E") {

            inimigos.push({
                x: x,
                y: y,
                movimento: Math.random()
            });

            mapa[y][x] = ".";

        }

        /*
        BOSS
        */

        if (bloco === "K") {

            boss = {
                x: x,
                y: y,
                vida: 5,
                movimento: 0
            };

            mapa[y][x] = ".";

        }

    }

}

atualizarInterface();

desenhar();


}

/*

# INTERFACE

*/

function atualizarInterface() {


scoreElement.textContent =
    String(pontos).padStart(4, "0");

livesElement.textContent =
    "❤️".repeat(vidas) +
    "🖤".repeat(3 - vidas);

const minutos =
    Math.floor(tempo / 60);

const segundos =
    Math.floor(tempo % 60);

timerElement.textContent =
    String(minutos).padStart(2, "0") +
    ":" +
    String(segundos).padStart(2, "0");


}

 /*

# INICIAR JOGO

*/

function iniciarJogo() {


faseAtual = 0;

pontos = 0;

vidas = 3;

indicePergunta = 0;

indicePerguntaBoss = 0;

iniciarFase();

jogoAtivo = true;

perguntaAberta = false;

startScreen.classList.add("hidden");

gameOverScreen.classList.add("hidden");

questionScreen.classList.add("hidden");

ultimoTempo = performance.now();

requestAnimationFrame(loop);


}

 /*

# PRÓXIMA FASE

*/

function proximaFase() {


faseAtual++;

if (faseAtual < fases.length) {

    iniciarFase();

    jogoAtivo = true;

    perguntaAberta = false;

    bombaAtual = null;

    acumuladorTempo = 0;

    ultimoTempo = performance.now();

    requestAnimationFrame(loop);

    return;

}

terminarJogo(
    true,
    "Você completou todas as fases!"
);


}

 /*

# GAME OVER / VITÓRIA

*/

function terminarJogo(
venceu,
mensagem
) {


jogoAtivo = false;

questionScreen.classList.add("hidden");

gameOverScreen.classList.remove("hidden");

if (venceu) {

    gameOverTitle.textContent =
        "VOCÊ VENCEU!";

} else {

    gameOverTitle.textContent =
        "GAME OVER";

}

gameOverText.textContent =
    mensagem +
    " Pontuação: " +
    pontos;


}

 /*

# BLOQUEIO

*/

function bloqueado(x, y) {


if (
    x < 0 ||
    y < 0 ||
    x >= COLS ||
    y >= ROWS
) {

    return true;

}

if (mapa[y][x] === "#") {

    return true;

}

if (mapa[y][x] === "B") {

    return true;

}

if (
    bombas.some(
        bomba =>
            bomba.x === x &&
            bomba.y === y &&
            bomba.ativa
    )
) {

    return true;

}

return false;


}

 /*

# MOVIMENTO DO JOGADOR

*/

function moverJogador(dx, dy) {


if (
    !jogoAtivo ||
    perguntaAberta
) {

    return;

}

if (
    jogador.cooldown > 0
) {

    return;

}

const novoX =
    jogador.x + dx;

const novoY =
    jogador.y + dy;

/*
BOSS
*/

if (
    boss &&
    !bossDerrotado &&
    novoX === boss.x &&
    novoY === boss.y
) {

    iniciarBatalhaBoss();

    return;

}

if (
    bloqueado(novoX, novoY)
) {

    return;

}

jogador.x = novoX;

jogador.y = novoY;

jogador.cooldown = 0.12;

verificarColisaoInimigo();


}

 /*

# BOMBA

*/

function colocarBomba() {


if (
    !jogoAtivo ||
    perguntaAberta
) {

    return;

}

const existe =
    bombas.some(
        bomba =>
            bomba.x === jogador.x &&
            bomba.y === jogador.y
    );

if (existe) {

    return;

}

const bomba = {

    x: jogador.x,

    y: jogador.y,

    ativa: true,

    tempo: null,

    piscando: 0,

    contagemAtiva: false

};

bombas.push(bomba);

abrirPergunta(bomba);


}

/*

# PERGUNTA DA BOMBA

*/

function abrirPergunta(bomba) {


perguntaAberta = true;

bombaAtual = bomba;

const pergunta =
    perguntas[
        indicePergunta %
        perguntas.length
    ];

indicePergunta++;

questionElement.textContent =
    pergunta.pergunta;

answersElement.innerHTML = "";

feedbackElement.textContent = "";

pergunta.respostas.forEach(
    (resposta, indice) => {

        const botao =
            document.createElement("button");

        botao.textContent =
            String.fromCharCode(65 + indice) +
            ") " +
            resposta;

        botao.onclick = () => {

            responder(
                indice === pergunta.correta
            );

        };

        answersElement.appendChild(botao);

    }
);

questionScreen.classList.remove("hidden");


}

/*

# RESPOSTA DA BOMBA

*/

function responder(acertou) {


if (!bombaAtual) {

    return;

}

if (acertou) {

    feedbackElement.textContent =
        "✅ CORRETO! VOCÊ TEM 3 SEGUNDOS!";

    feedbackElement.style.color =
        "#45e0ff";

    bombaAtual.tempo = 3;

    bombaAtual.contagemAtiva = true;

    setTimeout(() => {

        questionScreen.classList.add(
            "hidden"
        );

        perguntaAberta = false;

        bombaAtual = null;

    }, 600);

} else {

    feedbackElement.textContent =
        "❌ ERRADO! A BOMBA FALHOU!";

    feedbackElement.style.color =
        "#ff5577";

    bombaAtual.ativa = false;

    setTimeout(() => {

        bombas = bombas.filter(
            bomba =>
                bomba !== bombaAtual
        );

        questionScreen.classList.add(
            "hidden"
        );

        perguntaAberta = false;

        bombaAtual = null;

    }, 700);

}


}

/*

# BATALHA DO BOSS

*/

function iniciarBatalhaBoss() {


if (
    batalhaBoss ||
    bossDerrotado ||
    !boss
) {

    return;

}

batalhaBoss = true;

indicePerguntaBoss = 0;

abrirPerguntaBoss();


}

 /*

# PERGUNTA DO BOSS

*/

function abrirPerguntaBoss() {


perguntaAberta = true;

const pergunta =
    perguntasBoss[
        indicePerguntaBoss
    ];

questionElement.textContent =
    "👑 BOSS: " +
    pergunta.pergunta;

answersElement.innerHTML = "";

feedbackElement.textContent =
    "Derrote o Boss respondendo corretamente!";

feedbackElement.style.color =
    "#ffd34d";

pergunta.respostas.forEach(
    (resposta, indice) => {

        const botao =
            document.createElement("button");

        botao.textContent =
            String.fromCharCode(65 + indice) +
            ") " +
            resposta;

        botao.onclick = () => {

            responderBoss(
                indice === pergunta.correta
            );

        };

        answersElement.appendChild(botao);

    }
);

questionScreen.classList.remove("hidden");


}

/*

# RESPOSTA DO BOSS

*/

function responderBoss(acertou) {


if (!batalhaBoss) {

    return;

}

/*
==============================================
ACERTOU
==============================================
*/

if (acertou) {

    boss.vida--;

    pontos += 250;

    feedbackElement.textContent =
        "⚔️ ACERTOU! O BOSS PERDEU 1 VIDA!";

    feedbackElement.style.color =
        "#45e0ff";

    atualizarInterface();

    /*
    BOSS DERROTADO
    */

    if (boss.vida <= 0) {

        bossDerrotado = true;

        batalhaBoss = false;

        perguntaAberta = false;

        questionScreen.classList.add(
            "hidden"
        );

        pontos += 1000;

        atualizarInterface();

        setTimeout(() => {

            terminarJogo(
                true,
                "👑 O BOSS FOI DERROTADO! O REINO FOI SALVO!"
            );

        }, 700);

        return;

    }

    indicePerguntaBoss++;

    setTimeout(() => {

        abrirPerguntaBoss();

    }, 700);

}

/*
==============================================
ERROU
==============================================
*/

else {

    vidas--;

    feedbackElement.textContent =
        "❌ ERROU! VOCÊ PERDEU 1 VIDA!";

    feedbackElement.style.color =
        "#ff5577";

    atualizarInterface();

    /*
    SEM VIDAS
    */

    if (vidas <= 0) {

        setTimeout(() => {

            terminarJogo(
                false,
                "O Boss derrotou você."
            );

        }, 800);

        return;

    }

    /*
    CONTINUA A BATALHA
    */

    indicePerguntaBoss++;

    /*
    Se acabaram as perguntas,
    o ciclo recomeça.
    */

    if (
        indicePerguntaBoss >=
        perguntasBoss.length
    ) {

        indicePerguntaBoss = 0;

    }

    setTimeout(() => {

        abrirPerguntaBoss();

    }, 800);

}


}

/*

# EXPLOSÃO

*/

function explodir(bomba) {


if (!bomba.ativa) {

    return;

}

bomba.ativa = false;

const celulas = [
    {
        x: bomba.x,
        y: bomba.y
    }
];

const direcoes = [
    { x: 1, y: 0 },
    { x: -1, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: -1 }
];

for (
    const direcao of direcoes
) {

    for (
        let distancia = 1;
        distancia <= 2;
        distancia++
    ) {

        const x =
            bomba.x +
            direcao.x *
            distancia;

        const y =
            bomba.y +
            direcao.y *
            distancia;

        if (
            x < 0 ||
            y < 0 ||
            x >= COLS ||
            y >= ROWS
        ) {

            break;

        }

        if (
            mapa[y][x] === "#"
        ) {

            break;

        }

        celulas.push({
            x,
            y
        });

        if (
            mapa[y][x] === "B"
        ) {

            mapa[y][x] = ".";

            pontos += 50;

            break;

        }

    }

}

explosoes.push({
    celulas: celulas,
    tempo: 0.45
});

pontos += 25;

/*
INIMIGOS
*/

for (
    const celula of celulas
) {

    const inimigo =
        inimigos.find(
            inimigo =>
                inimigo.x === celula.x &&
                inimigo.y === celula.y
        );

    if (inimigo) {

        inimigos =
            inimigos.filter(
                item =>
                    item !== inimigo
            );

        pontos += 200;

    }

    /*
    BOSS NÃO MORRE COM BOMBA
    */

    if (
        boss &&
        !bossDerrotado &&
        boss.x === celula.x &&
        boss.y === celula.y
    ) {

        feedbackElement.textContent =
            "👑 O BOSS É IMUNE ÀS BOMBAS!";

        pontos += 50;

    }

    /*
    JOGADOR
    */

    if (
        jogador.x === celula.x &&
        jogador.y === celula.y
    ) {

        ferirJogador();

    }

}

bombas =
    bombas.filter(
        item =>
            item !== bomba
    );

atualizarInterface();


}

/*

# DANO

*/

function ferirJogador() {


if (
    jogador.invulneravel > 0
) {

    return;

}

vidas--;

jogador.invulneravel = 1.5;

atualizarInterface();

if (vidas <= 0) {

    terminarJogo(
        false,
        "Você ficou sem vidas."
    );

}


}

/*

# INIMIGOS

*/

function atualizarInimigos(delta) {


for (
    const inimigo of inimigos
) {

    inimigo.movimento -= delta;

    if (
        inimigo.movimento <= 0
    ) {

        inimigo.movimento =
            0.5 +
            Math.random() *
            0.6;

        const direcoes = [
            { x: 1, y: 0 },
            { x: -1, y: 0 },
            { x: 0, y: 1 },
            { x: 0, y: -1 }
        ];

        const direcao =
            direcoes[
                Math.floor(
                    Math.random() *
                    direcoes.length
                )
            ];

        const novoX =
            inimigo.x +
            direcao.x;

        const novoY =
            inimigo.y +
            direcao.y;

        if (
            !bloqueado(
                novoX,
                novoY
            )
        ) {

            inimigo.x = novoX;

            inimigo.y = novoY;

        }

        verificarColisaoInimigo();

    }

}


}

/*

# COLISÃO COM INIMIGO

*/

function verificarColisaoInimigo() {


if (
    jogador.invulneravel > 0
) {

    return;

}

const encontrou =
    inimigos.some(
        inimigo =>
            inimigo.x === jogador.x &&
            inimigo.y === jogador.y
    );

if (encontrou) {

    ferirJogador();

}


}

/*

# ATUALIZAÇÃO

*/

function atualizar(delta) {


if (!jogoAtivo) {

    return;

}

if (
    jogador.cooldown > 0
) {

    jogador.cooldown -= delta;

}

if (
    jogador.invulneravel > 0
) {

    jogador.invulneravel -= delta;

}

/*
BOMBAS
*/

for (
    const bomba of bombas
) {

    bomba.piscando +=
        delta * 10;

    if (
        bomba.tempo !== null &&
        bomba.contagemAtiva
    ) {

        bomba.tempo -= delta;

        if (
            bomba.tempo <= 0 &&
            bomba.ativa
        ) {

            explodir(bomba);

        }

    }

}

/*
EXPLOSÕES
*/

for (
    const explosao of explosoes
) {

    explosao.tempo -= delta;

}

explosoes =
    explosoes.filter(
        explosao =>
            explosao.tempo > 0
    );

/*
INIMIGOS
*/

if (
    !batalhaBoss &&
    !bossDerrotado
) {

    atualizarInimigos(delta);

}

/*
TEMPO
*/

acumuladorTempo += delta;

if (
    acumuladorTempo >= 1
) {

    acumuladorTempo = 0;

    tempo--;

    atualizarInterface();

    if (
        tempo <= 0
    ) {

        terminarJogo(
            false,
            "O tempo acabou."
        );

    }

}

/*
==============================================
FASE NORMAL
==============================================
*/

if (
    !fases[faseAtual].boss &&
    inimigos.length === 0 &&
    jogoAtivo
) {

    jogoAtivo = false;

    if (
        faseAtual <
        fases.length - 1
    ) {

        setTimeout(
            () => {

                proximaFase();

            },
            1000
        );

    }

}


}

/*

# FUNDO

*/

function desenharFundo() {


ctx.fillStyle = "#07121e";

ctx.fillRect(
    0,
    0,
    canvas.width,
    canvas.height
);

for (
    let y = 0;
    y < ROWS;
    y++
) {

    for (
        let x = 0;
        x < COLS;
        x++
    ) {

        ctx.fillStyle =
            (x + y) % 2 === 0
                ? "#091827"
                : "#0b1c2c";

        ctx.fillRect(
            x * TILE,
            y * TILE,
            TILE,
            TILE
        );

    }

}


}

/*

# MAPA

*/

function desenharMapa() {


for (
    let y = 0;
    y < ROWS;
    y++
) {

    for (
        let x = 0;
        x < COLS;
        x++
    ) {

        const bloco =
            mapa[y][x];

        /*
        PAREDE
        */

        if (
            bloco === "#"
        ) {

            ctx.fillStyle =
                "#183149";

            ctx.fillRect(
                x * TILE + 3,
                y * TILE + 3,
                TILE - 6,
                TILE - 6
            );

            ctx.fillStyle =
                "#284a66";

            ctx.fillRect(
                x * TILE + 8,
                y * TILE + 8,
                TILE - 16,
                8
            );

        }

        /*
        BLOCO
        */

        if (
            bloco === "B"
        ) {

            ctx.fillStyle =
                "#79552f";

            ctx.fillRect(
                x * TILE + 5,
                y * TILE + 5,
                TILE - 10,
                TILE - 10
            );

            ctx.fillStyle =
                "#9b703f";

            ctx.fillRect(
                x * TILE + 10,
                y * TILE + 10,
                TILE - 20,
                8
            );

            ctx.strokeStyle =
                "#bd8950";

            ctx.strokeRect(
                x * TILE + 5,
                y * TILE + 5,
                TILE - 10,
                TILE - 10
            );

        }

    }

}


}

/*

# JOGADOR

*/

function desenharJogador() {


if (
    jogador.invulneravel > 0 &&
    Math.floor(
        jogador.invulneravel * 10
    ) % 2 === 0
) {

    return;

}

const centroX =
    jogador.x *
    TILE +
    TILE / 2;

const centroY =
    jogador.y *
    TILE +
    TILE / 2;

ctx.fillStyle =
    "#45e0ff";

ctx.beginPath();

ctx.arc(
    centroX,
    centroY,
    20,
    0,
    Math.PI * 2
);

ctx.fill();

ctx.fillStyle =
    "#06131f";

ctx.beginPath();

ctx.arc(
    centroX - 7,
    centroY - 4,
    3,
    0,
    Math.PI * 2
);

ctx.arc(
    centroX + 7,
    centroY - 4,
    3,
    0,
    Math.PI * 2
);

ctx.fill();


}

 /*

# INIMIGOS

*/

function desenharInimigos() {


for (
    const inimigo of inimigos
) {

    const x =
        inimigo.x *
        TILE +
        TILE / 2;

    const y =
        inimigo.y *
        TILE +
        TILE / 2;

    ctx.fillStyle =
        "#ff5577";

    ctx.beginPath();

    ctx.arc(
        x,
        y,
        20,
        0,
        Math.PI * 2
    );

    ctx.fill();

    ctx.fillStyle =
        "white";

    ctx.fillRect(
        x - 10,
        y - 5,
        6,
        7
    );

    ctx.fillRect(
        x + 4,
        y - 5,
        6,
        7
    );

}


}

 /*

# BOSS

*/

function desenharBoss() {


if (
    !boss ||
    bossDerrotado
) {

    return;

}

const x =
    boss.x *
    TILE +
    TILE / 2;

const y =
    boss.y *
    TILE +
    TILE / 2;

/*
AURA
*/

ctx.beginPath();

ctx.arc(
    x,
    y,
    29 +
    Math.sin(
        performance.now() / 150
    ) * 3,
    0,
    Math.PI * 2
);

ctx.fillStyle =
    "rgba(255, 50, 80, 0.18)";

ctx.fill();

/*
CORPO
*/

ctx.fillStyle =
    "#8b172f";

ctx.beginPath();

ctx.arc(
    x,
    y,
    23,
    0,
    Math.PI * 2
);

ctx.fill();

/*
COROA
*/

ctx.fillStyle =
    "#ffd34d";

ctx.beginPath();

ctx.moveTo(
    x - 19,
    y - 17
);

ctx.lineTo(
    x - 12,
    y - 31
);

ctx.lineTo(
    x - 3,
    y - 20
);

ctx.lineTo(
    x + 5,
    y - 31
);

ctx.lineTo(
    x + 18,
    y - 17
);

ctx.closePath();

ctx.fill();

/*
OLHOS
*/

ctx.fillStyle =
    "#ffdfdf";

ctx.fillRect(
    x - 10,
    y - 3,
    7,
    7
);

ctx.fillRect(
    x + 4,
    y - 3,
    7,
    7
);

/*
VIDA DO BOSS
*/

const largura =
    50;

const vida =
    boss.vida / 5;

ctx.fillStyle =
    "#1a1a1a";

ctx.fillRect(
    x - largura / 2,
    y + 30,
    largura,
    7
);

ctx.fillStyle =
    "#ff5577";

ctx.fillRect(
    x - largura / 2,
    y + 30,
    largura * vida,
    7
);

ctx.fillStyle =
    "white";

ctx.font =
    "bold 13px Arial";

ctx.textAlign =
    "center";

ctx.fillText(
    "BOSS",
    x,
    y + 52
);


}

 /*

# BOMBAS

*/

function desenharBombas() {


for (
    const bomba of bombas
) {

    const x =
        bomba.x *
        TILE +
        TILE / 2;

    const y =
        bomba.y *
        TILE +
        TILE / 2;

    const pulsar =
        Math.sin(
            bomba.piscando
        ) * 3;

    ctx.fillStyle =
        "#111";

    ctx.beginPath();

    ctx.arc(
        x,
        y,
        21 + pulsar,
        0,
        Math.PI * 2
    );

    ctx.fill();

    ctx.strokeStyle =
        "#ff5577";

    ctx.lineWidth = 3;

    ctx.stroke();

    ctx.fillStyle =
        "#ffc94d";

    ctx.fillRect(
        x + 8,
        y - 25,
        5,
        10
    );

    if (
        bomba.contagemAtiva &&
        bomba.tempo !== null
    ) {

        const numero =
            Math.ceil(
                bomba.tempo
            );

        ctx.fillStyle =
            "white";

        ctx.font =
            "bold 22px Arial";

        ctx.textAlign =
            "center";

        ctx.textBaseline =
            "middle";

        ctx.fillText(
            numero,
            x,
            y - 35
        );

    }

}


}

/*

# EXPLOSÕES

*/

function desenharExplosoes() {


for (
    const explosao of explosoes
) {

    const alpha =
        explosao.tempo / 0.45;

    ctx.globalAlpha =
        alpha;

    for (
        const celula of explosao.celulas
    ) {

        const x =
            celula.x * TILE;

        const y =
            celula.y * TILE;

        ctx.fillStyle =
            "#ffae21";

        ctx.fillRect(
            x + 8,
            y + 8,
            TILE - 16,
            TILE - 16
        );

        ctx.fillStyle =
            "#fff4a3";

        ctx.fillRect(
            x + 20,
            y + 20,
            TILE - 40,
            TILE - 40
        );

    }

    ctx.globalAlpha = 1;

}


}

/*

# DESENHAR

*/

function desenhar() {


desenharFundo();

desenharMapa();

desenharBombas();

desenharExplosoes();

desenharInimigos();

desenharBoss();

desenharJogador();


}

/*

# GAME LOOP

*/

function loop(agora) {


if (!jogoAtivo) {

    desenhar();

    return;

}

const delta =
    Math.min(
        (agora - ultimoTempo) / 1000,
        0.05
    );

ultimoTempo = agora;

atualizar(delta);

desenhar();

requestAnimationFrame(loop);


}

/*

# CONTROLES

*/

window.addEventListener(
"keydown",
function(event) {


    if (
        event.key === "ArrowUp" ||
        event.key === "ArrowDown" ||
        event.key === "ArrowLeft" ||
        event.key === "ArrowRight" ||
        event.code === "Space"
    ) {

        event.preventDefault();

    }

    if (
        !jogoAtivo ||
        perguntaAberta
    ) {

        return;

    }

    const tecla =
        event.key.toLowerCase();

    if (
        tecla === "w" ||
        event.key === "ArrowUp"
    ) {

        moverJogador(0, -1);

    }

    if (
        tecla === "s" ||
        event.key === "ArrowDown"
    ) {

        moverJogador(0, 1);

    }

    if (
        tecla === "a" ||
        event.key === "ArrowLeft"
    ) {

        moverJogador(-1, 0);

    }

    if (
        tecla === "d" ||
        event.key === "ArrowRight"
    ) {

        moverJogador(1, 0);

    }

    if (
        event.code === "Space"
    ) {

        colocarBomba();

    }

}


);

/*

# BOTÕES

*/

startButton.addEventListener(
"click",
iniciarJogo
);

restartButton.addEventListener(
"click",
iniciarJogo
);

/*

# INÍCIO

*/

iniciarFase();
