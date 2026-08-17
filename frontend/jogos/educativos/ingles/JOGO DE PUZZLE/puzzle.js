/* =========================================================
   ENGLISH PUZZLE
   PUZZLE EDUCATIVO DE INGLÊS
   INSTITUTO ACUTIS
========================================================= */


/* =========================================================
   CONFIGURAÇÕES
========================================================= */

const CONFIG = {
    rows: 4,
    cols: 4,
    totalPieces: 16,
    questionsPerUnlock: 1,
    questionTime: 30
};


/* =========================================================
   ESTADO DO JOGO
========================================================= */

let pieces = [];
let placedPieces = 0;

let selectedPiece = null;
let selectedSlot = null;

let currentQuestion = null;
let questionTimer = null;
let questionSeconds = CONFIG.questionTime;

let unlockedPieces = 4;

let gameFinished = false;


/* =========================================================
   ELEMENTOS
========================================================= */

const elements = {

    board:
        document.getElementById("puzzleBoard"),

    pieces:
        document.getElementById("piecesContainer"),

    questionOverlay:
        document.getElementById("questionOverlay"),

    questionText:
        document.getElementById("questionText"),

    questionCategory:
        document.getElementById("questionCategory"),

    questionAnswers:
        document.getElementById("questionAnswers"),

    questionTimer:
        document.getElementById("questionTimer"),

    questionFeedback:
        document.getElementById("questionFeedback"),

    closeQuestion:
        document.getElementById("closeQuestion"),

    progress:
        document.getElementById("puzzleProgress"),

    progressText:
        document.getElementById("progressText"),

    unlockedText:
        document.getElementById("unlockedText"),

    message:
        document.getElementById("gameMessage"),

    restartButton:
        document.getElementById("restartButton"),

    victoryOverlay:
        document.getElementById("victoryOverlay"),

    victoryTime:
        document.getElementById("victoryTime")

};


/* =========================================================
   BANCO DE PERGUNTAS
========================================================= */

