tat

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
// --- GK Kesari Complete Voice & Audio Engine (Mic + Speaker) ---

// 1. AI के असली जवाब को बोलकर सुनाना (Dynamic Text-to-Speech)
function speakCurrentResponse() {
    // यहाँ अपनी उस HTML ID को लिखें जहाँ AI का जवाब (Output) दिखता है (जैसे id="output" या id="response-box")
    const outputElement = document.getElementById('output') || document.getElementById('response-box') || document.getElementById('question-box');
    
    let textToRead = "";
    if (outputElement && outputElement.innerText.trim() !== "") {
        textToRead = outputElement.innerText; // यह स्क्रीन पर लिखा हुआ असली जवाब पढ़ेगा!
    } else {
        textToRead = "कृपया पहले कोई सवाल पूछें या लिखें।";
    }

    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel(); // पुरानी आवाज़ रोकें
        const utterance = new SpeechSynthesisUtterance(textToRead);
        utterance.lang = 'hi-IN'; // हिंदी
        utterance.rate = 1.0;
        window.speechSynthesis.speak(utterance);
    }
}

// 2. बोलकर सर्च करने के लिए माइक्रोफोन चालू करना (Speech-to-Text / Listening)
function startListening() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
        alert("आपका ब्राउज़र वॉइस रिकॉर्डिंग (Mic) सपोर्ट नहीं करता। कृपया क्रोम ब्राउज़र इस्तेमाल करें।");
        return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'hi-IN'; // हिंदी में बोलकर सर्च करें
    recognition.interimResults = false;

    recognition.onstart = function() {
        console.log("Mic चालू हो गया है, बोलिए...");
        // चाहें तो यहाँ बटन का रंग बदल सकते हैं या हिंट दिखा सकते हैं
    };

    recognition.onresult = function(event) {
        const spokenText = event.results[0][0].transcript;
        console.log("सुना गया सवाल:", spokenText);
        
        // इनपुट बॉक्स में बोली गई बात को ऑटोमैटिक भर दें
        // (अपने इनपुट बॉक्स की ID यहाँ चेक कर लें जैसे id="user-input" या id="query")
        const inputField = document.getElementById('user-input') || document.getElementById('query');
        if (inputField) {
            inputField.value = spokenText;
            
            // अगर आपके पास कोई सर्च या सबमिट फंक्शन है, तो उसे यहाँ ऑटो-ट्रिगर कर सकते हैं
            // जैसे: submitQuery(); या searchGK();
        }
    };

    recognition.onerror = function(event) {
        console.error("Mic error:", event.error);
    };

    recognition.start();
}

// 3. लाल बटन पर क्लिक करने का मुख्य कंट्रोल
document.addEventListener('DOMContentLoaded', () => {
    const redButton = document.getElementById('red-speaker-btn'); // अपनी लाल बटन की ID
    
    if (redButton) {
        redButton.addEventListener('click', () => {
            // लॉजिक: अगर इनपुट बॉक्स खाली है, तो माइक सुनेगा (Speech-to-Text)।
            // अगर जवाब आ चुका है, तो लाल बटन उसे पढ़कर सुनाएगा (Text-to-Speech)।
            const inputField = document.getElementById('user-input') || document.getElementById('query');
            
            if (inputField && inputField.value.trim() === "") {
                // अगर कुछ नहीं लिखा, तो बोलकर पूछने के लिए माइक ऑन करें
                startListening();
            } else {
                // अगर जवाब या सवाल है, तो उसे स्पीकर से बोलें
                speakCurrentResponse();
            }
        });
    }
});
// START QUIZ
renderQuestion();


