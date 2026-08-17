/* =========================================================
   SPACE ENGLISH BATTLE
   INSTITUTO ACUTIS
   2 PLAYERS — GLOBAL QUESTION PAUSE
========================================================= */


/* =========================================================
   CONFIGURAÇÕES
========================================================= */

const SHIP_SPEED = 0.28;
const BULLET_SPEED = 1.6;

const INITIAL_LIVES = 3;

const INITIAL_SPAWN_TIME = 1500;

const QUESTION_TIME = 30;


/* =========================================================
   PERGUNTAS
========================================================= */

const questions = [

    {
        question: "What is the past of GO?",
        answers: ["Goed", "Went", "Goes", "Going"],
        correct: 1,
        category: "Simple Past"
    },

    {
        question: "Choose the correct sentence:",
        answers: [
            "She are happy.",
            "She am happy.",
            "She is happy.",
            "She be happy."
        ],
        correct: 2,
        category: "Grammar"
    },

    {
        question: "What does BIGGEST mean?",
        answers: [
            "Menor",
            "Maior",
            "Rápido",
            "Fácil"
        ],
        correct: 1,
        category: "Vocabulary"
    },

    {
        question: "What is the opposite of HAPPY?",
        answers: [
            "Sad",
            "Fast",
            "Beautiful",
            "Strong"
        ],
        correct: 0,
        category: "Vocabulary"
    },

    {
        question: "Complete: There ___ two books.",
        answers: [
            "is",
            "am",
            "are",
            "be"
        ],
        correct: 2,
        category: "There is / There are"
    },

    {
        question: "What does WORRIED mean?",
        answers: [
            "Cansado",
            "Preocupado",
            "Feliz",
            "Bravo"
        ],
        correct: 1,
        category: "Vocabulary"
    },

    {
        question: "Choose the correct sentence:",
        answers: [
            "I went to school yesterday.",
            "I go to school yesterday.",
            "I going school yesterday.",
            "I gone school yesterday."
        ],
        correct: 0,
        category: "Simple Past"
    },

    {
        question: "What is the past of EAT?",
        answers: [
            "Eated",
            "Ate",
            "Eating",
            "Eats"
        ],
        correct: 1,
        category: "Simple Past"
    },

    {
        question: "Complete: She ___ English every day.",
        answers: [
            "study",
            "studies",
            "studied",
            "studying"
        ],
        correct: 1,
        category: "Simple Present"
    },

    {
        question: "What does MISTAKES mean?",
        answers: [
            "Metas",
            "Erros",
            "Sonhos",
            "Desafios"
        ],
        correct: 1,
        category: "Vocabulary"
    },

    {
        question: "Choose the correct article: ___ apple.",
        answers: [
            "A",
            "An",
            "The",
            "No article"
        ],
        correct: 1,
        category: "Articles"
    },

    {
        question: "What is the opposite of EXPENSIVE?",
        answers: [
            "Cheap",
            "Large",
            "Small",
            "Difficult"
        ],
        correct: 0,
        category: "Vocabulary"
    },

    {
        question: "Complete: I ___ playing soccer now.",
        answers: [
            "am",
            "is",
            "are",
            "be"
        ],
        correct: 0,
        category: "Present Continuous"
    },

    {
        question: "What does GOALS mean?",
        answers: [
            "Erros",
            "Metas",
            "Problemas",
            "Respostas"
        ],
        correct: 1,
        category: "Vocabulary"
    },

    {
        question: "What is the past of SEE?",
        answers: [
            "Seed",
            "Saw",
            "Seen",
            "Seeing"
        ],
        correct: 1,
        category: "Simple Past"
    },

    {
        question: "Choose the correct sentence:",
        answers: [
            "They was happy.",
            "They were happy.",
            "They is happy.",
            "They be happy."
        ],
        correct: 1,
        category: "Verb To Be"
    },

    {
        question: "What does IMPROVE mean?",
        answers: [
            "Melhorar",
            "Perder",
            "Esquecer",
            "Parar"
        ],
        correct: 0,
        category: "Vocabulary"
    },

    {
        question: "Complete: There ___ a computer on the table.",
        answers: [
            "are",
            "am",
            "is",
            "be"
        ],
        correct: 2,
        category: "There is / There are"
    },

    {
        question: "What is the past of HAVE?",
        answers: [
            "Haved",
            "Has",
            "Had",
            "Having"
        ],
        correct: 2,
        category: "Simple Past"
    },

    {
        question: "What does CHALLENGE mean?",
        answers: [
            "Desafio",
            "Vitória",
            "Descanso",
            "Erro"
        ],
        correct: 0,
        category: "Vocabulary"
    },

    {
        question: "Choose the correct preposition: I live ___ Brazil.",
        answers: [
            "at",
            "on",
            "in",
            "for"
        ],
        correct: 2,
        category: "Prepositions"
    },

    {
        question: "Complete: He ___ soccer yesterday.",
        answers: [
            "play",
            "plays",
            "played",
            "playing"
        ],
        correct: 2,
        category: "Simple Past"
    },

    {
        question: "What is the opposite of EASY?",
        answers: [
            "Small",
            "Difficult",
            "Short",
            "Cheap"
        ],
        correct: 1,
        category: "Vocabulary"
    },

    {
        question: "Choose the correct pronoun: ___ am a teacher.",
        answers: [
            "He",
            "She",
            "I",
            "They"
        ],
        correct: 2,
        category: "Pronouns"
    },

    {
        question: "Complete: They ___ students.",
        answers: [
            "is",
            "am",
            "are",
            "be"
        ],
        correct: 2,
        category: "Verb To Be"
    }

];


