from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import json
import os
from ...services.competency_mapper import assess_competencies, get_skill_gaps_only
from ...services.course_recommender import recommend_courses

router = APIRouter(prefix="/analyze", tags=["Analysis"])

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "data")


def load_json(filename):
    with open(os.path.join(DATA_DIR, filename), 'r') as f:
        return json.load(f)


class AnalyzeRequest(BaseModel):
    employee_id: str


@router.post("")
def analyze_profile(request: AnalyzeRequest):
    employees = load_json("employees.json")
    framework = load_json("competency_framework.json")
    courses = load_json("courses.json")
    
    employee = next((e for e in employees if e['employee_id'] == request.employee_id), None)
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    assessments = assess_competencies(employee, framework)
    gaps = get_skill_gaps_only(assessments)
    recommendations = recommend_courses(gaps, courses)
    
    return {
        "employee": employee,
        "skill_assessments": assessments,
        "skill_gaps": gaps,
        "recommended_courses": recommendations[:10],
        "summary": {
            "total_skills_assessed": len(assessments),
            "total_gaps": len(gaps),
            "high_priority_gaps": len([g for g in gaps if g['priority'] == 'High'])
        }
    }