"""
Quiz Generator using Ollama
Generates MCQs from uploaded documents.
"""

import requests
import json
import re
import PyPDF2
from io import BytesIO
from ..core.config import settings


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
        response = requests.post(
            f'{settings.OLLAMA_URL}/api/generate',
            json={
                "model": settings.OLLAMA_MODEL,
                "prompt": prompt,
                "stream": False,
                "options": {"temperature": 0.7, "num_predict": 2000}
            },
            timeout=180
        )
        
        result = response.json()
        response_text = result.get('response', '')
        return parse_quiz_response(response_text)
        
    except requests.exceptions.ConnectionError:
        return [{"error": "Ollama is not running. Please start Ollama."}]
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
    try:
        response = requests.get(f'{settings.OLLAMA_URL}/api/tags', timeout=5)
        models = response.json().get('models', [])
        model_names = [m['name'] for m in models]
        return {
            "running": True,
            "models": model_names,
            "mistral_available": any('mistral' in m for m in model_names)
        }
    except:
        return {"running": False, "models": [], "mistral_available": False}