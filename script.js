JavaScript

const chatForm = document.getElementById("chatForm");
const chatInput = document.getElementById("chatInput");
const chatMessages = document.getElementById("chatMessages");
const sendButton = document.getElementById("sendButton");

function addMessage(text, role) {
  const item = document.createElement("div");
  item.className = `message ${role}`;
  item.textContent = text;
  chatMessages.appendChild(item);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return item;
}

// AI CHAT SYSTEM
chatForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const message = chatInput.value.trim();
  if (!message) return;

  addMessage(message, "user");
  chatInput.value = "";

  sendButton.disabled = true;
  sendButton.textContent = "रुकें...";

  const waiting = addMessage(
    "जवाब तैयार हो रहा है...",
    "assistant"
  );

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message })
    });

    const data = await response.json();

  
 waiting.textContent = data.reply || data.error || "कोई जवाब नहीं मिला"; 
      "सर्वर से संपर्क नहीं हो पाया। इंटरनेट और सर्वर जाँचें।";
  } finally {
    sendButton.disabled = false;
    sendButton.textContent = "भेजें ➤";
    chatInput.focus();
  }
});

// GK QUIZ QUESTIONS
const questions = [
  {
    q: "भारत की राजधानी क्या है?",
    o: ["मुंबई", "नई दिल्ली", "जयपुर", "लखनऊ"],
    a: 1,
    e: "भारत की राजधानी नई दिल्ली है।"
  },
  {
    q: "भारत का राष्ट्रीय पशु कौन है?",
    o: ["शेर", "हाथी", "बाघ", "घोड़ा"],
    a: 2,
    e: "भारत का राष्ट्रीय पशु बाघ है।"
  },
  {
    q: "सौरमंडल का सबसे बड़ा ग्रह कौन-सा है?",
    o: ["पृथ्वी", "मंगल", "शनि", "बृहस्पति"],
    a: 3,
    e: "बृहस्पति सबसे बड़ा ग्रह है।"
  },
  {
    q: "भारत का संविधान कब लागू हुआ?",
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

