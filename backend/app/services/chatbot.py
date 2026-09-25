"""
AI Chatbot Assistant using Ollama + Mistral
Answers questions about skills, courses, and the platform itself.
Enhanced version with better prompting and context awareness.
"""

import requests
import json

# Change to "phi" for faster responses, "mistral" for better quality
MODEL_NAME = "mistral"

SYSTEM_PROMPT = """You are SkillIntel Assistant — an AI helper built into the Skill Intelligence Platform (SIH26101) for Government of India officials.

## YOUR ROLE
You help users understand:
1. How to use the platform (Profile, Skill Gaps, Courses, Quiz Generator)
2. Their personal skill gaps and strengths (when context is available)
3. Recommended iGOT Karmayogi courses and why they matter
4. General upskilling advice for government statistical work

## CRITICAL RULES — FOLLOW THESE STRICTLY

1. **ALWAYS answer the exact question asked.** Do not repeat previous answers.
2. **NEVER give generic responses.** If asked "What are my skill gaps?", list them specifically.
3. **USE THE CONTEXT** provided below about the current user. Reference their name, designation, gaps, and strengths directly.
4. **Be concise.** 2-4 sentences for simple questions. Bullet points for lists.
5. **If you don't know**, say: "I don't have that information. Check the [specific page] page in the app."
6. **NEVER invent data.** Only use what's in the context or general knowledge about iGOT/Mission Karmayogi.

## EXAMPLES

User: "What are my skill gaps?"
Good reply: "Rajesh, you have 3 skill gaps: Python (High priority), SDG Indicators (High priority), and Data Visualization (Medium priority). I recommend starting with Python since it's foundational."

User: "How does this platform work?"
Good reply: "The platform has 5 main features: (1) Profile — select an employee, (2) Analysis — AI finds skill gaps, (3) Courses — get iGOT recommendations, (4) Quiz — generate tests from documents, (5) Chatbot — ask me anything."

User: "Recommend a course"
Good reply: "Based on your Python gap, I recommend 'Python for Data Analysis' from IIT Madras (20 hours, Intermediate level). It covers Python, Pandas, and NumPy — exactly what your role requires."

## TONE
- Friendly, professional, helpful
- Speak to the user like a career advisor
- Use their name if available
"""


def build_context_note(context: dict) -> str:
    """Build a detailed context note from analysis data."""
    if not context:
        return "No specific user context available. Answer general questions about the platform."

    employee = context.get("employee", {})
    gaps = context.get("skill_gaps", [])
    assessments = context.get("skill_assessments", [])
    strengths = [s for s in assessments if not s.get("has_gap", True)]
    recommendations = context.get("recommended_courses", [])

    lines = ["## CURRENT USER CONTEXT (use this in your answers)"]

    if employee:
        lines.append(f"- Name: {employee.get('name', 'Unknown')}")
        lines.append(f"- Designation: {employee.get('designation', 'N/A')}")
        lines.append(f"- Department: {employee.get('department', 'N/A')}")
        lines.append(f"- Experience: {employee.get('experience_years', 0)} years")
        lines.append(f"- Education: {employee.get('education', 'N/A')}")

    if gaps:
        lines.append(f"\n### Skill Gaps ({len(gaps)} total):")
        for g in gaps[:10]:
            lines.append(f"- {g['skill']} (Priority: {g['priority']}) — currently {g['current_level']}, needs {g['required_level']}")

    if strengths:
        lines.append(f"\n### Strengths ({len(strengths)} total):")
        for s in strengths[:10]:
            lines.append(f"- {s['skill']} ({s['current_level']})")

    if recommendations:
        lines.append(f"\n### Top Course Recommendations:")
        for r in recommendations[:5]:
            c = r['course']
            lines.append(f"- {c['title']} by {c['provider']} ({c['duration_hours']}h, {c['level']}) — relevance {int(r['relevance_score']*100)}%")
            lines.append(f"  Why: {r['why_recommended']}")

    return "\n".join(lines)


def get_chat_response(message: str, history: list = None, context: dict = None) -> dict:
    """
    Get a chatbot reply from Ollama with improved prompting.
    """
    history = history or []

    # Build the messages array
    messages = [{"role": "system", "content": SYSTEM_PROMPT}]

    # Add context as a separate system message
    context_note = build_context_note(context)
    if context_note:
        messages.append({"role": "system", "content": context_note})

    # Add recent conversation history (last 6 turns only)
    for turn in history[-6:]:
        role = turn.get("role")
        content = turn.get("content")
        if role in ("user", "assistant") and content:
            messages.append({"role": role, "content": content})

    # Add the current message
    messages.append({"role": "user", "content": message})

    try:
        response = requests.post(
            "http://localhost:11434/api/chat",
            json={
                "model": MODEL_NAME,
                "messages": messages,
                "stream": False,
                "options": {
                    "temperature": 0.3,       # Lower = more focused
                    "top_p": 0.9,
                    "repeat_penalty": 1.2,    # Discourage repetition
                    "num_predict": 400,       # Limit response length
                    "stop": ["\n\n\n", "User:", "Human:"]
                }
            },
            timeout=180
        )
        result = response.json()
        reply = result.get("message", {}).get("content", "").strip()

        if not reply:
            return {
                "reply": "",
                "error": "No response. Try rephrasing or ask something simpler."
            }

        return {"reply": reply, "error": None}

    except requests.exceptions.ConnectionError:
        return {
            "reply": "",
            "error": "Ollama is not running. Start it with: ollama serve"
        }
    except requests.exceptions.Timeout:
        return {
            "reply": "",
            "error": "The AI took too long. Try a shorter question."
        }
    except Exception as e:
        return {"reply": "", "error": f"Chat failed: {str(e)}"}