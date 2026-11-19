JavaScript

/* =====================================
   GK KESARI AI - QUIZ SYSTEM
   Fixed Question Repeat & Restart Bug
===================================== */

(function () {
    "use strict";

    // GK QUESTIONS
    const questions = [
        {
            question: "भारत की राजधानी कौन सी है?",
            options: ["मुंबई", "नई दिल्ली", "जयपुर", "लखनऊ"],
            answer: 1
        },
        {
            question: "भारत का राष्ट्रीय पशु कौन है?",
            options: ["शेर", "हाथी", "बाघ", "घोड़ा"],
            answer: 2
        },
        {
            question: "भारत का राष्ट्रीय पक्षी कौन है?",
            options: ["तोता", "मोर", "कबूतर", "हंस"],
            answer: 1
        },
        {
            question: "भारत का संविधान कब लागू हुआ?",
            options: [
                "15 अगस्त 1947",
                "26 जनवरी 1950",
                "2 अक्टूबर 1949",
                "26 नवंबर 1947"
            ],
            answer: 1
        },
        {
            question: "भारत के प्रथम प्रधानमंत्री कौन थे?",
            options: [
                "महात्मा गांधी",
                "सरदार पटेल",
                "जवाहरलाल नेहरू",
                "डॉ. राजेंद्र प्रसाद"
            ],
            answer: 2
        },
        {
            question: "सूर्य किस दिशा से निकलता है?",
            options: ["पश्चिम", "उत्तर", "दक्षिण", "पूर्व"],
            answer: 3
        },
        {
            question: "भारत का राष्ट्रीय फूल कौन सा है?",
            options: ["गुलाब", "कमल", "चमेली", "सूरजमुखी"],
            answer: 1
        },
        {
            question: "पृथ्वी का प्राकृतिक उपग्रह कौन है?",
            options: ["मंगल", "सूर्य", "चंद्रमा", "शुक्र"],
            answer: 2
        },
        {
            question: "भारत का राष्ट्रीय गान किसने लिखा?",
            options: [
                "प्रेमचंद",
                "रवींद्रनाथ टैगोर",
                "महात्मा गांधी",
                "सुभाष चंद्र बोस"
            ],
            answer: 1
        },
        {
            question: "ताजमहल कहाँ स्थित है?",
            options: ["दिल्ली", "आगरा", "जयपुर", "भोपाल"],
            answer: 1
        }
    ];

    // QUIZ VARIABLES
    let currentQuestion = 0;
    let score = 0;
    let answered = false;
    let quizFinished = false;

    // HTML ELEMENTS
    const questionBox = document.getElementById("question");
    const optionsBox = document.getElementById("options");

    if (!questionBox || !optionsBox) {
        console.error(
            "GK Kesari: question या options ID नहीं मिला।"
        );
        return;
    }

    // CREATE NEXT BUTTON
    let nextButton = document.getElementById("next-btn");

    if (!nextButton) {
        nextButton = document.createElement("button");
        nextButton.id = "next-btn";
        nextButton.type = "button";
        nextButton.textContent = "अगला सवाल";
        nextButton.style.cssText =
            "display:none;margin-top:18px;padding:12px 25px;" +
            "background:#ff6b00;color:white;border:0;" +
            "border-radius:10px;font-weight:bold;cursor:pointer;";

        optionsBox.insertAdjacentElement("afterend", nextButton);
    }

    // CREATE RESULT AREA
    let resultBox = document.getElementById("quiz-result");

    if (!resultBox) {
        resultBox = document.createElement("div");
        resultBox.id = "quiz-result";
        resultBox.style.cssText =
            "display:none;margin-top:20px;padding:15px;" +
            "border-radius:12px;text-align:center;";
        nextButton.insertAdjacentElement("afterend", resultBox);
    }

    // SHOW QUESTION
    function showQuestion() {

        if (currentQuestion >= questions.length) {
            finishQuiz();
            return;
        }

        answered = false;
        quizFinished = false;

        const q = questions[currentQuestion];

        questionBox.textContent =
            "प्रश्न " + (currentQuestion + 1) +
            " / " + questions.length + " : " + q.question;

        optionsBox.innerHTML = "";

        nextButton.style.display = "none";
        resultBox.style.display = "none";

        q.options.forEach(function (option, index) {

            const button = document.createElement("button");

            button.type = "button";
            button.className = "quiz-option";
            button.textContent =
                String.fromCharCode(65 + index) + ". " + option;

            button.style.cssText =
                "display:block;width:100%;padding:13px;margin:9px 0;" +
                "border:1px solid #888;border-radius:10px;" +
                "background:#131c2e;color:white;text-align:left;" +
                "cursor:pointer;font-size:15px;";

            button.addEventListener("click", function () {
                checkAnswer(index, button);
            });

            optionsBox.appendChild(button);
        });
    }

    // CHECK ANSWER
    function checkAnswer(selected, clickedButton) {

        if (answered || quizFinished) return;

        answered = true;

        const correct = questions[currentQuestion].answer;
        const allButtons = optionsBox.querySelectorAll("button");

        if (selected === correct) {
            score++;
            clickedButton.style.background = "#16803c";
            clickedButton.textContent += " ✓ सही जवाब";
        } else {
            clickedButton.style.background = "#a52a2a";

            allButtons[correct].style.background = "#16803c";
            allButtons[correct].textContent += " ✓ सही जवाब";
        }

        allButtons.forEach(function (button) {
            button.disabled = true;
            button.style.cursor = "default";
        });

        nextButton.textContent =
            currentQuestion === questions.length - 1
                ? "रिजल्ट देखें"
                : "अगला सवाल";

        nextButton.style.display = "block";
    }

    // NEXT QUESTION
    function nextQuestion() {

        if (!answered || quizFinished) return;

        currentQuestion++;

        if (currentQuestion < questions.length) {
            showQuestion();
        } else {
            finishQuiz();
        }
    }

    // FINAL RESULT
    function finishQuiz() {

        quizFinished = true;

        questionBox.textContent = "GK Kesari Quiz पूरा हुआ!";

        optionsBox.innerHTML = "";

        nextButton.style.display = "none";
        resultBox.style.display = "block";

        resultBox.innerHTML =
            "<h2>आपका परिणाम</h2>" +
            "<h3>कुल सवाल: " + questions.length + "</h3>" +
            "<h3>सही जवाब: " + score + "</h3>" +
            "<h3>गलत जवाब: " +
            (questions.length - score) + "</h3>" +
            "<h2>स्कोर: " + score + " / " +
            questions.length + "</h2>";

        const restartButton = document.createElement("button");

        restartButton.type = "button";
        restartButton.textContent = "फिर से शुरू करें";

        restartButton.style.cssText =
            "padding:12px 25px;margin-top:15px;" +
            "background:#ff6b00;color:white;border:0;" +
            "border-radius:10px;cursor:pointer;font-weight:bold;";

        restartButton.addEventListener("click", restartQuiz);

        resultBox.appendChild(restartButton);
    }

    // RESTART ONLY WHEN BUTTON IS PRESSED
    function restartQuiz() {

        currentQuestion = 0;
        score = 0;
        answered = false;
        quizFinished = false;

        showQuestion();
    }

    // SCORE FUNCTION
    function getQuizScore() {
        return score;
    }

    // GLOBAL FUNCTIONS
    window.showQuestion = showQuestion;
    window.nextQuestion = nextQuestion;
    window.restartQuiz = restartQuiz;
    window.getQuizScore = getQuizScore;

    // NEXT BUTTON EVENT
    nextButton.addEventListener("click", nextQuestion);

    // START QUIZ ONCE
    showQuestion();

})();

