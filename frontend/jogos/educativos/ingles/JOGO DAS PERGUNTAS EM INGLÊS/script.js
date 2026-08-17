/* =========================================================
   ENGLISH QUIZ ARENA
   INSTITUTO ACUTIS
   VERSÃO CORRIGIDA
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       BANCO DE PERGUNTAS
    ===================================================== */

    const questions = [

        {
            category: "Grammar",
            question: "Choose the correct sentence:",
            answers: [
                "She don't like coffee.",
                "She doesn't likes coffee.",
                "She doesn't like coffee.",
                "She not like coffee."
            ],
            correct: 2,
            hint: "Use DOESN'T + the base form of the verb.",
            explanation:
                "The correct sentence is 'She doesn't like coffee.' After DOESN'T, the verb stays in its base form."
        },

        {
            category: "Vocabulary",
            question: "What does 'worried' mean?",
            answers: [
                "Cansado",
                "Preocupado",
                "Animado",
                "Surpreso"
            ],
            correct: 1,
            hint: "It describes someone who is concerned about something.",
            explanation:
                "Worried means preocupado(a)."
        },

        {
            category: "Verb To Be",
            question: "Complete: 'They ___ at school yesterday.'",
            answers: [
                "was",
                "were",
                "are",
                "is"
            ],
            correct: 1,
            hint: "Use the past form of TO BE with THEY.",
            explanation:
                "The correct answer is WERE. We use WERE with YOU, WE and THEY."
        },

        {
            category: "Simple Past",
            question: "Which sentence is correct?",
            answers: [
                "I go to the park yesterday.",
                "I goed to the park yesterday.",
                "I went to the park yesterday.",
                "I going to the park yesterday."
            ],
            correct: 2,
            hint: "GO is an irregular verb.",
            explanation:
                "The past form of GO is WENT."
        },

        {
            category: "Articles",
            question: "Choose the correct option: 'She is ___ English teacher.'",
            answers: [
                "a",
                "an",
                "the",
                "no article"
            ],
            correct: 1,
            hint: "English begins with a vowel sound.",
            explanation:
                "We use AN before a vowel sound: 'an English teacher.'"
        },

        {
            category: "There is / There are",
            question: "Complete: '___ three books on the table.'",
            answers: [
                "There is",
                "There are",
                "There be",
                "It are"
            ],
            correct: 1,
            hint: "Look at the noun after the blank. Is it singular or plural?",
            explanation:
                "BOOKS is plural, so we use THERE ARE."
        },

        {
            category: "Vocabulary",
            question: "What is the opposite of 'biggest'?",
            answers: [
                "Smallest",
                "Strongest",
                "Fastest",
                "Highest"
            ],
            correct: 0,
            hint: "Think about size.",
            explanation:
                "The opposite of BIGGEST is SMALLEST."
        },

        {
            category: "Prepositions",
            question: "Choose the correct preposition: 'I wake up ___ 6 a.m.'",
            answers: [
                "in",
                "on",
                "at",
                "for"
            ],
            correct: 2,
            hint: "We use this preposition with exact times.",
            explanation:
                "We use AT with exact times: 'at 6 a.m.'"
        },

        {
            category: "Pronouns",
            question: "Which pronoun replaces 'Maria and John'?",
            answers: [
                "He",
                "She",
                "It",
                "They"
            ],
            correct: 3,
            hint: "Maria and John are two people.",
            explanation:
                "Maria and John = THEY."
        },

        {
            category: "Mixed",
            question: "Choose the correct question:",
            answers: [
                "Where you live?",
                "Where does you live?",
                "Where do you live?",
                "Where are you live?"
            ],
            correct: 2,
            hint: "Use DO with YOU in the Simple Present.",
            explanation:
                "The correct structure is 'Where do you live?'"
        }

    ];


    /* =====================================================
       ESTADO DO JOGO
    ===================================================== */

    const MAX_TIME = 20;

    let currentQuestion = 0;
    let score = 0;
    let combo = 0;
    let lives = 3;

    let correctCount = 0;
    let wrongCount = 0;

    let timeLeft = MAX_TIME;

    let timer = null;

    let answered = false;
    let hintUsed = false;


    /* =====================================================
       ELEMENTOS
    ===================================================== */

    const questionElement =
        document.getElementById("question");

    const answersElement =
        document.getElementById("answers");

    const categoryElement =
        document.getElementById("category");

    const questionNumberElement =
        document.getElementById("questionNumber");

    const progressElement =
        document.getElementById("progress");

    const scoreElement =
        document.getElementById("score");

    const comboElement =
        document.getElementById("combo");

    const livesElement =
        document.getElementById("lives");

    const timerElement =
        document.getElementById("timer");

    const feedbackElement =
        document.getElementById("feedback");

    const nextButton =
        document.getElementById("nextButton");

    const hintButton =
        document.getElementById("hintButton");

    const hintElement =
        document.getElementById("hint");

    const hintText =
        document.getElementById("hintText");

    const quizScreen =
        document.getElementById("quizScreen");

    const resultScreen =
        document.getElementById("resultScreen");

    const finalScoreElement =
        document.getElementById("finalScore");

    const correctAnswersElement =
        document.getElementById("correctAnswers");

    const wrongAnswersElement =
        document.getElementById("wrongAnswers");

    const accuracyElement =
        document.getElementById("accuracy");

    const restartButton =
        document.getElementById("restartButton");


    /* =====================================================
       VERIFICAÇÃO
    ===================================================== */

    const requiredElements = [
        questionElement,
        answersElement,
        categoryElement,
        questionNumberElement,
        progressElement,
        scoreElement,
        comboElement,
        livesElement,
        timerElement,
        feedbackElement,
        nextButton,
        hintButton,
        hintElement,
        hintText,
        quizScreen,
        resultScreen,
        finalScoreElement,
        correctAnswersElement,
        wrongAnswersElement,
        accuracyElement,
        restartButton
    ];

    const missingElement =
        requiredElements.some(
            element => element === null
        );

    if (missingElement) {

        console.error(
            "ERRO: algum elemento do HTML não foi encontrado."
        );

        console.error(
            "Verifique se o HTML está usando os mesmos IDs do jogo."
        );

        return;
    }


    /* =====================================================
       ATUALIZAR STATUS
    ===================================================== */

    function updateStats() {

        scoreElement.textContent =
            score;

        comboElement.textContent =
            combo;

        livesElement.textContent =
            lives;

    }


    /* =====================================================
       CARREGAR QUESTÃO
    ===================================================== */

    function loadQuestion() {

        clearInterval(timer);

        answered = false;

        hintUsed = false;


        const question =
            questions[currentQuestion];


        /* TEXTO */

        questionElement.textContent =
            question.question;

        categoryElement.textContent =
            question.category;

        questionNumberElement.textContent =
            currentQuestion + 1;


        /* PROGRESSO */

        const percentage =
            ((currentQuestion + 1) /
            questions.length) * 100;

        progressElement.style.width =
            percentage + "%";


        /* LIMPAR ALTERNATIVAS */

        answersElement.innerHTML = "";


        /* CRIAR ALTERNATIVAS */

        question.answers.forEach(
            (answer, index) => {

                const button =
                    document.createElement("button");

                button.type = "button";

                button.className =
                    "answer";


                button.innerHTML = `
                    <span class="answer-letter">
                        ${String.fromCharCode(65 + index)}
                    </span>

                    <span>
                        ${answer}
                    </span>
                `;


                button.addEventListener(
                    "click",
                    () => {

                        selectAnswer(
                            index,
                            button
                        );

                    }
                );


                answersElement.appendChild(
                    button
                );

            }
        );


        /* FEEDBACK */

        feedbackElement.className =
            "feedback hidden";

        feedbackElement.innerHTML =
            "";


        /* PRÓXIMA */

        nextButton.classList.add(
            "hidden"
        );


        /* DICA */

        hintElement.classList.add(
            "hidden"
        );

        hintButton.classList.remove(
            "hidden"
        );


        /* TIMER */

        startTimer();

    }


    /* =====================================================
       TIMER
    ===================================================== */

    function startTimer() {

        clearInterval(timer);

        timeLeft = MAX_TIME;

        timerElement.textContent =
            timeLeft;


        timer = setInterval(
            () => {

                timeLeft--;

                timerElement.textContent =
                    timeLeft;


                if (timeLeft <= 0) {

                    clearInterval(timer);

                    timeOut();

                }

            },
            1000
        );

    }


    /* =====================================================
       TIME OUT
    ===================================================== */

    function timeOut() {

        if (answered)
            return;


        answered = true;

        wrongCount++;

        lives--;

        combo = 0;


        updateStats();

        revealCorrectAnswer();


        feedbackElement.className =
            "feedback wrong";


        feedbackElement.innerHTML = `
            ⏰ <strong>Time's up!</strong>
            <br>
            ${questions[currentQuestion].explanation}
        `;


        nextButton.classList.remove(
            "hidden"
        );


        checkLives();

    }


    /* =====================================================
       RESPONDER
    ===================================================== */

    function selectAnswer(
        selectedIndex,
        selectedButton
    ) {

        if (answered)
            return;


        answered = true;

        clearInterval(timer);


        const question =
            questions[currentQuestion];


        const buttons =
            document.querySelectorAll(
                ".answer"
            );


        /* DESABILITAR TODAS */

        buttons.forEach(
            button => {

                button.style.pointerEvents =
                    "none";

            }
        );


        /* VERIFICAR */

        if (
            selectedIndex ===
            question.correct
        ) {

            selectedButton.classList.add(
                "correct"
            );

            handleCorrect();

        } else {

            selectedButton.classList.add(
                "wrong"
            );

            handleWrong();

        }

    }


    /* =====================================================
       ACERTO
    ===================================================== */

    function handleCorrect() {

        correctCount++;

        combo++;


        let points = 100;


        /* COMBO */

        if (combo >= 3) {

            points += 50;

        }


        /* SEM DICA */

        if (!hintUsed) {

            points += 20;

        }


        /* VELOCIDADE */

        points += timeLeft * 2;


        score += points;


        updateStats();


        feedbackElement.className =
            "feedback correct";


        feedbackElement.innerHTML = `
            ✅ <strong>Correct!</strong>
            <br>
            ${questions[currentQuestion].explanation}
            <br>
            <strong>+${points} points</strong>
        `;


        revealCorrectAnswer();


        nextButton.classList.remove(
            "hidden"
        );

    }


    /* =====================================================
       ERRO
    ===================================================== */

    function handleWrong() {

        wrongCount++;

        lives--;

        combo = 0;


        updateStats();


        feedbackElement.className =
            "feedback wrong";


        feedbackElement.innerHTML = `
            ❌ <strong>Not quite!</strong>
            <br>
            ${questions[currentQuestion].explanation}
        `;


        revealCorrectAnswer();


        nextButton.classList.remove(
            "hidden"
        );


        checkLives();

    }


    /* =====================================================
       MOSTRAR CORRETA
    ===================================================== */

    function revealCorrectAnswer() {

        const question =
            questions[currentQuestion];


        const buttons =
            document.querySelectorAll(
                ".answer"
            );


        if (buttons[question.correct]) {

            buttons[question.correct]
                .classList.add(
                    "correct"
                );

        }

    }


    /* =====================================================
       VIDAS
    ===================================================== */

    function checkLives() {

        if (lives <= 0) {

            setTimeout(
                () => {

                    endGame();

                },
                1000
            );

        }

    }


    /* =====================================================
       PRÓXIMA
    ===================================================== */

    nextButton.addEventListener(
        "click",
        () => {

            if (!answered)
                return;


            currentQuestion++;


            if (
                currentQuestion >=
                questions.length
            ) {

                endGame();

                return;

            }


            loadQuestion();

        }
    );


    /* =====================================================
       DICA
    ===================================================== */

    hintButton.addEventListener(
        "click",
        () => {

            if (answered)
                return;


            hintUsed = true;


            hintText.textContent =
                questions[currentQuestion].hint;


            hintElement.classList.remove(
                "hidden"
            );


            hintButton.classList.add(
                "hidden"
            );

        }
    );


    /* =====================================================
       FINAL
    ===================================================== */

    function endGame() {

        clearInterval(timer);


        quizScreen.classList.add(
            "hidden"
        );


        resultScreen.classList.remove(
            "hidden"
        );


        finalScoreElement.textContent =
            score;


        correctAnswersElement.textContent =
            correctCount;


        wrongAnswersElement.textContent =
            wrongCount;


        const accuracy =
            Math.round(
                (correctCount /
                questions.length) * 100
            );


        accuracyElement.textContent =
            accuracy + "%";

    }


    /* =====================================================
       REINICIAR
    ===================================================== */

    restartButton.addEventListener(
        "click",
        () => {

            clearInterval(timer);


            currentQuestion = 0;

            score = 0;

            combo = 0;

            lives = 3;

            correctCount = 0;

            wrongCount = 0;

            timeLeft = MAX_TIME;


            updateStats();


            resultScreen.classList.add(
                "hidden"
            );


            quizScreen.classList.remove(
                "hidden"
            );


            loadQuestion();

        }
    );


    /* =====================================================
       INICIALIZAÇÃO
    ===================================================== */

    updateStats();

    loadQuestion();

});