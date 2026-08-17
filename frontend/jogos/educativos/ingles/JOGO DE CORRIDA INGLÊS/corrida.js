javascript
/* =========================================================
   ENGLISH RACE
   MULTIPLAYER EDUCATIONAL RACING GAME
   INSTITUTO ACUTIS
========================================================= */


/* =========================================================
   CONFIGURAÇÃO
========================================================= */

const CONFIG = {
    totalCasas: 20,
    tempoPergunta: 30,

    // Quantas casas o jogador avança ao acertar
    minimoAvanco: 1,
    maximoAvanco: 3
};


/* =========================================================
   ELEMENTOS
========================================================= */

const el = {

    player1Car:
        document.getElementById("player1Car"),

    player2Car:
        document.getElementById("player2Car"),

    player1Position:
        document.getElementById("player1Position"),

    player2Position:
        document.getElementById("player2Position"),

    player1Message:
        document.getElementById("player1Message"),

    player2Message:
        document.getElementById("player2Message"),

    player1Button:
        document.getElementById("player1AnswerButton"),

    player2Button:
        document.getElementById("player2AnswerButton"),

    questionOverlay:
        document.getElementById("questionOverlay"),

    questionPlayer:
        document.getElementById("questionPlayer"),

    questionPlayerIcon:
        document.getElementById("questionPlayerIcon"),

    questionTimer:
        document.getElementById("questionTimer"),

    questionCategory:
        document.getElementById("questionCategory"),

    questionText:
        document.getElementById("questionText"),

    questionAnswers:
        document.getElementById("questionAnswers"),

    questionFeedback:
        document.getElementById("questionFeedback"),

    winnerOverlay:
        document.getElementById("winnerOverlay"),

    winnerTitle:
        document.getElementById("winnerTitle"),

    winnerMessage:
        document.getElementById("winnerMessage"),

    winnerPlayer1Position:
        document.getElementById("winnerPlayer1Position"),

    winnerPlayer2Position:
        document.getElementById("winnerPlayer2Position"),

    restartButton:
        document.getElementById("restartButton")

};


/* =========================================================
   BANCO DE PERGUNTAS
========================================================= */

const questions = [

    {
        category: "VERB TO BE",
        question: "She ___ a student.",
        answers: ["am", "is", "are", "be"],
        correct: 1
    },

    {
        category: "PRONOUNS",
        question: "John and Mary are friends. ___ are happy.",
        answers: ["He", "She", "They", "It"],
        correct: 2
    },

    {
        category: "ARTICLES",
        question: "I have ___ orange.",
        answers: ["a", "an", "the", "some"],
        correct: 1
    },

    {
        category: "SIMPLE PRESENT",
        question: "He ___ soccer every Sunday.",
        answers: ["play", "plays", "playing", "played"],
        correct: 1
    },

    {
        category: "SIMPLE PAST",
        question: "Yesterday, I ___ to school.",
        answers: ["go", "goes", "went", "going"],
        correct: 2
    },

    {
        category: "VOCABULARY",
        question: "What is the opposite of 'big'?",
        answers: ["Tall", "Small", "Fast", "Long"],
        correct: 1
    },

    {
        category: "PREPOSITIONS",
        question: "The book is ___ the table.",
        answers: ["on", "at", "to", "from"],
        correct: 0
    },

    {
        category: "THERE IS / THERE ARE",
        question: "___ two books on the desk.",
        answers: [
            "There is",
            "There are",
            "There am",
            "There be"
        ],
        correct: 1
    },

    {
        category: "VOCABULARY",
        question: "What does 'hungry' mean?",
        answers: [
            "Cansado",
            "Com fome",
            "Feliz",
            "Com medo"
        ],
        correct: 1
    },

    {
        category: "ADJECTIVES",
        question: "Which word means 'feliz'?",
        answers: [
            "Sad",
            "Angry",
            "Happy",
            "Tired"
        ],
        correct: 2
    },

    {
        category: "VOCABULARY",
        question: "What does 'teacher' mean?",
        answers: [
            "Aluno",
            "Professor",
            "Médico",
            "Diretor"
        ],
        correct: 1
    },

    {
        category: "SIMPLE PRESENT",
        question: "She ___ English every day.",
        answers: [
            "study",
            "studies",
            "studied",
            "studying"
        ],
        correct: 1
    },

    {
        category: "SIMPLE PAST",
        question: "They ___ football yesterday.",
        answers: [
            "play",
            "plays",
            "played",
            "playing"
        ],
        correct: 2
    },

    {
        category: "PRONOUNS",
        question: "Maria is my sister. ___ is 15.",
        answers: [
            "He",
            "She",
            "They",
            "It"
        ],
        correct: 1
    },

    {
        category: "VOCABULARY",
        question: "What is the opposite of 'hot'?",
        answers: [
            "Cold",
            "Warm",
            "Big",
            "Fast"
        ],
        correct: 0
    },

    {
        category: "ARTICLES",
        question: "He is ___ doctor.",
        answers: [
            "an",
            "a",
            "are",
            "some"
        ],
        correct: 1
    },

    {
        category: "VERB TO BE",
        question: "They ___ my friends.",
        answers: [
            "is",
            "am",
            "are",
            "be"
        ],
        correct: 2
    },

    {
        category: "VOCABULARY",
        question: "What does 'fast' mean?",
        answers: [
            "Lento",
            "Grande",
            "Rápido",
            "Fraco"
        ],
        correct: 2
    },

    {
        category: "PREPOSITIONS",
        question: "I live ___ Brazil.",
        answers: [
            "at",
            "on",
            "in",
            "to"
        ],
        correct: 2
    },

    {
        category: "SIMPLE PRESENT",
        question: "I ___ English every day.",
        answers: [
            "study",
            "studies",
            "studied",
            "studying"
        ],
        correct: 0
    }

];