/* =========================================================
   ELEMENTOS
========================================================= */

const player1Arena =
    document.getElementById("player1Arena");

const player2Arena =
    document.getElementById("player2Arena");

const player1Ship =
    document.getElementById("player1Ship");

const player2Ship =
    document.getElementById("player2Ship");

const player1Aliens =
    document.getElementById("player1Aliens");

const player2Aliens =
    document.getElementById("player2Aliens");

const player1Bullets =
    document.getElementById("player1Bullets");

const player2Bullets =
    document.getElementById("player2Bullets");

const player1Kills =
    document.getElementById("player1Kills");

const player2Kills =
    document.getElementById("player2Kills");

const roundNumber =
    document.getElementById("roundNumber");


/* =========================================================
   PERGUNTA
========================================================= */

const questionModal =
    document.getElementById("questionModal");

const questionPlayer =
    document.getElementById("questionPlayer");

const questionText =
    document.getElementById("questionText");

const questionAnswers =
    document.getElementById("questionAnswers");

const questionFeedback =
    document.getElementById("questionFeedback");

const questionCategory =
    document.getElementById("questionCategory");

const questionTimerDisplay =
    document.getElementById("questionTimer");


/* =========================================================
   MODAIS
========================================================= */

const eliminationModal =
    document.getElementById("eliminationModal");

const eliminationTitle =
    document.getElementById("eliminationTitle");

const eliminationText =
    document.getElementById("eliminationText");

const continueButton =
    document.getElementById("continueButton");


const winnerModal =
    document.getElementById("winnerModal");

const winnerTitle =
    document.getElementById("winnerTitle");

const winnerText =
    document.getElementById("winnerText");

const finalP1Lives =
    document.getElementById("finalP1Lives");

const finalP2Lives =
    document.getElementById("finalP2Lives");

const finalP1Kills =
    document.getElementById("finalP1Kills");

const finalP2Kills =
    document.getElementById("finalP2Kills");

const restartButton =
    document.getElementById("restartButton");


/* =========================================================
   JOGADORES
========================================================= */

const players = {

    1: {

        x: 50,
        y: 82,

        lives: INITIAL_LIVES,

        kills: 0,

        eliminated: false,

        keys: {

            up: false,
            down: false,
            left: false,
            right: false

        },

        arena: player1Arena,
        ship: player1Ship,
        aliens: player1Aliens,
        bullets: player1Bullets,

        _bullets: []

    },


    2: {

        x: 50,
        y: 82,

        lives: INITIAL_LIVES,

        kills: 0,

        eliminated: false,

        keys: {

            up: false,
            down: false,
            left: false,
            right: false

        },

        arena: player2Arena,
        ship: player2Ship,
        aliens: player2Aliens,
        bullets: player2Bullets,

        _bullets: []

    }

};


