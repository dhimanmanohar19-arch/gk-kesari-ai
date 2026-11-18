JavaScript

const questions = [
  {
    q: "भारत का राष्ट्रीय पक्षी कौन है?",
    a: ["तोता", "मोर", "कबूतर", "हंस"],
    correct: 1
  },
  {
    q: "भारत की राजधानी क्या है?",
    a: ["मुंबई", "जयपुर", "नई दिल्ली", "लखनऊ"],
    correct: 2
  },
  {
    q: "भारत का राष्ट्रीय पशु कौन है?",
    a: ["शेर", "बाघ", "हाथी", "घोड़ा"],
    correct: 1
  },
  {
    q: "ताजमहल कहाँ स्थित है?",
    a: ["दिल्ली", "आगरा", "जयपुर", "भोपाल"],
    correct: 1
  },
  {
    q: "भारत का राष्ट्रीय फूल कौन सा है?",
    a: ["गुलाब", "कमल", "चमेली", "गेंदा"],
    correct: 1
  },
  {
    q: "सूर्य किस दिशा से निकलता है?",
    a: ["पश्चिम", "उत्तर", "पूर्व", "दक्षिण"],
    correct: 2
  },
  {
    q: "भारत का राष्ट्रीय फल कौन सा है?",
    a: ["सेब", "आम", "केला", "अंगूर"],
    correct: 1
  },
  {
    q: "एक सप्ताह में कितने दिन होते हैं?",
    a: ["5", "6", "7", "8"],
    correct: 2
  },
  {
    q: "पृथ्वी का उपग्रह कौन है?",
    a: ["सूर्य", "चंद्रमा", "मंगल", "शुक्र"],
    correct: 1
  },
  {
    q: "भारत का राष्ट्रीय गान किसने लिखा?",
    a: ["महात्मा गांधी", "रवीन्द्रनाथ टैगोर", "प्रेमचंद", "नेहरू"],
    correct: 1
  }
];

let questionOrder = [];
let current = 0;
let score = 0;
let answered = false;

const questionBox = document.querySelector(
  "#question, .question, .question-box"
);
const optionsBox = document.querySelector(
  "#options, .options, .option-container"
);
const nextButton = document.querySelector(
  "#nextBtn, .next-button, .next-btn"
);
const feedback = document.querySelector(
  "#feedback, .feedback"
);
const speaker = document.querySelector(
  "#speakerBtn, .speaker, .speaker-button"
);

function shuffleQuestions() {
  questionOrder = questions.map((_, i) => i);

  for (let i = questionOrder.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [questionOrder[i], questionOrder[j]] =
      [questionOrder[j], questionOrder[i]];
  }
}

function showQuestion() {
  if (!questionBox || !optionsBox || !nextButton) {
    console.error("GK Dashboard: HTML elements नहीं मिले।");
    return;
  }

  if (current >= questionOrder.length) {
    questionBox.textContent =
      "🎉 आपका GK राउंड पूरा हुआ!";

    optionsBox.innerHTML = "";
    if (feedback) {
      feedback.textContent =
        "आपका स्कोर: " + score + " / " + questions.length;
    }

    nextButton.textContent = "नया राउंड शुरू करें ➜";
    answered = true;
    return;
  }

  answered = false;

  const item = questions[questionOrder[current]];

  questionBox.textContent =
    `प्रश्न ${current + 1}: ${item.q}`;

  optionsBox.innerHTML = "";

  item.a.forEach((answer, index) => {
    const button = document.createElement("button");
    button.textContent = answer;
    button.type = "button";
    button.className = "option";

    button.addEventListener("click", () => {
      checkAnswer(index, button);
    });

    optionsBox.appendChild(button);
  });

  if (feedback) feedback.textContent = "";

  nextButton.textContent = "Next question ➜";
}

function checkAnswer(index, selectedButton) {
  if (answered) return;

  answered = true;

  const item = questions[questionOrder[current]];
  const buttons = optionsBox.querySelectorAll("button");

  buttons.forEach((button, i) => {
    button.disabled = true;

    if (i === item.correct) {
      button.style.background = "#176b3a";
      button.style.color = "white";
    }
  });

  if (index === item.correct) {
    score++;

    if (feedback) {
      feedback.textContent = "✅ Perfect answer!";
    }
  } else {
    if (feedback) {
      feedback.textContent =
        "❌ गलत जवाब! सही उत्तर: " +
        item.a[item.correct];
    }
  }
}

function nextQuestion() {
  JavaScript

function nextQuestion() {

    if (!answered) {
        if (feedback) {
            feedback.textContent = "पहले एक जवाब चुनिए!";
        }
        return;
    }

    current++;

    if (current >= questionOrder.length) {

        if (feedback) {
            feedback.textContent =
                "🎉 GK Kesari क्विज़ पूरा हुआ! आपका स्कोर: "
                + score + "/" + questionOrder.length;
        }

        if (nextButton) {
            nextButton.disabled = true;
            nextButton.textContent = "क्विज़ पूरा हुआ";
        }

        return;
    }

    showQuestion();
}

    return;
  } tc

  if (!answered) {
    if (feedback) {
      feedback.textContent = "पहले एक जवाब चुनिए!";
    }
    return;
  }

  current++;
  showQuestion();
}

if (nextButton) {
  nextButton.addEventListener("click", nextQuestion);
}

if (speaker) {
  speaker.addEventListener("click", () => {
    const item = questions[questionOrder[current]];
    if (!item) return;

    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();

      const speech = new SpeechSynthesisUtterance(item.q);
      speech.lang = "hi-IN";
      speech.rate = 0.9;

      window.speechSynthesis.speak(speech);
    }
  });
}

shuffleQuestions();
showQuestion();