/* =========================================================
   ESTADO DOS JOGADORES
========================================================= */

const players = {

    1: {
        position: 0,
        active: true,
        answered: false,
        car: el.player1Car,
        positionElement: el.player1Position,
        message: el.player1Message,
        button: el.player1Button
    },

    2: {
        position: 0,
        active: true,
        answered: false,
        car: el.player2Car,
        positionElement: el.player2Position,
        message: el.player2Message,
        button: el.player2Button
    }

};


/* =========================================================
   ESTADO GLOBAL
========================================================= */

let currentPlayer = null;
let currentQuestion = null;

let timer = null;
let seconds = CONFIG.tempoPergunta;

let gameStarted = false;
let gameFinished = false;

let questionUsed = [];


/* =========================================================
   UTILIDADES
========================================================= */

function random(min, max) {

    return Math.floor(
        Math.random() * (max - min + 1)
    ) + min;

}


function getQuestion() {

    if (
        questionUsed.length >=
        questions.length
    ) {

        questionUsed = [];

    }


    let index;

    do {

        index = random(
            0,
            questions.length - 1
        );

    } while (
        questionUsed.includes(index)
    );


    questionUsed.push(index);

    return questions[index];

}


/* =========================================================
   CRIAÇÃO DAS CASAS
========================================================= */

function createTrackCells() {

    document
        .querySelectorAll(".race-cell")
        .forEach(
            cell => cell.remove()
        );


    const roads = [

        document.getElementById(
            "player1Road"
        ),

        document.getElementById(
            "player2Road"
        )

    ];


    roads.forEach(
        road => {

            if (!road)
                return;


            for (
                let i = 1;
                i <= CONFIG.totalCasas;
                i++
            ) {

                const cell =
                    document.createElement(
                        "div"
                    );


                cell.className =
                    "race-cell";


                cell.dataset.position =
                    i;


                cell.innerHTML = `
                    <span>${i}</span>
                `;


                /*
                   As casas ficam espalhadas
                   pelo percurso visual.
                   O CSS define o formato
                   da pista.
                */

                road.appendChild(
                    cell
                );

            }

        }
    );

}


/* =========================================================
   POSIÇÃO DO CARRO
========================================================= */

function updateCarPosition(
    playerNumber
) {

    const player =
        players[playerNumber];


    const progress =
        player.position /
        CONFIG.totalCasas;


    /*
       O carro percorre o caminho
       completo de 0% a 100%.

       O CSS usa a variável
       --race-progress para que
       a pista possa ter curvas.
    */

    player.car.style.setProperty(
        "--race-progress",
        progress
    );


    /*
       Também atualizamos uma
       variável percentual.
    */

    player.car.style.setProperty(
        "--progress-percent",
        `${progress * 100}%`
    );


    player.positionElement.textContent =
        `${player.position}/${CONFIG.totalCasas}`;

}


/* =========================================================
   AVANÇAR CARRO
========================================================= */

function moveCar(
    playerNumber
) {

    const player =
        players[playerNumber];


    const amount =
        random(
            CONFIG.minimoAvanco,
            CONFIG.maximoAvanco
        );


    player.position += amount;


    if (
        player.position >
        CONFIG.totalCasas
    ) {

        player.position =
            CONFIG.totalCasas;

    }


    updateCarPosition(
        playerNumber
    );


    player.message.textContent =
        `🏎️ +${amount} casas! O carro avançou!`;


    player.message.classList.add(
        "success"
    );


    setTimeout(
        () => {

            player.message.classList.remove(
                "success"
            );

        },
        700
    );


    if (
        player.position >=
        CONFIG.totalCasas
    ) {

        finishRace(
            playerNumber
        );

    }

}


/* =========================================================
   ABRIR PERGUNTA
========================================================= */

function openQuestion(
    playerNumber
) {

    if (
        gameFinished ||
        !gameStarted
    )
        return;


    const player =
        players[playerNumber];


    if (!player.active)
        return;


    /*
       Evita que o jogador abra
       várias perguntas.
    */

    if (
        currentPlayer !== null
    )
        return;


    currentPlayer =
        playerNumber;


    currentQuestion =
        getQuestion();


    player.answered =
        false;


    el.questionPlayer.textContent =
        `PLAYER ${playerNumber}`;


}
