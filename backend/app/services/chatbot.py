"""
AI Chatbot Assistant using Groq API
Answers questions about skills, courses, and the platform itself.
"""

import os
from groq import Groq

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
client = Groq(api_key=GROQ_API_KEY) if GROQ_API_KEY else None

MODEL_NAME = "openai/gpt-oss-20b"

SYSTEM_PROMPT = """You are SkillIntel Assistant — an AI helper built into the Skill Intelligence Platform (SIH26101) for Government of India officials.

## YOUR ROLE
You help users understand:
1. How to use the platform (Profile, Skill Gaps, Courses, Quiz Generator)
2. Their personal skill gaps and strengths (when context is available)
3. Recommended iGOT Karmayogi courses and why they matter
4. General upskilling advice for government statistical work

## CRITICAL RULES
1. ALWAYS answer the exact question asked. Do not repeat previous answers.
2. NEVER give generic responses. If asked "What are my skill gaps?", list them specifically.
3. USE THE CONTEXT provided below about the current user.
4. Be concise. 2-4 sentences for simple questions.
5. If you don't know, say: "I don't have that information. Check the [specific page] page."
6. NEVER invent data.

## TONE
Friendly, professional, helpful. Speak like a career advisor.
"""


def build_context_note(context: dict) -> str:
    if not context:
        return "No specific user context available."

    employee = context.get("employee", {})
    gaps = context.get("skill_gaps", [])
    assessments = context.get("skill_assessments", [])
    strengths = [s for s in assessments if not s.get("has_gap", True)]
    recommendations = context.get("recommended_courses", [])

    lines = ["## CURRENT USER CONTEXT"]

    if employee:
        lines.append(f"- Name: {employee.get('name', 'Unknown')}")
        lines.append(f"- Designation: {employee.get('designation', 'N/A')}")
        lines.append(f"- Department: {employee.get('department', 'N/A')}")

    if gaps:
        lines.append(f"\n### Skill Gaps ({len(gaps)} total):")
        for g in gaps[:10]:
            lines.append(f"- {g['skill']} (Priority: {g['priority']})")

    if strengths:
        lines.append(f"\n### Strengths ({len(strengths)} total):")
        for s in strengths[:10]:
            lines.append(f"- {s['skill']} ({s['current_level']})")

    if recommendations:
        lines.append(f"\n### Top Course Recommendations:")
        for r in recommendations[:5]:
            c = r['course']
            lines.append(f"- {c['title']} by {c['provider']}")

    return "\n".join(lines)


def get_chat_response(message: str, history: list = None, context: dict = None) -> dict:
    if not client:
        return {"reply": "", "error": "GROQ_API_KEY is not set. Please configure it in Render environment variables."}

    history = history or []

    messages = [{"role": "system", "content": SYSTEM_PROMPT}]

    context_note = build_context_note(context)
    if context_note:
        messages.append({"role": "system", "content": context_note})

    for turn in history[-6:]:
        role = turn.get("role")
        content = turn.get("content")
        if role in ("user", "assistant") and content:
            messages.append({"role": role, "content": content})

    messages.append({"role": "user", "content": message})

    try:
        response = client.chat.completions.create(
            model=MODEL_NAME,
            messages=messages,
            temperature=0.3,
            max_tokens=400,
        )
        reply = response.choices[0].message.content.strip()

        if not reply:
            return {"reply": "", "error": "No response. Try rephrasing."}

        return {"reply": reply, "error": None}

    except Exception as e:
        return {"reply": "", "error": f"Chat failed: {str(e)}"}