/* =========================================================
   ESTADO GLOBAL
========================================================= */

let gameRunning = true;


/*
   🔥 ESSA É A VARIÁVEL PRINCIPAL

   false = jogo normal

   true = OS DOIS JOGADORES ESTÃO PAUSADOS
*/

let globalQuestionPause = false;


let round = 1;

let alienId = 0;

let bulletId = 0;

let currentQuestion = null;

let currentQuestionPlayer = null;

let currentQuestionAlien = null;

let questionTimeout = null;

let questionCountdown = null;

let questionSecondsLeft = 0;

let spawnTimer = null;

let lastFrame = performance.now();

let spawnTime =
    INITIAL_SPAWN_TIME;


/* =========================================================
   ALIENS
========================================================= */

const alienData = {

    1: [],

    2: []

};


/* =========================================================
   AUXILIARES
========================================================= */

function shuffle(array) {

    return [...array].sort(
        () =>
            Math.random() -
            0.5
    );

}


function random(min, max) {

    return Math.random() *
        (max - min) +
        min;

}


/* =========================================================
   MOVIMENTO
========================================================= */

function updatePlayer(
    player,
    delta
) {

    /*
       🔴 PAUSA GLOBAL

       Não importa qual jogador recebeu
       a pergunta.

       OS DOIS ficam congelados.
    */

    if (
        globalQuestionPause ||
        player.eliminated
    ) {

        return;

    }


    const speed =
        SHIP_SPEED * delta;


    if (player.keys.up) {

        player.y -= speed;

    }


    if (player.keys.down) {

        player.y += speed;

    }


    if (player.keys.left) {

        player.x -= speed;

    }


    if (player.keys.right) {

        player.x += speed;

    }


    player.x =
        Math.max(
            8,
            Math.min(
                92,
                player.x
            )
        );


    player.y =
        Math.max(
            12,
            Math.min(
                88,
                player.y
            )
        );


    player.ship.style.left =
        `${player.x}%`;


    player.ship.style.top =
        `${player.y}%`;

}


/* =========================================================
   CRIAR ALIEN
========================================================= */

function spawnAlien(
    playerNumber
) {

    const player =
        players[playerNumber];


    if (
        !gameRunning ||
        player.eliminated
    ) {

        return;

    }


    const alien =
        document.createElement(
            "div"
        );


    const id =
        ++alienId;


    let type =
        "normal";

    let speed =
        random(
            0.015,
            0.026
        );

    let emoji =
        "👽";


    const roll =
        Math.random();


    if (
        roll > 0.78 &&
        roll <= 0.92
    ) {

        type =
            "fast";

        speed =
            0.035;

        emoji =
            "🛸";

    }


    else if (
        roll > 0.92
    ) {

        type =
            "boss";

        speed =
            0.010;

        emoji =
            "👾";

    }


    alien.className =
        `alien ${type}`;


    alien.textContent =
        emoji;


    const x =
        random(
            8,
            92
        );


    const y =
        -8;


    alien.style.left =
        `${x}%`;


    alien.style.top =
        `${y}%`;


    player.aliens.appendChild(
        alien
    );


    alienData[playerNumber].push({

        id,

        element:
            alien,

        x,

        y,

        speed,

        type,

        destroyed:
            false

    });

}


/* =========================================================
   ATUALIZAR ALIENS
========================================================= */

function updateAliens(
    playerNumber,
    delta
) {

    /*
       🔴 PAUSA GLOBAL

       TODOS OS ALIENS PARAM.
    */

    if (
        globalQuestionPause
    ) {

        return;

    }


    const player =
        players[playerNumber];


    if (
        player.eliminated
    ) {

        return;

    }


    const list =
        alienData[playerNumber];


    for (
        let i =
            list.length - 1;

        i >= 0;

        i--
    ) {

        const alien =
            list[i];


        if (
            alien.destroyed
        ) {

            continue;

        }


        alien.y +=
            alien.speed * delta;


        alien.element.style.top =
            `${alien.y}%`;


        if (
            alien.y >= 88
        ) {

            removeAlien(
                playerNumber,
                i
            );


            loseLife(
                playerNumber,
                "An alien escaped!"
            );

        }

    }

}


