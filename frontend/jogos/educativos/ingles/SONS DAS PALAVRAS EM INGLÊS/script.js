/* =========================================================
   PRONUNCIATION CHALLENGE
   INSTITUTO ACUTIS
========================================================= */


/* =========================================================
   PALAVRAS
========================================================= */

const words = [

    {
        word: "THINK",
        phonetic: "/θɪŋk/",
        level: "EASY",
        tip: "Coloque a língua levemente entre os dentes para produzir o som TH.",
        alternatives: ["think"]
    },

    {
        word: "SHE",
        phonetic: "/ʃiː/",
        level: "EASY",
        tip: "O SH produz um som parecido com o 'CH' de 'chá', mas mais prolongado.",
        alternatives: ["she"]
    },

    {
        word: "CHAIR",
        phonetic: "/tʃer/",
        level: "EASY",
        tip: "O CH começa com um som parecido com 'tch'.",
        alternatives: ["chair"]
    },

    {
        word: "THIS",
        phonetic: "/ðɪs/",
        level: "EASY",
        tip: "No TH de THIS, a língua fica entre os dentes e o som é vibrante.",
        alternatives: ["this"]
    },

    {
        word: "THREE",
        phonetic: "/θriː/",
        level: "MEDIUM",
        tip: "Comece com o TH colocando a língua entre os dentes.",
        alternatives: ["three"]
    },

    {
        word: "VERY",
        phonetic: "/ˈver.i/",
        level: "MEDIUM",
        tip: "O V é produzido com os dentes superiores tocando levemente o lábio inferior.",
        alternatives: ["very"]
    },

    {
        word: "WATER",
        phonetic: "/ˈwɔː.tər/",
        level: "MEDIUM",
        tip: "O W começa com os lábios arredondados.",
        alternatives: ["water"]
    },

    {
        word: "WORLD",
        phonetic: "/wɝːld/",
        level: "HARD",
        tip: "Pratique o W e depois o R americano sem vibrar a língua.",
        alternatives: ["world"]
    },

    {
        word: "ENOUGH",
        phonetic: "/ɪˈnʌf/",
        level: "HARD",
        tip: "O GH no final produz som de F nesta palavra.",
        alternatives: ["enough"]
    },

    {
        word: "FRIEND",
        phonetic: "/frend/",
        level: "HARD",
        tip: "Não pronuncie todas as letras como no português. FRIEND tem apenas uma sílaba.",
        alternatives: ["friend"]
    }

];


/* =========================================================
   ESTADO
========================================================= */

let currentIndex = 0;

let score = 0;

let streak = 0;

let lives = 3;

let answered = false;


/* =========================================================
   ELEMENTOS
========================================================= */

const wordElement =
    document.getElementById("word");

const phoneticElement =
    document.getElementById("phonetic");

const levelBadge =
    document.getElementById("levelBadge");

const levelText =
    document.getElementById("levelText");

const tipText =
    document.getElementById("tipText");

const scoreElement =
    document.getElementById("score");

const streakElement =
    document.getElementById("streak");

const livesElement =
    document.getElementById("lives");

const currentQuestion =
    document.getElementById("currentQuestion");

const totalQuestions =
    document.getElementById("totalQuestions");

const progress =
    document.getElementById("progress");

const listenBtn =
    document.getElementById("listenBtn");

const speakBtn =
    document.getElementById("speakBtn");

const nextBtn =
    document.getElementById("nextBtn");

const result =
    document.getElementById("result");

const gameOver =
    document.getElementById("gameOver");

const finalScore =
    document.getElementById("finalScore");

const restartBtn =
    document.getElementById("restartBtn");


totalQuestions.textContent =
    words.length;


/* =========================================================
   CARREGAR PALAVRA
========================================================= */

function loadWord() {

    const current =
        words[currentIndex];

    wordElement.textContent =
        current.word;

    phoneticElement.textContent =
        current.phonetic;

    levelBadge.textContent =
        current.level;

    levelText.textContent =
        "Nível " +
        Math.floor(currentIndex / 3 + 1);

    tipText.textContent =
        current.tip;

    currentQuestion.textContent =
        currentIndex + 1;

    const percentage =
        ((currentIndex + 1) / words.length) * 100;

    progress.style.width =
        percentage + "%";

    result.className =
        "result hidden";

    result.innerHTML = "";

    nextBtn.classList.add("hidden");

    answered = false;
}


/* =========================================================
   OUVIR PRONÚNCIA
========================================================= */

