from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from recommendation_engine import get_course_recommendations
from evaluation_engine import evaluate_submission

app = FastAPI(title="EduConnect AI Service")

class RecommendationRequest(BaseModel):
    user_id: str
    interests: List[str]
    completed_courses: List[str]

class EvaluationRequest(BaseModel):
    submission: str
    context: Optional[str] = None

@app.get("/")
def read_root():
    return {"status": "AI Service Running"}

@app.post("/recommendations")
def recommend(req: RecommendationRequest):
    return get_course_recommendations(req.user_id, req.interests, req.completed_courses)

@app.post("/evaluate")
def evaluate(req: EvaluationRequest):
    return evaluate_submission(req.submission, req.context)
