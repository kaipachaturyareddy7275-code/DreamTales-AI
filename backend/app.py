from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

# Paste your REAL Gemini API Key here
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

genai.configure(
    api_key=os.getenv("GEMINI_API_KEY")
)

model = genai.GenerativeModel(
    "gemini-2.5-flash"
)

@app.route("/")
def home():
    return "🌙 DreamTales AI Backend Running"

@app.route("/generate", methods=["POST"])
def generate_story():

    try:

        data = request.get_json()

        name = data.get("name", "")
        age = data.get("age", "")
        character = data.get("character", "")
        theme = data.get("theme", "")
        length = data.get("length", "Medium")
        style = data.get("style", "Fantasy")

        prompt = f"""
Create a magical bedtime story.

Child Name: {name}
Age: {age}
Character: {character}
Theme: {theme}
Style: {style}
Length: {length}

Requirements:
- Age appropriate
- Gentle and positive
- Include sensory details
- Mention the child's name often
- Teach the moral naturally
- End with a calm sleepy ending
"""

        response = model.generate_content(prompt)
        
        print(response)

        story = response.text if response.text else "No story generated."

        return jsonify({
            "story": story
        })

    except Exception as e:

        print("ERROR:", str(e))

        return jsonify({
            "story":
            f"Error: {str(e)}"
        }), 500

if __name__ == "__main__":
    app.run(debug=True)