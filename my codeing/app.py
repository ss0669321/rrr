# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import os

app = Flask(__name__)
CORS(app)

# Configure Gemini AI
genai.configure(api_key=os.getenv('GEMINI_API_KEY'))
model = genai.GenerativeModel('gemini-pro')

def safe_eval(expression):
    allowed_chars = set('0123456789+-*/(). ')
    if all(c in allowed_chars for c in expression):
        try:
            return str(eval(expression))
        except:
            return "Error"
    return "Invalid input"

@app.route('/calculate', methods=['POST'])
def calculate():
    data = request.json
    expression = data['expression']
    result = safe_eval(expression)
    return jsonify({'result': result})

@app.route('/ai/calculate', methods=['POST'])
def ai_calculate():
    data = request.json
    prompt = f"""Act as a math expert. Solve: {data['query']}. 
    Provide:1. Final answer (bold). 2. Brief explanation (50 words). 3. Step-by-step (max 3 steps). 
    Format in HTML (no head/body)"""
    
    try:
        response = model.generate_content(prompt)
        return jsonify({'result': response.text})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)