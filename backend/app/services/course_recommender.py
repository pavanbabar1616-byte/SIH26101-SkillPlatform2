"""
Course Recommendation Engine
Recommends courses based on skill gaps.
"""


def recommend_courses(skill_gaps: list, all_courses: list) -> list:
    """
    Recommend courses based on identified skill gaps.
    """
    recommendations = []
    
    for gap in skill_gaps:
        if not gap.get('has_gap', False):
            continue
        
        skill_name = gap['skill']
        
        for course in all_courses:
            course_skills = [s.lower() for s in course.get('skills_covered', [])]
            if skill_name.lower() in course_skills:
                relevance = calculate_relevance(gap, course)
                recommendations.append({
                    "course": course,
                    "skill_gap": skill_name,
                    "priority": gap['priority'],
                    "relevance_score": relevance,
                    "why_recommended": generate_explanation(gap, course)
                })
    
    recommendations.sort(key=lambda x: x['relevance_score'], reverse=True)
    
    seen = set()
    unique = []
    for rec in recommendations:
        cid = rec['course']['course_id']
        if cid not in seen:
            seen.add(cid)
            unique.append(rec)
    
    return unique


def calculate_relevance(gap: dict, course: dict) -> float:
    score = 0.5
    priority_bonus = {"High": 0.3, "Medium": 0.15, "Low": 0.05}
    score += priority_bonus.get(gap['priority'], 0)
    
    required = gap['required_level']
    course_level = course.get('level', 'Intermediate')
    level_order = {"Beginner": 1, "Intermediate": 2, "Advanced": 3}
    
    if level_order.get(course_level, 2) == level_order.get(required, 2):
        score += 0.2
    elif level_order.get(course_level, 2) < level_order.get(required, 2):
        score += 0.1
    
    return round(min(score, 1.0), 2)


def generate_explanation(gap: dict, course: dict) -> str:
    return (
        f"Your role requires {gap['skill']} at {gap['required_level']} level, "
        f"but your current level is {gap['current_level']}. "
        f"This {course['duration_hours']}-hour course from {course['provider']} "
        f"covers {gap['skill']} and will help close this gap."
    )