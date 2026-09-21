"""
Competency Mapping Engine
Compares employee skills against required skills for their role.
"""

from sentence_transformers import SentenceTransformer, util
from functools import lru_cache

@lru_cache(maxsize=1)
def get_model():
    """Load the model once and cache it."""
    return SentenceTransformer('all-MiniLM-L6-v2')

model = get_model()


def assess_competencies(employee_profile: dict, competency_framework: dict) -> list:
    """
    Compare employee's current skills against required skills for their role.
    """
    role = employee_profile.get('designation', '')
    framework = competency_framework.get(role, {})
    required_skills = framework.get('required_skills', [])
    
    if not required_skills:
        return [{"error": f"No competency framework found for role: {role}"}]
    
    current_skills_text = ' '.join(employee_profile.get('current_skills', []))
    if not current_skills_text:
        current_skills_text = "none"
    
    current_embedding = model.encode(current_skills_text)
    
    results = []
    for skill in required_skills:
        skill_name = skill['skill']
        required_level = skill['level']
        priority = skill['priority']
        
        skill_embedding = model.encode(skill_name)
        similarity = util.cos_sim(current_embedding, skill_embedding).item()
        
        if similarity > 0.6:
            current_level = "Advanced"
        elif similarity > 0.35:
            current_level = "Intermediate"
        elif similarity > 0.15:
            current_level = "Beginner"
        else:
            current_level = "None"
        
        level_order = {"None": 0, "Beginner": 1, "Intermediate": 2, "Advanced": 3}
        has_gap = level_order.get(current_level, 0) < level_order.get(required_level, 0)
        
        results.append({
            "skill": skill_name,
            "required_level": required_level,
            "current_level": current_level,
            "has_gap": has_gap,
            "priority": priority,
            "similarity_score": round(similarity, 3)
        })
    
    priority_order = {"High": 0, "Medium": 1, "Low": 2}
    results.sort(key=lambda x: (not x['has_gap'], priority_order.get(x['priority'], 3)))
    
    return results


def get_skill_gaps_only(assessments: list) -> list:
    return [a for a in assessments if a.get('has_gap', False)]