/* =========================================================
   REMOVER ALIEN
========================================================= */

function removeAlien(
    playerNumber,
    index
) {

    const list =
        alienData[playerNumber];


    const alien =
        list[index];


    if (!alien) {

        return;

    }


    alien.element.remove();


    list.splice(
        index,
        1
    );

}


/* =========================================================
   ATIRAR
========================================================= */

function shoot(
    playerNumber
) {

    /*
       🔴 NÃO PERMITE TIRO DURANTE
       A PERGUNTA
    */

    if (
        !gameRunning ||
        globalQuestionPause
    ) {

        return;

    }


    const player =
        players[playerNumber];


    if (
        player.eliminated
    ) {

        return;

    }


    const bullet =
        document.createElement(
            "div"
        );


    bullet.className =
        "bullet";


    const id =
        ++bulletId;


    const x =
        player.x;


    const y =
        player.y - 5;


    bullet.style.left =
        `${x}%`;


    bullet.style.top =
        `${y}%`;


    player.bullets.appendChild(
        bullet
    );


    player._bullets.push({

        id,

        element:
            bullet,

        x,

        y

    });

}


/* =========================================================
   ATUALIZAR TIROS
========================================================= */

function updateBullets(
    playerNumber,
    delta
) {

    /*
       🔴 PAUSA GLOBAL

       TODOS OS TIROS PARAM.
    */

    if (
        globalQuestionPause
    ) {

        return;

    }


    const player =
        players[playerNumber];


    if (
        player.eliminated
    ) {

        return;

    }


    for (
        let i =
            player._bullets.length - 1;

        i >= 0;

        i--
    ) {

        const bullet =
            player._bullets[i];


        bullet.y -=
            BULLET_SPEED * delta;


        bullet.element.style.top =
            `${bullet.y}%`;


        if (
            bullet.y < -5
        ) {

            bullet.element.remove();


            player._bullets.splice(
                i,
                1
            );


            continue;

        }


        checkBulletCollision(
            playerNumber,
            bullet,
            i
        );

    }

}


/* =========================================================
   COLISÃO
========================================================= */

function checkBulletCollision(
    playerNumber,
    bullet,
    bulletIndex
) {

    /*
       Nunca processar colisões durante
       uma pergunta.
    */

    if (
        globalQuestionPause
    ) {

        return;

    }


    const aliens =
        alienData[playerNumber];


    for (
        let i =
            aliens.length - 1;

        i >= 0;

        i--
    ) {

        const alien =
            aliens[i];


        if (
            alien.destroyed
        ) {

            continue;

        }


        const dx =
            Math.abs(
                bullet.x -
                alien.x
            );


        const dy =
            Math.abs(
                bullet.y -
                alien.y
            );


        if (
            dx < 6 &&
            dy < 7
        ) {

            bullet.element.remove();


            players[playerNumber]
                ._bullets
                .splice(
                    bulletIndex,
                    1
                );


            alien.destroyed =
                true;


            createExplosion(
                players[playerNumber],
                alien
            );


            /*
               🔥 PAUSA GLOBAL
            */

            openQuestion(
                playerNumber,
                alien,
                i
            );


            break;

        }

    }

}


/* =========================================================
   EXPLOSÃO
========================================================= */

function createExplosion(
    player,
    alien
) {

    const explosion =
        document.createElement(
            "div"
        );


    explosion.className =
        "explosion";


    explosion.textContent =
        "💥";


    explosion.style.left =
        `${alien.x}%`;


    explosion.style.top =
        `${alien.y}%`;


    player.arena.appendChild(
        explosion
    );


    setTimeout(
        () => {

            explosion.remove();

        },
        450
    );

}


/* =========================================================
   ABRIR PERGUNTA
========================================================= */

