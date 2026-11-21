Python

import os
import json
import requests
from flask import Flask, request, Response, send_from_directory, stream_with_context

app = Flask(__name__)

API_KEY = os.environ.get("GEMINI_API_KEY")
MODEL = "gemini-2.5-flash"

@app.route("/")
def home():
    return send_from_directory(".", "index.html")

@app.route("/ask", methods=["POST"])
def ask():
    data = request.get_json(silent=True) or {}
    question = data.get("question", "").strip()

    if not question:
        return {"error": "कृपया सवाल लिखें।"}, 400

    if not API_KEY:
        return {"error": "Render में GEMINI_API_KEY सेट नहीं है।"}, 500

    def generate():
        url = (
            f"https://generativelanguage.googleapis.com/v1beta/"
            f"models/{MODEL}:streamGenerateContent"
            f"?alt=sse&key={API_KEY}"
        )

        payload = {
            "systemInstruction": {
                "parts": [{
                    "text": (
                        "आप GK Kesari AI हैं। हर विषय के सवालों का "
                        "सही, स्पष्ट और उपयोगी जवाब दें। "
                        "यूजर हिंदी में पूछे तो हिंदी में, "
                        "अंग्रेजी में पूछे तो अंग्रेजी में जवाब दें। "
                        "कठिन बात को आसान भाषा में समझाएं। "
                        "तथ्य मालूम न हो तो गलत जानकारी न बनाएं।"
                    )
                }]
            },
            "contents": [{
                "role": "user",
                "parts": [{"text": question}]
            }],
            "generationConfig": {
                "temperature": 0.4,
                "maxOutputTokens": 2048
            }
        }

        try:
            with requests.post(
                url,
                json=payload,
                stream=True,
                timeout=(20, 180)
            ) as response:

                if response.status_code != 200:
                    yield "data: " + json.dumps({
                        "error": "Gemini API में समस्या है: "
                                 + response.text[:500]
                    }, ensure_ascii=False) + "\n\n"
                    return

                for line in response.iter_lines(decode_unicode=True):
                    if not line or not line.startswith("data:"):
                        continue

                    raw = line[5:].strip()

                    try:
                        result = json.loads(raw)
                        parts = result.get("candidates", [{}])[0] \
                            .get("content", {}).get("parts", [])

                        for part in parts:
                            if "text" in part:
                                yield "data: " + json.dumps({
                                    "text": part["text"]
                                }, ensure_ascii=False) + "\n\n"

                    except (ValueError, IndexError, KeyError):
                        continue

            yield "data: [DONE]\n\n"

        except requests.RequestException as e:
            yield "data: " + json.dumps({
                "error": "कनेक्शन की समस्या: " + str(e)
            }, ensure_ascii=False) + "\n\n"

    return Response(
        stream_with_context(generate()),
        content_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no"
        }
    )

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 10000)))
