"""
Competency Mapping Engine (Groq-powered, lightweight)
Compares employee skills against required skills for their role.
"""

import os
import json
from groq import Groq

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
client = Groq(api_key=GROQ_API_KEY) if GROQ_API_KEY else None

MODEL_NAME = "openai/gpt-oss-20b"


def assess_competencies(employee_profile: dict, competency_framework: dict) -> list:
    """
    Compare employee's current skills against required skills for their role.
    Uses Groq LLM for semantic skill matching.
    """
    role = employee_profile.get('designation', '')
    framework = competency_framework.get(role, {})
    required_skills = framework.get('required_skills', [])

    if not required_skills:
        return [{"error": f"No competency framework found for role: {role}"}]

    if not client:
        # Fallback: simple keyword-based matching
        return _keyword_fallback(employee_profile, required_skills)

    current_skills = employee_profile.get('current_skills', [])

    prompt = f"""You are a competency assessment expert. Compare the employee's current skills against the required skills for their role.

Employee Current Skills: {', '.join(current_skills) if current_skills else 'None'}

Required Skills for {role}:
{json.dumps(required_skills, indent=2)}

For each required skill, determine:
1. The employee's current level: "None", "Beginner", "Intermediate", or "Advanced"
2. Whether there's a gap (current level < required level)
3. A similarity/relevance score between 0 and 1

Return ONLY a valid JSON array. No other text.
Format:
[
  {{
    "skill": "Python",
    "required_level": "Intermediate",
    "current_level": "None",
    "has_gap": true,
    "priority": "High",
    "similarity_score": 0.1
  }}
]

JSON:"""

    try:
        response = client.chat.completions.create(
            model=MODEL_NAME,
            messages=[
                {"role": "system", "content": "You are a competency assessment expert. Always return valid JSON arrays."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.2,
            max_tokens=2000,
        )

        response_text = response.choices[0].message.content
        results = _parse_json_array(response_text)

        if not results:
            return _keyword_fallback(employee_profile, required_skills)

        # Sort by priority and gap status
        priority_order = {"High": 0, "Medium": 1, "Low": 2}
        results.sort(key=lambda x: (not x.get('has_gap', False), priority_order.get(x.get('priority', 'Low'), 3)))

        return results

    except Exception as e:
        return _keyword_fallback(employee_profile, required_skills)


def _keyword_fallback(employee_profile: dict, required_skills: list) -> list:
    """Simple keyword-based fallback when Groq is unavailable."""
    current_skills = [s.lower() for s in employee_profile.get('current_skills', [])]

    results = []
    for skill in required_skills:
        skill_name = skill['skill']
        is_present = skill_name.lower() in current_skills or any(
            skill_name.lower() in s or s in skill_name.lower() for s in current_skills
        )

        current_level = "Intermediate" if is_present else "None"
        level_order = {"None": 0, "Beginner": 1, "Intermediate": 2, "Advanced": 3}
        has_gap = level_order.get(current_level, 0) < level_order.get(skill['level'], 0)

        results.append({
            "skill": skill_name,
            "required_level": skill['level'],
            "current_level": current_level,
            "has_gap": has_gap,
            "priority": skill['priority'],
            "similarity_score": 0.5 if is_present else 0.1
        })

    priority_order = {"High": 0, "Medium": 1, "Low": 2}
    results.sort(key=lambda x: (not x.get('has_gap', False), priority_order.get(x.get('priority', 'Low'), 3)))
    return results


def _parse_json_array(text: str) -> list:
    """Parse JSON array from LLM response."""
    import re
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass

    match = re.search(r'\[[\s\S]*\]', text)
    if match:
        try:
            return json.loads(match.group())
        except json.JSONDecodeError:
            pass
    return []


def get_skill_gaps_only(assessments: list) -> list:
    return [a for a in assessments if a.get('has_gap', False)]