function openQuestion(
    playerNumber,
    alien,
    alienIndex
) {

    if (
        !gameRunning ||
        globalQuestionPause
    ) {

        return;

    }


    /*
       =====================================================
       🔥 PAUSA GLOBAL
       =====================================================
    */

    globalQuestionPause =
        true;


    currentQuestionPlayer =
        playerNumber;


    currentQuestionAlien = {

        playerNumber,

        alien,

        alienIndex

    };


    /*
       ESCOLHER PERGUNTA
    */

    currentQuestion =
        questions[
            Math.floor(
                Math.random() *
                questions.length
            )
        ];


    /*
       MOSTRAR QUEM RECEBEU
    */

    if (questionPlayer) {

        questionPlayer.textContent =
            `PLAYER ${playerNumber}`;

    }


    if (questionCategory) {

        questionCategory.textContent =
            currentQuestion.category;

    }


    questionText.textContent =
        currentQuestion.question;


    questionFeedback.textContent =
        "";


    questionFeedback.className =
        "question-feedback";


    questionAnswers.innerHTML =
        "";


    const answers =
        currentQuestion.answers.map(
            (
                answer,
                index
            ) => ({

                text:
                    answer,

                originalIndex:
                    index

            })
        );


    shuffle(
        answers
    ).forEach(
        answer => {

            const button =
                document.createElement(
                    "button"
                );


            button.className =
                "answer-button";


            button.textContent =
                answer.text;


            button.addEventListener(
                "click",
                () => {

                    answerQuestion(
                        answer.originalIndex,
                        button
                    );

                }
            );


            questionAnswers.appendChild(
                button
            );

        }
    );


    /*
       VISUALMENTE CONGELAR OS DOIS
    */

    player1Arena.classList.add(
        "question-paused"
    );


    player2Arena.classList.add(
        "question-paused"
    );


    questionModal.classList.remove(
        "question-player-1",
        "question-player-2"
    );


    questionModal.classList.add(
        `question-player-${playerNumber}`
    );


    questionModal.classList.remove(
        "hidden"
    );


    /*
       🔥 30 SEGUNDOS
    */

    startQuestionTimer();

}


/* =========================================================
   TIMER
========================================================= */

function startQuestionTimer() {

    clearTimeout(
        questionTimeout
    );


    clearInterval(
        questionCountdown
    );


    questionSecondsLeft =
        QUESTION_TIME;


    updateQuestionTimerDisplay();


    questionCountdown =
        setInterval(
            () => {

                questionSecondsLeft--;


                updateQuestionTimerDisplay();


                if (
                    questionSecondsLeft <= 0
                ) {

                    clearInterval(
                        questionCountdown
                    );

                }

            },
            1000
        );


    questionTimeout =
        setTimeout(
            () => {

                timeOutQuestion();

            },
            QUESTION_TIME * 1000
        );

}


/* =========================================================
   DISPLAY DO TIMER
========================================================= */

function updateQuestionTimerDisplay() {

    if (
        !questionTimerDisplay
    ) {

        return;

    }


    questionTimerDisplay.textContent =
        questionSecondsLeft;


    questionTimerDisplay.classList.toggle(
        "danger",
        questionSecondsLeft <= 10
    );

}


/* =========================================================
   TEMPO ESGOTADO
========================================================= */

function timeOutQuestion() {

    if (
        !currentQuestion ||
        currentQuestionPlayer === null
    ) {

        return;

    }


    clearInterval(
        questionCountdown
    );


    disableAnswers();


    questionFeedback.textContent =
        "⏰ TIME'S UP! -1 LIFE";


    questionFeedback.className =
        "question-feedback wrong";


    loseLife(
        currentQuestionPlayer,
        "Time expired!"
    );


    setTimeout(
        () => {

            destroyQuestionAlien();

            closeQuestion();

        },
        900
    );

}


/* =========================================================
   DESABILITAR RESPOSTAS
========================================================= */

function disableAnswers() {

    const buttons =
        questionAnswers.querySelectorAll(
            ".answer-button"
        );


    buttons.forEach(
        button => {

            button.disabled =
                true;

        }
    );

}


/* =========================================================
   RESPONDER
========================================================= */

