from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from ...services.chatbot import get_chat_response

router = APIRouter(prefix="/chatbot", tags=["Chatbot"])


class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    message: str
    history: Optional[List[ChatMessage]] = []
    context: Optional[Dict[str, Any]] = None


@router.post("/chat")
def chat(request: ChatRequest):
    history = [{"role": m.role, "content": m.content} for m in (request.history or [])]
    result = get_chat_response(
        message=request.message,
        history=history,
        context=request.context,
    )
    return result


@router.get("/status")
def chatbot_status():
    from ...services.chatbot import MODEL_NAME
    import requests as req
    try:
        r = req.get("http://localhost:11434/api/tags", timeout=5)
        models = [m["name"] for m in r.json().get("models", [])]
        return {
            "running": True,
            "model": MODEL_NAME,
            "available": any(MODEL_NAME in m for m in models),
            "all_models": models,
        }
    except Exception:
        return {
            "running": False,
            "model": MODEL_NAME,
            "available": False,
            "all_models": [],
        }