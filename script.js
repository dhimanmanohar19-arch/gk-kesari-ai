JavaScript
let currentQuestion = 0;
let score = 0;

const questions = [
  {
    question: "भारत की राजधानी क्या है?",
    options: ["मुंबई", "दिल्ली", "जयपुर", "पटना"],
    answer: "दिल्ली"
  },
  {
    question: "भारत का राष्ट्रीय पशु कौन है?",
    options: ["शेर", "हाथी", "बाघ", "घोड़ा"],
    answer: "बाघ"
  },
  {
    question: "भारत का राष्ट्रीय पक्षी कौन है?",
    options: ["तोता", "मोर", "कबूतर", "हंस"],
    answer: "मोर"
  }
];JavaScript
function showQuestion() {
  if (currentQuestion >= questions.length) {
    document.getElementById("question").innerText =
      "🎉 सभी सवाल पूरे हो गए!";

    document.getElementById("options").innerHTML = "";
    return;
  }

  let q = questions[currentQuestion];

  document.getElementById("question").innerText = q.question;

  let box = document.getElementById("options");
  box.innerHTML = "";

  q.options.forEach(option => {
    let btn = document.createElement("button");
    btn.innerText = option;

    btn.onclick = function() {
      if (option === q.answer) {
        score++;
        alert("सही जवाब!");
      } else {
        alert("गलत जवाब! सही उत्तर: " + q.answer);
      }

      currentQuestion++;
      showQuestion();
    };

    box.appendChild(btn);
  });
}JavaScript
function restartQuiz() {
  currentQuestion = 0;
  score = 0;
  showQuestion();
}

function getQuizScore() {
  alert("आपका कुल स्कोर: " + score);
}

console.log("GK Kesari AI Quiz Ready!");