function answerQuestion(
    selectedAnswer,
    button
) {

    if (
        !currentQuestion
    ) {

        return;

    }


    clearTimeout(
        questionTimeout
    );


    clearInterval(
        questionCountdown
    );


    disableAnswers();


    const correct =
        selectedAnswer ===
        currentQuestion.correct;


    if (correct) {

        if (button) {

            button.classList.add(
                "correct"
            );

        }


        questionFeedback.textContent =
            "✅ CORRECT!";


        questionFeedback.className =
            "question-feedback correct";


        const player =
            players[
                currentQuestionPlayer
            ];


        player.kills++;


        updateKills();


        setTimeout(
            () => {

                destroyQuestionAlien();

                closeQuestion();

            },
            700
        );

    }

    else {

        if (button) {

            button.classList.add(
                "wrong"
            );

        }


        questionFeedback.textContent =
            "❌ WRONG! -1 LIFE";


        questionFeedback.className =
            "question-feedback wrong";


        loseLife(
            currentQuestionPlayer,
            "Wrong answer!"
        );


        setTimeout(
            () => {

                destroyQuestionAlien();

                closeQuestion();

            },
            900
        );

    }

}


/* =========================================================
   DESTRUIR ALIEN DA PERGUNTA
========================================================= */

function destroyQuestionAlien() {

    if (
        !currentQuestionAlien
    ) {

        return;

    }


    const data =
        currentQuestionAlien;


    const list =
        alienData[
            data.playerNumber
        ];


    const alien =
        list[data.alienIndex];


    if (alien) {

        alien.element.remove();


        const index =
            list.indexOf(
                alien
            );


        if (
            index !== -1
        ) {

            list.splice(
                index,
                1
            );

        }

    }


    currentQuestionAlien =
        null;

}


/* =========================================================
   FECHAR PERGUNTA
========================================================= */

function closeQuestion() {

    clearTimeout(
        questionTimeout
    );


    clearInterval(
        questionCountdown
    );


    /*
       =====================================================
       🔥 DESPAUSAR O JOGO INTEIRO
       =====================================================
    */

    globalQuestionPause =
        false;


    /*
       REMOVER PAUSA VISUAL DOS DOIS
    */

    player1Arena.classList.remove(
        "question-paused"
    );


    player2Arena.classList.remove(
        "question-paused"
    );


    questionModal.classList.remove(
        "question-player-1",
        "question-player-2"
    );


    questionModal.classList.add(
        "hidden"
    );


    currentQuestion =
        null;


    currentQuestionPlayer =
        null;

}


/* =========================================================
   PERDER VIDA
========================================================= */

function loseLife(
    playerNumber,
    reason
) {

    const player =
        players[playerNumber];


    if (
        player.eliminated
    ) {

        return;

    }


    player.lives--;


    updateLives(
        playerNumber
    );


    player.arena.classList.add(
        "damage"
    );


    setTimeout(
        () => {

            player.arena.classList.remove(
                "damage"
            );

        },
        300
    );


    if (
        player.lives <= 0
    ) {

        eliminatePlayer(
            playerNumber
        );

    }

}


/* =========================================================
   VIDAS
========================================================= */

function updateLives(
    playerNumber
) {

    const player =
        players[playerNumber];


    const selector =
        playerNumber === 1
            ? ".p1-life"
            : ".p2-life";


    const lives =
        document.querySelectorAll(
            selector
        );


    lives.forEach(
        (
            life,
            index
        ) => {

            if (
                index >=
                player.lives
            ) {

                life.classList.add(
                    "lost"
                );


                life.textContent =
                    "🖤";

            }

            else {

                life.classList.remove(
                    "lost"
                );


                life.textContent =
                    "❤️";

            }

        }
    );

}


/* =========================================================
   ELIMINAÇÃO
========================================================= */

function eliminatePlayer(
    playerNumber
) {

    const player =
        players[playerNumber];


    player.eliminated =
        true;


    player.keys.up =
        false;

    player.keys.down =
        false;

    player.keys.left =
        false;

    player.keys.right =
        false;


    player.arena.classList.add(
        "eliminated"
    );


    if (
        currentQuestionPlayer ===
        playerNumber
    ) {

        clearTimeout(
            questionTimeout
        );


        clearInterval(
            questionCountdown
        );


        questionModal.classList.add(
            "hidden"
        );


        currentQuestion =
            null;


        currentQuestionPlayer =
            null;


        globalQuestionPause =
            false;

    }


    showElimination(
        playerNumber
    );


    checkWinner();

}


/* =========================================================
   AVISO DE ELIMINAÇÃO
========================================================= */

