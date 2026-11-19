let isSpeechEnabled = true;

// Text-to-Speech फ़ंक्शन
function speakText(text, lang = "hi-IN") {
  if (!isSpeechEnabled || !("speechSynthesis" in window) || !text) return;

  // पिछली आवाज़ चल रही हो तो रोकें ताकि आवाज़ आपस में न टकराए
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = 0.95; // सुनकर समझने में आसान गति
  utterance.pitch = 1;

  window.speechSynthesis.speak(utterance);
}

// बोलने की आवाज़ तुरंत रोकने का फ़ंक्शन
function stopSpeech() {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}

// वर्तमान सवाल और सभी विकल्पों का पूरा टेक्स्ट तैयार करने का हेल्पर
function getCurrentQuestionSpeechText() {
  const currentQuestionText = questionBox ? questionBox.textContent || "" : "";
  const optionTexts = Array.from(document.querySelectorAll(".quiz-option"))
    .map((btn) => btn.textContent)
    .join("। ");

  return (currentQuestionText + "। " + optionTexts).trim();
}

// जवाब चुनने पर बोलकर फ़ीडबैक देने का फ़ंक्शन
function speakAnswerFeedback(isCorrect, correctLetter, correctOptionText) {
  if (!isSpeechEnabled) return;

  if (isCorrect) {
    speakText("शाबाश! सही जवाब है।", "hi-IN");
  } else {
    speakText(
      "गलत जवाब। सही उत्तर विकल्प " + correctLetter + ", " + correctOptionText + " है।",
      "hi-IN"
    );
  }
}

// CREATE RESULT AREA
let resultBox = document.getElementById("quiz-result");

if (!resultBox) {
  resultBox = document.createElement("div");
  resultBox.id = "quiz-result";
  resultBox.style.cssText =
    "display:none;margin-top:20px;padding:15px;border-radius:12px;text-align:center;";
  nextButton.insertAdjacentElement("afterend", resultBox);
}

// CREATE SPEAK / MUTE & REPEAT BUTTONS
let speechControlsBox = document.getElementById("speech-controls-box");

if (!speechControlsBox && questionBox) {
  speechControlsBox = document.createElement("div");
  speechControlsBox.id = "speech-controls-box";
  speechControlsBox.style.cssText =
    "display:flex;flex-wrap:wrap;gap:8px;margin:8px 0 12px 0;";

  const speechToggleBtn = document.createElement("button");
  speechToggleBtn.id = "speech-toggle-btn";
  speechToggleBtn.type = "button";
  speechToggleBtn.textContent = "🔊 आवाज़ चालू";
  speechToggleBtn.style.cssText =
    "padding:8px 14px;border:1px solid #888;border-radius:8px;background:#1f2d47;color:#ffffff;cursor:pointer;font-size:14px;";

  const repeatSpeechBtn = document.createElement("button");
  repeatSpeechBtn.id = "repeat-speech-btn";
  repeatSpeechBtn.type = "button";
  repeatSpeechBtn.textContent = "🔁 दोबारा सुनें";
  repeatSpeechBtn.style.cssText =
    "padding:8px 14px;border:1px solid #888;border-radius:8px;background:#131c2e;color:#ffffff;cursor:pointer;font-size:14px;";

  speechToggleBtn.addEventListener("click", function () {
    isSpeechEnabled = !isSpeechEnabled;

    if (isSpeechEnabled) {
      speechToggleBtn.textContent = "🔊 आवाज़ चालू";
      repeatSpeechBtn.disabled = false;
      repeatSpeechBtn.style.opacity = "1";
      speakText(getCurrentQuestionSpeechText(), "hi-IN");
    } else {
      speechToggleBtn.textContent = "🔇 आवाज़ बंद";
      repeatSpeechBtn.disabled = true;
      repeatSpeechBtn.style.opacity = "0.5";
      stopSpeech();
    }
  });

  repeatSpeechBtn.addEventListener("click", function () {
    if (!isSpeechEnabled) return;
    speakText(getCurrentQuestionSpeechText(), "hi-IN");
  });

  speechControlsBox.appendChild(speechToggleBtn);
  speechControlsBox.appendChild(repeatSpeechBtn);
  questionBox.insertAdjacentElement("afterend", speechControlsBox);
}

// SHOW QUESTION
function showQuestion() {
  if (currentQuestion >= questions.length) {
    stopSpeech();
    finishQuiz();
    return;
  }

  answered = false;
  quizFinished = false;

  const q = questions[currentQuestion];

  questionBox.textContent =
    "प्रश्न " + (currentQuestion + 1) + " / " + questions.length + " : " + q.question;

  optionsBox.innerHTML = "";

  nextButton.style.display = "none";
  resultBox.style.display = "none";

  let speechOptionsText = "";

  q.options.forEach(function (option, index) {
    const letter = String.fromCharCode(65 + index);
    const button = document.createElement("button");

    button.type = "button";
    button.className = "quiz-option";
    button.textContent = letter + ". " + option;

    button.style.cssText =
      "display:block;width:100%;padding:13px;margin-bottom:10px;border:1px solid #888;border-radius:10px;background:#131c2e;color:white;text-align:left;cursor:pointer;font-size:15px;";

    optionsBox.appendChild(button);

    speechOptionsText += "विकल्प " + letter + ", " + option + "। ";
  });

  const fullSpeechText = questionBox.textContent + "। " + speechOptionsText;
  speakText(fullSpeechText, "hi-IN");
}// Text-to-Speech helper function
function speakText(text, lang = "en-IN") {
  if (!("speechSynthesis" in window) || !text) return;

  // Pichli awaaz band karein taaki overlap na ho
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang; // English ke liye "en-IN", Hindi ke liye "hi-IN"
  utterance.rate = 0.95; // Bachchon aur students ke liye thoda clear speed
  utterance.pitch = 1;

  // Agar phone mein matching voice available ho to select karein
  const voices = window.speechSynthesis.getVoices();
  const matchedVoice = voices.find((v) => v.lang.toLowerCase().startsWith(lang.slice(0, 2).toLowerCase()));
  if (matchedVoice) {
    utterance.voice = matchedVoice;
  }

  window.speechSynthesis.speak(utterance);
}

// 1. Jab naya question screen par dikhe tab apne aap bolne ke liye
function onQuestionLoaded(questionText, options = []) {
  const optionsText = options.length ? ` Options are: ${options.join(", ")}.` : "";
  speakText(`${questionText}${optionsText}`, "en-IN");
}

// 2. Jab user answer chune ("Perfect answer!" ya galat jawab) tab bolne ke liye
function onAnswerResult(isCorrect, feedbackText = "") {
  const message = feedbackText || (isCorrect ? "Perfect answer!" : "Try again.");
  speakText(message, "en-IN");
}

// 3. Speaker button dabane par dobara bolne ke liye
function onSpeakerButtonClick(currentQuestionText, currentOptions = []) {
  onQuestionLoaded(currentQuestionText, currentOptions);
}
