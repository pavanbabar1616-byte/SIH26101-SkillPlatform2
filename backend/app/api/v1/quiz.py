from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel
from ...services.quiz_generator import (
    generate_quiz, extract_text_from_pdf, check_ollama_status
)

router = APIRouter(prefix="/quiz", tags=["Quiz"])


class TextQuizRequest(BaseModel):
    text: str
    num_questions: int = 5


@router.post("/generate")
async def generate_quiz_from_file(
    file: UploadFile = File(...),
    num_questions: int = 5
):
    content = await file.read()
    filename = file.filename.lower()
    
    if filename.endswith('.pdf'):
        text = extract_text_from_pdf(content)
    elif filename.endswith('.txt'):
        text = content.decode('utf-8', errors='ignore')
    else:
        raise HTTPException(status_code=400, detail="Only PDF and TXT files supported")
    
    if not text or len(text.strip()) < 50:
        raise HTTPException(status_code=400, detail="Could not extract sufficient text")
    
    quiz = generate_quiz(text, num_questions)
    return {
        "filename": file.filename,
        "num_questions": num_questions,
        "quiz": quiz
    }


@router.post("/generate-text")
def generate_quiz_from_text(request: TextQuizRequest):
    quiz = generate_quiz(request.text, request.num_questions)
    return {"quiz": quiz}


@router.get("/status")
def ollama_status():
    return check_ollama_status()