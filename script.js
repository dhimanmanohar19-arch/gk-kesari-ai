
const chatInput = document.getElementById("chatInput");
const // फॉर्म सबमिट या चैट भेजने का मुख्य लॉजिक
const chatForm = document.getElementById("chat-form"); // अपने फॉर्म या बटन की आईडी यहाँ चेक कर लें
const chatInput = document.getElementById("chat-input");
const sendButton = document.getElementById("send-button");
const waiting = document.getElementById("waiting"); // लोडिंग या वेटिंग मैसेज दिखाने वाला एलिमेंट

if (chatForm) {
    chatForm.addEventListener("submit", async (event) => {
        // फॉल्ट यहाँ था: event.preventDefault() में कोष्ठक छूटे थे
        event.preventDefault();

        const message = chatInput.value.trim();
        if (!message) return;

        // UI को अपडेट करें (बटन बंद करें, लोडिंग दिखाएं)
        sendButton.disabled = true;
        sendButton.textContent = "भेजा जा रहा है...";
        
        if (waiting) {
            waiting.textContent = "जवाब आ रहा है...";
        }

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ message })
            });

            const data = await response.json();

            if (waiting) {
                waiting.textContent = data.reply || data.error || "कोई जवाब नहीं मिला।";
            }

        } catch (error) {
            if (waiting) {
                waiting.textContent = "सर्वर से संपर्क नहीं हो पाया। इंटरनेट और सर्वर जाँचें।";
            }
        } finally {
            sendButton.disabled = false;
            sendButton.textContent = "भेजें ➔";
            chatInput.focus();
        }
    });
}


// // GK QUIZ QUESTIONS (अगर आप क्विज़ का डेटा भी साथ रख रहे हैं)
const questions = [
    {
        q: "भारत की राजधानी क्या है?",
        o: ["मुंबई", "नई दिल्ली", "जयपुर", "लखनऊ"],
        a: 1,
        e: "भारत की राजधानी नई दिल्ली है।"
    }
];लागू हुआ?",
    o: [
      "15 अगस्त 1947",
      "26 जनवरी 1950",
      "2 अक्टूबर 1950",
      "26 नवंबर 1949"
    ],
    a: 1,
    e: "संविधान 26 जनवरी 1950 को लागू हुआ।"
  },
  {
    q: "पानी का रासायनिक सूत्र क्या है?",
    o: ["CO₂", "O₂", "H₂O", "NaCl"],
    a: 2,
    e: "पानी का रासायनिक सूत्र H₂O है।"
  }
];

let current = 0;
let score = 0;
let answered = false;

const questionText = document.getElementById("questionText");
const optionsBox = document.getElementById("options");
const questionCount = document.getElementById("questionCount");
const scoreLabel = document.getElementById("scoreLabel");
const progressBar = document.getElementById("progressBar");
const feedback = document.getElementById("quizFeedback");
const nextButton = document.getElementById("nextButton");
const restartButton = document.getElementById("restartButton");

function renderQuestion() {
  answered = false;

  const item = questions[current];

  questionCount.textContent =
    `प्रश्न ${current + 1} / ${questions.length}`;

  scoreLabel.textContent = `स्कोर: ${score}`;

  progressBar.style.width =
    `${(current / questions.length) * 100}%`;

  questionText.textContent = item.q;
  feedback.textContent = "";
  optionsBox.replaceChildren();

  item.o.forEach((option, index) => {
    const button = document.createElement("button");

    button.className = "option";

    button.textContent =
      `${String.fromCharCode(65 + index)}. ${option}`;

    button.addEventListener("click", () => {
      chooseAnswer(index);
    });

    optionsBox.appendChild(button);
  });

  nextButton.disabled = true;

  nextButton.textContent =
    current === questions.length - 1
      ? "रिजल्ट देखें"
      : "अगला सवाल →";
}

function chooseAnswer(index) {
  if (answered) return;

  answered = true;

  const item = questions[current];

  [...optionsBox.children].forEach((button, i) => {
    button.disabled = true;

    if (i === item.a) {
      button.classList.add("correct");
    }

    if (i === index && index !== item.a) {
      button.classList.add("wrong");
    }
  });

  if (index === item.a) {
    score++;

    feedback.textContent =
      `सही जवाब! ${item.e}`;

  } else {
    feedback.textContent =
      `सही उत्तर: ${item.o[item.a]}। ${item.e}`;
  }

  scoreLabel.textContent = `स्कोर: ${score}`;
  nextButton.disabled = false;
}

nextButton.addEventListener("click", () => {
  if (!answered) return;

  if (current < questions.length - 1) {
    current++;
    renderQuestion();

  } else {
    questionText.textContent =
      `टेस्ट पूरा हुआ! आपका स्कोर ${score} / ${questions.length} है।`;

    optionsBox.replaceChildren();

    feedback.textContent =
      score === questions.length
        ? "शानदार! सभी जवाब सही हैं।"
        : "अच्छा प्रयास! फिर से अभ्यास करें।";

    progressBar.style.width = "100%";
    questionCount.textContent = "टेस्ट पूरा";
    nextButton.disabled = true;
  }
});

restartButton.addEventListener("click", () => {
  current = 0;
  score = 0;
  renderQuestion();
});

// START QUIZ
renderQuestion();