listenBtn.addEventListener(
    "click",
    () => {

        const current =
            words[currentIndex];

        if (!("speechSynthesis" in window)) {

            alert(
                "Seu navegador não suporta reprodução de voz."
            );

            return;
        }

        speechSynthesis.cancel();

        const utterance =
            new SpeechSynthesisUtterance(
                current.word
            );

        utterance.lang =
            "en-US";

        utterance.rate =
            0.75;

        utterance.pitch =
            1;

        speechSynthesis.speak(
            utterance
        );

    }
);


/* =========================================================
   RECONHECIMENTO DE VOZ
========================================================= */

const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;


let recognition = null;


if (SpeechRecognition) {

    recognition =
        new SpeechRecognition();

    recognition.lang =
        "en-US";

    recognition.interimResults =
        false;

    recognition.maxAlternatives =
        3;


    recognition.onstart = () => {

        speakBtn.innerHTML = `
            🎙️
            <span>
                <strong>Listening...</strong>
                <small>Fale agora</small>
            </span>
        `;

    };


    recognition.onresult =
        (event) => {

            const spoken =
                event.results[0][0]
                .transcript
                .toLowerCase()
                .trim();

            checkPronunciation(
                spoken
            );

        };


    recognition.onerror =
        (event) => {

            console.log(
                "Erro:",
                event.error
            );

            result.className =
                "result wrong";

            result.innerHTML =
                "⚠️ Não consegui ouvir. Tente novamente.";

            nextBtn.classList.remove(
                "hidden"
            );

        };


    recognition.onend = () => {

        speakBtn.innerHTML = `
            🎙️
            <span>
                <strong>Speak</strong>
                <small>Fale a palavra</small>
            </span>
        `;

    };

} else {

    speakBtn.addEventListener(
        "click",
        () => {

            alert(
                "Seu navegador não suporta reconhecimento de voz. Use o Google Chrome."
            );

        }
    );

}


/* =========================================================
   INICIAR MICROFONE
========================================================= */

if (recognition) {

    speakBtn.addEventListener(
        "click",
        () => {

            if (answered)
                return;

            recognition.start();

        }
    );

}


/* =========================================================
   VERIFICAR PRONÚNCIA
========================================================= */

function checkPronunciation(
    spoken
) {

    if (answered)
        return;

    const current =
        words[currentIndex];

    const correct =
        current.alternatives
        .some(
            answer =>
                normalize(answer) ===
                normalize(spoken)
        );


    if (correct) {

        correctAnswer();

    } else {

        wrongAnswer(
            spoken
        );

    }

}


/* =========================================================
   NORMALIZAR
========================================================= */

function normalize(text) {

    return text
        .toLowerCase()
        .replace(/[.,!?]/g, "")
        .trim();

}


/* =========================================================
   ACERTO
========================================================= */

function correctAnswer() {

    answered = true;

    streak++;

    const bonus =
        streak >= 3
            ? 20
            : 10;

    score += bonus;

    scoreElement.textContent =
        score;

    streakElement.textContent =
        streak;

    result.className =
        "result correct";

    result.innerHTML = `
        ✅ Excellent!
        <br>
        <small>
            Pronúncia reconhecida corretamente.
            +${bonus} pontos
        </small>
    `;

    nextBtn.classList.remove(
        "hidden"
    );

}


/* =========================================================
   ERRO
========================================================= */

function wrongAnswer(
    spoken
) {

    answered = true;

    lives--;

    streak = 0;

    livesElement.textContent =
        lives;

    streakElement.textContent =
        streak;

    result.className =
        "result wrong";

    result.innerHTML = `
        ❌ Try again!
        <br>
        <small>
            Você falou:
            <strong>${spoken}</strong>
        </small>
    `;

    nextBtn.classList.remove(
        "hidden"
    );


    if (lives <= 0) {

        setTimeout(
            endGame,
            700
        );

    }

}


/* =========================================================
   PRÓXIMA PALAVRA
========================================================= */

nextBtn.addEventListener(
    "click",
    () => {

        currentIndex++;

        if (
            currentIndex >=
            words.length
        ) {

            endGame();

            return;
        }

        loadWord();

    }
);


/* =========================================================
   FINAL
========================================================= */

function endGame() {

    gameOver.classList.remove(
        "hidden"
    );

    finalScore.textContent =
        score;

}


/* =========================================================
   REINICIAR
========================================================= */

restartBtn.addEventListener(
    "click",
    () => {

        currentIndex = 0;

        score = 0;

        streak = 0;

        lives = 3;

        scoreElement.textContent =
            score;

        streakElement.textContent =
            streak;

        livesElement.textContent =
            lives;

        gameOver.classList.add(
            "hidden"
        );

        loadWord();

    }
);


/* =========================================================
   INICIAR
========================================================= */

loadWord();