function showElimination(
    playerNumber
) {

    if (
        !eliminationModal
    ) {

        return;

    }


    if (
        eliminationTitle
    ) {

        eliminationTitle.textContent =
            `PLAYER ${playerNumber} ELIMINATED`;

    }


    if (
        eliminationText
    ) {

        eliminationText.textContent =
            `Player ${playerNumber} lost all 3 lives.`;

    }


    eliminationModal.classList.remove(
        "hidden"
    );


    if (
        continueButton
    ) {

        continueButton.onclick =
            () => {

                eliminationModal.classList.add(
                    "hidden"
                );

            };

    }

}


/* =========================================================
   VERIFICAR VENCEDOR
========================================================= */

function checkWinner() {

    const p1Dead =
        players[1].eliminated;


    const p2Dead =
        players[2].eliminated;


    if (
        p1Dead &&
        !p2Dead
    ) {

        endGame(2);

    }


    else if (
        p2Dead &&
        !p1Dead
    ) {

        endGame(1);

    }

}


/* =========================================================
   FINAL
========================================================= */

function endGame(
    winner
) {

    gameRunning =
        false;


    globalQuestionPause =
        false;


    clearInterval(
        spawnTimer
    );


    clearTimeout(
        questionTimeout
    );


    clearInterval(
        questionCountdown
    );


    questionModal.classList.add(
        "hidden"
    );


    eliminationModal.classList.add(
        "hidden"
    );


    if (
        winnerTitle
    ) {

        winnerTitle.textContent =
            `PLAYER ${winner} WINS!`;

    }


    if (
        winnerText
    ) {

        winnerText.textContent =
            `Player ${winner} is the last survivor!`;

    }


    if (
        finalP1Lives
    ) {

        finalP1Lives.textContent =
            getHeartDisplay(
                players[1].lives
            );

    }


    if (
        finalP2Lives
    ) {

        finalP2Lives.textContent =
            getHeartDisplay(
                players[2].lives
            );

    }


    if (
        finalP1Kills
    ) {

        finalP1Kills.textContent =
            players[1].kills;

    }


    if (
        finalP2Kills
    ) {

        finalP2Kills.textContent =
            players[2].kills;

    }


    if (
        winnerModal
    ) {

        winnerModal.classList.remove(
            "hidden"
        );

    }

}


/* =========================================================
   CORAÇÕES
========================================================= */

function getHeartDisplay(
    lives
) {

    if (
        lives <= 0
    ) {

        return "💀";

    }


    return "❤️".repeat(
        lives
    );

}


/* =========================================================
   KILLS
========================================================= */

function updateKills() {

    if (
        player1Kills
    ) {

        player1Kills.textContent =
            players[1].kills;

    }


    if (
        player2Kills
    ) {

        player2Kills.textContent =
            players[2].kills;

    }

}


/* =========================================================
   TECLADO
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        /*
           PLAYER 1
        */

        if (
            event.code === "KeyW"
        ) {

            players[1].keys.up =
                true;

        }


        if (
            event.code === "KeyS"
        ) {

            players[1].keys.down =
                true;

        }


        if (
            event.code === "KeyA"
        ) {

            players[1].keys.left =
                true;

        }


        if (
            event.code === "KeyD"
        ) {

            players[1].keys.right =
                true;

        }


        if (
            event.code === "Space"
        ) {

            event.preventDefault();

            shoot(1);

        }


        /*
           PLAYER 2
        */

        if (
            event.code === "ArrowUp"
        ) {

            event.preventDefault();

            players[2].keys.up =
                true;

        }


        if (
            event.code === "ArrowDown"
        ) {

            event.preventDefault();

            players[2].keys.down =
                true;

        }


        if (
            event.code === "ArrowLeft"
        ) {

            event.preventDefault();

            players[2].keys.left =
                true;

        }


        if (
            event.code === "ArrowRight"
        ) {

            event.preventDefault();

            players[2].keys.right =
                true;

        }


        if (
            event.code === "Enter"
        ) {

            event.preventDefault();

            shoot(2);

        }

    }
);


/* =========================================================
   KEYUP
========================================================= */

