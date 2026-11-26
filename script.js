JavaScript

/* =====================================
   GK KESARI AI ROBOT - NEW VERSION
   Gemini AI + Voice + Smart Chat
===================================== */

document.addEventListener("DOMContentLoaded", function () {

    const input =
        document.querySelector(".input-box") ||
        document.getElementById("questionInput");

    const mic =
        document.querySelector(".mic-button") ||
        document.getElementById("micButton");

    const send =
        document.getElementById("sendButton");

    let chat =
        document.getElementById("chat-box") ||
        document.querySelector(".chat-box") ||
        document.querySelector(".chat-container");

    if (!input) {
        console.error("GK Kesari: Input box नहीं मिला।");
        return;
    }

    // Chat box अपने आप बनाएं
    if (!chat) {
        chat = document.createElement("div");
        chat.id = "chat-box";
        chat.style.cssText =
            "padding:12px;max-height:450px;overflow-y:auto;";
        input.parentNode.insertBefore(chat, input);
    }

    let busy = false;
    let history = [];
    let askedQuestions = [];

    // संदेश दिखाना
    function addMessage(text, type) {
        const message = document.createElement("div");

        message.style.cssText =
            "padding:12px;margin:8px 0;border-radius:12px;" +
            "white-space:pre-wrap;overflow-wrap:anywhere;" +
            (type === "user"
                ? "background:#dcecff;text-align:right;"
                : "background:#f0f0f0;text-align:left;");

        message.textContent = text;
        chat.appendChild(message);
        chat.scrollTop = chat.scrollHeight;

        return message;
    }

    // AI से जवाब लेना
    async function askAI(question) {

        question = question.trim();

        if (!question || busy) return;

        busy = true;
        input.disabled = true;
        if (send) send.disabled = true;

        addMessage(question, "user");

        const botMessage = addMessage("🤖 GK Kesari सोच रहा है...", "bot");

        try {

            const previous = history
                .slice(-12)
                .map(item =>
                    item.role + ": " + item.text
                ).join("\n");

            const fullQuestion =
                "आप GK Kesari AI रोबोट हैं। " +
                "केवल सही और उपयोगी जानकारी दें। " +
                "हिंदी में सरल उत्तर दें। " +
                "यदि उपयोगकर्ता अगला GK सवाल मांगे तो " +
                "पहले पूछे गए सवालों को न दोहराएं।\n\n" +
                "पिछली बातचीत:\n" + previous +
                "\n\nनया सवाल:\n" + question;

            const response = await fetch("/ask", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    question: fullQuestion
                })
            });

            if (!response.ok) {
                throw new Error(
                    "Server Error: " + response.status
                );
            }

            let answer = "";

            // Gemini का streaming जवाब
            if (response.body) {

                const reader = response.body.getReader();
                const decoder = new TextDecoder();

                let buffer = "";

                while (true) {

                    const result = await reader.read();

                    if (result.done) break;

                    buffer += decoder.decode(
                        result.value,
                        { stream: true }
                    );

                    const lines = buffer.split("\n");
                    buffer = lines.pop() || "";

                    for (const line of lines) {

                        const clean = line.trim();

                        if (!clean.startsWith("data:")) continue;

                        const raw = clean.slice(5).trim();

                        if (!raw || raw === "[DONE]") continue;

                        try {
                            const data = JSON.parse(raw);

                            if (data.error) {
                                throw new Error(data.error);
                            }

                            if (data.text) {
                                answer += data.text;
                                botMessage.textContent = answer;
                                chat.scrollTop = chat.scrollHeight;
                            }

                        } catch (err) {
                            if (err.message !== "Unexpected end of JSON input") {
                                if (err.message && !err.message.includes("JSON")) {
                                    throw err;
                                }
                            }
                        }
                    }
                }

            } else {
                throw new Error("Streaming उपलब्ध नहीं है।");
            }

            if (!answer.trim()) {
                answer = "माफ कीजिए, जवाब नहीं मिला। दोबारा पूछिए।";
            }

            botMessage.textContent = answer;

            history.push(
                { role: "user", text: question },
                { role: "assistant", text: answer }
            );

            // पुराने सवालों की सूची
            if (/अगला|नया सवाल|next question/i.test(question)) {
                askedQuestions.push(question);
                askedQuestions = askedQuestions.slice(-30);
            }

            // बोलकर जवाब
            if ("speechSynthesis" in window) {
                window.speechSynthesis.cancel();
                const speech = new SpeechSynthesisUtterance(answer);
                speech.lang = "hi-IN";
                speech.rate = 0.95;
                window.speechSynthesis.speak(speech);
            }

        } catch (error) {

            botMessage.textContent =
                "⚠️ AI कनेक्शन में समस्या: " + error.message;

            console.error(error);

        } finally {

            busy = false;
            input.disabled = false;
            if (send) send.disabled = false;
            input.focus();
        }
    }

    // भेजने का बटन
    if (send) {
        send.addEventListener("click", function () {
            const question = input.value;
            if (question.trim()) {
                input.value = "";
                askAI(question);
            }
        });
    }

    // Enter से सवाल भेजें
    input.addEventListener("keydown", function (event) {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();

            const question = input.value;

            if (question.trim()) {
                input.value = "";
                askAI(question);
            }
        }
    });

    // माइक्रोफोन
    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;

    if (mic && SpeechRecognition) {

        const recognition = new SpeechRecognition();

        recognition.lang = "hi-IN";
        recognition.continuous = false;
        recognition.interimResults = false;

        mic.addEventListener("click", function () {
            recognition.start();
        });

        recognition.onresult = function (event) {
            input.value =
                event.results[0][0].transcript;
            input.focus();
        };

        recognition.onerror = function (event) {
            console.error("Mic Error:", event.error);
        };
    }

    console.log("GK KESARI AI ROBOT READY!");

});

