from fastapi import APIRouter, HTTPException
import json
import os

router = APIRouter(prefix="/employees", tags=["Employees"])

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "data")


def load_employees():
    with open(os.path.join(DATA_DIR, "employees.json"), 'r') as f:
        return json.load(f)


@router.get("")
def get_employees():
    return load_employees()


@router.get("/{employee_id}")
def get_employee(employee_id: str):
    employees = load_employees()
    employee = next((e for e in employees if e['employee_id'] == employee_id), None)
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    return employee