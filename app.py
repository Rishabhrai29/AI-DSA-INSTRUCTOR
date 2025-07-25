from flask import Flask, request, jsonify, send_from_directory
import google.generativeai as genai
from flask_cors import CORS
from dotenv import load_dotenv
import os

load_dotenv()  # load variables from .env

app = Flask(__name__)
CORS(app)

genai.configure(api_key=os.environ.get("GOOGLE_API_KEY"))

SYSTEM_PROMPT = "You are a dsa instructor, give user optimal and correct answer to the user who is asking you the questions and if someone ask question which is not related to data structure algorithm or programming then tell user my expertise only works for dsa and programming"

@app.route("/")
def index():
    return send_from_directory(".", "index.html")

@app.route("/generate", methods=["POST"])
def generate():
    data = request.json
    topic = data.get("topic", "")

    model = genai.GenerativeModel(model_name="gemini-1.5-flash", system_instruction=SYSTEM_PROMPT)
    chat = model.start_chat()
    response = chat.send_message(topic)
    return jsonify({"response": response.text})

if __name__ == "__main__":
    app.run(debug=True, port=5000)

# if __name__ == "__main__":
#     app.run(host="0.0.0.0", port=10000)

