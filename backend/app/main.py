from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .core.config import settings
from .api.v1 import employees, analysis, courses, quiz, chatbot

app = FastAPI(
    title="SIH26101 Skill Intelligence Platform",
    version="1.0.0",
    description="AI-Powered Learning for Government Officials"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(employees.router, prefix="/api/v1")
app.include_router(analysis.router, prefix="/api/v1")
app.include_router(courses.router, prefix="/api/v1")
app.include_router(quiz.router, prefix="/api/v1")
app.include_router(chatbot.router, prefix="/api/v1")


@app.get("/")
def root():
    return {
        "message": "SIH26101 Skill Intelligence Platform API",
        "version": "1.0.0",
        "status": "running"
    }


@app.get("/health")
def health():
    from .services.quiz_generator import check_ollama_status
    ollama = check_ollama_status()
    return {
        "status": "healthy",
        "ollama": ollama,
        "api_version": "1.0.0"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)