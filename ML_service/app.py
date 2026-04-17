from fastapi import FastAPI, UploadFile, File, Body
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict, Any
import shutil
import os

from services.resume_parser import generate_structured_profile
from services.job_matcher import match_jobs
from services.skill_gap_analyzer import analyze_skill_gap
from services.fraud_detector import detect_fraud

app = FastAPI(
    title="TalentSync AI Microservice",
    description="Intelligent matching, NLP parsing, and Fraud Detection for the TalentSync Hackathon application.",
    version="1.0.0"
)

# Standard permissive CORS setup for internal routing
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def health_check():
    return {"status": "AI Microservice Core is Online!"}

@app.post("/analyze-resume")
async def analyze_resume_endpoint(file: UploadFile = File(...)):
    """
    Accepts PDF upload, uses PyMuPDF to extract, and Gemini LLM to format JSON.
    """
    temp_path = f"temp_{file.filename}"
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    try:
        profile_json = generate_structured_profile(temp_path)
        return {"success": True, "profile": profile_json}
    except Exception as e:
        return {"success": False, "error": str(e)}
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)

@app.post("/match-jobs")
def match_jobs_endpoint(payload: Dict[str, Any] = Body(...)):
    """
    Input: {"candidate_skills": ["React"], "jobs": [{"id": 1, "skillsRequired": ["React"], "description": "..."}]}
    Output: Hybrid scoring matrix (TF-IDF + Semantic)
    """
    candidate_skills = payload.get("candidate_skills", [])
    jobs_list = payload.get("jobs", [])
    
    scored_matches = match_jobs(candidate_skills, jobs_list)
    return {"success": True, "matches": scored_matches}

@app.post("/skill-gap")
def skill_gap_endpoint(payload: Dict[str, list] = Body(...)):
    """
    Evaluates Candidate missing skills vs Job Requirements. 
    Returns AI-generated recommendations.
    """
    cand_skills = payload.get("candidate_skills", [])
    job_skills = payload.get("job_skills", [])
    
    insights = analyze_skill_gap(cand_skills, job_skills)
    return {"success": True, "insights": insights}

@app.post("/fraud-detect")
def fraud_detect_endpoint(payload: Dict[str, str] = Body(...)):
    """
    Analyzes job descriptions for suspicious fraudulent patterns. 
    """
    desc = payload.get("job_description", "")
    if not desc:
        return {"success": False, "error": "No description provided."}
        
    result = detect_fraud(desc)
    return {"success": True, "analysis": result}

if __name__ == "__main__":
    import uvicorn
    # Use 8002 to avoid conflict with standard backend/react ports
    uvicorn.run(app, host="0.0.0.0", port=8002)
