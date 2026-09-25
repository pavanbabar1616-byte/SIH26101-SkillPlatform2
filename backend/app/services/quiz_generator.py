"""
Quiz Generator using Groq API
Generates MCQs from uploaded documents.
"""

import os
import json
import re
import PyPDF2
from io import BytesIO
from groq import Groq

# Initialize Groq client
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
client = Groq(api_key=GROQ_API_KEY) if GROQ_API_KEY else None

MODEL_NAME = "llama-3.1-8b-instant"


def extract_text_from_pdf(file_content: bytes) -> str:
    try:
        pdf_reader = PyPDF2.PdfReader(BytesIO(file_content))
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text() or ""
        return text
    except Exception as e:
        return f"Error extracting PDF: {str(e)}"


def generate_quiz(document_text: str, num_questions: int = 5) -> list:
    if not client:
        return [{"error": "GROQ_API_KEY is not set. Please configure it in Render environment variables."}]

    max_chars = 3000
    if len(document_text) > max_chars:
        document_text = document_text[:max_chars]

    prompt = f"""You are an expert educator. Generate exactly {num_questions} multiple choice questions from the following text.

For each question, provide:
1. The question text
2. Four options labeled A, B, C, D
3. The correct answer (just the letter)
4. A brief explanation

Return ONLY a valid JSON array. No other text before or after.
Format:
[
  {{
    "question": "What is...?",
    "options": {{"A": "Option 1", "B": "Option 2", "C": "Option 3", "D": "Option 4"}},
    "correct_answer": "B",
    "explanation": "Because..."
  }}
]

Text:
{document_text}

JSON:"""

    try:
        response = client.chat.completions.create(
            model=MODEL_NAME,
            messages=[
                {"role": "system", "content": "You are an expert educator that generates multiple choice questions. Always return valid JSON."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=2000,
        )
        
        response_text = response.choices[0].message.content
        return parse_quiz_response(response_text)
        
    except Exception as e:
        return [{"error": f"Quiz generation failed: {str(e)}"}]


def parse_quiz_response(response_text: str) -> list:
    try:
        return json.loads(response_text)
    except json.JSONDecodeError:
        pass
    
    json_match = re.search(r'\[[\s\S]*\]', response_text)
    if json_match:
        try:
            return json.loads(json_match.group())
        except json.JSONDecodeError:
            pass
    
    json_match = re.search(r'\{[\s\S]*\}', response_text)
    if json_match:
        try:
            return [json.loads(json_match.group())]
        except json.JSONDecodeError:
            pass
    
    return [{"error": "Could not parse quiz response", "raw": response_text[:500]}]


def check_ollama_status() -> dict:
    """Check if Groq API is configured."""
    if client:
        return {
            "running": True,
            "models": [MODEL_NAME],
            "mistral_available": True,
            "provider": "groq"
        }
    return {"running": False, "models": [], "mistral_available": False}