document.addEventListener(
    "keyup",
    event => {

        if (
            event.code === "KeyW"
        ) {

            players[1].keys.up =
                false;

        }


        if (
            event.code === "KeyS"
        ) {

            players[1].keys.down =
                false;

        }


        if (
            event.code === "KeyA"
        ) {

            players[1].keys.left =
                false;

        }


        if (
            event.code === "KeyD"
        ) {

            players[1].keys.right =
                false;

        }


        if (
            event.code === "ArrowUp"
        ) {

            players[2].keys.up =
                false;

        }


        if (
            event.code === "ArrowDown"
        ) {

            players[2].keys.down =
                false;

        }


        if (
            event.code === "ArrowLeft"
        ) {

            players[2].keys.left =
                false;

        }


        if (
            event.code === "ArrowRight"
        ) {

            players[2].keys.right =
                false;

        }

    }
);


/* =========================================================
   SPAWNER
========================================================= */

function startSpawner() {

    clearInterval(
        spawnTimer
    );


    spawnTimer =
        setInterval(
            () => {

                if (
                    !gameRunning
                ) {

                    return;

                }


                /*
                   🔴 DURANTE A PERGUNTA
                   NÃO NASCE NENHUM ALIEN
                */

                if (
                    globalQuestionPause
                ) {

                    return;

                }


                round++;


                if (
                    roundNumber
                ) {

                    roundNumber.textContent =
                        round;

                }


                if (
                    !players[1].eliminated
                ) {

                    spawnAlien(1);

                }


                if (
                    !players[2].eliminated
                ) {

                    spawnAlien(2);

                }


                if (
                    round % 5 === 0
                ) {

                    increaseDifficulty();

                }

            },
            spawnTime
        );

}


/* =========================================================
   DIFICULDADE
========================================================= */

function increaseDifficulty() {

    spawnTime =
        Math.max(
            650,
            spawnTime - 120
        );


    startSpawner();

}


/* =========================================================
   LOOP PRINCIPAL
========================================================= */

function gameLoop(
    currentTime
) {

    const delta =
        Math.min(
            currentTime -
            lastFrame,
            50
        );


    lastFrame =
        currentTime;


    if (
        gameRunning
    ) {

        /*
           🔥 MESMO LOOP PARA OS DOIS

           globalQuestionPause impede
           qualquer atualização quando
           existe pergunta.
        */

        updatePlayer(
            players[1],
            delta
        );


        updatePlayer(
            players[2],
            delta
        );


        updateAliens(
            1,
            delta
        );


        updateAliens(
            2,
            delta
        );


        updateBullets(
            1,
            delta
        );


        updateBullets(
            2,
            delta
        );

    }


    requestAnimationFrame(
        gameLoop
    );

}


/* =========================================================
   LIMPAR
========================================================= */

function clearGame() {

    alienData[1].forEach(
        alien => {

            alien.element.remove();

        }
    );


    alienData[2].forEach(
        alien => {

            alien.element.remove();

        }
    );


    alienData[1] = [];

    alienData[2] = [];


    players[1]._bullets.forEach(
        bullet => {

            bullet.element.remove();

        }
    );


    players[2]._bullets.forEach(
        bullet => {

            bullet.element.remove();

        }
    );


    players[1]._bullets = [];

    players[2]._bullets = [];

}


/* =========================================================
   CONFIGURAÇÃO INICIAL
========================================================= */

function setupPlayers() {

    players[1].x = 50;
    players[1].y = 82;

    players[2].x = 50;
    players[2].y = 82;


    players[1].ship.style.left =
        "50%";


    players[1].ship.style.top =
        "82%";


    players[2].ship.style.left =
        "50%";


    players[2].ship.style.top =
        "82%";


    updateLives(1);

    updateLives(2);

    updateKills();

}


/* =========================================================
   INICIAR
========================================================= */

function init() {

    clearGame();


    setupPlayers();


    setTimeout(
        () => {

            if (
                !players[1].eliminated
            ) {

                spawnAlien(1);

            }


            if (
                !players[2].eliminated
            ) {

                spawnAlien(2);

            }

        },
        700
    );


    startSpawner();


    requestAnimationFrame(
        gameLoop
    );

}


/* =========================================================
   REINICIAR
========================================================= */

if (
    restartButton
) {

    restartButton.addEventListener(
        "click",
        () => {

            location.reload();

        }
    );

}


/* =========================================================
   START
========================================================= */

init();