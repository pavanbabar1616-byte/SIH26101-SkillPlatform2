from fastapi import APIRouter
import json
import os

router = APIRouter(prefix="/courses", tags=["Courses"])

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "data")


def load_courses():
    with open(os.path.join(DATA_DIR, "courses.json"), 'r') as f:
        return json.load(f)


@router.get("")
def get_all_courses():
    return load_courses()


@router.get("/{skill}")
def get_courses_by_skill(skill: str):
    courses = load_courses()
    matching = []
    for course in courses:
        course_skills = [s.lower() for s in course.get('skills_covered', [])]
        if skill.lower() in course_skills:
            matching.append(course)
    return matching