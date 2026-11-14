

import os
from flask import Flask, render_template, request, jsonify
from openai import OpenAI

app = Flask(__name__)

@app.get("/")
def home():
    return render_template("index.html")

@app.get("/health")
def health():
    return jsonify({
        "status": "ok",
        "app": "GK KESARI AI"
    })

@app.post("/api/chat")
def chat():
    data = request.get_json(silent=True) or {}
    message = str(data.get("message", "")).strip()

    if not message:
        return jsonify({"error": "कृपया अपना सवाल लिखें।"}), 400

    if len(message) > 8000:
        return jsonify({"error": "सवाल बहुत लंबा है।"}), 400

    api_key = os.getenv("OPENAI_API_KEY")

    if not api_key:
        return jsonify({
            "error": "Render में OPENAI_API_KEY सेट करें।"
        }), 503

    try:
        client = OpenAI(api_key=api_key)

        response = client.responses.create(
            model=os.getenv("OPENAI_MODEL", "gpt-5.5"),
            instructions=(
                "तुम GK KESARI AI हिंदी सहायक हो। "
                "सरल और स्पष्ट हिंदी में जवाब दो।"
            ),
            input=message,
            max_output_tokens=700
        )

        answer = (response.output_text or "").strip()

        return jsonify({
            "reply": answer or "दोबारा कोशिश करें।"
        })

    except Exception:
        app.logger.exception("AI request failed")
        return jsonify({
            "error": "AI सेवा से जवाब नहीं मिला। API सेटिंग जाँचें।"
        }), 502


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=int(os.getenv("PORT", "10000"))
    )