const questions = [

    {
        category: "VERB TO BE",
        question: "She ___ my friend.",
        answers: [
            "am",
            "is",
            "are",
            "be"
        ],
        correct: 1
    },

    {
        category: "PRONOUNS",
        question: "John and Mary are students. ___ are happy.",
        answers: [
            "He",
            "She",
            "They",
            "It"
        ],
        correct: 2
    },

    {
        category: "ARTICLES",
        question: "I have ___ orange.",
        answers: [
            "a",
            "an",
            "the",
            "some"
        ],
        correct: 1
    },

    {
        category: "VOCABULARY",
        question: "What does 'dog' mean?",
        answers: [
            "Gato",
            "Cachorro",
            "Pássaro",
            "Cavalo"
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
        question: "Yesterday, I ___ football.",
        answers: [
            "play",
            "plays",
            "played",
            "playing"
        ],
        correct: 2
    },

    {
        category: "PREPOSITIONS",
        question: "The book is ___ the table.",
        answers: [
            "on",
            "at",
            "to",
            "from"
        ],
        correct: 0
    },

    {
        category: "THERE IS / THERE ARE",
        question: "___ three students in the classroom.",
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
        question: "What is the opposite of 'big'?",
        answers: [
            "Small",
            "Fast",
            "Tall",
            "Long"
        ],
        correct: 0
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
        category: "SIMPLE PRESENT",
        question: "They ___ soccer every Sunday.",
        answers: [
            "play",
            "plays",
            "playing",
            "played"
        ],
        correct: 0
    },

    {
        category: "SIMPLE PAST",
        question: "She ___ a movie yesterday.",
        answers: [
            "watch",
            "watches",
            "watched",
            "watching"
        ],
        correct: 2
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
        category: "VERB TO BE",
        question: "They ___ students.",
        answers: [
            "is",
            "am",
            "are",
            "be"
        ],
        correct: 2
    },

    {
        category: "ARTICLES",
        question: "She is ___ doctor.",
        answers: [
            "an",
            "a",
            "the",
            "some"
        ],
        correct: 1
    },

    {
        category: "VOCABULARY",
        question: "What is the opposite of 'hot'?",
        answers: [
            "Cold",
            "Big",
            "Fast",
            "Tall"
        ],
        correct: 0
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
        category: "VOCABULARY",
        question: "What does 'book' mean?",
        answers: [
            "Livro",
            "Mesa",
            "Caneta",
            "Caderno"
        ],
        correct: 0
    }

];


/* =========================================================
   UTILIDADES
========================================================= */

function shuffle(array) {

    return [...array].sort(
        () => Math.random() - 0.5
    );

}


function randomQuestion() {

    return questions[
        Math.floor(
            Math.random() * questions.length
        )
    ];

}


function formatTime(seconds) {

    const minutes =
        Math.floor(seconds / 60);

    const secs =
        Math.floor(seconds % 60);

    return (
        String(minutes).padStart(2, "0") +
        ":" +
        String(secs).padStart(2, "0")
    );

}


/* =========================================================
   CRIAR TABULEIRO
========================================================= */

function createBoard() {

    if (!elements.board)
        return;

    elements.board.innerHTML = "";

    const total =
        CONFIG.rows * CONFIG.cols;


    for (
        let i = 0;
        i < total;
        i++
    ) {

        const slot =
            document.createElement("div");


        slot.className =
            "puzzle-slot";


        slot.dataset.index =
            i;


        slot.addEventListener(
            "dragover",
            event => {

                event.preventDefault();

                slot.classList.add(
                    "drag-over"
                );

            }
        );


        slot.addEventListener(
            "dragleave",
            () => {

                slot.classList.remove(
                    "drag-over"
                );

            }
        );


        slot.addEventListener(
            "drop",
            event => {

                event.preventDefault();

                slot.classList.remove(
                    "drag-over"
                );

                const pieceId =
                    event.dataTransfer.getData(
                        "piece"
                    );


                if (
                    pieceId !== ""
                ) {

                    placePiece(
                        Number(pieceId),
                        Number(slot.dataset.index)
                    );

                }

            }
        );


        elements.board.appendChild(
            slot
        );

    }

}


/* =========================================================
   CRIAR PEÇAS
========================================================= */

function createPieces() {

    if (!elements.pieces)
        return;


    elements.pieces.innerHTML =
        "";


    pieces = [];


    for (
        let i = 0;
        i < CONFIG.totalPieces;
        i++
    ) {

        const piece = {

            id: i,

            correctSlot: i,

            unlocked:
                i < unlockedPieces,

            placed: false

        };


        pieces.push(
            piece
        );

    }


    renderPieces();

}


/* =========================================================
   RENDERIZAR PEÇAS
========================================================= */

function renderPieces() {

    if (!elements.pieces)
        return;


    elements.pieces.innerHTML =
        "";


    pieces.forEach(
        piece => {

            if (piece.placed)
                return;


            const element =
                document.createElement("div");


            element.className =
                "puzzle-piece";


            element.dataset.id =
                piece.id;


            /*
               A peça fica bloqueada
               até o aluno responder
               corretamente.
            */

            if (!piece.unlocked) {

                element.classList.add(
                    "locked"
                );


                element.innerHTML = `
                    <div class="piece-lock">
                        🔒
                    </div>

                    <span>
                        RESPONDA
                    </span>
                `;


                element.addEventListener(
                    "click",
                    () => {

                        requestUnlock(
                            piece.id
                        );

                    }
                );


            } else {

                element.draggable =
                    true;


                element.innerHTML = `
                    <div class="piece-number">
                        ${piece.id + 1}
                    </div>
                `;


                element.addEventListener(
                    "dragstart",
                    event => {

                        event.dataTransfer
                            .setData(
                                "piece",
                                piece.id
                            );

                        selectedPiece =
                            piece.id;

                        element.classList.add(
                            "dragging"
                        );

                    }
                );


                element.addEventListener(
                    "dragend",
                    () => {

                        element.classList.remove(
                            "dragging"
                        );

                    }
                );


                /*
                   Também permite clicar
                   na peça e depois clicar
                   no espaço.
                */

                element.addEventListener(
                    "click",
                    () => {

                        selectPiece(
                            piece.id,
                            element
                        );

                    }
                );

            }


            elements.pieces.appendChild(
                element
            );

        }
    );


    updateProgress();

}


/* =========================================================
   SELECIONAR PEÇA
========================================================= */

function selectPiece(
    pieceId,
    element
) {

    document
        .querySelectorAll(
            ".puzzle-piece.selected"
        )
        .forEach(
            piece =>
                piece.classList.remove(
                    "selected"
                )
        );


    selectedPiece =
        pieceId;


    element.classList.add(
        "selected"
    );


    if (elements.message) {

        elements.message.textContent =
            "🧩 Agora clique no espaço onde deseja colocar a peça.";

    }

}


/* =========================================================
   CLIQUE NO ESPAÇO
========================================================= */

function setupSlotClick() {

    if (!elements.board)
        return;


    elements.board.addEventListener(
        "click",
        event => {

            const slot =
                event.target.closest(
                    ".puzzle-slot"
                );


            if (!slot)
                return;


            if (
                selectedPiece === null
            )
                return;


            placePiece(
                selectedPiece,
                Number(
                    slot.dataset.index
                )
            );

        }
    );

}


/* =========================================================
   COLOCAR PEÇA
========================================================= */

function placePiece(
    pieceId,
    slotIndex
) {

    const piece =
        pieces[pieceId];


    if (!piece)
        return;


    if (!piece.unlocked) {

        requestUnlock(
            pieceId
        );

        return;

    }


    if (piece.placed)
        return;


    const slot =
        elements.board.querySelector(
            `.puzzle-slot[data-index="${slotIndex}"]`
        );


    if (!slot)
        return;


    /*
       Se o espaço já possui uma peça,
       não permite colocar outra.
    */

    if (
        slot.children.length > 0
    ) {

        if (elements.message) {

            elements.message.textContent =
                "⚠️ Este espaço já está ocupado.";

        }

        return;

    }


    /*
       Verifica se a posição é correta.
    */

    if (
        piece.correctSlot !==
        slotIndex
    ) {

        if (elements.message) {

            elements.message.textContent =
                "❌ Essa peça não pertence a este lugar.";

        }


        slot.classList.add(
            "wrong-placement"
        );


        setTimeout(
            () => {

                slot.classList.remove(
                    "wrong-placement"
                );

            },
            600
        );


        return;

    }


    /*
       POSIÇÃO CORRETA
    */

    piece.placed =
        true;


    placedPieces++;


    const pieceElement =
        document.querySelector(
            `.puzzle-piece[data-id="${pieceId}"]`
        );


    if (pieceElement) {

        pieceElement.remove();

    }


    const boardPiece =
        document.createElement("div");


    boardPiece.className =
        "placed-piece";


    boardPiece.innerHTML = `
        <span>🧩</span>
        <small>${pieceId + 1}</small>
    `;


    slot.appendChild(
        boardPiece
    );


    slot.classList.add(
        "completed"
    );


    selectedPiece =
        null;


    if (elements.message) {

        elements.message.textContent =
            "✅ Peça colocada corretamente!";

    }


    updateProgress();


    /*
       Quando uma peça é colocada,
       libera uma nova peça mediante
       uma pergunta.
    */

    unlockNextPiece();


    /*
       Verifica vitória.
    */

    if (
        placedPieces >=
        CONFIG.totalPieces
    ) {

        finishGame();

    }

}


/* =========================================================
   LIBERAR PRÓXIMA PEÇA
========================================================= */

function unlockNextPiece() {

    /*
       Procura a primeira peça ainda
       bloqueada.
    */

    const lockedPiece =
        pieces.find(
            piece =>
                !piece.unlocked &&
                !piece.placed
        );


    if (!lockedPiece)
        return;


    /*
       A peça não é liberada imediatamente.

       O aluno precisa responder
       uma pergunta.
    */

    setTimeout(
        () => {

            requestUnlock(
                lockedPiece.id
            );

        },
        350
    );

}


/* =========================================================
   SOLICITAR DESBLOQUEIO
========================================================= */

function requestUnlock(
    pieceId
) {

    const piece =
        pieces[pieceId];


    if (!piece)
        return;


    if (piece.unlocked)
        return;


    currentQuestion =
        randomQuestion();


    openQuestion();

}


/* =========================================================
   ABRIR QUESTIONÁRIO
========================================================= */

function openQuestion() {

    if (
        !elements.questionOverlay
    )
        return;


    elements.questionOverlay
        .classList
        .remove("hidden");


    elements.questionCategory.textContent =
        currentQuestion.category;


    elements.questionText.textContent =
        currentQuestion.question;


    elements.questionFeedback.textContent =
        "Responda corretamente para liberar uma nova peça.";


    elements.questionFeedback.className =
        "question-feedback";


    renderQuestionAnswers();


    startQuestionTimer();

}


/* =========================================================
   RENDERIZAR RESPOSTAS
========================================================= */

function renderQuestionAnswers() {

    elements.questionAnswers.innerHTML =
        "";


    currentQuestion.answers.forEach(
        (answer, index) => {

            const button =
                document.createElement(
                    "button"
                );


            button.className =
                "answer-button";


            button.textContent =
                answer;


            button.addEventListener(
                "click",
                () => {

                    answerQuestion(
                        index
                    );

                }
            );


            elements.questionAnswers
                .appendChild(
                    button
                );

        }
    );

}


/* =========================================================
   RESPONDER
========================================================= */

function answerQuestion(
    index
) {

    if (!currentQuestion)
        return;


    const buttons =
        elements.questionAnswers
            .querySelectorAll(
                ".answer-button"
            );


    buttons.forEach(
        button =>
            button.disabled = true
    );


    const correct =
        index ===
        currentQuestion.correct;


    if (correct) {

        buttons[index]
            .classList
            .add("correct");


        elements.questionFeedback.textContent =
            "🎉 CORRETO! Uma nova peça foi liberada!";


        elements.questionFeedback.className =
            "question-feedback correct";


        stopQuestionTimer();


        /*
           Encontra a primeira peça
           bloqueada e libera.
        */

        const piece =
            pieces.find(
                p =>
                    !p.unlocked &&
                    !p.placed
            );


        if (piece) {

            piece.unlocked =
                true;

        }


        setTimeout(
            () => {

                closeQuestion();

                renderPieces();


                if (elements.message) {

                    elements.message.textContent =
                        "🧩 Nova peça liberada! Continue montando.";

                }

            },
            900
        );


        return;

    }


    /*
       RESPOSTA ERRADA
    */

    buttons[index]
        .classList
        .add("wrong");


    elements.questionFeedback.textContent =
        "❌ Resposta incorreta! Tente novamente.";


    elements.questionFeedback.className =
        "question-feedback wrong";


    setTimeout(
        () => {

            buttons.forEach(
                button =>
                    button.disabled = false
            );


            buttons[index]
                .classList
                .remove("wrong");


            elements.questionFeedback.textContent =
                "Tente novamente.";

        },
        700
    );

}


/* =========================================================
   TIMER DA PERGUNTA
========================================================= */

function startQuestionTimer() {

    stopQuestionTimer();


    questionSeconds =
        CONFIG.questionTime;


    updateQuestionTimer();


    questionTimer =
        setInterval(
            () => {

                questionSeconds--;


                updateQuestionTimer();


                if (
                    questionSeconds <= 0
                ) {

                    questionTimeOut();

                }

            },
            1000
        );

}


/* =========================================================
   ATUALIZAR TIMER
========================================================= */

function updateQuestionTimer() {

    if (
        !elements.questionTimer
    )
        return;


    elements.questionTimer.textContent =
        questionSeconds;


    if (
        questionSeconds <= 10
    ) {

        elements.questionTimer
            .classList
            .add("danger");

    } else {

        elements.questionTimer
            .classList
            .remove("danger");

    }

}


/* =========================================================
   TEMPO ESGOTADO
========================================================= */

function questionTimeOut() {

    stopQuestionTimer();


    elements.questionFeedback.textContent =
        "⏰ Tempo esgotado! Tente novamente.";


    elements.questionFeedback.className =
        "question-feedback wrong";


    const buttons =
        elements.questionAnswers
            .querySelectorAll(
                ".answer-button"
            );


    buttons.forEach(
        button =>
            button.disabled = false
    );


    setTimeout(
        () => {

            startQuestionTimer();

        },
        1000
    );

}


/* =========================================================
   PARAR TIMER
========================================================= */

function stopQuestionTimer() {

    if (questionTimer) {

        clearInterval(
            questionTimer
        );

        questionTimer =
            null;

    }

}


/* =========================================================
   FECHAR QUESTIONÁRIO
========================================================= */

function closeQuestion() {

    stopQuestionTimer();


    if (
        elements.questionOverlay
    ) {

        elements.questionOverlay
            .classList
            .add("hidden");

    }


    currentQuestion =
        null;

}


/* =========================================================
   PROGRESSO
========================================================= */

function updateProgress() {

    const percentage =
        (
            placedPieces /
            CONFIG.totalPieces
        ) * 100;


    if (
        elements.progress
    ) {

        elements.progress.style.width =
            `${percentage}%`;

    }


    if (
        elements.progressText
    ) {

        elements.progressText.textContent =
            `${placedPieces}/${CONFIG.totalPieces}`;

    }


    if (
        elements.unlockedText
    ) {

        const totalUnlocked =
            pieces.filter(
                piece =>
                    piece.unlocked
            ).length;


        elements.unlockedText.textContent =
            `${totalUnlocked}/${CONFIG.totalPieces}`;

    }

}


/* =========================================================
   VITÓRIA
========================================================= */

let gameStartTime =
    null;


function finishGame() {

    if (gameFinished)
        return;


    gameFinished =
        true;


    stopQuestionTimer();


    const elapsed =
        (
            Date.now() -
            gameStartTime
        ) / 1000;


    if (
        elements.victoryTime
    ) {

        elements.victoryTime.textContent =
            formatTime(elapsed);

    }


    if (
        elements.message
    ) {

        elements.message.textContent =
            "🏆 PARABÉNS! Você completou o quebra-cabeça!";

    }


    setTimeout(
        () => {

            if (
                elements.victoryOverlay
            ) {

                elements.victoryOverlay
                    .classList
                    .remove("hidden");

            }

        },
        700
    );

}


/* =========================================================
   REINICIAR JOGO
========================================================= */

function restartGame() {

    stopQuestionTimer();


    gameFinished =
        false;


    placedPieces =
        0;


    selectedPiece =
        null;


    selectedSlot =
        null;


    currentQuestion =
        null;


    unlockedPieces =
        4;


    gameStartTime =
        Date.now();


    if (
        elements.victoryOverlay
    ) {

        elements.victoryOverlay
            .classList
            .add("hidden");

    }


    closeQuestion();


    createBoard();

    createPieces();

    updateProgress();


    if (
        elements.message
    ) {

        elements.message.textContent =
            "🧩 Monte o quebra-cabeça! Responda às perguntas para liberar novas peças.";

    }

}


/* =========================================================
   BOTÃO DE REINÍCIO
========================================================= */

if (
    elements.restartButton
) {

    elements.restartButton.addEventListener(
        "click",
        restartGame
    );

}


/* =========================================================
   BOTÃO FECHAR PERGUNTA
========================================================= */

if (
    elements.closeQuestion
) {

    elements.closeQuestion.addEventListener(
        "click",
        () => {

            /*
               Não permite abandonar a pergunta
               simplesmente fechando.

               O aluno precisa responder.
            */

            if (
                elements.message
            ) {

                elements.message.textContent =
                    "⚠️ Responda à pergunta para liberar a peça.";

            }

        }
    );

}


/* =========================================================
   INICIALIZAÇÃO
========================================================= */

window.addEventListener(
    "load",
    () => {

        createBoard();

        setupSlotClick();

        restartGame();

    }
);