/* =========================================================
   ENGLISH MEMORY
   INSTITUTO ACUTIS
   SCRIPT.JS
   MECÂNICA: 1 MINUTO / TENTATIVAS INFINITAS
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       BANCO DE PALAVRAS
    ===================================================== */

    const vocabulary = [

        {
            english: "ACHIEVE",
            portuguese: "ALCANÇAR"
        },

        {
            english: "WORRIED",
            portuguese: "PREOCUPADO"
        },

        {
            english: "GOALS",
            portuguese: "METAS"
        },

        {
            english: "MISTAKES",
            portuguese: "ERROS"
        },

        {
            english: "BIGGEST",
            portuguese: "MAIOR"
        },

        {
            english: "IMPROVE",
            portuguese: "MELHORAR"
        },

        {
            english: "CHALLENGE",
            portuguese: "DESAFIO"
        },

        {
            english: "DREAM",
            portuguese: "SONHO"
        },

        {
            english: "LEARN",
            portuguese: "APRENDER"
        },

        {
            english: "CONFIDENT",
            portuguese: "CONFIANTE"
        }

    ];


    /* =====================================================
       CONFIGURAÇÕES
    ===================================================== */

    const TOTAL_PAIRS =
        vocabulary.length;

    const GAME_TIME = 60;


    /* =====================================================
       ESTADO DO JOGO
    ===================================================== */

    let cards = [];

    let firstCard = null;

    let secondCard = null;

    let lockBoard = false;

    let matchedPairs = 0;

    let attempts = 0;

    let score = 0;

    let combo = 0;

    let seconds = 0;

    let timeLeft = GAME_TIME;

    let timer = null;

    let gameStarted = false;

    let gameFinished = false;


    /* =====================================================
       ELEMENTOS
    ===================================================== */

    const board =
        document.getElementById(
            "memoryBoard"
        );

    const scoreElement =
        document.getElementById(
            "score"
        );

    const comboElement =
        document.getElementById(
            "combo"
        );

    const livesElement =
        document.getElementById(
            "lives"
        );

    const pairsFoundElement =
        document.getElementById(
            "pairsFound"
        );

    const attemptsElement =
        document.getElementById(
            "attempts"
        );

    const timerElement =
        document.getElementById(
            "timer"
        );

    const restartButton =
        document.getElementById(
            "restartButton"
        );

    const resultScreen =
        document.getElementById(
            "resultScreen"
        );

    const finalScoreElement =
        document.getElementById(
            "finalScore"
        );

    const finalPairsElement =
        document.getElementById(
            "finalPairs"
        );

    const finalAttemptsElement =
        document.getElementById(
            "finalAttempts"
        );

    const finalTimeElement =
        document.getElementById(
            "finalTime"
        );

    const playAgainButton =
        document.getElementById(
            "playAgainButton"
        );


    /* =====================================================
       VERIFICAR ELEMENTOS
    ===================================================== */

    if (
        !board ||
        !scoreElement ||
        !comboElement ||
        !livesElement ||
        !pairsFoundElement ||
        !attemptsElement ||
        !timerElement ||
        !restartButton ||
        !resultScreen ||
        !finalScoreElement ||
        !finalPairsElement ||
        !finalAttemptsElement ||
        !finalTimeElement ||
        !playAgainButton
    ) {

        console.error(
            "English Memory: elemento do HTML não encontrado."
        );

        return;

    }


    /* =====================================================
       EMBARALHAR
    ===================================================== */

    function shuffle(array) {

        const shuffled =
            [...array];


        for (
            let i = shuffled.length - 1;
            i > 0;
            i--
        ) {

            const random =
                Math.floor(
                    Math.random() *
                    (i + 1)
                );


            [
                shuffled[i],
                shuffled[random]
            ] = [
                shuffled[random],
                shuffled[i]
            ];

        }


        return shuffled;

    }


    /* =====================================================
       CRIAR CARTAS
    ===================================================== */

    function createCards() {

        cards = [];


        vocabulary.forEach(
            (item, index) => {

                /* INGLÊS */

                cards.push({

                    id:
                        `pair-${index}`,

                    pair:
                        index,

                    type:
                        "english",

                    text:
                        item.english

                });


                /* PORTUGUÊS */

                cards.push({

                    id:
                        `pair-${index}`,

                    pair:
                        index,

                    type:
                        "portuguese",

                    text:
                        item.portuguese

                });

            }
        );


        cards =
            shuffle(cards);

    }


    /* =====================================================
       RENDERIZAR
    ===================================================== */

    function renderBoard() {

        board.innerHTML = "";


        cards.forEach(
            (card, index) => {

                const cardElement =
                    document.createElement(
                        "div"
                    );


                cardElement.className =
                    "memory-card";


                cardElement.dataset.type =
                    card.type;

                cardElement.dataset.pair =
                    card.pair;

                cardElement.dataset.index =
                    index;


                cardElement.innerHTML = `

                    <div class="card-inner">

                        <div class="card-front">

                            <div class="card-symbol">
                                ?
                            </div>

                            <small>
                                MATCH
                            </small>

                        </div>


                        <div class="card-back">

                            <div class="card-content">

                                <span class="language">

                                    ${
                                        card.type === "english"
                                            ? "ENGLISH"
                                            : "PORTUGUÊS"
                                    }

                                </span>

                                <span class="word">
                                    ${card.text}
                                </span>

                            </div>

                        </div>

                    </div>

                `;


                cardElement.addEventListener(
                    "click",
                    () => {

                        flipCard(
                            cardElement
                        );

                    }
                );


                board.appendChild(
                    cardElement
                );

            }
        );

    }


    /* =====================================================
       VIRAR CARTA
    ===================================================== */

    function flipCard(cardElement) {

        if (lockBoard)
            return;


        if (gameFinished)
            return;


        if (
            cardElement.classList.contains(
                "flipped"
            )
        )
            return;


        if (
            cardElement.classList.contains(
                "matched"
            )
        )
            return;


        /* PRIMEIRO CLIQUE COMEÇA O TEMPO */

        if (!gameStarted) {

            gameStarted = true;

            startTimer();

        }


        cardElement.classList.add(
            "flipped"
        );


        if (!firstCard) {

            firstCard =
                cardElement;

            return;

        }


        secondCard =
            cardElement;


        lockBoard = true;

        attempts++;


        updateStats();


        checkMatch();

    }


    /* =====================================================
       VERIFICAR PAR
    ===================================================== */

    function checkMatch() {

        const firstPair =
            firstCard.dataset.pair;

        const secondPair =
            secondCard.dataset.pair;


        const firstType =
            firstCard.dataset.type;

        const secondType =
            secondCard.dataset.type;


        const isMatch =
            firstPair === secondPair &&
            firstType !== secondType;


        if (isMatch) {

            handleMatch();

        } else {

            handleMismatch();

        }

    }


    /* =====================================================
       ACERTO
    ===================================================== */

    function handleMatch() {

        matchedPairs++;

        combo++;


        /* ================================================
           PONTUAÇÃO
        ================================================= */

        let points = 100;


        /* COMBO */

        if (combo >= 2) {

            points +=
                (combo - 1) * 25;

        }


        /* BÔNUS POR VELOCIDADE */

        if (timeLeft >= 45) {

            points += 30;

        }

        else if (timeLeft >= 30) {

            points += 20;

        }

        else if (timeLeft >= 15) {

            points += 10;

        }


        score += points;


        /* ================================================
           MARCAR PAR
        ================================================= */

        firstCard.classList.add(
            "matched"
        );

        secondCard.classList.add(
            "matched"
        );


        /* ================================================
           RESETAR
        ================================================= */

        firstCard = null;

        secondCard = null;

        lockBoard = false;


        updateStats();


        /* ================================================
           VITÓRIA
        ================================================= */

        if (
            matchedPairs ===
            TOTAL_PAIRS
        ) {

            finishGame(
                true
            );

        }

    }


    /* =====================================================
       ERRO
    ===================================================== */

    function handleMismatch() {

        /*
           IMPORTANTE:

           NÃO perde vida.
           NÃO perde pontos.
           NÃO encerra o jogo.

           O jogador pode tentar quantas vezes
           quiser enquanto houver tempo.
        */


        combo = 0;


        setTimeout(
            () => {

                if (firstCard) {

                    firstCard.classList.remove(
                        "flipped"
                    );

                }


                if (secondCard) {

                    secondCard.classList.remove(
                        "flipped"
                    );

                }


                firstCard = null;

                secondCard = null;

                lockBoard = false;


                updateStats();

            },
            650
        );

    }


    /* =====================================================
       TIMER
    ===================================================== */

    function startTimer() {

        clearInterval(timer);


        timeLeft =
            GAME_TIME;

        seconds = 0;


        updateTimer();


        timer =
            setInterval(
                () => {

                    timeLeft--;

                    seconds++;


                    updateTimer();


                    /* ÚLTIMO SEGUNDO */

                    if (
                        timeLeft <= 0
                    ) {

                        clearInterval(timer);


                        if (
                            matchedPairs <
                            TOTAL_PAIRS
                        ) {

                            finishGame(
                                false
                            );

                        }

                    }

                },
                1000
            );

    }


    /* =====================================================
       ATUALIZAR TIMER
    ===================================================== */

    function updateTimer() {

        const minutes =
            Math.floor(
                timeLeft / 60
            );


        const secondsDisplay =
            timeLeft % 60;


        timerElement.textContent =

            String(minutes)
                .padStart(2, "0")

            +

            ":"

            +

            String(secondsDisplay)
                .padStart(2, "0");


        /* ALERTA */

        if (
            timeLeft <= 10
        ) {

            timerElement.style.color =
                "#ff6b6b";

        }

        else {

            timerElement.style.color =
                "";

        }

    }


    /* =====================================================
       STATUS
    ===================================================== */

    function updateStats() {

        scoreElement.textContent =
            score;


        comboElement.textContent =
            combo;


        /*
           O SISTEMA ANTIGO TINHA VIDAS.

           Agora substituímos por ∞.
        */

        livesElement.textContent =
            "∞";


        pairsFoundElement.textContent =
            matchedPairs;


        attemptsElement.textContent =
            attempts;


        updateTimer();

    }


    /* =====================================================
       FINAL DO JOGO
    ===================================================== */

    function finishGame(won) {

        if (gameFinished)
            return;


        gameFinished = true;


        clearInterval(timer);


        lockBoard = true;


        /* ================================================
           RESULTADO
        ================================================= */

        finalScoreElement.textContent =
            score;


        finalPairsElement.textContent =
            `${matchedPairs}/${TOTAL_PAIRS}`;


        finalAttemptsElement.textContent =
            attempts;


        finalTimeElement.textContent =
            formatElapsedTime(
                seconds
            );


        /* ================================================
           TEXTO DA TELA
        ================================================= */

        const resultTitle =
            resultScreen.querySelector(
                "h2"
            );

        const resultText =
            resultScreen.querySelector(
                "p"
            );

        const resultIcon =
            resultScreen.querySelector(
                ".result-icon"
            );


        if (won) {

            resultIcon.textContent =
                "🏆";

            resultTitle.textContent =
                "Memory Complete!";

            resultText.textContent =
                "Excellent! You found all the pairs before time ran out.";

        }

        else {

            resultIcon.textContent =
                "⏰";

            resultTitle.textContent =
                "Time's Up!";

            resultText.textContent =
                `You found ${matchedPairs} of ${TOTAL_PAIRS} pairs. Try again!`;

        }


        resultScreen.classList.remove(
            "hidden"
        );

    }


    /* =====================================================
       TEMPO DECORRIDO
    ===================================================== */

    function formatElapsedTime(
        totalSeconds
    ) {

        const minutes =
            Math.floor(
                totalSeconds / 60
            );


        const remaining =
            totalSeconds % 60;


        return (

            String(minutes)
                .padStart(2, "0")

            +

            ":"

            +

            String(remaining)
                .padStart(2, "0")

        );

    }


    /* =====================================================
       REINICIAR
    ===================================================== */

    function restartGame() {

        clearInterval(timer);


        /* RESET */

        cards = [];

        firstCard = null;

        secondCard = null;

        lockBoard = false;

        matchedPairs = 0;

        attempts = 0;

        score = 0;

        combo = 0;

        seconds = 0;

        timeLeft = GAME_TIME;

        gameStarted = false;

        gameFinished = false;


        /* ESCONDER RESULTADO */

        resultScreen.classList.add(
            "hidden"
        );


        /* RESET TIMER */

        timerElement.style.color =
            "";


        /* CRIAR NOVO JOGO */

        createCards();

        renderBoard();

        updateStats();

    }


    /* =====================================================
       EVENTOS
    ===================================================== */

    restartButton.addEventListener(
        "click",
        restartGame
    );


    playAgainButton.addEventListener(
        "click",
        restartGame
    );


    /* =====================================================
       INICIAR
    ===================================================== */

    restartGame();

});